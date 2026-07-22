import './feature.css'
import {Clock,BookOpen,BarChart3,Flame} from 'lucide-react';
const features=[
    {
        icon:Clock,
        title:"Suivi du temps",
        description: "Enregistre les sessions d'apprentissage et vois le temps s'accumuler."

    },
    {
        icon: BookOpen,
        title: "Carnet de vocabulaire",
        description: "Construis ta liste de mots, avec traductions et définitions.",
    },
    {
        icon:BarChart3,
        title:"Statistiques",
        description: "Visualise ta progression par jour, semaine et mois."

    },
    {
        icon: Flame,
        title: "Séries",
        description: "Reste régulier et garde ta série de jours actifs vivante.",
    },
];

function Features(){
    return (
        <section className="features">
            <div className="features-header">
                <span className="u-eyebrow features-eyebrow">Fonctionnalités</span>
                <h2 className=" u-display features-title">
                    Tout pour progresser, <span className='u-accent'>au même endroit</span>
                </h2>
            </div>
            <div className="features-grid">
                {features.map((feature,index)=>{
                    const Icon = feature.icon;
                    return (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon">
                                <Icon size={28}/>
                            </div>
                            <h3 className="feature-card-title">{feature.title}</h3>
                            <p className="feature-card-desc">{feature.description}</p>
                            
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Features