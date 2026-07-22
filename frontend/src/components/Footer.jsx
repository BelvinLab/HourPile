import './Footer.css';

// Les colonnes de liens : encore un .map() (3ᵉ fois — ça rentre !)
const footerColumns = [
  {
    title: "Produit",
    links: ["Fonctionnalités", "Tarifs", "Nouveautés"],
  },
  {
    title: "Ressources",
    links: ["Blog", "Guide", "Aide"],
  },
  {
    title: "Entreprise",
    links: ["À propos", "Contact", "Confidentialité"],
  },
];

function Footer() {
  const year = new Date().getFullYear();   // année automatique

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Colonne de gauche : logo + tagline */}
        <div className="footer-brand">
          <div className="footer-logo">HourPile</div>
          <p className="footer-tagline">
            Une langue, une heure à la fois.
          </p>
        </div>

        {/* Colonnes de liens, générées par .map() */}
        <div className="footer-columns">
          {footerColumns.map((column, index) => (
            <div className="footer-column" key={index}>
              <h4 className="footer-column-title">{column.title}</h4>
              <ul className="footer-links">
                {column.links.map((link, i) => (
                  <li key={i}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bas du footer : copyright */}
      <div className="footer-bottom">
        <p>© {year} HourPile. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;