import { Readify } from "./Readify";


let instance: Readify | null = null;

export const start = () => {
  instance = Readify.init({
    boldSingleSyllables: true,
  });
}

export const stop = () => {
  instance?.stop();
}