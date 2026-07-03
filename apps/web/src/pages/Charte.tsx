import { Card } from '@/components/ui/Card'

const PRINCIPLES = [
  { title: '01. Légalité', text: "Tout travail de cybersécurité doit se faire exclusivement sur des systèmes pour lesquels vous disposez d'une autorisation explicite. Aucune exception." },
  { title: '02. Confidentialité', text: 'Toutes les informations partagées au sein de la communauté restent strictement confidentielles.' },
  { title: '03. Responsabilité', text: 'Toute vulnérabilité réelle découverte doit être divulguée de manière responsable (responsible disclosure) au propriétaire du système concerné.' },
  { title: '04. Respect', text: 'La communauté est un espace bienveillant. Toute forme de harcèlement ou de comportement toxique est prohibée.' },
  { title: '05. Humilité', text: "Personne ne sait tout. Acceptez de ne pas savoir, demandez de l'aide, partagez vos connaissances." },
  { title: '06. Documentation', text: 'Tout ce que vous apprenez doit être documenté — un professionnel qui ne documente pas ne peut pas être audité.' },
  { title: '07. Apprentissage continu', text: "S'arrêter d'apprendre, c'est commencer à régresser." },
  { title: "08. Esprit d'équipe", text: 'Partagez vos découvertes, aidez les membres moins avancés — votre progression enrichit toute la communauté.' },
]

export function Charte() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Charte The Hackerhood</h1>
        <p className="mt-1 text-sm text-text-muted italic">« Learn • Practice • Secure • Repeat »</p>
      </div>

      <Card className="border-accent/30 bg-accent/5">
        <p className="text-sm italic">
          "La cybersécurité n'est pas une destination — c'est un mode de vie. Chaque jour est une occasion d'apprendre,
          de pratiquer et de sécuriser."
        </p>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-text-muted">Vision</h2>
        <p className="text-sm">
          Former des professionnels de la cybersécurité capables d'intervenir immédiatement sur le terrain,
          en priorisant la pratique (90%) sur la théorie (10%), au sein d'une communauté soudée et bienveillante.
        </p>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Code d'éthique</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <Card key={p.title}>
              <h3 className="font-semibold text-accent">{p.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{p.text}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="text-center">
        <p className="text-sm italic text-text-muted">
          "Un hacker éthique ne se définit pas par ce qu'il est capable de pirater, mais par ce qu'il choisit de ne pas pirater."
        </p>
      </Card>
    </div>
  )
}
