export function generateName(id: string): string {
  return `${id}${Math.random().toString(36).substr(2, 9)}`;
}

export const BIONIC_TAG_NAME = generateName("_");
export const BIONIC_CLASS = generateName("_");
export const BIONIC_IGNORED_CLASS = generateName("__");
export const BIONIC_FONT_WEIGHT = generateName("--");
export const BIONIC_BOLD_FONT_WEIGHT = generateName("---");
export const BIONIC_BOLD_FONT_VARIATION = generateName("---");
export const FW = "font-weight";
export const FV = "font-variation-settings";

export function initReadifyStyles() {
  injectStyles({
    [BIONIC_TAG_NAME]: {
      display: "inline",
    },
    [`.${BIONIC_IGNORED_CLASS}`]: {
      [FW]: `var(${BIONIC_FONT_WEIGHT})`,
    },
    [`.${BIONIC_CLASS}`]: {
      [FW]: `var(${BIONIC_BOLD_FONT_WEIGHT})`,
      [FV]: `var(${BIONIC_BOLD_FONT_VARIATION})`,
    },
  });
}

interface StyleDefinition {
  [key: string]: {
    [key: string]: string;
  };
}

function cssObjectToString(styles: Partial<CSSStyleDeclaration>): string {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
}

export function injectStyles(customStyles: StyleDefinition = {}): void {
  const sheet = new CSSStyleSheet();
  for (const [selector, styles] of Object.entries(customStyles)) {
    sheet.insertRule(`${selector} { ${cssObjectToString(styles)} }`);
  }
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}

export function updateStyle(
  selector: string,
  properties: Partial<CSSStyleDeclaration>,
) {
  const sheet = document.adoptedStyleSheets.find((s) =>
    Array.from(s.cssRules).some(
      (rule) => rule instanceof CSSStyleRule && rule.selectorText === selector,
    ),
  );
  if (!sheet) return;
  const ruleIndex = Array.from(sheet.cssRules).findIndex(
    (rule) => rule instanceof CSSStyleRule && rule.selectorText === selector,
  );
  if (ruleIndex === -1) return;
  const rule = sheet.cssRules[ruleIndex] as CSSStyleRule;
  Object.assign(rule.style, properties);
}

export function removeStyle(selector: string) {
  const sheet = document.adoptedStyleSheets.find((s) =>
    Array.from(s.cssRules).some(
      (rule) => rule instanceof CSSStyleRule && rule.selectorText === selector,
    ),
  );
  if (!sheet) return;
  const ruleIndex = Array.from(sheet.cssRules).findIndex(
    (rule) => rule instanceof CSSStyleRule && rule.selectorText === selector,
  );
  if (ruleIndex === -1) return;
  sheet.deleteRule(ruleIndex);
}
