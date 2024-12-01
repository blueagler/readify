export interface ReadifyConfig {
  boldFactor: number;
  commonWords: Set<string>;
}

export interface CustomizedConfig {
  readonly boldCommonWords: boolean;
  readonly boldFactor: number;
  readonly boldSingleSyllables: boolean;
  readonly commonWords: Set<string>;
  readonly syllableExceptions: Map<string, number>;
}
