import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../components/form/Button";
import Input from "../components/form/Input";
import {login} from "../api/authServices"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);


  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const navigate = useNavigate()
  async function  handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email,password)
      navigate("/dashboard");
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setLoading(false);
    }
      
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDE9F7] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#1A1523]">Bon retour !</h1>
        <p className="mt-1 text-sm text-[#6B6580]">
          Connecte-toi à ton compte pour continuer
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-3xl bg-white p-9 shadow-[0_25px_50px_-20px_rgba(107,101,128,0.35)]"
        >
          <Input
            label="Adresse email"
            id="email"
            type="email"
            required
            placeholder="ton@email.com"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Mot de passe"
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Ton mot de passe"
            icon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="pointer-events-auto"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#6B6580]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-[#E2DDF4] accent-[#6C5CE7] focus:ring-[#6C5CE7]/40"
              />
              Se souvenir de moi
            </label>
            <Link
              to="/forgot-password"
              className="font-semibold text-[#6C5CE7] hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          <Button type="submit" disabled={loading}>Se connecter</Button>

          <p className="text-center text-sm text-[#6B6580]">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#6C5CE7] hover:underline"
            >
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}