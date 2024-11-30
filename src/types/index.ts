import { BionicConfig } from "./config";

export type ProcessCallback = (element: Element) => void;
export type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

export interface ReadifyConfig {
  boldFactor: number;
  commonWords: Set<string>;
  useSyllables: boolean;
}

export interface DOMMatchers {
  readonly INTERACTIVE: Set<string>;
  readonly TEXT_ONLY: Set<string>;
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

export interface ProcessorConfig {
  readonly BATCH_SIZE: number;
  readonly BIONIC: BionicConfig;
  readonly COLUMN_THRESHOLD: number;
  readonly ignoreTags: Set<string>;
  readonly INTERSECTION_MARGIN: string;
  readonly INTERSECTION_THRESHOLD: number;
  readonly MUTATION: {
    readonly ATTRIBUTES_FILTER: Set<string>;
    readonly OPTIONS: MutationObserverInit;
  };
  readonly VIEWPORT_MARGIN: number;
}

export interface CustomizedConfig {
  readonly boldFactor: number;
  readonly commonWords: Set<string>;
  readonly syllableExceptions: Map<string, number>;
  readonly useSyllables: boolean;
}
