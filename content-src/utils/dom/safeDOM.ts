const originalRemoveChild = Node.prototype.removeChild;
const originalReplaceChild = Node.prototype.replaceChild;

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

function safeRemoveChild<T extends Node>(parent: Node, child: T): T {
  if (child.parentNode === parent) {
    return originalRemoveChild.call(parent, child) as T;
  }
  const actualChild = Array.from(parent.childNodes).find(
    (node) =>
      node instanceof child.constructor && isEquivalentNode(node, child),
  );
  if (actualChild) {
    return originalRemoveChild.call(parent, actualChild) as T;
  }
  return child;
}

function safeReplaceChild<T extends Node>(
  parent: Node,
  newChild: Node,
  oldChild: T,
): T {
  if (oldChild.parentNode === parent) {
    modifiedNodes.add(newChild);
    return originalReplaceChild.call(parent, newChild, oldChild) as T;
  }
  const actualChild = Array.from(parent.childNodes).find(
    (node) =>
      node instanceof oldChild.constructor && isEquivalentNode(node, oldChild),
  );
  if (actualChild) {
    modifiedNodes.add(newChild);
    return originalReplaceChild.call(parent, newChild, actualChild) as T;
  }
  return oldChild;
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
}

export function restoreDOMMethods(): void {
  Node.prototype.removeChild = originalRemoveChild;
  Node.prototype.replaceChild = originalReplaceChild;
}
