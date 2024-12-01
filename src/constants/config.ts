import type {
  BionicConfig,
  BionicRatios,
  DOMAttributes,
  MutationConfig,
  ProcessorConfig,
  SyllablePatterns,
} from "../types/config";

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
export const pixelRatio = window.devicePixelRatio || 1;
export const screenWidth = window.innerWidth;
export const screenHeight = window.innerHeight;

const DOM_ATTRS: DOMAttributes = {
  OBSERVED_ATTR: "data-readify-observed",
  PROCESSED_ATTR: "data-readify-processed",
} as const;

const MUTATION: MutationConfig = {
  ATTRIBUTES_FILTER: new Set([
    "class",
    "style",
    "contenteditable",
    "role",
    DOM_ATTRS.PROCESSED_ATTR,
    DOM_ATTRS.OBSERVED_ATTR,
  ]),
  OPTIONS: {
    attributeOldValue: false,
    attributes: true,
    characterData: true,
    characterDataOldValue: false,
    childList: true,
    subtree: true,
  },
} as const;

const BIONIC_RATIOS: BionicRatios = {
  COMMON_WORDS: 0.35,
  MULTI_SYLLABLE: {
    FOUR_PLUS: 0.65,
    THREE: 0.55,
    TWO: 0.45,
  },
  SINGLE_SYLLABLE: {
    LONG: 0.45,
    MEDIUM: 0.4,
    SHORT: 0.35,
  },
} as const;

const BIONIC_SYLLABLE_PATTERNS: SyllablePatterns = {
  ADD: /(?:ia|riet|dien|iu|io|ii|[aeiouy]ing|[^aeiouy]ying$|ui[aeiouy]|eo|[aeiou]{2}|[aeiou]y[aeiou]|[aeiou](?:le|les|ed|es|est|eth|ist|ism|ize|ous|ship|tion|tive|ture|ure|ward|wise|yer|ying)$)/g,
  SILENT_E: /[^l]e$/,
  SILENT_ED: /(?:[^td]|^)ed$/,
  SILENT_ES: /[^sz]es$/,
  SUBTRACT:
    /(?:cial|tia|cius|cious|giu|ion|iou|sia$|[^aeiouy]eo|[aeiouy]ing$|[^aeiouy]y[aeiouy]|eous$|gue$|que$|[aeiou]{2}|[aeiou](?:re|le|les|ed|es|est|eth|ist|ism|ize|ous|ship|tion|tive|ture|ure|ward|wise|yer|ying)$)/g,
  VOWELS: /[aeiouy]+/g,
} as const;

const BIONIC_SYLLABLE_EXCEPTIONS = new Map<string, number>([
  ["business", 2],
  ["camera", 3],
  ["chocolate", 3],
  ["comfortable", 3],
  ["different", 2],
  ["evening", 2],
  ["every", 2],
  ["family", 3],
  ["favorite", 3],
  ["general", 3],
  ["interest", 3],
  ["interesting", 3],
  ["jewelry", 3],
  ["literature", 3],
  ["memory", 3],
  ["naturally", 3],
  ["restaurant", 3],
  ["science", 2],
  ["several", 3],
  ["temperature", 4],
  ["vegetable", 4],
  ["wednesday", 2],
]);

const BIONIC_PREFIX_PATTERN =
  /^(?:un|de|re|pre|pro|in|en|em|dis|mis|sub|inter|super|trans|non|over|under|out|up|down|anti|auto|bi|co|contra|counter|extra|hyper|i[lr]|im|inter|mid|multi|post|semi|sub|super|tele|tri|ultra|uni)/;

