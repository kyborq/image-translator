// Модуль для работы с фреймами

interface INode {
  frameNode: (BaseNode & ChildrenMixin) | null;
  textNode: TextNode;
}

export interface IFrameNode {
  frameNode: (BaseNode & ChildrenMixin) | null;
  textNodes: TextNode[];
}

export interface IIterableNode {
  [key: string]: IFrameNode;
}

export interface IIterableFrame {
  [key: string]: FrameNode;
}

export const getTextNodes = () => {
  const result = figma.currentPage
    .findAll((node) => node.type === "TEXT")
    .filter((node) => figma.currentPage.selection.includes(node));

  return result;
};

export const mergeNodes = (nodes: INode[]) => {
  const frames: IIterableNode = {};
  nodes.forEach((node) => {
    if (node.frameNode?.id && !frames[node.frameNode.id]) {
      frames[node.frameNode?.id] = {
        frameNode: node.frameNode,
        textNodes: [],
      };
    }

    if (node.frameNode?.id && !!frames[node.frameNode.id]) {
      frames[node.frameNode?.id] = {
        ...frames[node.frameNode?.id],
        textNodes: [...frames[node.frameNode?.id].textNodes, node.textNode],
      };
    }
  });

  return frames;
};

export const getTopNodes = (nodes: SceneNode[]) => {
  const result = getParentNodes(nodes);
  const mergedNodes = mergeNodes(result);

  const frames = Object.keys(mergedNodes);
  const frameNodes = frames.map((id) => {
    return mergedNodes[id];
  });

  return frameNodes;
};

export const getParentNodes = (selectedNodes: SceneNode[]) => {
  const nodes = selectedNodes.map((node) => {
    const parent: INode = {
      frameNode: node.parent,
      textNode: node as TextNode,
    };

    return parent;
  });

  return nodes;
};
