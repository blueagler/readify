import { PROCESSOR_CONFIG } from "../constants/config";
import { ProcessorConfig } from "../types/config";
import { CustomizedConfig } from "../types/index";
import {
  getElementPosition,
  isBionicSpan,
  isElementVisible,
} from "../utils/dom/elementUtils";
import { createBionicNode } from "./TextTransformer";

export class DOMProcessor {
  private readonly $config: ProcessorConfig = PROCESSOR_CONFIG;
  private intersectionObserver!: IntersectionObserver;
  private isProcessing = false;
  private mutationObserver!: MutationObserver;
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

  private cleanupRemovedElement(root: Element): void {
    if (root instanceof HTMLElement) {
      root.removeAttribute(this.$config.DOM_ATTRS.PROCESSED_ATTR);
      root.removeAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR);
    }
    const elements = root.querySelectorAll(
      `[${this.$config.DOM_ATTRS.PROCESSED_ATTR}], [${this.$config.DOM_ATTRS.OBSERVED_ATTR}]`,
    );
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.removeAttribute(this.$config.DOM_ATTRS.PROCESSED_ATTR);
        el.removeAttribute(this.$config.DOM_ATTRS.OBSERVED_ATTR);
      }
    });
  }

  private flushTaskBuffer(): void {
    if (this.taskBuffer.length === 0) return;
    const [visibleElements, hiddenElements] = this.partitionElements(
      this.taskBuffer,
    );
    this.taskBuffer = [];

    const sortedVisible = this.sortElementsByReadingOrder(visibleElements);
    if (sortedVisible.length > 0) {
      this.queueTask(() =>
        sortedVisible.forEach((element) => this.processTextNodes(element)),
      );
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
    return Array.from(element.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
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
    const elements = [...root.querySelectorAll("*")].filter(
      (el) => this.getTextNodes(el).length > 0 && this.shouldProcess(el),
    );

    this.taskBuffer.push(...elements);
    this.flushTaskBuffer();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (task) {
        task();
      }
    }

    this.isProcessing = false;
  }

  private processTextNodes(element: Element): void {
    if (!this.shouldProcess(element)) return;

    Array.from(element.children)
      .filter(
        (child) =>
          !this.isProcessed(child) &&
          !isBionicSpan(child) &&
          !child.querySelector("strong"),
      )
      .forEach((child) => this.processTextNodes(child));

    const textNodes = this.getTextNodes(element);
    if (!textNodes.length) return;

    const fragment = document.createDocumentFragment();
    textNodes.forEach((node) => {
      if (node.textContent) {
        fragment.appendChild(createBionicNode(node.textContent, this.$config));
      }
    });

    textNodes.forEach((node) => node.parentNode?.removeChild(node));
    element.appendChild(fragment);

    if (element instanceof HTMLElement) {
      element.setAttribute(this.$config.DOM_ATTRS.PROCESSED_ATTR, "");
    }
  }

  private queueTask(task: () => void): void {
    this.taskQueue.push(task);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private setupObservers(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof Element) {
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

        if (target instanceof Element && !this.isProcessed(target)) {
          this.queueTask(() => this.processNewContent(target));
        } else if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            node instanceof Element &&
              !this.isProcessed(node) &&
              this.queueTask(() => this.processNewContent(node));
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

    if (this.$config.ignoreTags.has(element.tagName)) return false;
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

    this.mutationObserver.observe(document.body, {
      ...this.$config.MUTATION.OPTIONS,
      attributeFilter: [...this.$config.MUTATION.ATTRIBUTES_FILTER],
    });
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
