import { prisma } from '@/lib/prisma'
import { createTache } from './actions'
import TacheItem from './TacheItem'

export default async function Home() {
  const taches = await prisma.taches.findMany({
    orderBy: { dateCreation: 'desc' },
  })

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Mes tâches</h1>

      <form action={createTache} className="flex gap-2 mb-8">
        <input
          type="text"
          name="titre"
          placeholder="Nouvelle tâche..."
          required
          className="border rounded px-3 py-2 flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </form>

      <ul className="space-y-2">
        {taches.map((tache) => (
          <TacheItem key={tache.id} tache={tache} />
        ))}
      </ul>
    </main>
  )
}