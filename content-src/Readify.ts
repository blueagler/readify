import type { CustomizedConfig } from "./types";

import { DOMProcessor } from "./core/DOMProcessor";
import { initReadifyStyles } from "./styles";
import { patchDOMMethods, restoreDOMMethods } from "./utils/dom/safeDOM";

export class Readify {
  private static instance: null | Readify = null;
  private processor: DOMProcessor;

  constructor(config?: Partial<CustomizedConfig>) {
    patchDOMMethods();
    initReadifyStyles();
    this.processor = new DOMProcessor(config);
  }

  public static getInstance(config?: Partial<CustomizedConfig>): Readify {
    if (!Readify.instance) {
      Readify.instance = new Readify(config);
    }
    return Readify.instance;
  }

  public static init(config?: Partial<CustomizedConfig>): Readify {
    const instance = Readify.getInstance(config);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => instance.$start());
    } else {
      instance.$start();
    }
    return instance;
  }

  public $start(): void {
    this.processor.$start();
  }

  public $stop(): void {
    this.processor.$stop();
    restoreDOMMethods();
  }
}
