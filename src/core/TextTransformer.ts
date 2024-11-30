import { ProcessorConfig } from "../types/index";
import { isSpecialCharacter } from "../utils/text/stringUtils";
import { splitIntoSentences, splitIntoWords } from "../utils/text/textSplitter";
import { analyzeWord } from "../utils/text/wordAnalyzer";

export function createBionicNode(
  text: string,
  config: ProcessorConfig,
): DocumentFragment {
  if (typeof text !== "string") {
    return document.createDocumentFragment();
  }

  const fragment = document.createDocumentFragment();
  const sentences = splitIntoSentences(text);

  sentences.forEach((sentence) => {
    const words = splitIntoWords(sentence);
    words.forEach((word) => {
      if (!word.trim() || isSpecialCharacter(word)) {
        fragment.appendChild(document.createTextNode(word));
        return;
      }

      const span = document.createElement("span");
      const graphemes = [...word];
      const { boldLength } = analyzeWord(word, config.BIONIC);

      const strong = document.createElement("strong");
      strong.textContent = graphemes.slice(0, boldLength).join("");
      span.appendChild(strong);
      span.appendChild(
        document.createTextNode(graphemes.slice(boldLength).join("")),
      );
      fragment.appendChild(span);
    });
  });

  return fragment;
}
