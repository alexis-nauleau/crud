// Importe ton client Prisma configuré (connexion à mon_projet_crud)
import { prisma } from '@/lib/prisma'

// Importe la Server Action pour créer une tâche
import { createTache } from './actions'

// Importe le nouveau composant qui gère l'affichage + les filtres
import TacheList from './TacheList'

// "async" car on va chercher des données en base AVANT d'afficher quoi que ce soit.
// C'est un Server Component : ce code s'exécute côté serveur, jamais dans le navigateur.
export default async function Home() {

  // Récupère TOUTES les tâches de la base, triées par date de création,
  // la plus récente en premier ('desc' = descendant).
  // Important : on récupère TOUJOURS toutes les tâches ici, peu importe le filtre choisi
  // par l'utilisateur — le filtrage se fera ensuite côté client, dans TacheList.
  const taches = await prisma.taches.findMany({
    orderBy: { dateCreation: 'desc' },
  })

  // Calcule le nombre de tâches marquées comme "faites", pour l'afficher dans le sous-titre.
  // .filter() garde uniquement les éléments du tableau qui remplissent la condition,
  // puis .length compte combien il en reste
  const nbFaites = taches.filter((t) => t.fait).length

  // Ce qui suit est le HTML/JSX réellement affiché à l'écran
  return (

    // Conteneur extérieur : largeur max fixée (max-w-lg), centré horizontalement (mx-auto),
    // avec un espace intérieur tout autour (p-8)
    <main className="max-w-lg mx-auto p-8">

      {/* La "carte" visuelle : fond gris foncé, coins très arrondis, padding généreux */}
      <div className="bg-zinc-900 rounded-2xl p-8">

        {/* Titre principal de la page */}
        <h1 className="text-xl font-medium text-zinc-50 mb-1">Mes tâches</h1>

        {/* Sous-titre dynamique, ex: "3 tâches, 1 terminée".
            Le "s" et le "e" ne s'ajoutent que si le nombre est supérieur à 1 (pluriel correct) */}
        <p className="text-sm text-zinc-500 mb-6">
          {taches.length} tâche{taches.length > 1 ? 's' : ''}, {nbFaites} terminée{nbFaites > 1 ? 's' : ''}
        </p>

        {/* Formulaire d'ajout d'une tâche.
            "action={createTache}" : Next.js appelle automatiquement cette Server Action
            quand le formulaire est soumis, sans JavaScript côté client à écrire ici */}
        <form action={createTache} className="flex gap-2 mb-6">

          {/* Champ texte. "name='titre'" est la clé que createTache utilise
              pour lire la valeur tapée (formData.get('titre')) */}
          <input
            type="text"
            name="titre"
            placeholder="Nouvelle tâche..."
            required
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-teal-600"
          />

          {/* Bouton d'envoi du formulaire */}
          <button
            type="submit"
            className="bg-teal-500 text-teal-950 font-medium rounded-lg px-4 py-2.5 text-sm hover:bg-teal-400"
          >
            Ajouter
          </button>
        </form>

        {/* On délègue TOUT l'affichage de la liste (+ les filtres) à ce composant.
            On lui passe "taches" (toutes, non filtrées) en tant que prop.
            C'est TacheList qui décidera, côté client, lesquelles afficher
            selon le filtre actif (toutes / à faire / faites) */}
        <TacheList taches={taches} />

      </div>
    </main>
  )
}