import './Momentum.css';

function Momentum() {
  return (
    <section className="momentum">
      <div className="momentum-inner">
        <span className="u-eyebrow momentum-eyebrow">Pourquoi ça marche</span>

        <h2 className="u-display momentum-title">
          1 heure par jour<span className="u-accent"> = 365 heures</span> par an.
        </h2>

        <p className="momentum-text">
          La régularité bat l'intensité. Tu n'as pas besoin de sessions
          marathon — tu as besoin de ne pas casser la chaîne. HourPile
          t'aide à empiler tes heures, jour après jour.
        </p>

        {/* Comparaison visuelle : régulier vs irrégulier */}
        <div className="momentum-compare">
          <div className="compare-card compare-good">
            <span className="compare-label">Régulier</span>
            <div className="compare-bars">
              <span style={{ height: '30%' }}></span>
              <span style={{ height: '40%' }}></span>
              <span style={{ height: '50%' }}></span>
              <span style={{ height: '65%' }}></span>
              <span style={{ height: '80%' }}></span>
              <span style={{ height: '100%' }}></span>
            </div>
            <span className="compare-caption">1h/jour → progression constante</span>
          </div>

          <div className="compare-card compare-bad">
            <span className="compare-label">Irrégulier</span>
            <div className="compare-bars">
              <span style={{ height: '90%' }}></span>
              <span style={{ height: '10%' }}></span>
              <span style={{ height: '80%' }}></span>
              <span style={{ height: '10%' }}></span>
              <span style={{ height: '15%' }}></span>
              <span style={{ height: '10%' }}></span>
            </div>
            <span className="compare-caption">7h le dimanche → abandon rapide</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Momentum;