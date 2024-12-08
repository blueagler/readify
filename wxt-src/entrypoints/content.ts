import { defineContentScript } from "wxt/sandbox";
//@ts-expect-error - This is a fake import
import { start } from "../../content-build/content.js";

export default defineContentScript({
  allFrames: true,
  main() {
    document.addEventListener("DOMContentLoaded", start);
  },
  matches: ["<all_urls>"],
  runAt: "document_start",
  world: "MAIN",
});
