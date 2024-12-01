import { isSymbol, isWhitespace } from "./stringUtils";

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
