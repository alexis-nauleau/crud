'use client'

import { useState } from 'react'
import { toggleTache, deleteTache, updateTache } from './actions'

// Type décrivant une tâche, pour que TypeScript sache à quoi s'attendre
type Tache = {
  id: string
  titre: string
  fait: boolean
}

export default function TacheItem({ tache }: { tache: Tache }) {
  // "enEdition" = un booléen qui dit si on affiche le champ modifiable ou le texte normal
  const [enEdition, setEnEdition] = useState(false)
  // "titre" = une copie locale du texte, modifiable pendant l'édition
  const [titre, setTitre] = useState(tache.titre)

  // Appelée quand l'utilisateur valide sa modification
  async function handleUpdate() {
    await updateTache(tache.id, titre)
    setEnEdition(false) // referme le mode édition une fois sauvegardé
  }

  return (
    <li className="flex items-center gap-3 border rounded px-3 py-2">
      
      {enEdition ? (
        // ----- MODE ÉDITION -----
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        />
      ) : (
        // ----- MODE AFFICHAGE NORMAL -----
        <span className={tache.fait ? 'line-through text-gray-400 flex-1' : 'flex-1'}>
          {tache.titre}
        </span>
      )}

      <form action={toggleTache.bind(null, tache.id, tache.fait)}>
        <button type="submit" className="text-sm border px-2 py-1 rounded">
          {tache.fait ? 'Fait' : 'À faire'}
        </button>
      </form>

      {enEdition ? (
        // Bouton pour valider la modification
        <button onClick={handleUpdate} className="text-green-600 text-sm">
          Valider
        </button>
      ) : (
        // Bouton pour activer le mode édition
        <button onClick={() => setEnEdition(true)} className="text-blue-600 text-sm">
          Modifier
        </button>
      )}

      <form action={deleteTache.bind(null, tache.id)}>
        <button type="submit" className="text-red-600 text-sm">
          Supprimer
        </button>
      </form>

    </li>
  )
}