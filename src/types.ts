export enum UIActionTypes {
  EXPORT = "EXPORT",
  TRANSLATE = "TRANSLATE",
  CLOSE = "CLOSE",
  CHANGE_FORMAT = "CHANGE_FORMAT",
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
