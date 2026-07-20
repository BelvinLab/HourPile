import './Hero.css';
import heroImage from '../assets/vitrine5.png';

function Hero() {
  return (
    <section className="hero">
      {/* Colonne gauche : le texte */}
      <div className="hero-text">
        <span className="u-eyebrow hero-eyebrow">Apprentissage des langues</span>

        <h1 className="u-display hero-title">
          Une langue,<br />
          une <span className="u-accent">heure</span> à la fois.
        </h1>

        <p className="hero-subtitle">
          Suis ton temps, construis ton vocabulaire, et regarde
          tes progrès s'accumuler jour après jour.
        </p>

        <div className="hero-actions">
          <button className="u-btn">Commencer →</button>
          <button className="u-btn-outline">En savoir plus</button>
        </div>
      </div>

      {/* Colonne droite : l'illustration */}
      <div className="hero-image">
        <img src={heroImage} alt="Apprentissage des langues" />
      </div>
    </section>
  );
}

export default Hero;