import { ProcessorConfig } from "../types/config";
import { isSpecialCharacter } from "../utils/text/stringUtils";
import { splitIntoWords } from "../utils/text/textSplitter";
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
  containerSpan.setAttribute(config.DOM_ATTRS.PROCESSED_ATTR, "");

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
        strong.textContent = word.slice(0, boldLength);
        wordSpan.appendChild(strong);
        if (boldLength < word.length) {
          wordSpan.appendChild(document.createTextNode(word.slice(boldLength)));
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