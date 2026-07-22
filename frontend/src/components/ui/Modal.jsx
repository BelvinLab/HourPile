import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({ open, onClose, title, children }) {
  // Fermeture au clavier avec Échap
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Le fond sombre : un clic dessus ferme la modale
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      {/* stopPropagation : un clic DANS la carte ne remonte pas au fond */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1A1523]">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#524D66] transition hover:bg-[#EDE9F7]"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;