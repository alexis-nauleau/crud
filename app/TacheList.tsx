'use client'

import { useState } from 'react'
import TacheItem from './TacheItem'

type Tache = {
  id: string
  titre: string
  fait: boolean
}

// Les 3 filtres possibles
type Filtre = 'toutes' | 'a-faire' | 'faites'

export default function TacheList({ taches }: { taches: Tache[] }) {
  const [filtre, setFiltre] = useState<Filtre>('toutes')

  // On calcule la liste filtrée à chaque rendu, selon le filtre actif
  const tachesFiltrees = taches.filter((tache) => {
    if (filtre === 'a-faire') return !tache.fait
    if (filtre === 'faites') return tache.fait
    return true // 'toutes' : aucun filtrage
  })

  return (
    <div>
      {/* Boutons de filtre */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setFiltre('toutes')}
          className={
            filtre === 'toutes'
              ? 'text-xs px-3 py-1.5 rounded-full bg-teal-500 text-teal-950 font-medium'
              : 'text-xs px-3 py-1.5 rounded-full text-zinc-400 hover:bg-zinc-800'
          }
        >
          Toutes
        </button>
        <button
          onClick={() => setFiltre('a-faire')}
          className={
            filtre === 'a-faire'
              ? 'text-xs px-3 py-1.5 rounded-full bg-teal-500 text-teal-950 font-medium'
              : 'text-xs px-3 py-1.5 rounded-full text-zinc-400 hover:bg-zinc-800'
          }
        >
          À faire
        </button>
        <button
          onClick={() => setFiltre('faites')}
          className={
            filtre === 'faites'
              ? 'text-xs px-3 py-1.5 rounded-full bg-teal-500 text-teal-950 font-medium'
              : 'text-xs px-3 py-1.5 rounded-full text-zinc-400 hover:bg-zinc-800'
          }
        >
          Faites
        </button>
      </div>

      {/* Liste filtrée, ou message si vide */}
      {tachesFiltrees.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-6">
          Aucune tâche dans cette catégorie.
        </p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {tachesFiltrees.map((tache) => (
            <TacheItem key={tache.id} tache={tache} />
          ))}
        </div>
      )}
    </div>
  )
}