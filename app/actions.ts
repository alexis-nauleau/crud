// Directive Next.js : tout ce fichier s'exécute UNIQUEMENT côté serveur,
// jamais dans le navigateur du visiteur. Indispensable pour toucher à Prisma
// (et donc à ta base de données) en toute sécurité.
'use server'

// Importe ton client Prisma configuré (connexion à mon_projet_crud)
import { prisma } from '@/lib/prisma'

// Fonction Next.js pour dire "les données de cette page ont changé, recharge-les"
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

  // Dit à Next.js de rafraîchir la page d'accueil ('/')
  // pour que la nouvelle tâche apparaisse immédiatement à l'écran
  revalidatePath('/')
}


// ----- MARQUER FAIT / PAS FAIT -----

// Reçoit deux paramètres classiques (pas un formData ici) :
// l'id de la tâche à modifier, et son état actuel (fait ou pas fait)
export async function toggleTache(id: string, fait: boolean) {

  // Modifie la ligne dont l'id correspond exactement (where: { id })
  await prisma.taches.update({
    where: { id },
    data: { fait: !fait }, // "!" = inverse la valeur (true devient false, et inversement)
  })

  // Rafraîchit la page pour montrer le changement
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


// Rappel important : ces trois fonctions ne sont jamais appelées avec
// onClick={() => ...} comme en React classique. Elles sont branchées
// directement sur l'attribut "action" d'un <form> dans page.tsx :
// <form action={createTache}>
// Next.js intercepte automatiquement la soumission et exécute la fonction
// côté serveur, sans que tu aies besoin d'écrire de fetch() ou d'API route.