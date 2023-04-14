import { TGroupedNode, TParentNode } from "../types";

const CONTAINER_NODES = ["FRAME"];
const WHITELIST_NODES = ["TEXT", "FRAME"];

export function getTextNode(node: SceneNode): TextNode {
  const children = "children" in node ? node.children[0] : null;

  if (!children) {
    console.error(`getTextNode(${JSON.stringify(node)}): Your frame is empty!`);
  }

  if (!!children && children.type === "TEXT") {
    return children;
  }

  return getTextNode(children as FrameNode);
}

export function getTextNodes(nodes: readonly SceneNode[]): TextNode[] {
  const allowedNodes = nodes.filter((node) =>
    WHITELIST_NODES.includes(node.type)
  );

  const textNodes = allowedNodes.map((node) => {
    if (CONTAINER_NODES.includes(node.type)) {
      return getTextNode(node);
    }
    return node as TextNode;
  });

  return textNodes;
}

export function getParentNode(node: SceneNode): FrameNode {
  if (node.parent?.type === "PAGE") {
    return node as FrameNode;
  }
  return getParentNode(node.parent as SceneNode);
}

export function getParentNodes(nodes: TextNode[]): TParentNode[] {
  const parents = nodes.map((node) => {
    const parentNode: TParentNode = {
      parent: getParentNode(node.parent as SceneNode),
      text: node,
    };
    return parentNode;
  });

  return parents;
}

export function groupByParent(nodes: TParentNode[]): TGroupedNode[] {
  const result = nodes.reduce((acc, node) => {
    const existingParent = acc.find(
      (item) => item.parent.id === node.parent.id
    );
    if (existingParent) {
      existingParent.texts.push(node.text);
    } else {
      acc.push({
        parent: node.parent,
        texts: [node.text],
      });
    }
    return acc;
  }, [] as TGroupedNode[]);

  return result;
}
