import { PROCESSOR_CONFIG } from "../constants/config";
import { CustomizedConfig, ElementCheckType, ProcessorConfig } from "../types";
import {
  getElementPosition,
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
  private observedElements = new WeakSet<Element>();
  private processedElements = new WeakSet<Element>();
  private processingSet = new WeakSet<Element>();
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
      config.ATTRIBUTE_VALUES?.some(
        ([attr, value]) => element.getAttribute(attr) === value,
      )
    )
      return true;
    if (
      config.CLASS_NAMES?.some(
        (className) =>
          typeof element.className === "string" &&
          element.className.includes(className),
      )
    )
      return true;
    if (
      config.STYLES?.some(
        ([prop, value]) =>
          window.getComputedStyle(element)[prop as any] === value,
      )
    )
      return true;
    if (
      config.ROLES &&
      element.hasAttribute("role") &&
      config.ROLES.includes(element.getAttribute("role")?.toLowerCase() || "")
    ) {
      return true;
    }
    return (
      config.CLOSEST?.some((selector) => element.closest(selector) !== null) ??
      false
    );
  }
  private cleanupRemovedElement(root: Element): void {
    this.observedElements.delete(root);
    this.processedElements.delete(root);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node): number => {
        if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP;
        if (this.isProcessed(node) || this.observedElements.has(node)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    });

    let node;
    while ((node = walker.nextNode() as Element)) {
      this.processedElements.delete(node);
      this.observedElements.delete(node);
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
        !this.observedElements.has(element)
      ) {
        this.observedElements.add(element);
        this.intersectionObserver.observe(element);
      }
    });
  }
  private isBionicSpan(element: Element): boolean {
    if (!(element instanceof HTMLElement)) return false;

    if (this.isContentProcessed(element)) return true;

    if (element instanceof HTMLSpanElement) {
      if (
        element.firstElementChild instanceof HTMLElement &&
        element.firstElementChild.tagName === "STRONG"
      ) {
        return true;
      }
    }

    return false;
  }
  private isChildOfPendingElements(
    element: Element,
    elements: Element[],
  ): boolean {
    return elements.some(
      (pending) => pending.contains(element) && pending !== element,
    );
  }
  private isContentProcessed(node: Node): boolean {
    if (node instanceof Element) {
      if (this.isProcessed(node)) return true;
    }

    let parent = node.parentElement;
    while (parent) {
      if (this.isProcessed(parent)) return true;
      parent = parent.parentElement;
    }

    return false;
  }
  private isEditableOrInteractive(element: Element): boolean {
    return this.checkElementType(element, ElementCheckType.Editable);
  }
  private isHidden(element: Element): boolean {
    return this.checkElementType(element, ElementCheckType.Hidden);
  }
  private isHighPerformanceElement(element: Element): boolean {
    return this.checkElementType(element, ElementCheckType.HighPerformance);
  }
  private isIgnored(element: Element): boolean {
    return this.checkElementType(element, ElementCheckType.Ignored);
  }
  private isProcessed(element: Element): boolean {
    return this.processedElements.has(element);
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
    if (!root || this.isIgnored(root) || this.isProcessed(root)) return;

    queueMicrotask(() => {
      const elements = new Set<Element>();
      const elementsToObserve = new Set<Element>();
      const processedParents = new WeakSet<Element>();

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node): number => {
            if (!node || this.isContentProcessed(node)) {
              return NodeFilter.FILTER_REJECT;
            }

            if (node.nodeType === Node.TEXT_NODE) {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;

              if (
                this.isIgnored(parent) ||
                this.isEditableOrInteractive(parent) ||
                this.isHighPerformanceElement(parent) ||
                this.isBionicSpan(parent)
              ) {
                return NodeFilter.FILTER_REJECT;
              }

              const text = node.textContent?.trim();
              if (!text || /^[\s…]+$/.test(text)) {
                return NodeFilter.FILTER_REJECT;
              }
              processedParents.add(parent);
              if (isElementVisible(parent)) {
                elements.add(parent);
              } else {
                elementsToObserve.add(parent);
              }
              return NodeFilter.FILTER_SKIP;
            }

            if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP;

            if (
              this.isIgnored(node) ||
              this.isEditableOrInteractive(node) ||
              this.isHighPerformanceElement(node) ||
              this.isBionicSpan(node)
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            return NodeFilter.FILTER_ACCEPT;
          },
        },
      );

      while (walker.nextNode()) {}

      if (elements.size > 0) {
        const uniqueElements = Array.from(elements).filter((element) => {
          let parent = element.parentElement;
          while (parent) {
            if (elements.has(parent)) return false;
            parent = parent.parentElement;
          }
          return true;
        });

        this.taskBuffer.push(...uniqueElements);
        this.flushTaskBuffer();
      }

      elementsToObserve.forEach((element) => {
        if (
          element instanceof HTMLElement &&
          !this.observedElements.has(element)
        ) {
          this.observedElements.add(element);
          this.intersectionObserver.observe(element);
        }
      });
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
    if (!this.shouldProcess(element) || this.isProcessed(element)) return;

    this.processingSet.add(element);
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

    let node;
    while ((node = walker.nextNode() as Text)) {
      if (
        node.parentElement &&
        node.textContent?.trim() &&
        !/^[\s…]+$/.test(node.textContent) &&
        !this.isIgnored(node.parentElement) &&
        !this.isHidden(node.parentElement) &&
        !this.isEditableOrInteractive(node.parentElement) &&
        !this.isHighPerformanceElement(node.parentElement) &&
        !this.isContentProcessed(node)
      ) {
        nodes.push(node);
      }
    }

    nodes.forEach((node) => {
      const processedNode = createBionicNode(node.textContent!, this.$config);
      node.parentNode!.replaceChild(processedNode, node);
    });

    this.processedElements.add(element);
    this.processingSet.delete(element);
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
            this.observedElements.add(element);
            this.intersectionObserver.observe(element);
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
            this.observedElements.delete(entry.target);
          }
        }),
      {
        rootMargin: this.$config.INTERSECTION_MARGIN,
        threshold: this.$config.INTERSECTION_THRESHOLD,
      },
    );
    this.mutationObserver = new MutationObserver((mutations) => {
      const debounceSet = new WeakSet<Element>();
      mutations.forEach((mutation) => {
        const target = mutation.target;
        if (!target) return;
        if (target instanceof Element && this.isProcessed(target)) return;
        if (target instanceof Element && this.isIgnored(target)) return;
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
    if (
      !(element instanceof HTMLElement) ||
      this.isIgnored(element) ||
      this.isHidden(element) ||
      this.isEditableOrInteractive(element) ||
      this.isHighPerformanceElement(element) ||
      this.isContentProcessed(element)
    ) {
      return false;
    }

    const text = element.textContent || "";
    return (
      text.trim().length > 0 &&
      /[a-zA-Z]/.test(text) &&
      Array.from(element.childNodes).some(
        (node) =>
          node.nodeType === Node.TEXT_NODE &&
          node.textContent?.trim() &&
          !/^[\s…]+$/.test(node.textContent) &&
          !this.isContentProcessed(node),
      )
    );
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
  public $stop(): void {
    this.intersectionObserver.disconnect();
    this.mutationObserver.disconnect();
    this.taskQueue = [];
    this.taskBuffer = [];
    this.isProcessing = false;
    this.cleanupRemovedElement(document.body);
  }
}
