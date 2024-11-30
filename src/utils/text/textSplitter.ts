import { isPunctuation, isSymbol, isWhitespace } from "./stringUtils";

export function splitIntoSentences(text: string): string[] {
  const sentences: string[] = [];
  let currentSentence = "";
  let prevChar = "";

  for (const char of text) {
    if (char === "\n") {
      if (currentSentence) {
        sentences.push(currentSentence);
        currentSentence = "";
      }
      sentences.push(char);
      continue;
    }

    currentSentence += char;

    if (isPunctuation(prevChar) && isWhitespace(char)) {
      sentences.push(currentSentence);
      currentSentence = "";
    }

    prevChar = char;
  }

  if (currentSentence) {
    sentences.push(currentSentence);
  }

  return sentences;
}

export function splitIntoWords(text: string): string[] {
  const words: string[] = [];
  let currentWord = "";
  let prevChar = "";

  for (const char of text) {
    if (isWhitespace(char)) {
      if (currentWord) {
        words.push(currentWord);
        currentWord = "";
      }
      words.push(char);
      continue;
    }

    if (isSymbol(char) && !isSymbol(prevChar)) {
      if (currentWord) {
        words.push(currentWord);
        currentWord = "";
      }
    }

    currentWord += char;
    prevChar = char;
  }

  if (currentWord) {
    words.push(currentWord);
  }

  return words;
}
