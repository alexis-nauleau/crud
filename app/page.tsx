import { prisma } from '@/lib/prisma'
import { createTache } from './actions'
import TacheList from './TacheList'

// "async" car on va chercher des données en base AVANT d'afficher quoi que ce soit.
export default async function Home() {

  // Récupère TOUTES les tâches de la base, triées par date de création, la plus récente en premier 
  // récupère aussi les infos de la catégorie liée
  const taches = await prisma.taches.findMany({
    orderBy: { dateCreation: 'desc' },
    include: { categorie: true },
  })

  const categories = await prisma.categorie.findMany()

  // Calcule le nombre de tâches marquées comme "faites", pour l'afficher dans le sous-titre.
  // .filter() garde uniquement les éléments du tableau qui remplissent la condition,
  // puis .length compte combien il en reste
  const nbFaites = taches.filter((t) => t.fait).length


  return (

    <main className="max-w-lg mx-auto p-8">
      <div className="bg-zinc-900 rounded-2xl p-8 w-fit">
        <h1 className="text-xl font-medium text-zinc-50 mb-1">Mes tâches</h1>
        <p className="text-sm text-zinc-500 mb-6">
          {taches.length} tâche{taches.length > 1 ? 's' : ''}, {nbFaites} terminée{nbFaites > 1 ? 's' : ''}
        </p>

        {/* "flex-col" empile les lignes verticalement : le titre seul en haut,
            puis catégorie + date + bouton sur une deuxième ligne */}
        <form action={createTache} className="flex flex-col gap-3 mb-6">

          {/* Ligne 1 : le champ titre, seul, pleine largeur */}
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Titre</label>
            <input
              type="text"
              name="titre"
              placeholder="Nouvelle tâche..."
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-teal-600"
            />
          </div>

          {/* Ligne 2 : catégorie et date côte à côte, puis le bouton.
              "items-end" aligne le bouton avec le bas des champs (pas leurs labels) */}
          <div className="flex gap-2 items-end">

            {/* Nouveau : sélecteur de catégorie, avec son label au-dessus */}
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1 block">Catégorie</label>
              <select
                name="categorieId"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-zinc-50"
              >
                <option value="">Sans catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Champ de sélection de date, avec son label au-dessus */}
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1 block">Échéance</label>
              <input
                type="date"
                name="dateEcheance"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-zinc-50"
              />
            </div>

            <button
              type="submit"
              className="bg-teal-500 text-teal-950 font-medium rounded-lg px-4 py-2 text-sm hover:bg-teal-400"
            >
              Ajouter
            </button>
          </div>

        </form>

        <TacheList taches={taches} />
      </div>
    </main>
  )
}