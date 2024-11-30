import { createBionicNode } from "./textTransformer";

export class DOMProcessor {
  private static readonly IGNORE_TAGS = new Set([
    "SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT", 
    "NOSCRIPT", "CANVAS", "SVG"
  ]);
  
  private static readonly BATCH_SIZE = 10;
  private static readonly INTERSECTION_THRESHOLD = 0.1;
  private static readonly INTERSECTION_MARGIN = '50px';
  private static readonly MUTATION_ATTRIBUTES = ['class', 'style', 'contenteditable'];
  private static readonly DOM_MATCHERS = {
    INTERACTIVE: 'a[href], button, input, select, textarea',
    TEXT_ONLY: 'a:not([href])'
  };
  private static readonly VIEWPORT_MARGIN = 100; // px to check above/below viewport
  private static readonly COLUMN_THRESHOLD = 50; // px distance to consider elements in same column

  private processedElements = new WeakSet<Element>();
  private observedElements = new WeakSet<Element>();
  private taskQueue: (() => void)[] = [];
  private taskBuffer: Element[] = [];
  private isProcessingQueue = false;
  private intersectionObserver: IntersectionObserver;
  private mutationObserver: MutationObserver;
  private documentWrite?: typeof document.write;
  private documentWriteln?: typeof document.writeln;
  private boundHandleWrite: (this: Document, ...args: string[]) => void;
  private boundHandleScroll: () => void;

