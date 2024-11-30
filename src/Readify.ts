import type { DOMProcessorConfig } from "./types/index";

import { PROCESSOR_CONFIG } from "./constants/config";
import { DOMProcessor } from "./core/DOMProcessor";

export class Readify {
  private static instance: null | Readify = null;
  private processor: DOMProcessor;

  constructor(config?: Partial<DOMProcessorConfig>) {
    this.processor = new DOMProcessor({
      ...PROCESSOR_CONFIG,
      ...config,
    });
  }

  public static getInstance(config?: Partial<DOMProcessorConfig>): Readify {
    if (!Readify.instance) {
      Readify.instance = new Readify(config);
    }
    return Readify.instance;
  }

  public static init(config?: Partial<DOMProcessorConfig>): Readify {
    const instance = Readify.getInstance(config);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", instance.$start);
    } else {
      instance.$start();
    }
    return instance;
  }

  public $start(): void {
    this.processor.$start();
  }

  public stop(): void {
    this.processor.stop();
  }
}
