import { PROCESSOR_CONFIG } from "../../constants/config";
import { ElementPosition } from "../../types/index";

export function isElementVisible(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= window.innerHeight + PROCESSOR_CONFIG.VIEWPORT_MARGIN &&
    rect.bottom >= -PROCESSOR_CONFIG.VIEWPORT_MARGIN
  );
}

export function isBionicSpan(element: Element): boolean {
  // Check if it's either the outer bionic span or an inner text span
  return (
    element instanceof HTMLSpanElement &&
    ((element.firstChild instanceof HTMLElement &&
      element.firstChild.tagName === "STRONG") ||
      (element.parentElement instanceof HTMLSpanElement &&
        element.previousElementSibling instanceof HTMLElement &&
        element.previousElementSibling.tagName === "STRONG"))
  );
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
