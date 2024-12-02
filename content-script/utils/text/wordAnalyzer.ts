import { BionicConfig } from "../../types";

interface WordAnalysis {
  boldLength: number;
  isCommonWord: boolean;
  syllables: number;
}

const syllableCache = new Map<string, number>();
const MAX_CACHE_SIZE = 10000;

function countSyllables(word: string, config: BionicConfig): number {
  const cached = syllableCache.get(word);
  if (cached !== undefined) return cached;

  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;

  const exceptionCount = config.syllableExceptions.get(word);
  if (exceptionCount !== undefined) {
    return exceptionCount;
  }

  let syllables = (word.match(config.SYLLABLE_PATTERNS.VOWELS) || []).length;
  if (syllables === 0) return 1;

  syllables -= (word.match(config.SYLLABLE_PATTERNS.SUBTRACT) || []).length;
  syllables += (word.match(config.SYLLABLE_PATTERNS.ADD) || []).length;

  if (config.PREFIX_PATTERN.test(word)) {
    syllables++;
  }

  if (config.SYLLABLE_PATTERNS.SILENT_E.test(word)) syllables--;
  if (config.SYLLABLE_PATTERNS.SILENT_ED.test(word)) syllables--;
  if (config.SYLLABLE_PATTERNS.SILENT_ES.test(word)) syllables--;

  if (syllableCache.size < MAX_CACHE_SIZE) {
    syllableCache.set(word, syllables);
  }

  return Math.max(1, syllables);
}

function getDynamicBoldLength(
  length: number,
  syllables: number,
  config: BionicConfig,
): number {
  if (length <= 0 || syllables <= 0) {
    return Math.min(Math.ceil(length * 0.4), 4);
  }

  if (length <= 4) {
    return Math.ceil(
      length * config.RATIOS.SINGLE_SYLLABLE.$SHORT * config.boldFactor,
    );
  }

  const baseRatio =
    syllables <= 1
      ? length <= 7
        ? config.RATIOS.SINGLE_SYLLABLE.MEDIUM
        : config.RATIOS.SINGLE_SYLLABLE.LONG
      : syllables === 2
        ? config.RATIOS.MULTI_SYLLABLE.TWO
        : syllables === 3
          ? config.RATIOS.MULTI_SYLLABLE.THREE
          : config.RATIOS.MULTI_SYLLABLE.FOUR_PLUS;

  const lengthScale = length > 8 ? 1 + (length - 8) * 0.005 : 1;
  const positionFactor = Math.max(0.8, Math.min(1.2, syllables > 2 ? 1.1 : 1));

  return Math.ceil(
    length * baseRatio * config.boldFactor * lengthScale * positionFactor,
  );
}

const analysisCache = new WeakMap<BionicConfig, Map<string, WordAnalysis>>();

export function analyzeWord(word: string, config: BionicConfig): WordAnalysis {
  if (!word || typeof word !== "string") {
    return { boldLength: 0, isCommonWord: false, syllables: 0 };
  }

  let configCache = analysisCache.get(config);
  if (configCache) {
    const cached = configCache.get(word);
    if (cached) return cached;
  } else {
    configCache = new Map();
    analysisCache.set(config, configCache);
  }

  const length = word.length;
  if (length === 0) {
    return { boldLength: 0, isCommonWord: false, syllables: 0 };
  }

  const lowerWord = word.toLowerCase();
  const isCommon = config.commonWords.has(lowerWord);
  const syllables = countSyllables(word, config);

  let boldLength: number;

  if (isCommon) {
    boldLength = config.boldCommonWords
      ? Math.max(
          1,
          Math.ceil(length * config.RATIOS.COMMON_WORDS * config.boldFactor),
        )
      : 0;
  } else {
    if (syllables === 1 && !config.boldSingleSyllables) {
      boldLength = 0;
    } else {
      boldLength = Math.max(1, getDynamicBoldLength(length, syllables, config));
    }
  }

  const result = {
    boldLength: Math.min(config.MAX_BOLD_LENGTH, Math.min(length, boldLength)),
    isCommonWord: isCommon,
    syllables,
  };

  if (configCache.size < MAX_CACHE_SIZE) {
    configCache.set(word, result);
  }

  return result;
}
