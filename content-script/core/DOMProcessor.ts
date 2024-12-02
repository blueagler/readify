import { PROCESSOR_CONFIG } from "../constants/config";
import { CustomizedConfig, ProcessorConfig } from "../types";
import {
  getElementPosition,
  isBionicSpan,
  isElementVisible,
  isInsideIgnoredTag,
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
  private taskBuffer: Element[] = [];
  private taskQueue: (() => void)[] = [];
  // Add a Set to track elements being processed
  private processingSet = new Set<Element>();

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

    // Filter out redundant elements before partitioning
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
      if (
        isInsideIgnoredTag(root, this.$config.ignoreTags) || 
        this.processingSet.has(root)
      ) {
        return;
      }

      const elements = new Set<Element>();
      const elementsToObserve = new Set<Element>(); // Add this to track invisible elements

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node): number => {
          if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP;
          
          if (
            this.$config.ignoreTags.has(node.tagName) || 
            this.processingSet.has(node)
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Only process leaf nodes or nodes with direct text children
          if (this.shouldProcess(node)) {
            const hasDirectTextNode = Array.from(node.childNodes).some(
              child => child.nodeType === Node.TEXT_NODE && child.textContent?.trim()
            );
            if (hasDirectTextNode) {
              // If visible, process; if not, observe
              if (isElementVisible(node)) {
                elements.add(node);
              } else {
                elementsToObserve.add(node);
              }
              return NodeFilter.FILTER_REJECT; // Skip children
            }
          }
          
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      while (walker.nextNode()) {} // Just traverse to apply filter

      // Setup observation for invisible elements
      elementsToObserve.forEach(element => {
        if (element instanceof HTMLElement && 
            !element.hasAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR)) {
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
      // Only process direct text nodes, don't recurse
      const textNodes = Array.from(element.childNodes).filter(
        node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
      );

      if (textNodes.length) {
        textNodes.forEach(node => {
          if (node.textContent) {
            const processedNode = createBionicNode(node.textContent, this.$config);
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
          // Recheck visibility before processing
          if (isElementVisible(element)) {
            this.processTextNodes(element);
          } else {
            // If not visible, observe it
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
            !isInsideIgnoredTag(entry.target, this.$config.ignoreTags) &&
            !this.isProcessed(entry.target) // Add this check
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
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach((node) => {
            node instanceof Element && this.cleanupRemovedElement(node);
          });
        }

        const target =
          mutation.type === "characterData"
            ? mutation.target.parentElement
            : mutation.target instanceof Element
              ? mutation.target
              : null;

        if (
          target instanceof Element &&
          !this.isProcessed(target) &&
          !isInsideIgnoredTag(target, this.$config.ignoreTags)
        ) {
          this.queueTask(() => this.processNewContent(target));
        } else if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (
              node instanceof Element &&
              !this.isProcessed(node) &&
              !isInsideIgnoredTag(node, this.$config.ignoreTags)
            ) {
              this.queueTask(() => this.processNewContent(node));
            }
          });
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

    // Quick check for element's own tag
    if (this.$config.ignoreTags.has(element.tagName)) return false;

    // Check for ignored parent tags
    if (isInsideIgnoredTag(element, this.$config.ignoreTags)) return false;

    if (isBionicSpan(element)) return false;

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

    this.mutationObserver.observe(document.body,this.$config.MUTATION.OPTIONS);
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
