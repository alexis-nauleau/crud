import { prisma } from '@/lib/prisma'
import { createTache } from './actions'
import TacheItem from './TacheItem'

export default async function Home() {
  const taches = await prisma.taches.findMany({
    orderBy: { dateCreation: 'desc' },
  })

  const nbFaites = taches.filter((t) => t.fait).length

  return (
    <main className="max-w-lg mx-auto p-20">
      <div className="bg-zinc-900 rounded-2xl p-8">
        <h1 className="text-xl font-medium text-zinc-50 mb-1">Mes tâches</h1>
        <p className="text-sm text-zinc-500 mb-6">
          {taches.length} tâche{taches.length > 1 ? 's' : ''}, {nbFaites} terminée{nbFaites > 1 ? 's' : ''}
        </p>

        <form action={createTache} className="flex gap-2 mb-6">
          <input
            type="text"
            name="titre"
            placeholder="Nouvelle tâche..."
            required
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-teal-600"
          />
          <button
            type="submit"
            className="bg-teal-500 text-teal-950 font-medium rounded-lg px-4 py-2.5 text-sm hover:bg-teal-400"
          >
            Ajouter
          </button>
        </form>

        <div className="flex flex-col gap-0.5">
          {taches.map((tache) => (
            <TacheItem key={tache.id} tache={tache} />
          ))}
        </div>
      </div>
    </main>
  )
}