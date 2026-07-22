import { apiRequest, API_URL } from "./client";

/**
 * Inscription. Envoie du JSON à /auth/register.
 */
export async function register({ firstName, lastName, email, password }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      first_name: firstName,     // le backend attend du snake_case
      last_name: lastName,
      email,
      password,
    }),
  });
}

/**
 * Connexion. ATTENTION : /auth/login attend du form-data (OAuth2),
 * pas du JSON — d'où le traitement particulier ici.
 */
export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);   // le standard OAuth2 nomme ce champ "username"
  formData.append("password", password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Email ou mot de passe incorrect");
  }

  const data = await response.json();
  localStorage.setItem("token", data.access_token);   // on stocke le token
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}