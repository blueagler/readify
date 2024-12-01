import { init } from "../dist/index";
import { defineContentScript } from "wxt/sandbox";

export default defineContentScript({
  main() {
    init();
  },
  matches: ['<all_urls>'],
  runAt: "document_idle",
  world: "MAIN",
});
