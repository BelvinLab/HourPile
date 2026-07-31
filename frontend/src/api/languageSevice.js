import { apiRequest } from "./client";

export async function getLanguages() {
  return apiRequest("/languages");
}