// L'adresse du backend. Un seul endroit à changer le jour du déploiement.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";



function extractErrorMessage(errorData) {
  const detail = errorData?.detail;

  // cas simple : une chaîne
  if (typeof detail === "string") return detail;

  // cas validation : un tableau d'objets {loc, msg, type}
  if (Array.isArray(detail)) {
    return detail
      .map((err) => {
        const field = err.loc?.[err.loc.length - 1];   // le nom du champ fautif
        return field ? `${field} : ${err.msg}` : err.msg;
      })
      .join(" — ");
  }

  return "Une erreur est survenue";
} 
/**
 * Fonction générique pour tous les appels API.
 * Gère : l'URL, les en-têtes, le token, et les erreurs.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // si un token existe, on l'ajoute automatiquement
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  // FastAPI renvoie les erreurs avec un champ "detail"
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(extractErrorMessage(errorData));
  }

  return response.json();
}

export { API_URL };