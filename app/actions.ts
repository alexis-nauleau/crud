// Directive Next.js 
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ----- CRÉER UNE TÂCHE -----

// "async" car on va attendre une réponse de la base de données avant de continuer.
export async function createTache(formData: FormData) {
  // Récupère la valeur tapée dans <input name="titre" /> du formulaire
  const titre = formData.get('titre') as string
  const categorieId = formData.get('categorieId') as string
   // Récupère la date choisie dans le champ <input type="date">.
  // Le navigateur envoie une chaîne au format "AAAA-MM-JJ" (ex: "2026-09-30"),
  const dateEcheanceStr = formData.get('dateEcheance') as string

    // Demande à Prisma de créer une nouvelle ligne dans la table Taches
  await prisma.taches.create({
    data: {
      titre,
      // Opérateur ternaire : condition ? valeur_si_vrai : valeur_si_faux
      categorieId: categorieId ? categorieId : null,
      dateEcheance: dateEcheanceStr ? new Date(dateEcheanceStr) : null,
    },
  })

  revalidatePath('/')
}

// ----- MARQUER FAIT / PAS FAIT -----

// Reçoit deux paramètres 
// l'id de la tâche à modifier, et son état actuel (fait ou pas fait)
export async function toggleTache(id: string, fait: boolean) {

  // Modifie la ligne dont l'id correspond exactement (where: { id })
  await prisma.taches.update({
    where: { id },
    data: { fait: !fait }, // "!" = inverse la valeur (true devient false, et inversement)
  })
  revalidatePath('/')
}

// ----- SUPPRIMER UNE TÂCHE -----

// Reçoit uniquement l'id de la tâche à supprimer
export async function deleteTache(id: string) {

  // Supprime définitivement la ligne correspondant à cet id
  await prisma.taches.delete({
    where: { id },
  })

  // Rafraîchit la page pour que la tâche disparaisse visuellement
  revalidatePath('/')
}
 // MODIFIER UNE TACHE
export async function updateTache(id: string, titre: string) {
  await prisma.taches.update({
    where: { id },
    data: { titre },
  })
  revalidatePath('/')
}
