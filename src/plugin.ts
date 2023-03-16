import { LANGUAGES, LANGUAGES_ANDROID } from "./lib/languages";
import {
  getTextNodes,
  getTopNodes,
  IFrameNode,
  IIterableFrame,
} from "./lib/translation";
import {
  UIActionTypes,
  UIAction,
  PluginAction,
  PluginActionTypes,
} from "./types";

figma.showUI(__html__, { width: 300, height: 158 });

const translated: IIterableFrame = {};

let languages = LANGUAGES_ANDROID;
let languagesKeys = Object.keys(languages);

export function postMessage({ type, payload }: PluginAction): void {
  figma.ui.postMessage({ type, payload });
}

function processResult(
  frame: IFrameNode,
  original: string,
  language: string,
  result: string
) {
  const texts = result.split("*");

  const frameId = frame.frameNode?.id;
  const currentFrame = figma.currentPage.findOne((node) => node.id === frameId);

  if (currentFrame) {
    const clonedFrame = currentFrame.clone() as FrameNode;
    const index = languagesKeys.indexOf(language) + 1;

    clonedFrame.y += clonedFrame.height * index + 200 * index;
    clonedFrame.name = `${currentFrame.name} - ${languages[language]}`;

    const nodeTexts = clonedFrame.findAll((element) => element.type === "TEXT");

    const changedTexts = nodeTexts.filter((n) => {
      const t = n as TextNode;
      if (original.includes(t.characters)) {
        return t;
      }
    });

    changedTexts.forEach((text, index) => {
      const textMap = texts[index];
      const textNode = text as any;
      figma.loadFontAsync(textNode.fontName).then(() => {
        textNode.characters = textMap;
      });
    });

    translated[clonedFrame.id] = {
      frame: clonedFrame,
      language,
    };
  }
}

function translateText(node: IFrameNode, language: string, text: string) {
  postMessage({
    type: PluginActionTypes.TRANSLATE,
    payload: { node, language, text },
  });
}

function startTranslation() {
  const textNodes = getTextNodes();
  const topNodes = getTopNodes(textNodes);

  topNodes.forEach((frame) => {
    const text = frame.textNodes.map((text) => text.characters).join("*");

    languagesKeys.forEach((language) => {
      translateText(frame, language, text);
    });
  });
}

type TExport = "JPG" | "PNG" | "SVG" | "PDF";

async function startExport(format: string) {
  let exportableBytes = [];
  const keys = Object.keys(translated);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const current = translated[key];

    if (current.frame.exportSettings.length === 0) {
      current.frame.exportSettings = [
        {
          format: format.toUpperCase() as TExport,
          suffix: "",
          constraint: { type: "SCALE", value: 1 },
          contentsOnly: true,
        },
      ];
    }

    const selection = figma.currentPage.selection.map((n) => n.id);
    const isSelected = selection.length > 0;
    // console.log("selected:", selection);

    for (let setting of current.frame.exportSettings) {
      let defaultSetting = setting;
      const bytes = await current.frame.exportAsync(defaultSetting);
      if (
        format === "jpg" &&
        Object.keys(LANGUAGES).includes(current.language) &&
        ((isSelected && selection.includes(current.frame.id)) || !isSelected)
      ) {
        const formName = current.frame.name.replace("/", " ");
        exportableBytes.push({
          name: `${current.language}/${formName}`,
          setting,
          bytes,
        });
      }

      // selection.includes(current.frame.id)

      if (
        format === "png" &&
        Object.keys(LANGUAGES_ANDROID).includes(current.language) &&
        ((isSelected && selection.includes(current.frame.id)) || !isSelected)
      ) {
        const formName = current.frame.name.replace("/", " ");
        exportableBytes.push({
          name: `${current.language}/${formName}`,
          setting,
          bytes,
        });
      }
    }
  }

  console.log("exporting...", exportableBytes);

  postMessage({
    type: PluginActionTypes.EXPORT,
    payload: { exportableBytes, format },
  });
}

startTranslation();

figma.ui.onmessage = function ({ type, payload }: UIAction): void {
  switch (type) {
    case UIActionTypes.TRANSLATE:
      processResult(
        payload.node,
        payload.original,
        payload.language,
        payload.text
      );
      break;

    case UIActionTypes.CHANGE_FORMAT:
      // ...
      break;

    case UIActionTypes.EXPORT:
      startExport(payload);
      break;

    case UIActionTypes.CLOSE:
      // console.log("YAY!!!");
      // figma.closePlugin();
      break;
  }
};
