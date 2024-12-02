import { defineContentScript } from "wxt/sandbox";
//@ts-expect-error - This is a fake import
import { start } from "../dist/_index.js";

export default defineContentScript({
  allFrames: true,
  main() {
    document.addEventListener("DOMContentLoaded", start);
  },
  matches: ["<all_urls>"],
  registration: "manifest",
  runAt: "document_start",
  world: "ISOLATED",
});
