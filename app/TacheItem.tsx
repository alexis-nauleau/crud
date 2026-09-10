'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check } from 'lucide-react'
import { toggleTache, deleteTache, updateTache } from './actions'

type Tache = {
  id: string
  titre: string
  fait: boolean
}

export default function TacheItem({ tache }: { tache: Tache }) {
  const [enEdition, setEnEdition] = useState(false)
  const [titre, setTitre] = useState(tache.titre)

  async function handleUpdate() {
    await updateTache(tache.id, titre)
    setEnEdition(false)
  }

  return (
    <div className="group flex items-center gap-3 px-2.5 py-3 rounded-xl hover:bg-zinc-800 transition-colors">

      <form action={toggleTache.bind(null, tache.id, tache.fait)}>
        <button
          type="submit"
          className={
            tache.fait
              ? 'w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center'
              : 'w-5 h-5 rounded-full border-[1.5px] border-zinc-600'
          }
        >
          {tache.fait && <Check size={13} className="text-teal-950" />}
        </button>
      </form>

      {enEdition ? (
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="flex-1 bg-transparent text-sm text-zinc-50 border-b border-zinc-600 focus:outline-none"
        />
      ) : (
        <span
          className={
            tache.fait
              ? 'flex-1 text-sm line-through text-zinc-500'
              : 'flex-1 text-sm text-zinc-50'
          }
        >
          {tache.titre}
        </span>
      )}

      {enEdition ? (
        <button
          onClick={handleUpdate}
          className="text-xs text-teal-400 hover:text-teal-300"
        >
          Valider
        </button>
      ) : (
        <button
          onClick={() => setEnEdition(true)}
          aria-label="Modifier"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil size={16} className="text-teal-400 hover:text-teal-300" />
        </button>
      )}

      <form action={deleteTache.bind(null, tache.id)}>
        <button
          type="submit"
          aria-label="Supprimer"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={16} className="text-rose-400 hover:text-rose-300" />
        </button>
      </form>

    </div>
  )
}