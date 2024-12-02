import { Readify } from "./Readify";

let instance: null | Readify = null;

export const start = () => {
  instance = Readify.init({
    boldCommonWords: true,
    boldSingleSyllables: true,
  });
};

export const stop = () => {
  instance?.stop();
};
