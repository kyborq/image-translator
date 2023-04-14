import { postMessage } from "../plugin";
import { PluginActionTypes, TGroupedNode, TTranslatedNode } from "../types";
import { LANGUAGES } from "./language-service";

export async function processTranslated(
  frame: TGroupedNode,
  original: string,
  language: string,
  result: string
): Promise<TTranslatedNode> {
  const languages = Object.keys(LANGUAGES);

  const texts = result.split("*");
  const frameId = frame.parent?.id;
  const currentFrame = figma.currentPage.findOne((node) => node.id === frameId);

  if (!currentFrame) {
    throw new Error(`Frame with ID ${frameId} not found`);
  }

  const clonedFrame = currentFrame.clone() as FrameNode;
  const index = languages.indexOf(language) + 1;

  clonedFrame.y += clonedFrame.height * index + 200 * index;
  clonedFrame.name = `${currentFrame.name} - ${LANGUAGES[language]}`;

  const nodeTexts = clonedFrame.findAll((element) => element.type === "TEXT");

  const changedTexts = nodeTexts.filter((n) => {
    const t = n as TextNode;
    if (original.includes(t.characters)) {
      return t;
    }
  });

  const promises = changedTexts.map((text, index) => {
    const textMap = texts[index];
    const textNode = text as any;
    return figma.loadFontAsync(textNode.fontName).then(() => {
      textNode.characters = textMap;
    });
  });

  await Promise.all(promises);

  const translatedFrame: TTranslatedNode = {
    frame: clonedFrame,
    language,
  };

  return translatedFrame;
}

export function startTranslation(nodes: TGroupedNode[], index: number) {
  const languages = Object.keys(LANGUAGES);
  const count = index + nodes.length * languages.length;
  console.log(index, nodes.length, languages.length);

  nodes.forEach((node) => {
    const texts = node.texts.map((text) => text.characters);
    const text = texts.join("*");

    languages.forEach((language) => {
      // console.log("Translating...", node, language);

      postMessage({
        type: PluginActionTypes.START_TRANSLATE,
        payload: {
          language,
          text,
          node,
          count,
        },
      });
    });
  });
}
