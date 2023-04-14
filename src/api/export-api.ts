import { saveAs } from "file-saver";
import JSZip from "jszip";
import { TExportableFrame } from "../types";

export async function saveFramesAsZip(
  frames: TExportableFrame[],
  zipFileName: string,
  onProgress?: (percent: string) => void
) {
  // Создаем экземпляр класса из библиотеки JSZip
  const zip = new JSZip();

  // Добавляем в архив фреймы
  frames.forEach((frame) => {
    console.log("Save-To-Zip", frame);
    zip.file(`${frame.path}${frame.name}.${frame.format}`, frame.bytes);
  });

  // Сохранение архива на локальный диск
  const content = await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    },
    function updateCallback(metadata) {
      onProgress && onProgress(metadata.percent.toFixed(2) + "%");
      console.log("progression: " + metadata.percent.toFixed(2) + "%");
      if (metadata.currentFile) {
        console.log("current file = " + metadata.currentFile);
      }
    }
  );

  saveAs(content, zipFileName);

  return content;
}
