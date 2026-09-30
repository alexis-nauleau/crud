'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toggleTache, deleteTache, updateTache } from './actions'

type Tache = {
  id: string
  titre: string
  fait: boolean
  dateEcheance: Date | null
  categorie: { nom: string; couleur: string } | null
}

// "dragActif" vient du parent : dit si la poignée de glisser doit être utilisable
export default function TacheItem({ tache, dragActif }: { tache: Tache; dragActif: boolean }) {
  const [enEdition, setEnEdition] = useState(false)
  const [titre, setTitre] = useState(tache.titre)

  // useSortable connecte ce composant au système de drag & drop de dnd-kit.
  // Il renvoie tout ce qu'il faut pour rendre CET élément déplaçable
  const {
    attributes,   // props d'accessibilité à mettre sur la poignée
    listeners,    // gestionnaires d'événements (mousedown, touchstart...) pour la poignée
    setNodeRef,   // référence à attacher à l'élément déplaçable
    transform,    // décalage visuel pendant le glisser
    transition,   // animation fluide au relâchement
  } = useSortable({ id: tache.id, disabled: !dragActif })

  // Applique le décalage et la transition calculés par dnd-kit en style CSS
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  async function handleUpdate() {
    await updateTache(tache.id, titre)
    setEnEdition(false)
  }

  const enRetard =
    tache.dateEcheance && !tache.fait && new Date(tache.dateEcheance) < new Date()

  const dateFormatee = tache.dateEcheance
    ? new Date(tache.dateEcheance).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    })
    : null

  return (
    // "ref={setNodeRef}" et "style" sont nécessaires sur le conteneur pour
    // que dnd-kit puisse le déplacer visuellement pendant le glisser
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 px-2.5 py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-black/40"
    >

      {/* Poignée de glisser : seule cette icône déclenche le drag,
          pas toute la ligne (évite de gêner les clics sur les autres boutons).
          "attributes" et "listeners" ne sont utiles que si dragActif est vrai */}
      <div
        {...(dragActif ? { ...attributes, ...listeners } : {})}
        className={
          dragActif
            ? 'cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400'
            : 'text-zinc-800 cursor-not-allowed'
        }
        role="button"
        aria-label="Réordonner"
      >
        <GripVertical size={16} />
      </div>

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

      {dateFormatee && (
        <span
          className={
            enRetard
              ? 'text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-400'
              : 'text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400'
          }
        >
          {dateFormatee}
        </span>
      )}

      {tache.categorie && (
        <span
          style={{ backgroundColor: tache.categorie.couleur }}
          className="w-5 h-5 rounded-full shrink-0"
          title={tache.categorie.nom}
        />
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