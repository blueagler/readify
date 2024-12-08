const originalRemoveChild = Node.prototype.removeChild;
const originalReplaceChild = Node.prototype.replaceChild;
const originalInsertBefore = Node.prototype.insertBefore;
const originalGetAttribute = Element.prototype.getAttribute;

const modifiedNodes = new WeakSet<Node>();
const originalNodes = new WeakMap<Node, Node>();

function isClonableNode(node: Node): boolean {
  return (
    !(node instanceof ShadowRoot) &&
    !(node instanceof DocumentType) &&
    !(node instanceof DocumentFragment)
  );
}

function preserveOriginalNode(node: Node): void {
  if (!originalNodes.has(node) && isClonableNode(node)) {
    originalNodes.set(node, node.cloneNode(true));
  }
}

function getOriginalNode(node: Node): Node | null {
  return originalNodes.get(node) || null;
}

function isSameNodeType(node: Node, target: Node): boolean {
  return node.nodeType === target.nodeType && node.nodeName === target.nodeName;
}

function isEquivalentNode<T extends Node>(node: Node, target: T): boolean {
  return (
    (node as unknown) === (target as unknown) ||
    (modifiedNodes.has(node) && isSameNodeType(node, target))
  );
}

function findActualChild<T extends Node>(parent: Node, child: T): Node | null {
  if (!isClonableNode(parent)) {
    if (child.parentNode === parent) return child;
    return (
      Array.from(parent.childNodes).find(
        (node) =>
          node instanceof child.constructor && isEquivalentNode(node, child),
      ) || null
    );
  }

  const original = getOriginalNode(parent);
  if (original) {
    const originalChild = Array.from(original.childNodes).find(
      (node) =>
        node instanceof child.constructor && isEquivalentNode(node, child),
    );
    if (originalChild) {
      const actualChild = Array.from(parent.childNodes)[
        Array.from(original.childNodes).indexOf(originalChild)
      ];
      return actualChild || null;
    }
  }

  if (child.parentNode === parent) return child;
  return (
    Array.from(parent.childNodes).find(
      (node) =>
        node instanceof child.constructor && isEquivalentNode(node, child),
    ) || null
  );
}

function safeRemoveChild<T extends Node>(parent: Node, child: T): T {
  preserveOriginalNode(parent);
  const actualChild = findActualChild(parent, child);
  if (!actualChild) return child;
  return originalRemoveChild.call(parent, actualChild) as T;
}

function safeReplaceChild<T extends Node>(
  parent: Node,
  newChild: Node,
  oldChild: T,
): T {
  preserveOriginalNode(parent);
  const actualChild = findActualChild(parent, oldChild);
  if (!actualChild) return oldChild;
  modifiedNodes.add(newChild);
  return originalReplaceChild.call(parent, newChild, actualChild) as T;
}

function safeInsertBefore<T extends Node>(
  parent: Node,
  newChild: T,
  referenceNode: Node | null,
): T {
  preserveOriginalNode(parent);
  if (!referenceNode) {
    return parent.appendChild(newChild);
  }
  const actualReference = findActualChild(parent, referenceNode);
  if (!actualReference) {
    return parent.appendChild(newChild);
  }
  modifiedNodes.add(newChild);
  return originalInsertBefore.call(parent, newChild, actualReference) as T;
}

export function patchDOMMethods(): void {
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    return safeRemoveChild(this, child);
  };

  Node.prototype.replaceChild = function <T extends Node>(
    newChild: Node,
    oldChild: T,
  ): T {
    return safeReplaceChild(this, newChild, oldChild);
  };

  Node.prototype.insertBefore = function <T extends Node>(
    newChild: T,
    referenceNode: Node | null,
  ): T {
    return safeInsertBefore(this, newChild, referenceNode);
  };

  const originalGetAttribute = Element.prototype.getAttribute;
  Element.prototype.getAttribute = function (name: string): string | null {
    if (!isClonableNode(this)) {
      return originalGetAttribute.call(this, name);
    }
    const original = getOriginalNode(this);
    if (original instanceof Element) {
      return originalGetAttribute.call(original, name);
    }
    return originalGetAttribute.call(this, name);
  };
}

export function restoreDOMMethods(): void {
  Node.prototype.removeChild = originalRemoveChild;
  Node.prototype.replaceChild = originalReplaceChild;
  Node.prototype.insertBefore = originalInsertBefore;
  Element.prototype.getAttribute = originalGetAttribute;
}