const BIONIC_COMMON_WORDS = new Set<string>([
  "the",
  "be",
  "of",
  "and",
  "to",
  "a",
  "in",
  "have",
  "it",
  "you",
  "for",
  "not",
  "that",
  "on",
  "with",
  "do",
  "as",
  "he",
  "we",
  "this",
  "at",
  "they",
  "but",
  "from",
  "by",
  "will",
  "or",
  "his",
  "say",
  "go",
  "she",
  "so",
  "all",
  "about",
  "if",
  "one",
  "would",
  "can",
  "which",
  "there",
  "know",
  "more",
  "get",
  "who",
  "like",
  "when",
  "think",
  "make",
  "time",
  "see",
  "what",
  "up",
  "some",
  "other",
  "out",
  "good",
  "people",
  "year",
  "take",
  "no",
  "well",
  "because",
  "very",
  "just",
  "come",
  "could",
  "work",
  "use",
  "than",
  "now",
  "then",
  "also",
  "into",
  "only",
  "look",
  "want",
  "give",
  "first",
  "new",
  "way",
  "find",
  "over",
  "any",
  "after",
  "thing",
  "our",
  "still",
  "even",
  "back",
  "too",
  "mean",
  "may",
  "here",
  "many",
  "such",
  "last",
  "child",
  "tell",
  "really",
  "call",
  "before",
  "company",
  "through",
  "down",
  "show",
  "life",
  "man",
  "change",
  "place",
  "long",
  "between",
  "feel",
  "same",
  "lot",
  "great",
  "help",
  "where",
  "problem",
  "try",
  "leave",
  "number",
  "part",
  "start",
  "case",
  "turn",
  "each",
  "end",
  "world",
  "school",
  "might",
  "need",
  "home",
  "course",
  "house",
  "us",
  "move",
  "system",
  "provide",
  "small",
  "service",
  "around",
  "however",
  "again",
  "ask",
  "large",
  "group",
  "war",
  "off",
  "always",
  "write",
  "point",
  "mother",
  "father",
  "question",
  "late",
  "night",
  "live",
  "run",
  "car",
  "set",
  "water",
  "area",
  "money",
  "name",
  "book",
  "both",
  "own",
  "read",
  "less",
  "friend",
  "month",
  "city",
  "business",
  "value",
  "side",
  "social",
  "story",
  "young",
  "fact",
  "lot",
  "study",
  "eye",
  "job",
  "word",
  "though",
  "issue",
  "kind",
  "four",
  "head",
  "far",
  "black",
  "long",
  "both",
  "little",
  "house",
  "yes",
  "since",
  "provide",
  "service",
  "around",
  "friend",
  "important",
  "father",
  "sit",
  "away",
  "until",
  "power",
  "hour",
  "game",
  "often",
  "yet",
  "line",
  "political",
  "end",
  "among",
  "ever",
  "stand",
  "bad",
  "lose",
  "however",
  "member",
  "pay",
  "law",
  "meet",
  "car",
  "city",
  "almost",
  "include",
  "continue",
  "set",
  "later",
  "community",
  "much",
  "name",
  "five",
  "once",
  "white",
  "least",
  "president",
  "learn",
  "real",
  "change",
  "team",
  "minute",
  "best",
  "several",
  "idea",
  "kid",
  "body",
  "information",
  "nothing",
  "ago",
  "right",
  "lead",
  "social",
  "understand",
  "whether",
  "watch",
  "together",
  "follow",
  "parent",
  "stop",
  "face",
  "anything",
  "create",
  "public",
  "already",
  "speak",
  "others",
  "office",
  "three",
  "room",
  "national",
  "point",
  "hold",
  "keep",
  "next",
  "hear",
  "example",
  "question",
  "during",
  "work",
  "play",
  "government",
  "run",
  "small",
  "number",
  "off",
  "always",
  "move",
  "night",
  "live",
  "Mr",
  "bring",
  "without",
  "before",
  "large",
  "million",
  "must",
  "home",
  "under",
  "water",
  "room",
  "write",
  "mother",
  "area",
  "national",
  "money",
  "story",
  "young",
  "fact",
  "month",
  "different",
  "lot",
  "study",
  "book",
  "eye",
  "job",
  "word",
  "though",
  "business",
  "issue",
  "side",
  "kind",
  "four",
  "head",
  "far",
  "black",
  "long",
  "both",
  "little",
  "house",
  "yes",
  "since",
  "provide",
  "service",
  "around",
  "friend",
  "important",
  "father",
  "sit",
  "away",
  "until",
  "power",
  "hour",
  "game",
  "often",
  "yet",
  "line",
  "political",
  "end",
  "among",
  "ever",
  "stand",
  "bad",
  "lose",
  "however",
  "member",
  "pay",
  "law",
  "meet",
  "car",
  "city",
  "almost",
  "include",
  "continue",
  "set",
  "later",
  "community",
  "much",
  "name",
  "five",
  "once",
  "white",
  "least",
  "president",
  "learn",
  "real",
  "change",
  "team",
  "minute",
  "best",
  "several",
  "idea",
  "kid",
  "body",
  "information",
  "nothing",
  "ago",
  "right",
  "lead",
  "social",
  "understand",
  "whether",
  "watch",
  "together",
  "follow",
  "parent",
  "stop",
  "face",
  "anything",
  "create",
  "public",
  "already",
  "speak",
  "others",
  "office",
  "three",
  "room",
  "national",
  "point",
  "hold",
  "keep",
  "next",
  "hear",
  "example",
  "question",
  "during",
  "work",
  "play",
  "government",
  "run",
  "small",
  "number",
  "off",
  "always",
  "move",
  "night",
  "live",
  "Mr",
  "bring",
  "without",
  "before",
  "large",
  "million",
  "must",
  "home",
  "under",
  "water",
  "room",
  "write",
  "mother",
  "area",
  "national",
  "money",
  "story",
  "young",
  "fact",
  "month",
  "different",
  "lot",
]);
const BIONIC: BionicConfig = {
  boldCommonWords: false,
  boldFactor: 1,
  boldSingleSyllables: false,
  commonWords: BIONIC_COMMON_WORDS,
  MAX_BOLD_LENGTH: Math.min(5, Math.ceil(screenWidth / 200)),
  MIN_BOLD_LENGTH: 1,
  PREFIX_PATTERN: BIONIC_PREFIX_PATTERN,
  RATIOS: BIONIC_RATIOS,
  SYLLABLE_PATTERNS: BIONIC_SYLLABLE_PATTERNS,
  syllableExceptions: BIONIC_SYLLABLE_EXCEPTIONS,
} as const;

export const PROCESSOR_CONFIG: ProcessorConfig = {
  BIONIC,
  COLUMN_THRESHOLD: Math.max(50, Math.min(200, Math.floor(screenWidth * 0.1))),
  DOM_ATTRS,
  ignoreTags: new Set([
    "SCRIPT",
    "STYLE",
    "CODE",
    "PRE",
    "TEXTAREA",
    "INPUT",
    "NOSCRIPT",
    "CANVAS",
    "SVG",
    "IFRAME",
    "IMG",
    "VIDEO",
    "AUDIO",
    "OBJECT",
    "EMBED",
    "MAP",
    "FIGURE",
    "MATH",
  ]),
  INTERSECTION_MARGIN: `${Math.floor(screenHeight * 0.2)}px`,
  INTERSECTION_THRESHOLD: isMobile ? 0.1 : 0.05,
  MUTATION,
  VIEWPORT_MARGIN: Math.max(100, Math.min(400, Math.floor(screenHeight * 0.5))),
} as const;
