import {
  DOMProcessorConfig,
  PerformanceConfig,
  ReadifyConfig,
} from "../types/index";

export const PROCESSOR_CONFIG: DOMProcessorConfig = {
  BATCH_SIZE: 20,
  COLUMN_THRESHOLD: 50,
  IGNORE_TAGS: new Set([
    "SCRIPT",
    "STYLE",
    "CODE",
    "PRE",
    "TEXTAREA",
    "INPUT",
    "NOSCRIPT",
    "CANVAS",
    "SVG",
  ]),
  INTERSECTION_MARGIN: "50px",
  INTERSECTION_THRESHOLD: 0.1,
  VIEWPORT_MARGIN: 100,
} as const;

export const APP_CONFIG: ReadifyConfig = {
  DOM_MATCHERS: {
    INTERACTIVE: "a[href], button, input, select, textarea",
    TEXT_ONLY: "a:not([href])",
  },
  MUTATION_ATTRIBUTES: ["class", "style", "contenteditable"] as const,
} as const;

export const PERFORMANCE_CONFIG: PerformanceConfig = {
  BATCH_TIMEOUT: 0,
  SCROLL_THROTTLE: 150,
  TASK_DELAY: 0,
} as const;

export const DOM_CONFIG = {
  MUTATION_OPTIONS: {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  },
} as const;
