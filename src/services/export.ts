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
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    default:
      return "image/png";
  }
}

function exportTypeToFileExtension(type: string) {
  switch (type) {
    case "png":
      return ".png";
    case "jpg":
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

    const bType = exportTypeToBlobType(format);
    const ext = exportTypeToFileExtension(format);

    let blob = new Blob([cleanBytes], { type: bType });
    if (format === "png") {
      zip.file(`android/${name}${ext}`, blob, {
        base64: true,
      });
    }

    if (format === "jpg") {
      zip.file(`ios/${name}${ext}`, blob, {
        base64: true,
      });
    }
  }

  const content = await zip.generateAsync({ type: "blob" });

  return content;
}
