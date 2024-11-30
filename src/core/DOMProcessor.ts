import { APP_CONFIG, DOM_CONFIG, PROCESSOR_CONFIG } from "../constants/config";
import { DOMProcessorConfig } from "../types/index";
import {
  getElementPosition,
  isBionicSpan,
  isElementVisible,
} from "../utils/dom/elementUtils";
import { createBionicNode } from "./TextTransformer";

export class DOMProcessor {
  private boundHandleWrite: (this: Document, ...args: string[]) => void;
  private readonly $config: DOMProcessorConfig;
  private documentWrite?: typeof document.write;
  private documentWriteln?: typeof document.writeln;
  private intersectionObserver!: IntersectionObserver;
  private isProcessing = false;
  private mutationObserver!: MutationObserver;
  private observedElements = new WeakSet<Element>();
  private processedElements = new WeakSet<Element>();
  private taskBuffer: Element[] = [];
  private taskQueue: (() => void)[] = [];

  constructor(config: DOMProcessorConfig = PROCESSOR_CONFIG) {
    this.$config = config;
    this.boundHandleWrite = this.handleWrite.bind(this);
    this.setupObservers();
  }

  private flushTaskBuffer(): void {
    if (this.taskBuffer.length === 0) return;

    const [visibleElements, hiddenElements] = this.partitionElements(
      this.taskBuffer,
    );
    this.taskBuffer = [];

    const sortedVisible = this.sortElementsByReadingOrder(visibleElements);

    if (sortedVisible.length > 0) {
      this.queueTask(() => this.processBatch(sortedVisible));
    }

    hiddenElements.forEach((element) => {
      if (!this.observedElements.has(element)) {
        this.observedElements.add(element);
        this.intersectionObserver.observe(element);
      }
    });
  }

  private handleWrite(...args: string[]): void {
    if (this.documentWrite) {
      this.documentWrite.apply(document, args);
      this.processNewElement(document.body);
    }
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

  private processBatch(elements: Element[]): void {
    elements.forEach((element) => {
      if (!this.shouldProcess(element)) return;

      const nodesToProcess = Array.from(element.childNodes).filter((node) =>
        node instanceof Element
          ? !isBionicSpan(node) && !node.querySelector("strong")
          : node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      );

      if (nodesToProcess.length > 0) {
        const fragment = document.createDocumentFragment();
        nodesToProcess.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            fragment.appendChild(createBionicNode(node.textContent));
          } else if (
            node instanceof Element &&
            !isBionicSpan(node) &&
            !node.querySelector("strong")
          ) {
            const clone = node.cloneNode(true);
            if (clone instanceof Element) {
              this.processElement(clone);
            }
            fragment.appendChild(clone);
          }
        });

        nodesToProcess.forEach((node) => node.remove());
        element.appendChild(fragment);
        this.processedElements.add(element);
      }
    });
  }

  private processElement(element: Element): void {
    if (!this.shouldProcess(element)) return;

    Array.from(element.children)
      .filter(
        (child) =>
          !this.isProcessed(child) &&
          !isBionicSpan(child) &&
          !child.querySelector("strong"),
      )
      .forEach((child) => this.processElement(child));

    const textNodes = Array.from(element.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
    );

    if (textNodes.length) {
      const fragment = document.createDocumentFragment();
      textNodes.forEach((node) => {
        if (node.textContent) {
          fragment.appendChild(createBionicNode(node.textContent));
        }
      });

      textNodes.forEach((node) => node.remove());
      element.appendChild(fragment);
      this.processedElements.add(element);
    }
  }

  private processNewElement(root: Element): void {
    const elements = [...root.querySelectorAll("*")].filter((el) => {
      const hasDirectText = Array.from(el.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      );
      return hasDirectText && this.shouldProcess(el);
    });

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
            this.queueTask(() => this.processElement(entry.target));
            this.intersectionObserver.unobserve(entry.target);
          }
        }),
      {
        rootMargin: this.$config.INTERSECTION_MARGIN,
        threshold: this.$config.INTERSECTION_THRESHOLD,
      },
    );

    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element && !this.isProcessed(node)) {
              this.queueTask(() => this.processNewElement(node));
            }
          });
        } else if (
          mutation.type === "characterData" ||
          mutation.type === "attributes"
        ) {
          const target =
            mutation.type === "characterData"
              ? mutation.target.parentElement
              : mutation.target;

          if (target instanceof Element && !this.isProcessed(target)) {
            this.queueTask(() => this.processNewElement(target));
          }
        }
      });
    });
  }

  private shouldProcess(element: Element): boolean {
    return (
      !this.$config.IGNORE_TAGS.has(element.tagName) &&
      !this.isProcessed(element)
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
    this.documentWrite = document.write;
    this.documentWriteln = document.writeln;

    Object.defineProperties(document, {
      write: {
        configurable: true,
        value: this.boundHandleWrite,
      },
      writeln: {
        configurable: true,
        value: this.boundHandleWrite,
      },
    });

    this.processNewElement(document.body);

    this.mutationObserver.observe(document.body, {
      ...DOM_CONFIG.MUTATION_OPTIONS,
      attributeFilter: [...APP_CONFIG.MUTATION_ATTRIBUTES],
    });
  }

  public stop(): void {
    this.intersectionObserver.disconnect();
    this.mutationObserver.disconnect();

    if (this.documentWrite && this.documentWriteln) {
      Object.defineProperties(document, {
        write: { value: this.documentWrite },
        writeln: { value: this.documentWriteln },
      });
    }

    this.taskQueue = [];
    this.taskBuffer = [];
    this.isProcessing = false;
  }
}
