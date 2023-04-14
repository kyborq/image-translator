import { format } from "date-fns";
import { saveFramesAsZip } from "./api/export-api";
import { translateFrame } from "./api/translate-api";
import {
  PluginAction,
  PluginActionTypes,
  UIAction,
  UIActionTypes,
} from "./types";

import "./ui.css";

// Отправляем сообщения на сторону плагина
function sendMessage({ type, payload }: UIAction) {
  parent.postMessage({ pluginMessage: { type, payload } }, "*");
}

// Слушаем события пришедшие с плагина
function listenMessages() {
  window.onmessage = function (event: MessageEvent) {
    const pluginMessage = event.data.pluginMessage as PluginAction;

    if (!!pluginMessage?.type) {
      const { type, payload } = pluginMessage;

      if (type === PluginActionTypes.START_EXPORT) {
        const progressElement = document.querySelector(
          "#progress-bar"
        ) as HTMLSpanElement;
        progressElement.style.width = "0%";

        const dateTime = new Date();
        const formatDate = format(dateTime, "HH_mm_ss dd.MM.yyyy");
        saveFramesAsZip(
          payload,
          `ImageTranslator - ${formatDate}.zip`,
          (progress) => {
            progressElement.style.width = progress;
          }
        ).then(() => {
          console.log("Saved-ZIP");
        });
      }

      if (type === PluginActionTypes.START_TRANSLATE) {
        translateFrame(payload.text, payload.language).then((result) => {
          const text = result[payload.language][0];
          const language = payload.language;
          const node = payload.node;
          const original = payload.text;
          const count = payload.count;

          // console.log("Translated", original, text);

          const progressElement = document.querySelector(
            "#progress-bar"
          ) as HTMLSpanElement;
          progressElement.style.width = "0%";

          sendMessage({
            type: UIActionTypes.RESULT_TRANSLATE,
            payload: { text, original, language, node, count },
          });
        });
      }

      if (type === PluginActionTypes.PROGRESS_TRANSLATE) {
        console.log(`Translated ${payload.translated} / ${payload.all}`);
      }

      if (type === PluginActionTypes.PROGRESS_EXPORT) {
        console.log(`Exported ${payload.index} / ${payload.count}`);
        const btn = document.querySelector(
          "#export-button"
        ) as HTMLButtonElement;
        btn.classList.remove("disabled");
        btn.disabled = false;
      }
    }
  };
}

// Слушаем события пришедшие с UI
function listenButtons() {
  document.addEventListener("click", function (event: MouseEvent) {
    const target = event.target as HTMLElement;
    const formatRadio = document.querySelector(
      "input[name='export-type']:checked"
    ) as HTMLInputElement;
    const format = formatRadio.value;

    if (target.id === "export-button") {
      const btn = target as HTMLButtonElement;
      btn.disabled = true;
      btn.classList.add("disabled");
      sendMessage({ type: UIActionTypes.INIT_EXPORT, payload: format });
    }

    if (target.id === "translate-button") {
      sendMessage({ type: UIActionTypes.INIT_TRANSLATE });
    }
  });
}

// Инициализация слушателей событий
listenMessages();
listenButtons();
