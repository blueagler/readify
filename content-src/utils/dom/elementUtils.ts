import { PROCESSOR_CONFIG, screenHeight } from "../../constants/config";
import { ElementPosition } from "../../types";

export function isElementVisible(element: Element): boolean {
  if (!element || !(element instanceof Element)) return false;

  let current: Element | null = element;
  while (current && current instanceof Element) {
    const style = window.getComputedStyle(current);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0"
    ) {
      return false;
    }

    const root = current.getRootNode();
    current =
      current.parentElement ||
      (root instanceof ShadowRoot && root.host instanceof Element
        ? root.host
        : null);
  }

  const rect = element.getBoundingClientRect();
  return (
    rect &&
    rect.top <= screenHeight + PROCESSOR_CONFIG.VIEWPORT_MARGIN &&
    rect.bottom >= -PROCESSOR_CONFIG.VIEWPORT_MARGIN &&
    rect.height > 0 &&
    rect.width > 0
  );
}

export function getElementPosition(element: Element): ElementPosition {
  if (!element) return { $element: element, $width: 0, $x: 0, $y: 0 };

  const rect = element.getBoundingClientRect();
  let offsetX = 0;
  let offsetY = 0;
  let current: Element | null = element;

  while (current && current instanceof Element) {
    if (current instanceof HTMLElement) {
      offsetX += current.offsetLeft;
      offsetY += current.offsetTop;
    }
    const root = current.getRootNode();
    current =
      current.parentElement ||
      (root instanceof ShadowRoot && root.host instanceof Element
        ? root.host
        : null);
  }

  return {
    $element: element,
    $width: rect.width || 0,
    $x: offsetX,
    $y: offsetY,
  };
}
