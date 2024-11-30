export function createBionicNode(text: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const sentences = splitIntoSentences(text);
  
  sentences.forEach(sentence => {
    const words = splitIntoWords(sentence);
    words.forEach(word => {
      if (!word.trim()) {
        fragment.appendChild(document.createTextNode(word));
        return;
      }

      if (isSpecialCharacter(word)) {
        fragment.appendChild(document.createTextNode(word));
        return;
      }

      const span = document.createElement('span');
      const graphemes = [...word]; // Split into Unicode graphemes
      const midPoint = Math.ceil(graphemes.length / 2);
      const strong = document.createElement('strong');
      
      strong.textContent = graphemes.slice(0, midPoint).join('');
      span.appendChild(strong);
      span.appendChild(document.createTextNode(graphemes.slice(midPoint).join('')));
      fragment.appendChild(span);
    });
  });

  return fragment;
}

function splitIntoSentences(text: string): string[] {
  const sentences: string[] = [];
  let currentSentence = '';
  let prevChar = '';
  
  for (const char of text) {
    if (char === '\n') {
      if (currentSentence) {
        sentences.push(currentSentence);
        currentSentence = '';
      }
      sentences.push(char);
      continue;
    }

    currentSentence += char;

    if (isPunctuation(prevChar) && isWhitespace(char)) {
      sentences.push(currentSentence);
      currentSentence = '';
    }

    prevChar = char;
  }

  if (currentSentence) {
    sentences.push(currentSentence);
  }

  return sentences;
}

function splitIntoWords(text: string): string[] {
  const words: string[] = [];
  let currentWord = '';
  let prevChar = '';
  
  for (const char of text) {
    if (isWhitespace(char)) {
      if (currentWord) {
        words.push(currentWord);
        currentWord = '';
      }
      words.push(char);
      continue;
    }

    if (isSymbol(char) && !isSymbol(prevChar)) {
      if (currentWord) {
        words.push(currentWord);
        currentWord = '';
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

function isWhitespace(char: string): boolean {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r';
}

function isPunctuation(char: string): boolean {
  return char === '.' || char === '!' || char === '?';
}

function isSymbol(char: string): boolean {
  const code = char.codePointAt(0);
  if (!code) return false;
  
  // Unicode ranges for symbols and emoji
  return (
    (code >= 0x2000 && code <= 0x206F) || // General Punctuation
    (code >= 0x2190 && code <= 0x21FF) || // Arrows
    (code >= 0x2300 && code <= 0x23FF) || // Miscellaneous Technical
    (code >= 0x2600 && code <= 0x26FF) || // Miscellaneous Symbols
    (code >= 0x2700 && code <= 0x27BF) || // Dingbats
    (code >= 0xFE00 && code <= 0xFE0F) || // Variation Selectors
    (code >= 0x1F000 && code <= 0x1F9FF)  // Emoji
  );
}

function isSpecialCharacter(text: string): boolean {
  // Check if text is a single grapheme or symbol/emoji
  const graphemes = [...text];
  return graphemes.length === 1 || graphemes.every(isSymbol);
}
