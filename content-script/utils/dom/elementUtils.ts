import { PROCESSOR_CONFIG, screenHeight } from "../../constants/config";
import { ElementPosition } from "../../types";

export function isElementVisible(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;

  // Check if element is actually rendered
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  const rect = element.getBoundingClientRect();

  // Check if element is within viewport with margin
  return (
    rect.top <= screenHeight + PROCESSOR_CONFIG.VIEWPORT_MARGIN &&
    rect.bottom >= -PROCESSOR_CONFIG.VIEWPORT_MARGIN &&
    rect.height > 0 &&
    rect.width > 0
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
