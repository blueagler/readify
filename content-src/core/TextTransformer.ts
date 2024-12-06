import { ProcessorConfig } from "../types";
import { isSpecialCharacter, splitIntoWords } from "../utils/text/textUtils";
import { findEnglishRanges } from "../utils/text/textUtils";
import { analyzeWord } from "../utils/text/wordAnalyzer";

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

function calculateWeight(
  originalWeight: number,
  element: Element,
): {
  boldWeight: number;
  normalWeight: number;
  isVariable: boolean;
} {
  const isVariable = isVariableFont(element);

  const availableWeights = getAvailableFontWeights(element);
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

function setFontWeight(
  element: HTMLElement,
  weight: number,
  isVariable: boolean,
): void {
  element.style.setProperty("font-weight", `${weight}`);
  if (isVariable) {
    element.style.setProperty("font-variation-settings", `'wght' ${weight}`);
  }
}

export function createBionicNode(
  text: string,
  config: ProcessorConfig,
  target: ParentNode,
): DocumentFragment | false {
  if (!text?.trim()) {
    return false;
  }

  const englishRanges = findEnglishRanges(text).filter(({ $end, $start }) => {
    const word = text.slice($start, $end).trim();
    return /^[a-zA-Z]+(?:[\s'][a-zA-Z]+)*$/.test(word);
  });

  if (englishRanges.length === 0) {
    return false;
  }

  const originalWeight =
    parseInt(window.getComputedStyle(target as Element).fontWeight, 10) ||
    parseInt(window.getComputedStyle(document.body).fontWeight, 10) ||
    400;
  const calculatedWeights = calculateWeight(originalWeight, target as Element);

  const fragment = document.createDocumentFragment();
  const containerSpan = document.createElement("span");
  setFontWeight(
    containerSpan,
    calculatedWeights.normalWeight,
    calculatedWeights.isVariable,
  );

  englishRanges.sort((a, b) => a.$start - b.$start);

  let lastEnd = 0;
  englishRanges.forEach(({ $end, $start }) => {
    if ($start > lastEnd) {
      containerSpan.append(text.slice(lastEnd, $start));
    }

    splitIntoWords(text.slice($start, $end)).forEach((word) => {
      if (!word.trim() || isSpecialCharacter(word)) {
        containerSpan.append(word);
        return;
      }

      const { boldLength } = analyzeWord(word, config.BIONIC);
      if (boldLength === 0) {
        containerSpan.append(word);
        return;
      }

      const wordSpan = document.createElement("span");

      const strong = document.createElement("strong");
      setFontWeight(
        strong,
        calculatedWeights.boldWeight,
        calculatedWeights.isVariable,
      );
      strong.textContent = word.slice(0, boldLength);
      wordSpan.append(strong);

      if (boldLength < word.length) {
        const remaining = document.createElement("span");
        setFontWeight(
          remaining,
          calculatedWeights.normalWeight,
          calculatedWeights.isVariable,
        );
        remaining.textContent = word.slice(boldLength);
        wordSpan.append(remaining);
      }

      containerSpan.append(wordSpan);
    });

    lastEnd = $end;
  });

  if (lastEnd < text.length) {
    containerSpan.appendChild(document.createTextNode(text.slice(lastEnd)));
  }

  fragment.appendChild(containerSpan);
  return fragment;
}
