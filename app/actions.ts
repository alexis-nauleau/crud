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

  // Dit à Next.js de rafraîchir la page d'accueil ('/')
  revalidatePath('/')
}
