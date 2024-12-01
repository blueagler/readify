import { PROCESSOR_CONFIG, screenHeight } from "../../constants/config";
import { ElementPosition } from "../../types";

export function isElementVisible(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= screenHeight + PROCESSOR_CONFIG.VIEWPORT_MARGIN &&
    rect.bottom >= -PROCESSOR_CONFIG.VIEWPORT_MARGIN
  );
}

export function isBionicSpan(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;

  if (element.hasAttribute(PROCESSOR_CONFIG.DOM_ATTRS.PROCESSED_ATTR))
    return true;

  if (
    element.parentElement?.hasAttribute(
      PROCESSOR_CONFIG.DOM_ATTRS.PROCESSED_ATTR,
    )
  )
    return true;

  if (element instanceof HTMLSpanElement) {
    if (
      element.firstElementChild instanceof HTMLElement &&
      element.firstElementChild.tagName === "STRONG"
    ) {
      return true;
    }
  }

  return false;
}

export function getElementPosition(element: Element): ElementPosition {
  const rect = element.getBoundingClientRect();
  return {
    $element: element,
    $width: rect.width,
    $x: rect.left,
    $y: rect.top,
  };
}

export function isInsideIgnoredTag(
  element: Element,
  ignoreTags: Set<string>,
): boolean {
  let current = element;
  while (current) {
    if (ignoreTags.has(current.tagName)) {
      return true;
    }
    current = current.parentElement as Element;
  }
  return false;
}
