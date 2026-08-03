import { apiRequest } from "./client";

export async function getMyAchievements() {
  return apiRequest("/objective/achieved");        // le préfixe manquait
}

export async function getAllObjectives(idLanguage) {
  return apiRequest(`/objective/${idLanguage}`);   // le slash manquait
}

export async function achieveObjective(idLearningObjective) {
  return apiRequest(`/objective/achievement/${idLearningObjective}`, {
    method: "POST",                                 // sans ça, c'est un GET
  });
}

export async function unachieveObjective(idLearningObjective) {
  return apiRequest(`/objective/achievement/${idLearningObjective}`, {
    method: "DELETE",
  });
}