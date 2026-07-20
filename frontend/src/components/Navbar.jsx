import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo à gauche */}
      <div className="navbar-logo">HourPile</div>

      {/* Liens au centre */}
      <ul className="navbar-links">
        <li>Accueil</li>
        <li>Fonctionnalités</li>
        <li>À propos</li>
      </ul>

      {/* Connexion en lien à droite */}
      <a className="navbar-login" href="#">Connexion</a>
    </nav>
  );
}

export default Navbar;