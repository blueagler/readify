export interface SyllablePatterns {
  readonly ADD: RegExp;
  readonly SILENT_E: RegExp;
  readonly SILENT_ED: RegExp;
  readonly SILENT_ES: RegExp;
  readonly SUBTRACT: RegExp;
  readonly VOWELS: RegExp;
}

export interface BionicConfig {
  boldCommonWords: boolean;
  boldFactor: number;
  boldSingleSyllables: boolean;
  readonly commonWords: Set<string>;
  readonly MAX_BOLD_LENGTH: number;
  readonly MIN_BOLD_LENGTH: number;
  readonly PREFIX_PATTERN: RegExp;
  readonly RATIOS: BionicRatios;
  readonly SYLLABLE_PATTERNS: SyllablePatterns;
  readonly syllableExceptions: Map<string, number>;
}

export interface MutationConfig {
  readonly ATTRIBUTES_FILTER: Set<string>;
  readonly OPTIONS: MutationObserverInit;
}

export interface ProcessorConfig {
  readonly BIONIC: BionicConfig;
  readonly COLUMN_THRESHOLD: number;
  readonly DOM_ATTRS: DOMAttributes;
  readonly ignoreTags: Set<string>;
  readonly INTERSECTION_MARGIN: string;
  readonly INTERSECTION_THRESHOLD: number;
  readonly MUTATION: {
    readonly ATTRIBUTES_FILTER: Set<string>;
    readonly OPTIONS: MutationObserverInit;
  };
  readonly VIEWPORT_MARGIN: number;
}

export interface DOMAttributes {
  readonly OBSERVED_ATTR: string;
  readonly PROCESSED_ATTR: string;
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
