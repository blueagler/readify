import { DOMProcessor } from "./domProcessor";

function init(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      const processor = new DOMProcessor();
      processor.start();
    });
  } else {
    const processor = new DOMProcessor();
    processor.start();
  }
}

init();
