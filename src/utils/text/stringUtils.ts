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
