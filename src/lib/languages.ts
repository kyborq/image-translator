export interface ILanguage {
  [key: string]: string;
}

export const languages: ILanguage = {
  en: "English",
  ar: "Arabic",
  hu: "Hungarian",
  vi: "Vietnamese",
  el: "Greek",
  da: "Danish",
  iw: "Hebrew",
  id: "Indonesian",
  es: "Spanish",
  it: "Italian",
  ca: "Catalan",
  zh: "Chinese",
  ko: "Korean",
  ms: "Malay",
  de: "German",
  nl: "Dutch",
  no: "Norwegian",
  pl: "Polish",
  pt: "Portuguese ",
  ro: "Romanian",
  ru: "Russian",
  sk: "Slovak",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  fi: "Finnish",
  fr: "French",
  hi: "Hindi",
  hr: "Croatian",
  cs: "Czech",
  sv: "Swedish",
  ja: "Japanese",
};

export const languagesKeys = Object.keys(languages);
