import { exportZip } from "./api/export-api";
import { translate } from "./api/translate-api";
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

      switch (type) {
        // Выполнение перевода
        case PluginActionTypes.TRANSLATE:
          translate(payload.text, payload.language).then((result) => {
            const text = result[payload.language][0];
            const language = payload.language;
            const node = payload.node;
            const original = payload.text;

            sendMessage({
              type: UIActionTypes.TRANSLATE,
              payload: { text, original, language, node },
            });
          });
          break;

        // Выполнение экспорта
        case PluginActionTypes.EXPORT:
          exportZip(payload.format, payload.exportableBytes).then((content) => {
            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();

            const blobURL = window.URL.createObjectURL(content);
            const link = document.createElement("a");
            link.className = "button button--primary";
            link.href = blobURL;
            link.download = "export.zip";
            link.setAttribute(
              "download",
              `export-${day}.${
                month + 1
              }.${year}-${hours}:${minutes}:${seconds}.zip`
            );
            link.click();

            sendMessage({ type: UIActionTypes.CLOSE });
          });
          break;
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

    // console.log(format);

    switch (target.id) {
      // Клик на кнопку Экспорт
      case "jpg":
      case "png":
        sendMessage({ type: UIActionTypes.CHANGE_FORMAT, payload: format });
        break;
      case "saveBtn":
        sendMessage({ type: UIActionTypes.EXPORT, payload: format });
        break;
    }
  });
}

// Инициализация слушателей событий
listenMessages();
listenButtons();
