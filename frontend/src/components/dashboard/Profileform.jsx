import { useState } from "react";
import Input from "../form/Input";
import Button from "../form/Button";
import { updateMe } from "../../api/userService";

function ProfileForm({ user, onSuccess }) {
  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [lastName, setLastName] = useState(user.last_name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Le prénom et le nom sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      await updateMe({ firstName, lastName, bio });
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prénom"
          id="first_name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          label="Nom"
          id="last_name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1523]">
          Bio{" "}
          <span className="font-normal text-[#524D66]">(facultatif)</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Quelques mots sur ton parcours d'apprentissage…"
          className="w-full resize-none rounded-xl border border-solid border-gray-200 bg-white px-4 py-3 text-[#1A1523] placeholder-gray-400 transition focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20"
        />
        <p className="mt-1 text-right text-xs text-[#524D66]">
          {bio.length}/500
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}

export default ProfileForm;