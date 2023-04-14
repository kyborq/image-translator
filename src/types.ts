export type TExportFormat = "JPG" | "PNG" | "SVG" | "PDF";

export type TExportableFrame = {
  frameId: string;
  format: string;
  name: string;
  path: string;
  bytes: Uint8Array;
};

export enum UIActionTypes {
  INIT_EXPORT = "INIT_EXPORT",
  INIT_TRANSLATE = "INIT_TRANSLATE",
  RESULT_TRANSLATE = "RESULT_TRANSLATE",
}

export interface UIAction {
  type: UIActionTypes;
  payload?: any;
}

export enum PluginActionTypes {
  START_EXPORT = "START_EXPORT",
  START_TRANSLATE = "START_TRANSLATE",
  PROGRESS_TRANSLATE = "PROGRESS_TRANSLATE",
  PROGRESS_EXPORT = "PROGRESS_EXPORT",
}

export interface PluginAction {
  type: PluginActionTypes;
  payload?: any;
}

export type TParentNode = {
  text: TextNode;
  parent: FrameNode;
};

export type TGroupedNode = {
  texts: TextNode[];
  parent: FrameNode;
};

export type TTranslatedNode = {
  frame: FrameNode;
  language: string;
};
