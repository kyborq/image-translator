// Здесь все для работы с фреймами и текстовыми нодами

export function getParentNode(selected: TextNode): FrameNode {
  const frame = selected.parent as FrameNode;

  // ...

  return frame;
}

export function getChildrenNode(selected: FrameNode) {
  console.log(selected);
}
