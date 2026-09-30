'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent, // n'est pas une fonction — c'est juste une forme d'objet que TypeScript utilise pour vérifier que tu manipules correctement les données.
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

  // Copie locale des tâches, pour pouvoir réordonner visuellement
  // IMMÉDIATEMENT au drag, sans attendre la réponse du serveur
  const [tachesLocales, setTachesLocales] = useState(taches)

  // "sensors" configure comment dnd-kit détecte le début d'un glisser-déposer.
  // PointerSensor fonctionne à la fois avec la souris et le tactile
  const sensors = useSensors(useSensor(PointerSensor))

  // Change de filtre ET remet la pagination à la page 1.
  function changerFiltre(nouveauFiltre: Filtre) {
    setFiltre(nouveauFiltre)
    setPage(1)
  }

  // On calcule la liste filtrée à chaque rendu, selon le filtre actif
  const tachesFiltrees = tachesLocales.filter((tache) => {
    if (filtre === 'a-faire') return !tache.fait
    if (filtre === 'faites') return tache.fait
    return true // 'toutes' : aucun filtrage
  })

  // Calcule le nombre total de pages nécessaires.
  const totalPages = Math.ceil(tachesFiltrees.length / TACHES_PAR_PAGE)

  // Le drag & drop n'est activé que sur la vue complète, sans filtre ni pagination,
  // pour éviter toute ambiguïté sur la position réelle d'une tâche masquée
  const dragActif = filtre === 'toutes' && totalPages <= 1

  const indexDebut = (page - 1) * TACHES_PAR_PAGE
  const indexFin = indexDebut + TACHES_PAR_PAGE
  const tachesAffichees = tachesFiltrees.slice(indexDebut, indexFin)

  // Appelée quand l'utilisateur relâche une tâche après l'avoir glissée
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    // "over" est null si on relâche en dehors de la zone de la liste : on ignore
    if (!over || active.id === over.id) return

    // Retrouve la position de départ et d'arrivée dans le tableau local
    const ancienIndex = tachesLocales.findIndex((t) => t.id === active.id)
    const nouvelIndex = tachesLocales.findIndex((t) => t.id === over.id)

    // arrayMove déplace un élément d'une position à une autre dans un tableau,
    // en renvoyant un NOUVEAU tableau (sans modifier l'original)
    const nouvelOrdre = arrayMove(tachesLocales, ancienIndex, nouvelIndex)

    // Met à jour l'affichage immédiatement, avant même la réponse du serveur
    // (rend l'interface réactive, l'utilisateur voit le résultat tout de suite)
    setTachesLocales(nouvelOrdre)

    // Envoie le nouvel ordre en base, en arrière-plan
    await reordonnerTaches(nouvelOrdre.map((t) => t.id))
  }

  return (
    <div>
  
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

      {/* Petit message explicatif quand le drag est désactivé */}
      {!dragActif && (
        <p className="text-xs text-zinc-600 mb-2">
          Le réordonnement est disponible uniquement sur "Toutes" sans pagination.
        </p>
      )}

      {/* Liste filtrée et paginée, ou message si vide */}
      {tachesAffichees.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-6">
          Aucune tâche dans cette catégorie.
        </p>
      ) : (
        // DndContext englobe toute la zone où le glisser-déposer est possible.
        // "sensors" et "collisionDetection" configurent son comportement,
        // "onDragEnd" est appelé au relâchement
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* SortableContext dit à dnd-kit quels éléments (par leur id) peuvent
              être réordonnés entre eux, et selon quelle stratégie visuelle
              (ici : une liste verticale classique) */}
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

      {/* Contrôles de pagination : affichés seulement s'il y a plus d'une page */}
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