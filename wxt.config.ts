import { defineConfig } from "wxt";

export default defineConfig({
  outDir: "extension-build",
  srcDir: "wxt-src",
  manifest: {
    name: "Readify - Bionic Reading Assistant",
    description:
      "Readify works by implementing a bionic reading mode on web text, making it more engaging and easier to understand.",
  },
  modules: ["@wxt-dev/auto-icons"],
});
