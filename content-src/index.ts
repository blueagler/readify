import { Readify } from "./Readify";

let instance: Readify | null = null;

export const start = async () => {
  instance = Readify.init({
    boldCommonWords: true,
    boldSingleSyllables: true,
  });
};
