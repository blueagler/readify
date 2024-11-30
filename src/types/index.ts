export interface DOMProcessorConfig {
  readonly BATCH_SIZE: number;
  readonly COLUMN_THRESHOLD: number;
  readonly IGNORE_TAGS: Set<string>;
  readonly INTERSECTION_MARGIN: string;
  readonly INTERSECTION_THRESHOLD: number;
  readonly VIEWPORT_MARGIN: number;
}

export interface ReadifyConfig {
  readonly DOM_MATCHERS: DOMMatchers;
  readonly MUTATION_ATTRIBUTES: Set<string>;
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

export type ProcessCallback = (element: Element) => void;
export type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

export interface ProcessOptions {
  isProcessed: boolean;
  isVisible: boolean;
  shouldProcess: boolean;
}
