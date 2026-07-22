import './socialProof.css'


const stats = [
    {value: "30+", label: "langues supportées"},
    {value: "100%", label : "gratuit"},
    {value: "5",label : "types d'activités"},
]
function SocialProof(){
    return  (
        <section className='social-proof'>
            <div className="social-proof-inner">
                {stats.map((stat,index)=>(
                    <div className="stat" key={index}>
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
export default SocialProof