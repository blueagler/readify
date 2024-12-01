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
