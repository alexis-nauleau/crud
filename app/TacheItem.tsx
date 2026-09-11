// Directive Next.js : ce composant s'exécute AUSSI dans le navigateur (pas que sur le
// serveur), car il a besoin de useState pour gérer l'interactivité en temps réel
// (basculer entre affichage normal et mode édition)
'use client'

// Hook React qui permet de "retenir" une valeur entre les rendus du composant
import { useState } from 'react'

// Icônes utilisées pour les boutons (crayon, poubelle, coche)
import { Pencil, Trash2, Check } from 'lucide-react'

// Les Server Actions qu'on appelle depuis ce composant client
import { toggleTache, deleteTache, updateTache } from './actions'

// Décrit la forme attendue d'une tâche, pour que TypeScript vérifie qu'on utilise
// bien les bonnes propriétés (id, titre, fait) sans faute de frappe
type Tache = {
  id: string
  titre: string
  fait: boolean
}

// Le composant reçoit une seule tâche en "prop" (donnée transmise par le parent, ici TacheList)
export default function TacheItem({ tache }: { tache: Tache }) {

  // "enEdition" = est-ce qu'on affiche le champ modifiable ou le texte normal ?
  // useState renvoie toujours une paire : [valeur actuelle, fonction pour la changer]
  const [enEdition, setEnEdition] = useState(false)

  // "titre" = une copie locale et modifiable du texte, initialisée avec le titre actuel.
  // On ne modifie jamais directement "tache.titre" (qui vient de la base) pendant la saisie
  const [titre, setTitre] = useState(tache.titre)

  // Fonction appelée quand l'utilisateur clique sur "Valider" après avoir modifié le texte
  async function handleUpdate() {
    await updateTache(tache.id, titre) // envoie le nouveau titre à la base via Prisma
    setEnEdition(false) // referme le mode édition une fois la sauvegarde faite
  }

  return (
    // "group" permet à ce conteneur de servir de référence pour "group-hover" plus bas
    // (les icônes n'apparaissent que quand on survole CETTE ligne précise)
    <div className="group flex items-center gap-3 px-2.5 py-3 rounded-xl hover:bg-zinc-800 transition-colors">

      {/* Bouton rond pour marquer fait/pas fait.
          Toujours dans un <form> avec .bind() pour pré-attacher l'id et l'état actuel
          à toggleTache avant qu'elle soit appelée au clic */}
      <form action={toggleTache.bind(null, tache.id, tache.fait)}>
        <button
          type="submit"
          className={
            tache.fait
              ? 'w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center'
              : 'w-5 h-5 rounded-full border-[1.5px] border-zinc-600'
          }
        >
          {/* La coche ne s'affiche que si la tâche est faite */}
          {tache.fait && <Check size={13} className="text-teal-950" />}
        </button>
      </form>

      {/* Affichage conditionnel : soit le champ de saisie (mode édition),
          soit le texte simple (mode normal) */}
      {enEdition ? (
        <input
          type="text"
          value={titre} // valeur contrôlée par le state React, pas par le DOM directement
          onChange={(e) => setTitre(e.target.value)} // met à jour le state à chaque frappe
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

      {/* Bouton Modifier/Valider, selon le mode actuel */}
      {enEdition ? (
        <button
          onClick={handleUpdate} // appel direct de la fonction, pas de <form> ici
          className="text-xs text-teal-400 hover:text-teal-300"
        >
          Valider
        </button>
      ) : (
        <button
          onClick={() => setEnEdition(true)} // passe simplement enEdition à true
          aria-label="Modifier" // texte lu par les lecteurs d'écran (accessibilité)
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil size={16} className="text-teal-400 hover:text-teal-300" />
        </button>
      )}

      {/* Bouton supprimer, toujours via un <form> + .bind() comme pour toggleTache */}
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