  constructor() {
    this.intersectionObserver = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting && entry.target instanceof Element) {
          this.queueTask(() => this.processElement(entry.target));
          this.intersectionObserver.unobserve(entry.target);
        }
      }),
      { 
        threshold: DOMProcessor.INTERSECTION_THRESHOLD, 
        rootMargin: DOMProcessor.INTERSECTION_MARGIN 
      }
    );

    this.mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof Element && !this.isProcessedOrBionic(node)) {
              this.queueTask(() => this.processNewElement(node));
            }
          });
        } else if (mutation.type === 'characterData' || mutation.type === 'attributes') {
          const target = mutation.type === 'characterData' ? mutation.target.parentElement : mutation.target;
          if (target instanceof Element && !this.isProcessedOrBionic(target)) {
            this.queueTask(() => this.processNewElement(target));
          }
        }
      });
    });

    // Bind methods once
    this.boundHandleWrite = this.handleWrite.bind(this);
    this.boundHandleScroll = this.handleScroll.bind(this);

    // Add scroll handler
    window.addEventListener('scroll', this.boundHandleScroll, { passive: true });
  }

  private handleWrite(...args: string[]): void {
    if (this.documentWrite) {
      this.documentWrite.apply(document, args);
      this.processNewElement(document.body);
    }
  }

  private handleScroll(): void {
    if (this.taskBuffer.length > 0) {
      this.flushTaskBuffer();
    }
  }

  private queueTask(task: () => void) {
    this.taskQueue.push(task);
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  private queueElement(element: Element) {
    this.taskBuffer.push(element);
    if (this.taskBuffer.length >= DOMProcessor.BATCH_SIZE) {
      this.flushTaskBuffer();
    }
  }

  private sortElementsByReadingOrder(elements: Element[]): Element[] {
    if (!elements.length) return elements;

    // Group elements by columns first
    const elementPositions = elements.map(el => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      return {
        element: el,
        x: rect.left,
        y: rect.top,
        width: rect.width
      };
    });

    // Find columns by grouping elements with similar x coordinates
    const columns: Element[][] = [];
    let currentColumn: typeof elementPositions = [];
    
    // Sort by x first to find columns
    elementPositions.sort((a, b) => a.x - b.x);
    
    elementPositions.forEach(pos => {
      if (currentColumn.length === 0) {
        currentColumn.push(pos);
      } else {
        const lastX = currentColumn[0].x;
        if (Math.abs(pos.x - lastX) <= DOMProcessor.COLUMN_THRESHOLD) {
          currentColumn.push(pos);
        } else {
          // Sort current column by y position
          columns.push(currentColumn.sort((a, b) => a.y - b.y).map(p => p.element));
          currentColumn = [pos];
        }
      }
    });
    
    // Don't forget the last column
    if (currentColumn.length > 0) {
      columns.push(currentColumn.sort((a, b) => a.y - b.y).map(p => p.element));
    }

    // Merge columns preserving reading order
    return columns.reduce((acc, column) => acc.concat(column), []);
  }

  private flushTaskBuffer() {
    if (this.taskBuffer.length === 0) return;
    
    // Split buffer into visible and hidden elements
    const [visibleElements, hiddenElements] = this.taskBuffer.reduce<[Element[], Element[]]>(
      ([visible, hidden], element) => {
        if (this.isElementVisible(element)) {
          visible.push(element);
        } else {
          hidden.push(element);
        }
        return [visible, hidden];
      },
      [[], []]
    );

    this.taskBuffer = [];

    // Sort visible elements by reading order
    const sortedVisible = this.sortElementsByReadingOrder(visibleElements);

    // Process visible elements first
    if (sortedVisible.length > 0) {
      this.queueTask(() => this.processBatch(sortedVisible));
    }

    // Then queue hidden elements
    if (hiddenElements.length > 0) {
      this.queueTask(() => this.processBatch(hiddenElements));
    }
  }

  private async processQueue() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.taskQueue.length > 0 || this.taskBuffer.length > 0) {
      if (this.taskBuffer.length > 0) {
        this.flushTaskBuffer();
      }
      const task = this.taskQueue.shift();
      if (task) {
        await task();
        // Reduced delay between tasks
        if (this.taskQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private shouldProcess(element: Element): boolean {
    let current: Element | null = element;
    while (current) {
      if (DOMProcessor.IGNORE_TAGS.has(current.tagName)) return false;
      current = current.parentElement;
    }

    return document.contains(element) && 
           !this.isProcessedOrBionic(element) &&
           !(element instanceof HTMLElement && 
             element.matches(DOMProcessor.DOM_MATCHERS.INTERACTIVE) &&
             !element.matches(DOMProcessor.DOM_MATCHERS.TEXT_ONLY)) &&
           !(element instanceof HTMLElement && element.offsetParent === null);
  }

  private processElement(element: Element): void {
    if (!this.shouldProcess(element)) return;

    Array.from(element.children)
      .filter(child => !this.isProcessedOrBionic(child))
      .forEach(child => this.processElement(child));

    const nodesToProcess = Array.from(element.childNodes)
      .filter(node => 
        node instanceof Element ? 
          !this.isBasicBionicSpan(node) : 
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
      );

    if (nodesToProcess.length > 0) {
      const fragment = document.createDocumentFragment();
      const processedNodes = new Set();

      Array.from(element.childNodes).forEach(node => {
        if (nodesToProcess.includes(node)) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            fragment.appendChild(createBionicNode(node.textContent));
          } else if (node instanceof Element && !this.isBasicBionicSpan(node)) {
            const clone = node.cloneNode(true);
            if (clone instanceof Element) {
              this.processElement(clone);
            }
            fragment.appendChild(clone);
          } else {
            fragment.appendChild(node.cloneNode(true));
          }
        } else {
          fragment.appendChild(node.cloneNode(true));
        }
        processedNodes.add(node);
      });

      element.textContent = '';
      element.appendChild(fragment);
      this.processedElements.add(element);
    }
  }

  private processBatch(elements: Element[]) {
    const fragment = document.createDocumentFragment();
    elements.forEach(element => {
      if (!this.shouldProcess(element)) return;
      this.processElementInternal(element);
    });
  }

  private processElementInternal(element: Element): void {
    // Process children first (depth-first)
    const childElements = Array.from(element.children)
      .filter(child => !this.isProcessedOrBionic(child));
    
    if (childElements.length > 0) {
      this.queueTask(() => {
        this.processBatch(childElements);
      });
    }

    const nodesToProcess = Array.from(element.childNodes)
      .filter(node => 
        node instanceof Element ? 
          !this.isBasicBionicSpan(node) : 
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
      );

    if (nodesToProcess.length > 0) {
      const fragment = document.createDocumentFragment();
      Array.from(element.childNodes).forEach(node => {
        if (nodesToProcess.includes(node)) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            fragment.appendChild(createBionicNode(node.textContent));
          } else if (node instanceof Element && !this.isBasicBionicSpan(node)) {
            fragment.appendChild(node);
          } else {
            fragment.appendChild(node);
          }
        } else {
          fragment.appendChild(node);
        }
      });

      element.textContent = '';
      element.appendChild(fragment);
      this.processedElements.add(element);
    }
  }

  private processNewElement(root: Element): void {
    const elements = [...root.querySelectorAll('*')]
      .filter(el => {
        const hasDirectText = Array.from(el.childNodes)
          .some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
        return hasDirectText && this.shouldProcess(el);
      });

    // Split elements into visible and hidden
    const [visibleElements, hiddenElements] = elements.reduce<[Element[], Element[]]>(
      ([visible, hidden], element) => {
        if (this.isElementVisible(element)) {
          visible.push(element);
        } else {
          hidden.push(element);
        }
        return [visible, hidden];
      },
      [[], []]
    );

    // Sort visible elements by reading order
    const sortedVisible = this.sortElementsByReadingOrder(visibleElements);

    // Process visible elements immediately
    if (sortedVisible.length > 0) {
      this.queueTask(() => {
        this.processBatch(sortedVisible);
      });
    }

    // Queue hidden elements for later processing
    hiddenElements.forEach(element => {
      if (!this.observedElements.has(element)) {
        this.observedElements.add(element);
        this.queueElement(element);
      }
    });
    
    if (this.taskBuffer.length > 0) {
      this.flushTaskBuffer();
    }
  }

  private isProcessedOrBionic(node: Node): boolean {
    if (!(node instanceof Element)) return false;
    if (this.processedElements.has(node)) return true;
    if (this.isBasicBionicSpan(node)) return true;
    
    let parent = node.parentElement;
    while (parent) {
      if (this.processedElements.has(parent) || this.isBasicBionicSpan(parent)) {
        return true;
      }
      parent = parent.parentElement;
    }
    
    return Array.from(node.getElementsByTagName('span'))
      .some(span => this.isBasicBionicSpan(span));
  }

  private isBasicBionicSpan(element: Element): boolean {
    return element instanceof HTMLSpanElement &&
           element.childNodes.length === 2 &&
           element.firstChild instanceof HTMLElement &&
           element.firstChild.tagName === 'STRONG' &&
           element.lastChild?.nodeType === Node.TEXT_NODE;
  }

  private isElementVisible(element: Element): boolean {
    if (!(element instanceof HTMLElement)) return false;
    const rect = element.getBoundingClientRect();
    return rect.top <= window.innerHeight + DOMProcessor.VIEWPORT_MARGIN && 
           rect.bottom >= -DOMProcessor.VIEWPORT_MARGIN;
  }

  public start(): void {
    // Save original methods
    this.documentWrite = document.write;
    this.documentWriteln = document.writeln;

    // Use defineProperty to handle write methods
    Object.defineProperties(document, {
      write: {
        value: this.boundHandleWrite
      },
      writeln: {
        value: this.boundHandleWrite
      }
    });

    this.processNewElement(document.body);
    
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: DOMProcessor.MUTATION_ATTRIBUTES
    });
  }

  public stop(): void {
    this.intersectionObserver.disconnect();
    this.mutationObserver.disconnect();

    // Restore original methods
    if (this.documentWrite && this.documentWriteln) {
      Object.defineProperties(document, {
        write: {
          value: this.documentWrite
        },
        writeln: {
          value: this.documentWriteln
        }
      });
    }

    window.removeEventListener('scroll', this.boundHandleScroll);

    this.taskQueue = [];
    this.taskBuffer = [];
    this.isProcessingQueue = false;

    this.documentWrite = undefined;
    this.documentWriteln = undefined;
  }
}
