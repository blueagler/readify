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

const STANDARD_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

function findClosestWeight(target: number, availableWeights: number[]): number {
  return availableWeights.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
  );
}

function getAvailableFontWeights(element: Element): number[] {
  const fontFamily = window.getComputedStyle(element).fontFamily;
  if (!fontFamily) return STANDARD_WEIGHTS;
  const availableWeights = document.fonts.check(`1px ${fontFamily}`)
    ? Array.from(document.fonts)
        .filter((font) => font.family === fontFamily.replace(/['"]/g, ""))
        .map((font) => parseInt(font.weight))
    : STANDARD_WEIGHTS;

  return availableWeights.length > 0
    ? availableWeights.sort((a, b) => a - b)
    : STANDARD_WEIGHTS;
}

function isVariableFont(element: Element): boolean {
  return window
    .getComputedStyle(element)
    .getPropertyValue("font-variation-settings")
    .includes("wght");
}

export interface CalculateWeightResult {
  boldWeight: number;
  normalWeight: number;
  isVariable: boolean;
}

export function calculateWeight(element: Element): CalculateWeightResult {
  const isVariable = isVariableFont(element);
  const elementStyle = window.getComputedStyle(element);
  const originalWeight =
    (isVariable
      ? parseInt(
          elementStyle
            .getPropertyValue("font-variation-settings")
            .split(" ")[1],
          10,
        )
      : parseInt(elementStyle.fontWeight, 10)) ||
    parseInt(window.getComputedStyle(document.body).fontWeight, 10) ||
    400;

  const availableWeights = isVariable ? [] : getAvailableFontWeights(element);

  const desiredBoldWeight =
    originalWeight >= 600
      ? 900
      : Math.min(900, Math.round(originalWeight * 1.5));
  const desiredNormalWeight = Math.min(600, originalWeight);

  const boldWeight = isVariable
    ? desiredBoldWeight
    : findClosestWeight(desiredBoldWeight, availableWeights);
  const normalWeight = isVariable
    ? desiredNormalWeight
    : findClosestWeight(desiredNormalWeight, availableWeights);

  return {
    boldWeight,
    normalWeight,
    isVariable,
  };
}

export function setFontWeight(
  element: HTMLElement,
  weight: number,
  isVariable: boolean,
): void {
  element.style.setProperty("font-weight", `${weight}`);
  if (isVariable) {
    element.style.setProperty("font-variation-settings", `'wght' ${weight}`);
  }
}
