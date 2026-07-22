import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../components/form/Button";
import Input from "../components/form/Input";
import { register } from "../api/authServices";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const [Loading,setLoading] = useState(false)
  const [error,setError] = useState("")
  const navigate = useNavigate();



  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if(password!==passwordConfirmed){
        setError("Les mots de passe ne correspondent pas !")
        return;
    }
    if(password.length<8){
        setError("Le mot de passe doit contenir au moins 8 caractères.");
        return;
    }
    try{
        await register({firstName,lastName,email,password});
        navigate("/login");
    }catch(err){
        setError(err.message);
    }finally{
        setLoading(false)
    }

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDE9F7] px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#1A1523]">Bienvenue !</h1>
        <p className="mt-1 text-sm text-[#6B6580]">
          Crée ton compte pour commencer
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-3xl bg-white p-9 shadow-[0_25px_50px_-20px_rgba(107,101,128,0.35)]"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              id="first_name"
              required
              placeholder="Ton prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Nom"
              id="last_name"
              required
              placeholder="Ton nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <Input
            label="Email"
            id="email"
            type="email"
            required
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
          />

          <Input
            label="Mot de passe"
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Ton mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
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

          <Input
            label="Confirmation du mot de passe"
            id="password_confirmed"
            type={showPasswordConfirmation ? "text" : "password"}
            required
            placeholder="Confirme ton mot de passe"
            value={passwordConfirmed}
            onChange={(e) => setPasswordConfirmed(e.target.value)}
            icon={<Lock size={18} />}
            trailing={
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                className="pointer-events-auto"
                aria-label={
                  showPasswordConfirmation
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPasswordConfirmation ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            }
          />
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          <Button type="submit" disabled={Loading}>S'inscrire</Button>

          <p className="text-center text-sm text-[#6B6580]">
            Tu as déjà un compte ?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#6C5CE7] hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;