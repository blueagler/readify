import { defineContentScript } from "wxt/sandbox";
//@ts-expect-error - This is a fake import
import { start } from "../dist/_index.js";

export default defineContentScript({
  allFrames: true,
  main(ctx) {
    ctx.addEventListener(document, "DOMContentLoaded", start);
    ctx.onInvalidated(stop);
  },
  matches: ["<all_urls>"],
  registration: "manifest",
  runAt: "document_start",
  world: "ISOLATED",
});
