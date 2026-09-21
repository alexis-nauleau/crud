import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.categorie.createMany({
    data: [
      { nom: 'Travail', couleur: 'blue' },
      { nom: 'Personnel', couleur: 'purple' },
      { nom: 'Ménage', couleur: 'green' },
    ],
  })
  console.log('Catégories créées avec succès')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })