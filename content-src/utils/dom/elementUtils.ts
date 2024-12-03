import { PROCESSOR_CONFIG, screenHeight } from "../../constants/config";
import { ElementPosition } from "../../types";

export function isElementVisible(element: Element): boolean {
  let current: Element | null = element;
  while (current) {
    const style = window.getComputedStyle(current);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    current = current.parentElement || (current.getRootNode() as ShadowRoot).host;
  }
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= screenHeight + PROCESSOR_CONFIG.VIEWPORT_MARGIN &&
    rect.bottom >= -PROCESSOR_CONFIG.VIEWPORT_MARGIN &&
    rect.height > 0 &&
    rect.width > 0
  );
}

export function getElementPosition(element: Element): ElementPosition {
  const rect = element.getBoundingClientRect();
  let offsetX = 0;
  let offsetY = 0;
  let current: Element | null = element;
  while (current) {
    if (current instanceof HTMLElement) {
      offsetX += current.offsetLeft;
      offsetY += current.offsetTop;
    }
    current = current.parentElement || (current.getRootNode() as ShadowRoot).host;
  }
  return {
    $element: element,
    $width: rect.width,
    $x: offsetX,
    $y: offsetY,
  };
}
