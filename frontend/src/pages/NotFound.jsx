import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EDE9F7] px-4 text-center">
      <p className="text-6xl font-extrabold text-[#6C5CE7]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-[#1A1523]">
        Cette page n'existe pas
      </h1>
      <p className="mt-2 text-sm text-[#524D66]">
        Le lien est peut-être cassé, ou la page a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-[#1A1523] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6C5CE7]"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;