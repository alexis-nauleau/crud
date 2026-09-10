// Importe ton client Prisma configuré (connexion à ta base mon_projet_crud)
import { prisma } from '@/lib/prisma'

// Importe tes 3 Server Actions créées dans app/actions.ts
import { createTache, toggleTache, deleteTache } from './actions'

// "async" car on va chercher des données en base AVANT d'afficher quoi que ce soit.
// C'est un Server Component : ce code s'exécute côté serveur, jamais dans le navigateur.
export default async function Home() {

  // Récupère TOUTES les tâches de la base, triées par date de création,
  // la plus récente en premier ('desc' = descendant)
  const taches = await prisma.taches.findMany({
    orderBy: { dateCreation: 'desc' },
  })

  // Ce qui suit est le HTML/JSX réellement affiché à l'écran
  return (
    // Conteneur principal : largeur max fixée (max-w-xl), centré horizontalement (mx-auto),
    // avec un espace intérieur tout autour (p-8)
    <main className="max-w-xl mx-auto p-8">

      {/* Titre de la page : grande taille de texte (text-2xl), gras (font-bold), 
          marge en dessous (mb-6) */}
      <h1 className="text-2xl font-bold mb-6">Mes tâches</h1>

      {/* Formulaire d'ajout d'une tâche.
          "action={createTache}" : quand ce formulaire est soumis, Next.js appelle
          automatiquement ta Server Action createTache côté serveur, sans JavaScript
          côté client à écrire. flex + gap-2 alignent l'input et le bouton côte à côte. */}
      <form action={createTache} className="flex gap-2 mb-8">

        {/* Champ texte. "name='titre'" est important : c'est cette clé exacte que
            createTache utilise pour lire la valeur tapée (formData.get('titre')).
            "required" empêche l'envoi du formulaire si le champ est vide. */}
        <input
          type="text"
          name="titre"
          placeholder="Nouvelle tâche..."
          required
          className="border rounded px-3 py-2 flex-1"
        />

        {/* Bouton d'envoi du formulaire */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </form>

      {/* Liste qui va contenir toutes les tâches. space-y-2 ajoute un petit espace
          vertical entre chaque élément de la liste */}
      <ul className="space-y-2">

        {/* .map() parcourt le tableau "taches" et transforme chaque tâche
            en un élément <li> visuel. C'est l'équivalent JSX d'une boucle for */}
        {taches.map((tache) => (

          // "key={tache.id}" est OBLIGATOIRE en React pour toute liste générée avec .map()
          // Ça permet à React d'identifier chaque élément de façon unique et de gérer
          // les mises à jour efficacement (sans ça : warning dans la console)
          <li key={tache.id} className="flex items-center gap-3 border rounded px-3 py-2">

            {/* Affiche le titre de la tâche.
                Si tache.fait est vrai (tâche faite) : texte barré et grisé (line-through text-gray-400)
                Sinon : affichage normal.
                "flex-1" fait que ce span prend tout l'espace disponible restant */}
            <span className={tache.fait ? 'line-through text-gray-400 flex-1' : 'flex-1'}>
              {tache.titre}
            </span>

            {/* Formulaire pour basculer l'état fait/pas fait.
                ".bind(null, tache.id, tache.fait)" permet de "pré-attacher" des arguments
                à la fonction toggleTache AVANT qu'elle soit appelée : quand ce formulaire
                est soumis, toggleTache recevra automatiquement CET id et CET état précis. */}
            <form action={toggleTache.bind(null, tache.id, tache.fait)}>
              <button type="submit" className="text-sm border px-2 py-1 rounded">
                {/* Affiche "Fait" ou "À faire" selon l'état actuel de la tâche */}
                {tache.fait ? 'Fait' : 'À faire'}
              </button>
            </form>

            {/* Formulaire de suppression, même principe de .bind() mais avec un seul argument */}
            <form action={deleteTache.bind(null, tache.id)}>
              <button type="submit" className="text-red-600 text-sm">
                Supprimer
              </button>
            </form>

          </li>
        ))}
      </ul>
    </main>
  )
}