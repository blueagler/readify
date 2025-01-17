// eslint-disable-next-line @typescript-eslint/unbound-method
const originalRemoveChild = Node.prototype.removeChild;
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalReplaceChild = Node.prototype.replaceChild;
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalInsertBefore = Node.prototype.insertBefore;

const modifiedNodes = new WeakSet<Node>();

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
  if (child.parentNode === parent) return child;
  return (
    Array.from(parent.childNodes).find(
      (node) =>
        node instanceof child.constructor && isEquivalentNode(node, child),
    ) || null
  );
}

function safeRemoveChild<T extends Node>(parent: Node, child: T): T {
  const actualChild = findActualChild(parent, child);
  if (!actualChild) return child;
  return originalRemoveChild.call(parent, actualChild) as T;
}

function safeReplaceChild<T extends Node>(
  parent: Node,
  newChild: Node,
  oldChild: T,
): T {
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
}

export function restoreDOMMethods(): void {
  Node.prototype.removeChild = originalRemoveChild;
  Node.prototype.replaceChild = originalReplaceChild;
  Node.prototype.insertBefore = originalInsertBefore;
}
