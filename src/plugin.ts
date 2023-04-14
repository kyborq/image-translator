import { exportFrames } from "./service/export-service";
import {
  getParentNode,
  getParentNodes,
  getTextNodes,
  groupByParent,
} from "./service/frame-service";
import { FORMAT_LANGUAGES } from "./service/language-service";
import {
  processTranslated,
  startTranslation,
} from "./service/translate-service";
import {
  PluginAction,
  PluginActionTypes,
  TTranslatedNode,
  UIAction,
  UIActionTypes,
} from "./types";

export function postMessage({ type, payload }: PluginAction): void {
  figma.ui.postMessage({ type, payload });
}

figma.showUI(__html__, { width: 300, height: 158, visible: true });

const translated: TTranslatedNode[] = [];
const translatedFrames: FrameNode[] = [];

function initTranslate() {
  figma.ui.hide();

  const translatedCount = translated.length;

  const selection = figma.currentPage.selection;
  translatedFrames.push(selection.find((f) => getParentNode(f)) as FrameNode);

  const textNodes = getTextNodes(selection);
  console.log("Prepare-Text", textNodes);

  const parentNodes = getParentNodes(textNodes);
  console.log("Prepare-Parent", parentNodes);

  const grouppedNodes = groupByParent(parentNodes);
  console.log("Prepare-Groupped", grouppedNodes);

  // Начало работы переводчика
  startTranslation(grouppedNodes, translatedCount);
}

initTranslate();

figma.ui.onmessage = function ({ type, payload }: UIAction): void {
  if (type === UIActionTypes.INIT_EXPORT) {
    const selection = figma.currentPage.selection
      .map((n) => getParentNode(n))
      .map((n) => n.id);
    const isSelected = selection.length > 0;

    const f = isSelected
      ? translated.filter((f) => selection.includes(f.frame.id))
      : translated;

    const formattedFrames = f.filter((node) => {
      if (Object.keys(FORMAT_LANGUAGES[payload]).includes(node.language)) {
        return node;
      }
    });

    exportFrames(formattedFrames, payload).then((result) => {
      console.log("Finished-Export:", result);
      postMessage({
        type: PluginActionTypes.START_EXPORT,
        payload: result,
      });
    });
  }

  if (type === UIActionTypes.INIT_TRANSLATE) {
    initTranslate();
  }

  if (type === UIActionTypes.RESULT_TRANSLATE) {
    processTranslated(
      payload.node,
      payload.original,
      payload.language,
      payload.text
    ).then((result) => {
      translated.push(result);

      if (translated.length === payload.count) {
        console.log("Ready", translated);
        figma.ui.show();
      }

      postMessage({
        type: PluginActionTypes.PROGRESS_TRANSLATE,
        payload: {
          translated: translated.length,
          all: payload.count,
        },
      });
    });
  }
};
