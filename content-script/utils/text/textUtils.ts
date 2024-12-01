export interface TextRange {
  $end: number;
  $start: number;
}

export function findEnglishRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];
  let currentRange: null | TextRange = null;

  const chars = [...text];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (/[a-zA-Z]/.test(char)) {
      if (!currentRange) {
        currentRange = { $end: i + 1, $start: i };
      } else {
        currentRange.$end = i + 1;
      }
    } else {
      if (currentRange) {
        const segment = text.slice(currentRange.$start, currentRange.$end);
        if (/[a-zA-Z]{2,}/.test(segment)) {
          ranges.push({ ...currentRange });
        }
        currentRange = null;
      }
    }
  }

  if (currentRange) {
    const segment = text.slice(currentRange.$start, currentRange.$end);
    if (/[a-zA-Z]{2,}/.test(segment)) {
      ranges.push(currentRange);
    }
  }

  return ranges;
}

export function isWhitespace(char: string): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
}

export function isSymbol(char: string): boolean {
  const code = char.codePointAt(0);
  if (!code) return false;

  return (
    (code >= 0x2000 && code <= 0x206f) ||
    (code >= 0x2190 && code <= 0x21ff) ||
    (code >= 0x2300 && code <= 0x23ff) ||
    (code >= 0x2600 && code <= 0x26ff) ||
    (code >= 0x2700 && code <= 0x27bf) ||
    (code >= 0xfe00 && code <= 0xfe0f) ||
    (code >= 0x1f000 && code <= 0x1f9ff)
  );
}

export function isSpecialCharacter(text: string): boolean {
  const graphemes = [...text];
  return graphemes.length === 1 || graphemes.every(isSymbol);
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
