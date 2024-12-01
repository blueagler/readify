import { start, stop } from "../dist/index";
import { defineContentScript } from "wxt/sandbox";

export default defineContentScript({
  main(ctx) {
    ctx.addEventListener(document, "DOMContentLoaded", start);
    ctx.onInvalidated(stop);
  },
  matches: ['<all_urls>'],
  runAt: "document_start",
  world: "ISOLATED",
  allFrames: true,
  registration: "manifest"
});
