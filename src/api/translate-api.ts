const BASE_URL = "https://helpdev.info/"
const API_URL = BASE_URL + "api/translator/translate_text";
const TOKEN =
  "1535fa30d7e25dd8a49f1536779734ec8286108d115da5045d77f3b4185d8f790";

export async function translateFrame(text: string, language: string) {
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });

  const body = new URLSearchParams();
    
  // OLD in URLSearchParams constructor!
  // `text=${text}&token=${TOKEN}&fromLang=auto&toLangs=${language}`
  
  body.append("text", text);
  body.append("token", TOKEN);
  body.append("fromLang", "auto");
  body.append("toLangs", language);

  const requestOptions: RequestInit = {
    method: "POST",
    mode: "cors",
    headers,
    body,
    redirect: "follow",
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error!!!", error);
  }
}
