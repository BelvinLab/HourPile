import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo à gauche */}
      <Link to="/" className="navbar-logo">HourPile</Link>
      

      {/* Liens au centre */}
      <ul className="navbar-links">
        <li>Accueil</li>
        <li>Fonctionnalités</li>
        <li>À propos</li>
      </ul>

      {/* Connexion en lien à droite */}
      <Link className="navbar-login" to="/login">Connexion</Link>
    </nav>
  );
}

export default Navbar;