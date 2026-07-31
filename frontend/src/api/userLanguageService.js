import { apiRequest } from "./client";

export async function getMyLanguages() {
  return apiRequest("/user-languages/me");
}

export async function declareLanguage({ idLanguage, currentLevel, targetLevel }) {
  return apiRequest("/user-languages", {
    method: "POST",
    body: JSON.stringify({
      id_language: Number(idLanguage),
      current_level: currentLevel,
      target_level: targetLevel || null,
    }),
  });
}

export async function updateUserLanguage(id, { currentLevel, targetLevel }) {
  return apiRequest(`/user-languages/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      current_level: currentLevel,
      target_level: targetLevel || null,
    }),
  });
}

export async function deleteUserLanguage(id) {
  return apiRequest(`/user-languages/${id}`, { method: "DELETE" });
}