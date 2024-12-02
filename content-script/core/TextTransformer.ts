import { STYLE_CLASSES } from "../constants/config";
import { ProcessorConfig } from "../types";
import { isSpecialCharacter, splitIntoWords } from "../utils/text/textUtils";
import { findEnglishRanges } from "../utils/text/textUtils";
import { analyzeWord } from "../utils/text/wordAnalyzer";

export function createBionicNode(
  text: string,
  config: ProcessorConfig,
): DocumentFragment {
  if (typeof text !== "string" || !text.trim()) {
    return document.createDocumentFragment();
  }

  if (/<\/?(?:strong|span)/.test(text)) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode(text));
    return fragment;
  }

  const fragment = document.createDocumentFragment();
  const containerSpan = document.createElement("span");

  const englishRanges = findEnglishRanges(text).filter(({ $end, $start }) => {
    const word = text.slice($start, $end).trim();
    return /^[a-zA-Z]+(?:[\s'][a-zA-Z]+)*$/.test(word);
  });

  if (englishRanges.length === 0) {
    containerSpan.appendChild(document.createTextNode(text));
    fragment.appendChild(containerSpan);
    return fragment;
  }

  englishRanges.sort((a, b) => a.$start - b.$start);

  let lastEnd = 0;
  englishRanges.forEach(({ $end, $start }) => {
    if ($start > lastEnd) {
      containerSpan.appendChild(
        document.createTextNode(text.slice(lastEnd, $start)),
      );
    }

    const englishText = text.slice($start, $end);
    const words = splitIntoWords(englishText);
    words.forEach((word) => {
      if (!word.trim() || isSpecialCharacter(word)) {
        containerSpan.appendChild(document.createTextNode(word));
        return;
      }

      const wordSpan = document.createElement("span");
      const { boldLength } = analyzeWord(word, config.BIONIC);

      if (boldLength === 0) {
        wordSpan.textContent = word;
      } else {
        const strong = document.createElement("strong");
        strong.className = STYLE_CLASSES.BIONIC_SALIENCED;
        strong.textContent = word.slice(0, boldLength);
        wordSpan.appendChild(strong);
        if (boldLength < word.length) {
          const remaining = document.createElement("span");
          remaining.className = STYLE_CLASSES.BIONIC_IGNORED;
          remaining.textContent = word.slice(boldLength);
          wordSpan.appendChild(remaining);
        }
      }

      containerSpan.appendChild(wordSpan);
    });

    lastEnd = $end;
  });

  if (lastEnd < text.length) {
    containerSpan.appendChild(document.createTextNode(text.slice(lastEnd)));
  }

  fragment.appendChild(containerSpan);
  return fragment;
}
