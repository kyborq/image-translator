import JSZip from "jszip";

type Export = {
  name: string;
  settings: ExportSettings;
  bytes: Uint8Array;
};

function typedArrayToBuffer(array: Uint8Array) {
  return array.buffer.slice(
    array.byteOffset,
    array.byteLength + array.byteOffset
  );
}

function exportTypeToBlobType(type: string) {
  switch (type) {
    case "PDF":
      return "application/pdf";
    case "SVG":
      return "image/svg+xml";
    case "PNG":
      return "image/png";
    case "JPG":
      return "image/jpeg";
    default:
      return "image/png";
  }
}

function exportTypeToFileExtension(type: string) {
  switch (type) {
    case "PDF":
      return ".pdf";
    case "SVG":
      return ".svg";
    case "PNG":
      return ".png";
    case "JPG":
      return ".jpg";
    default:
      return ".png";
  }
}

export async function exportZip(format: string, exportableBytes: Export[]) {
  const zip = new JSZip();

  for (let data of exportableBytes) {
    const { bytes, name } = data;

    const cleanBytes = typedArrayToBuffer(bytes);

    let blob = new Blob([cleanBytes], { type: "image/png" });
    zip.file(`${name}.png`, blob, {
      base64: true,
    });
  }

  const content = await zip.generateAsync({ type: "blob" });

  return content;
}
