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
  readonly DEBOUNCE_DELAY: number;
  readonly OPTIONS: MutationObserverInit;
}

export interface ProcessorConfig {
  readonly BIONIC: BionicConfig;
  readonly COLUMN_THRESHOLD: number;
  readonly DOM_SELECTORS: DOMSelectors;
  readonly ELEMENTS_PER_FRAME: number;
  readonly INTERSECTION_MARGIN: string;
  readonly INTERSECTION_THRESHOLD: number;
  readonly MUTATION: MutationConfig;
  readonly VIEWPORT_MARGIN: number;
}

export interface BionicRatios {
  readonly COMMON_WORDS: number;
  readonly MULTI_SYLLABLE: {
    readonly FOUR_PLUS: number;
    readonly THREE: number;
    readonly TWO: number;
  };
  readonly SINGLE_SYLLABLE: {
    readonly _SHORT: number;
    readonly LONG: number;
    readonly MEDIUM: number;
  };
}

export interface ElementPosition {
  $element: Element;
  $width: number;
  $x: number;
  $y: number;
}

export interface ProcessOptions {
  isProcessed: boolean;
  isVisible: boolean;
  shouldProcess: boolean;
}

export type ProcessCallback = (element: Element) => void;
export type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

export interface ReadifyConfig {
  boldFactor: number;
  commonWords: Set<string>;
}

export interface CustomizedConfig {
  readonly boldCommonWords: boolean;
  readonly boldFactor: number;
  readonly boldSingleSyllables: boolean;
  readonly commonWords: Set<string>;
  readonly syllableExceptions: Map<string, number>;
}

export interface WordAnalysis {
  boldLength: number;
  syllables: number;
}

interface ElementCheckConfig {
  readonly ATTRIBUTE_VALUES?: readonly Readonly<[string, string]>[];
  readonly ATTRIBUTES?: readonly string[];
  readonly CLASS_NAMES?: readonly string[];
  readonly CLOSEST?: readonly string[];
  readonly ROLES?: readonly string[];
  readonly STYLES?: readonly Readonly<[string, string]>[];
  readonly TAGS?: readonly string[];
}

export enum ElementCheckType {
  Editable = 3,
  Hidden = 1,
  HighPerformance = 2,
  Ignored = 0,
}

interface DOMSelectors {
  ELEMENT_CHECKS: Record<ElementCheckType, ElementCheckConfig>;
}
