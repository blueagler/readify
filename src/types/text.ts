export interface WordAnalysis {
  boldLength: number;
  syllables: number;
}

export interface BionicRatios {
  readonly COMMON_WORDS: number;
  readonly MULTI_SYLLABLE: {
    readonly FOUR_PLUS: number;
    readonly THREE: number;
    readonly TWO: number;
  };
  readonly SINGLE_SYLLABLE: {
    readonly LONG: number;
    readonly MEDIUM: number;
    readonly SHORT: number;
  };
}
