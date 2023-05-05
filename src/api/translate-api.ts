const API_URL = "http://65.21.72.156/api/translator/translate_text";
const TOKEN =
  "1535fa30d7e25dd8a49f1536779734ec8286108d115da5045d77f3b4185d8f790";

export async function translateFrame(text: string, language: string) {
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });

  const body = new URLSearchParams(
    `text=${text}&token=${TOKEN}&fromLang=auto&toLangs=${language}`
  );

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
    redirect: "follow",
  };

  const response = await fetch(API_URL, requestOptions);
  const result = await response.json();
  return result;
}
