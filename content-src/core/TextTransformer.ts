import { ProcessorConfig } from "../types";
import {
  CalculateWeightResult,
  setFontWeight,
} from "../utils/dom/elementUtils";
import { isSpecialCharacter, splitIntoWords } from "../utils/text/textUtils";
import { findEnglishRanges } from "../utils/text/textUtils";
import { analyzeWord } from "../utils/text/wordAnalyzer";

export function createBionicNode(
  text: string,
  config: ProcessorConfig,
  calculatedWeights: CalculateWeightResult,
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
