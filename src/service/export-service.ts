import { postMessage } from "../plugin";
import {
  PluginActionTypes,
  TExportableFrame,
  TExportFormat,
  TTranslatedNode,
} from "../types";
import { DEVICE } from "./language-service";

export async function exportFrames(
  frames: TTranslatedNode[],
  format: TExportFormat
): Promise<TExportableFrame[]> {
  console.log("Exporting: ", frames, format);

  const exportSettings: ExportSettings = {
    constraint: { type: "SCALE", value: 1 },
    contentsOnly: true,
    suffix: "",
    format,
  };

  const device = DEVICE[format];

  const exportPromises = frames.map(({ frame, language }, index) => {
    return frame.exportAsync(exportSettings).then((bytes) => {
      const cleanName = frame.name.replace("/", "");

      const exportedFrame: TExportableFrame = {
        frameId: frame.id,
        format: format.toLowerCase(),
        name: cleanName,
        path: `${device}/${language}/`,
        bytes,
      };

      postMessage({
        type: PluginActionTypes.PROGRESS_EXPORT,
        payload: { index: index + 1, count: frames.length },
      });

      return exportedFrame;
    });
  });

  const exportResult = await Promise.all(exportPromises);

  postMessage({
    type: PluginActionTypes.PROGRESS_EXPORT,
    payload: { index: frames.length, count: frames.length },
  });

  return exportResult;
}
