import { getChildrenNode, getParentNode } from "./service/frame-service";

import { PluginAction, UIAction } from "./types";

figma.showUI(__html__, { width: 300, height: 158 });

const currentNode = figma.currentPage.selection;

// console.log(getParentFrame(currentNode));
console.log(getChildrenNode(currentNode.at(0) as FrameNode));

export function postMessage({ type, payload }: PluginAction): void {
  figma.ui.postMessage({ type, payload });
}

figma.ui.onmessage = function ({ type, payload }: UIAction): void {};
