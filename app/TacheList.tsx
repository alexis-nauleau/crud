'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import TacheItem from './TacheItem'
import { reordonnerTaches } from './actions'

type Tache = {
  id: string
  titre: string
  fait: boolean
  dateEcheance: Date | null
  categorie: { nom: string; couleur: string } | null
}

// Les 3 filtres possibles
type Filtre = 'toutes' | 'a-faire' | 'faites'

// Nombre de tâches affichées par page
const TACHES_PAR_PAGE = 10

export default function TacheList({ taches }: { taches: Tache[] }) {
  const [filtre, setFiltre] = useState<Filtre>('toutes')

  // "page" = le numéro de la page actuellement affichée, commence à 1
  const [page, setPage] = useState(1)

  // Copie locale des tâches, pour pouvoir réordonner visuellement immédiatement au drag
  const [tachesLocales, setTachesLocales] = useState(taches)

  // Texte tapé dans le champ de recherche
  const [recherche, setRecherche] = useState('')

  // Compte combien de tâches sont "en retard" : une date d'échéance déjà dépassée
  // et pas encore marquées comme faites. Calculé sur TOUTES les tâches
  // (tachesLocales), pas seulement celles affichées, pour que le nombre reste
  // exact peu importe le filtre ou la recherche en cours
  const nbEnRetard = tachesLocales.filter(
    (t) => t.dateEcheance && !t.fait && new Date(t.dateEcheance) < new Date()
  ).length

  const sensors = useSensors(useSensor(PointerSensor))

  // Change de filtre ET remet la pagination à la page 1.
  function changerFiltre(nouveauFiltre: Filtre) {
    setFiltre(nouveauFiltre)
    setPage(1)
  }

  // Idem pour la recherche, remet la page à 1 à chaque frappe,
  // sinon on pourrait se retrouver sur une page qui n'a plus de résultat
  function changerRecherche(texte: string) {
    setRecherche(texte)
    setPage(1)
  }

  // On applique d'abord le filtre (toutes/à faire/faites)...
  const tachesFiltrees = tachesLocales.filter((tache) => {
    if (filtre === 'a-faire') return !tache.fait
    if (filtre === 'faites') return tache.fait
    return true
  })

  // ...puis la recherche texte par-dessus. toLowerCase() des deux côtés
  // pour que la recherche ignore la casse ("Courses" trouve "courses")
  const tachesRecherchees = tachesFiltrees.filter((tache) =>
    tache.titre.toLowerCase().includes(recherche.toLowerCase())
  )

  const totalPages = Math.ceil(tachesRecherchees.length / TACHES_PAR_PAGE)

  // Le drag & drop reste limité à la vue complète, sans filtre, recherche ni pagination
  const dragActif = filtre === 'toutes' && recherche === '' && totalPages <= 1

  const indexDebut = (page - 1) * TACHES_PAR_PAGE
  const indexFin = indexDebut + TACHES_PAR_PAGE
  const tachesAffichees = tachesRecherchees.slice(indexDebut, indexFin)

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const ancienIndex = tachesLocales.findIndex((t) => t.id === active.id)
    const nouvelIndex = tachesLocales.findIndex((t) => t.id === over.id)
    const nouvelOrdre = arrayMove(tachesLocales, ancienIndex, nouvelIndex)

    setTachesLocales(nouvelOrdre)
    await reordonnerTaches(nouvelOrdre.map((t) => t.id))
  }

  return (
    <div>
      {/* Champ de recherche par titre */}
      <input
        type="text"
        value={recherche}
        onChange={(e) => changerRecherche(e.target.value)}
        placeholder="Rechercher une tâche..."
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-teal-600 mb-4"
      />

      {/* Nouveau : affiche le nombre de tâches en retard, seulement s'il y en a */}
      {nbEnRetard > 0 && (
        <p className="text-xs text-rose-400 mb-3">
          {nbEnRetard} tâche{nbEnRetard > 1 ? 's' : ''} en retard
        </p>
      )}

      {/* Boutons de filtre */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => changerFiltre('toutes')}
          className={
            filtre === 'toutes'
              ? 'text-xs px-3 py-1.5 rounded-full bg-teal-500 text-teal-950 font-medium'
              : 'text-xs px-3 py-1.5 rounded-full text-zinc-400 hover:bg-zinc-800'
          }
        >
          Toutes
        </button>
        <button
          onClick={() => changerFiltre('a-faire')}
          className={
            filtre === 'a-faire'
              ? 'text-xs px-3 py-1.5 rounded-full bg-teal-500 text-teal-950 font-medium'
              : 'text-xs px-3 py-1.5 rounded-full text-zinc-400 hover:bg-zinc-800'
          }
        >
          À faire
        </button>
        <button
          onClick={() => changerFiltre('faites')}
          className={
            filtre === 'faites'
              ? 'text-xs px-3 py-1.5 rounded-full bg-teal-500 text-teal-950 font-medium'
              : 'text-xs px-3 py-1.5 rounded-full text-zinc-400 hover:bg-zinc-800'
          }
        >
          Faites
        </button>
      </div>

      {!dragActif && (
        <p className="text-xs text-zinc-600 mb-2">
          Le réordonnement est disponible uniquement sur "Toutes" sans recherche ni pagination.
        </p>
      )}

      {tachesAffichees.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-6">
          Aucune tâche ne correspond.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tachesAffichees.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-0.5">
              {tachesAffichees.map((tache) => (
                <TacheItem key={tache.id} tache={tache} dragActif={dragActif} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="text-xs text-zinc-400 hover:text-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          <span className="text-xs text-zinc-500">
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="text-xs text-zinc-400 hover:text-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}