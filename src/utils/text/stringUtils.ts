export function isWhitespace(char: string): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
}

export function isPunctuation(char: string): boolean {
  return char === "." || char === "!" || char === "?";
}

export function isSymbol(char: string): boolean {
  const code = char.codePointAt(0);
  if (!code) return false;

  return (
    (code >= 0x2000 && code <= 0x206f) || // General Punctuation
    (code >= 0x2190 && code <= 0x21ff) || // Arrows
    (code >= 0x2300 && code <= 0x23ff) || // Miscellaneous Technical
    (code >= 0x2600 && code <= 0x26ff) || // Miscellaneous Symbols
    (code >= 0x2700 && code <= 0x27bf) || // Dingbats
    (code >= 0xfe00 && code <= 0xfe0f) || // Variation Selectors
    (code >= 0x1f000 && code <= 0x1f9ff) // Emoji
  );
}

export function isSpecialCharacter(text: string): boolean {
  const graphemes = [...text];
  return graphemes.length === 1 || graphemes.every(isSymbol);
}
