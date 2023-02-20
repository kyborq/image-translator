import { languages, languagesKeys } from "./lib/languages";
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

figma.showUI(__html__, { width: 300, height: 100 });

const translated: IIterableFrame = {};

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

    translated[clonedFrame.id] = clonedFrame;
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

async function startExport() {
  let exportableBytes = [];
  const keys = Object.keys(translated);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const current = translated[key];

    if (current.exportSettings.length === 0) {
      current.exportSettings = [
        {
          format: "PNG",
          suffix: "",
          constraint: { type: "SCALE", value: 1 },
          contentsOnly: true,
        },
      ];
    }

    for (let setting of current.exportSettings) {
      let defaultSetting = setting;
      const bytes = await current.exportAsync(defaultSetting);
      exportableBytes.push({
        name: current.name,
        setting,
        bytes,
      });
    }
  }

  postMessage({
    type: PluginActionTypes.EXPORT,
    payload: { exportableBytes },
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

    case UIActionTypes.EXPORT:
      startExport();
      break;

    case UIActionTypes.CLOSE:
      // console.log("YAY!!!");
      // figma.closePlugin();
      break;
  }
};
