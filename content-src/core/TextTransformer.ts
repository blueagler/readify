import { STYLE_CLASSES } from "../constants/config";
import { ProcessorConfig } from "../types";
import { isSpecialCharacter, splitIntoWords } from "../utils/text/textUtils";
import { findEnglishRanges } from "../utils/text/textUtils";
import { analyzeWord } from "../utils/text/wordAnalyzer";

export function createBionicNode(
  text: string,
  config: ProcessorConfig,
): DocumentFragment {
  if (!text?.trim()) {
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
      strong.className = STYLE_CLASSES.BIONIC_SALIENCED;
      strong.textContent = word.slice(0, boldLength);
      wordSpan.append(strong);

      if (boldLength < word.length) {
        const remaining = document.createElement("span");
        remaining.className = STYLE_CLASSES.BIONIC_IGNORED;
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
