import { PROCESSOR_CONFIG } from "../constants/config";
import { CustomizedConfig, ElementCheckType, ProcessorConfig } from "../types";
import {
  getElementPosition,
  isBionicSpan,
  isElementVisible,
} from "../utils/dom/elementUtils";
import { createBionicNode } from "./TextTransformer";
const queueMicrotask =
  globalThis.queueMicrotask ||
  (typeof Promise !== "undefined"
    ? (cb: () => void) => Promise.resolve().then(cb)
    : (cb: () => void) => setTimeout(cb, 0));
export class DOMProcessor {
  private readonly $config: ProcessorConfig = PROCESSOR_CONFIG;
  private intersectionObserver!: IntersectionObserver;
  private isAnimationScheduled = false;
  private isProcessing = false;
  private mutationObserver!: MutationObserver;
  private processingSet = new Set<Element>();
  private taskBuffer: Element[] = [];
  private taskQueue: (() => void)[] = [];
  constructor(config?: Partial<CustomizedConfig>) {
    this.$config.BIONIC.boldFactor =
      config?.boldFactor || this.$config.BIONIC.boldFactor;
    this.$config.BIONIC.boldSingleSyllables =
      config?.boldSingleSyllables || this.$config.BIONIC.boldSingleSyllables;
    this.$config.BIONIC.boldCommonWords =
      config?.boldCommonWords || this.$config.BIONIC.boldCommonWords;
    config?.commonWords?.forEach((word) =>
      this.$config.BIONIC.commonWords.add(word),
    );
    config?.syllableExceptions?.forEach((value, key) =>
      this.$config.BIONIC.syllableExceptions.set(key, value),
    );
    this.setupObservers();
  }
  private checkElementType(element: Element, type: ElementCheckType): boolean {
    if (!(element instanceof HTMLElement)) return false;
    const config = this.$config.DOM_SELECTORS.ELEMENT_CHECKS[type];
    if (config.TAGS?.includes(element.tagName)) return true;
    if (type === ElementCheckType.Editable && element.isContentEditable)
      return true;
    if (config.ATTRIBUTES?.some((attr) => element.hasAttribute(attr)))
      return true;
    if (
      config.ROLES &&
      element.hasAttribute("role") &&
      config.ROLES.includes(element.getAttribute("role")?.toLowerCase() || "")
    ) {
      return true;
    }
    return config.CLOSEST?.some(
      (selector) => element.closest(selector) !== null,
    ) ?? false;
  }
  private cleanupRemovedElement(root: Element): void {
    if (root instanceof HTMLElement) {
      root.removeAttribute(this.$config.DOM_ATTRS.PROCESSED_ATTR);
      root.removeAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR);
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node): number => {
        if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP;
        return node.hasAttribute(this.$config.DOM_ATTRS.PROCESSED_ATTR) ||
          node.hasAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });
    let node: Element | null;
    while ((node = walker.nextNode() as Element)) {
      if (node instanceof HTMLElement) {
        node.removeAttribute(this.$config.DOM_ATTRS.PROCESSED_ATTR);
        node.removeAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR);
      }
    }
  }
  private filterRedundantElements(elements: Element[]): Element[] {
    return elements.filter(
      (element) => !this.isChildOfPendingElements(element, elements),
    );
  }
  private flushTaskBuffer(): void {
    if (this.taskBuffer.length === 0) return;
    const uniqueElements = this.filterRedundantElements(this.taskBuffer);
    const [visibleElements, hiddenElements] =
      this.partitionElements(uniqueElements);
    this.taskBuffer = [];
    const sortedVisible = this.sortElementsByReadingOrder(visibleElements);
    if (sortedVisible.length > 0) {
      this.scheduleVisualUpdate(sortedVisible);
    }
    hiddenElements.forEach((element) => {
      if (
        element instanceof HTMLElement &&
        !element.hasAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR)
      ) {
        element.setAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR, "");
        this.intersectionObserver.observe(element);
      }
    });
  }
  private getTextNodes(element: Element): Node[] {
    const nodes: Node[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.textContent?.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
    });
    let node;
    while ((node = walker.nextNode())) {
      nodes.push(node);
    }
    return nodes;
  }
  private isChildOfPendingElements(
    element: Element,
    elements: Element[],
  ): boolean {
    return elements.some(
      (pending) => pending.contains(element) && pending !== element,
    );
  }
  private isEditableOrInteractive(element: Element): boolean {
    return this.checkElementType(element, ElementCheckType.Editable);
  }
  private isHighPerformanceElement(element: Element): boolean {
    return this.checkElementType(element, ElementCheckType.HighPerformance);
  }
  private isIgnored(element: Element): boolean {
    return this.checkElementType(element, ElementCheckType.Ignored);
  }
  private isProcessed(element: Element): boolean {
    return (
      element instanceof HTMLElement &&
      element.hasAttribute(this.$config.DOM_ATTRS.PROCESSED_ATTR)
    );
  }
  private partitionElements(elements: Element[]): [Element[], Element[]] {
    return elements.reduce<[Element[], Element[]]>(
      ([visible, hidden], element) => {
        (isElementVisible(element) ? visible : hidden).push(element);
        return [visible, hidden];
      },
      [[], []],
    );
  }
  private processNewContent(root: Element): void {
    queueMicrotask(() => {
      if (this.isIgnored(root) || this.processingSet.has(root)) {
        return;
      }
      const elements = new Set<Element>();
      const elementsToObserve = new Set<Element>();
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node): number => {
          if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP;
          if (this.isIgnored(node) || this.processingSet.has(node)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (this.shouldProcess(node)) {
            const hasDirectTextNode = Array.from(node.childNodes).some(
              (child) =>
                child.nodeType === Node.TEXT_NODE && child.textContent?.trim(),
            );
            if (hasDirectTextNode) {
              if (isElementVisible(node)) {
                elements.add(node);
              } else {
                elementsToObserve.add(node);
              }
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      while (walker.nextNode()) {}
      elementsToObserve.forEach((element) => {
        if (
          element instanceof HTMLElement &&
          !element.hasAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR)
        ) {
          element.setAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR, "");
          this.intersectionObserver.observe(element);
        }
      });
      if (elements.size > 0) {
        this.taskBuffer.push(...elements);
        this.flushTaskBuffer();
      }
    });
  }
  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;
    while (this.taskQueue.length > 0) {
      await new Promise(queueMicrotask);
      const task = this.taskQueue.shift();
      if (task) {
        task();
      }
    }
    this.isProcessing = false;
  }
  private processTextNodes(element: Element): void {
    if (!this.shouldProcess(element)) return;
    if (this.processingSet.has(element)) return;
    this.processingSet.add(element);
    try {
      const textNodes = Array.from(element.childNodes).filter(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      );
      if (textNodes.length) {
        textNodes.forEach((node) => {
          if (node.textContent) {
            const processedNode = createBionicNode(
              node.textContent,
              this.$config,
            );
            node.parentNode?.replaceChild(processedNode, node);
          }
        });
        if (element instanceof HTMLElement) {
          element.setAttribute(this.$config.DOM_ATTRS.PROCESSED_ATTR, "");
        }
      }
    } finally {
      this.processingSet.delete(element);
    }
  }
  private queueTask(task: () => void): void {
    this.taskQueue.push(task);
    if (!this.isProcessing) {
      queueMicrotask(() => this.processQueue());
    }
  }
  private scheduleVisualUpdate(elements: Element[]): void {
    if (elements.length === 0) return;
    this.queueTask(() => {
      let index = 0;
      const processNextBatch = () => {
        const startTime = performance.now();
        const endIndex = Math.min(
          index + this.$config.ELEMENTS_PER_FRAME,
          elements.length,
        );
        while (index < endIndex) {
          const element = elements[index];
          if (isElementVisible(element)) {
            this.processTextNodes(element);
          } else {
            if (element instanceof HTMLElement) {
              element.setAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR, "");
              this.intersectionObserver.observe(element);
            }
          }
          index++;
          if (performance.now() - startTime > 16) {
            break;
          }
        }
        if (index < elements.length) {
          requestAnimationFrame(processNextBatch);
        }
      };
      if (!this.isAnimationScheduled) {
        this.isAnimationScheduled = true;
        requestAnimationFrame(() => {
          processNextBatch();
          this.isAnimationScheduled = false;
        });
      }
    });
  }
  private setupObservers(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target instanceof Element &&
            !this.isProcessed(entry.target)
          ) {
            this.queueTask(() => this.processTextNodes(entry.target));
            this.intersectionObserver.unobserve(entry.target);
            if (entry.target instanceof HTMLElement) {
              entry.target.removeAttribute(
                this.$config.DOM_ATTRS.OBSERVED_ATTR,
              );
            }
          }
        }),
      {
        rootMargin: this.$config.INTERSECTION_MARGIN,
        threshold: this.$config.INTERSECTION_THRESHOLD,
      },
    );
    this.mutationObserver = new MutationObserver((mutations) => {
      const debounceSet = new Set<Element>();
      mutations.forEach((mutation) => {
        const target = mutation.target;
        if (!target) return;
        if (target instanceof Element && this.processingSet.has(target)) return;
        if (target instanceof Element && this.isEditableOrInteractive(target))
          return;
        if (target instanceof Element && this.isHighPerformanceElement(target))
          return;
        if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach((node) => {
            if (node instanceof Element) {
              this.cleanupRemovedElement(node);
              this.intersectionObserver.unobserve(node);
            }
          });
        }
        let targetElement: Element | null = null;
        if (target instanceof Element) {
          targetElement = target;
        } else if (target.parentElement) {
          targetElement = target.parentElement;
        }
        if (targetElement && !debounceSet.has(targetElement)) {
          debounceSet.add(targetElement);
          if (!this.isProcessed(targetElement)) {
            this.queueTask(() => this.processNewContent(targetElement!));
          }
        }
      });
    });
  }
  private shouldProcess(element: Element): boolean {
    if (!element || !(element instanceof HTMLElement)) return false;
    if (element.hasAttribute(this.$config.DOM_ATTRS.PROCESSED_ATTR))
      return false;
    if (element.closest(`[${this.$config.DOM_ATTRS.PROCESSED_ATTR}]`))
      return false;
    if (this.isEditableOrInteractive(element)) return false;
    if (this.isHighPerformanceElement(element)) return false;
    if (this.isIgnored(element)) return false;
    if (
      element.hasAttribute("aria-hidden") ||
      element.hasAttribute("aria-label") ||
      element.hasAttribute("data-noprocess") ||
      element.hasAttribute("data-raw") ||
      element.getAttribute("translate") === "no"
    )
      return false;
    const className = element.className;
    if (
      typeof className === "string" &&
      (className.includes("no-process") ||
        className.includes("code") ||
        className.includes("math") ||
        className.includes("syntax"))
    )
      return false;
    const style = window.getComputedStyle(element);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0" ||
      style.clipPath === "inset(100%)" ||
      style.clip === "rect(0, 0, 0, 0)"
    )
      return false;
    if (isBionicSpan(element)) return false;
    const text = element.textContent || "";
    if (!text.trim() || !/[a-zA-Z]/.test(text)) return false;
    return true;
  }
  private sortElementsByReadingOrder(elements: Element[]): Element[] {
    if (elements.length <= 1) return elements;
    const positions = elements.map(getElementPosition);
    const columns: Element[][] = [];
    let currentColumn: typeof positions = [];
    positions.sort((a, b) => a.$x - b.$x);
    positions.forEach((pos) => {
      if (currentColumn.length === 0) {
        currentColumn.push(pos);
      } else {
        const lastX = currentColumn[0].$x;
        if (Math.abs(pos.$x - lastX) <= this.$config.COLUMN_THRESHOLD) {
          currentColumn.push(pos);
        } else {
          columns.push(
            currentColumn.sort((a, b) => a.$y - b.$y).map((p) => p.$element),
          );
          currentColumn = [pos];
        }
      }
    });
    if (currentColumn.length > 0) {
      columns.push(
        currentColumn.sort((a, b) => a.$y - b.$y).map((p) => p.$element),
      );
    }
    return columns.reduce((acc, column) => acc.concat(column), []);
  }
  public $start(): void {
    this.processNewContent(document.body);
    this.mutationObserver.observe(document.body, this.$config.MUTATION.OPTIONS);
  }
  public stop(): void {
    this.intersectionObserver.disconnect();
    this.mutationObserver.disconnect();
    this.taskQueue = [];
    this.taskBuffer = [];
    this.isProcessing = false;
    this.cleanupRemovedElement(document.body);
  }
}
