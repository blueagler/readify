import { isSpecialCharacter } from "../utils/text/stringUtils";
import { splitIntoSentences, splitIntoWords } from "../utils/text/textSplitter";

export function createBionicNode(text: string): DocumentFragment {
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
      const midPoint = Math.ceil(graphemes.length / 2);
      const strong = document.createElement("strong");

      strong.textContent = graphemes.slice(0, midPoint).join("");
      span.appendChild(strong);
      span.appendChild(
        document.createTextNode(graphemes.slice(midPoint).join("")),
      );
      fragment.appendChild(span);
    });
  });

  return fragment;
}
