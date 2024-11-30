import type { BionicRatios } from "./text";

export interface SyllablePatterns {
  readonly ADD: RegExp;
  readonly SILENT_E: RegExp;
  readonly SILENT_ED: RegExp;
  readonly SILENT_ES: RegExp;
  readonly SUBTRACT: RegExp;
  readonly VOWELS: RegExp;
}

export interface BionicConfig {
  boldFactor: number;
  readonly commonWords: Set<string>;
  readonly MAX_BOLD_LENGTH: number;
  readonly MIN_BOLD_LENGTH: number;
  readonly PREFIX_PATTERN: RegExp;
  readonly RATIOS: BionicRatios;
  readonly SYLLABLE_PATTERNS: SyllablePatterns;
  readonly syllableExceptions: Map<string, number>;
  useSyllables: boolean;
}

export interface MutationConfig {
  readonly ATTRIBUTES_FILTER: Set<string>;
  readonly OPTIONS: {
    readonly attributeOldValue: boolean;
    readonly attributes: boolean;
    readonly characterData: boolean;
    readonly characterDataOldValue: boolean;
    readonly childList: boolean;
    readonly subtree: boolean;
  };
}

export interface ProcessorConfig {
  readonly BATCH_SIZE: number;
  readonly BIONIC: BionicConfig;
  readonly COLUMN_THRESHOLD: number;
  readonly ignoreTags: Set<string>;
  readonly INTERSECTION_MARGIN: string;
  readonly INTERSECTION_THRESHOLD: number;
  readonly MUTATION: MutationConfig;
  readonly VIEWPORT_MARGIN: number;
}
