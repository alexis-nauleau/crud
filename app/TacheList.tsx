'use client'

import { useState } from 'react'
import TacheItem from './TacheItem'

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

  // Change de filtre ET remet la pagination à la page 1.
  // Sans ça, si on était sur la page 3 et qu'on change de filtre, on pourrait
  // se retrouver sur une page qui n'existe plus pour ce nouveau filtre
  function changerFiltre(nouveauFiltre: Filtre) {
    setFiltre(nouveauFiltre)
    setPage(1)
  }

  //  liste filtrée à chaque rendu, selon le filtre actif
  const tachesFiltrees = taches.filter((tache) => {
    if (filtre === 'a-faire') return !tache.fait
    if (filtre === 'faites') return tache.fait
    return true // 'toutes' : aucun filtrage
  })

  // Calcule le nombre total de pages nécessaires.
  // Math.ceil arrondit toujours vers le haut : 23 tâches / 10 par page = 2.3 → 3 pages
  const totalPages = Math.ceil(tachesFiltrees.length / TACHES_PAR_PAGE)

  // Calcule quelles tâches afficher sur la page actuelle.
  // Exemple pour la page 2 avec 10 tâches par page : on garde les tâches
  // de l'index 10 à 19 (slice(10, 20))
  const indexDebut = (page - 1) * TACHES_PAR_PAGE
  const indexFin = indexDebut + TACHES_PAR_PAGE
  const tachesAffichees = tachesFiltrees.slice(indexDebut, indexFin)

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

      {/* Liste filtrée et paginée, ou message si vide */}
      {tachesAffichees.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-6">
          Aucune tâche dans cette catégorie.
        </p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {tachesAffichees.map((tache) => (
            <TacheItem key={tache.id} tache={tache} />
          ))}
        </div>
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