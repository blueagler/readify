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
