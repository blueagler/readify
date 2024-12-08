function generateClassName(id: string): string {
  return `_${id}${Math.random().toString(36).substr(2, 9)}`;
}

export const BIONIC_IGNORED_CLASS = generateClassName("_");
export const BIONIC_CLASS = generateClassName("");

export function initReadifyStyles() {
  injectStyles({
    [BIONIC_IGNORED_CLASS]: {
      fontWeight: "var(--a)",
      display: "inline",
    },
    [BIONIC_CLASS]: {
      fontWeight: "var(--b)",
      fontVariationSettings: "var(--c)",
      display: "inline",
    },
  });
}

interface StyleDefinition {
  [key: string]: Partial<CSSStyleDeclaration>;
}

function cssObjectToString(styles: Partial<CSSStyleDeclaration>): string {
  return Object.entries(styles)
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `${cssKey}: ${value};`;
    })
    .join(" ");
}

export function injectStyles(customStyles: StyleDefinition = {}): void {
  const sheet = new CSSStyleSheet();
  for (const [className, styles] of Object.entries(customStyles)) {
    sheet.insertRule(`.${className} { ${cssObjectToString(styles)} }`);
  }
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}

export function updateStyle(
  className: string,
  properties: Partial<CSSStyleDeclaration>,
) {
  const sheet = document.adoptedStyleSheets.find((s) =>
    Array.from(s.cssRules).some(
      (rule) =>
        rule instanceof CSSStyleRule && rule.selectorText === `.${className}`,
    ),
  );
  if (!sheet) return;
  const ruleIndex = Array.from(sheet.cssRules).findIndex(
    (rule) =>
      rule instanceof CSSStyleRule && rule.selectorText === `.${className}`,
  );
  if (ruleIndex === -1) return;
  const rule = sheet.cssRules[ruleIndex] as CSSStyleRule;
  Object.assign(rule.style, properties);
}

export function removeStyle(className: string) {
  const sheet = document.adoptedStyleSheets.find((s) =>
    Array.from(s.cssRules).some(
      (rule) =>
        rule instanceof CSSStyleRule && rule.selectorText === `.${className}`,
    ),
  );
  if (!sheet) return;
  const ruleIndex = Array.from(sheet.cssRules).findIndex(
    (rule) =>
      rule instanceof CSSStyleRule && rule.selectorText === `.${className}`,
  );
  if (ruleIndex === -1) return;
  sheet.deleteRule(ruleIndex);
}
