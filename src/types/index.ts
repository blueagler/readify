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
  readonly MUTATION_ATTRIBUTES: readonly string[];
}

export interface DOMMatchers {
  readonly INTERACTIVE: string;
  readonly TEXT_ONLY: string;
}

export interface PerformanceConfig {
  readonly BATCH_TIMEOUT: number;
  readonly SCROLL_THROTTLE: number;
  readonly TASK_DELAY: number;
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
