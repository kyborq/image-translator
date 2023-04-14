export interface ILanguage {
  [key: string]: string;
}

export interface IFormatLanguage {
  [key: string]: ILanguage;
}

// Для перевода на IOS устройств
export const BASE_LANGUAGES: ILanguage = {
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
  pt: "Portuguese",
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

// Для перевода для Android устройств
export const MORE_LANGUAGES: ILanguage = {
  is: "Icelandic",
  lv: "Latvian",
  lt: "Lithuanian",
  sl: "Slovenian",
  et: "Estonian",
};

export const LANGUAGES: ILanguage = {
  ...BASE_LANGUAGES,
  ...MORE_LANGUAGES,
};

// JPG - iOS
// PNG - Android
export const FORMAT_LANGUAGES: IFormatLanguage = {
  JPG: BASE_LANGUAGES,
  PNG: LANGUAGES,
};

export const DEVICE: ILanguage = {
  JPG: "ios",
  PNG: "android",
};
