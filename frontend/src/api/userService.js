import { apiRequest } from "./client";
export async function updateMe({ firstName, lastName, bio }) {
  return apiRequest("/users/me", {
    method: "PATCH",
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      bio: bio || null,
    }),
  });
}