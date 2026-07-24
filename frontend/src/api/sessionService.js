import { apiRequest } from "./client";

export async function getLanguages() {
  return apiRequest("/languages");
}

export async function create_session({ idLanguage, activity, duration, note, resource }) {
  return apiRequest("/session/create", {
    method: "POST",
    body: JSON.stringify({
      activity,
      duration: Number(duration),
      id_language: Number(idLanguage),
      note: note || null,
      resource: resource || null,
    }),
  });
}

export async function getMySession(){
  return apiRequest("/session/my_session");
}