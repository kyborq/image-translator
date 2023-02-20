export enum UIActionTypes {
  EXPORT = "EXPORT",
  TRANSLATE = "TRANSLATE",
  CLOSE = "CLOSE",
}

export interface UIAction {
  type: UIActionTypes;
  payload?: any;
}

export enum PluginActionTypes {
  EXPORT = "EXPORT",
  TRANSLATE = "TRANSLATE",
}

export interface PluginAction {
  type: PluginActionTypes;
  payload?: any;
}
