import { DOMProcessorConfig, ReadifyConfig } from "../types/index";

function getDeviceConfig(): DOMProcessorConfig {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isHighRes = pixelRatio > 1;

  const batchSize = Math.floor(
    50 * (isMobile ? 0.6 : 1) * (isHighRes ? 1.2 : 1),
  );
  const columnThreshold = Math.floor(width * 0.1);
  const viewportMargin = Math.floor(height * 0.5);
  const intersectionMargin = `${Math.floor(height * 0.2)}px`;

  return {
    BATCH_SIZE: Math.max(20, Math.min(100, batchSize)),
    COLUMN_THRESHOLD: Math.max(50, Math.min(200, columnThreshold)),
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
      "IFRAME",
      "IMG",
      "VIDEO",
      "AUDIO",
      "OBJECT",
      "EMBED",
      "MAP",
      "FIGURE",
      "MATH",
    ]),
    INTERSECTION_MARGIN: intersectionMargin,
    INTERSECTION_THRESHOLD: isMobile ? 0.1 : 0.05, // Higher threshold for mobile to save resources
    VIEWPORT_MARGIN: Math.max(100, Math.min(400, viewportMargin)), // Clamp between 100 and 400px
  } as const;
}

export const PROCESSOR_CONFIG = getDeviceConfig();

export const APP_CONFIG: ReadifyConfig = {
  DOM_MATCHERS: {
    INTERACTIVE: new Set([
      "a[href]",
      "button",
      "input",
      "select",
      "textarea",
      "[contenteditable]",
      "[role='button']",
      "[role='textbox']",
      "[role='combobox']",
      "[role='searchbox']",
      "details summary",
    ]),
    TEXT_ONLY: new Set(["a:not([href])", "[role='text']"]),
  },
  MUTATION_ATTRIBUTES: new Set(["class", "style", "contenteditable", "role"]),
} as const;

export const DOM_CONFIG = {
  MUTATION_OPTIONS: {
    attributeOldValue: false,
    attributes: true,
    characterData: true,
    characterDataOldValue: false,
    childList: true,
    subtree: true,
  },
} as const;
