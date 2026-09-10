// Directive Next.js 
'use server'


import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'


// ----- CRÉER UNE TÂCHE -----

// "async" car on va attendre une réponse de la base de données avant de continuer.
// "formData" = objet automatiquement créé par le navigateur quand un <form> est soumis
export async function createTache(formData: FormData) {

  // Récupère la valeur tapée dans <input name="titre" /> du formulaire.
  // "as string" dit à TypeScript : fais-moi confiance, c'est bien du texte
  // (formData.get() renvoie un type plus générique par défaut)
  const titre = formData.get('titre') as string
  
  // Demande à Prisma de créer une nouvelle ligne dans la table Taches.
  // "await" = attendre que l'opération soit vraiment terminée en base
  // avant de passer à la ligne suivante
  await prisma.taches.create({
data: { titre }, // raccourci JS pour { titre: titre }
  })

  // rafraîchir la page d'accueil ('/')
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


