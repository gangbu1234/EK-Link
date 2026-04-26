import { PrismaClient } from '@prisma/client'
import { mockInquiries, mockInvoices } from '../src/data/mock'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  for (const inquiry of mockInquiries) {
    await prisma.inquiry.upsert({
      where: { id: inquiry.id },
      update: {},
      create: {
        id: inquiry.id,
        brand: inquiry.brand,
        name: inquiry.name,
        subject: inquiry.subject,
        assignee: inquiry.assignee,
        status: inquiry.status,
        updatedAt: inquiry.updatedAt,
      },
    })
  }

  for (const invoice of mockInvoices) {
    await prisma.invoice.upsert({
      where: { id: invoice.id },
      update: {},
      create: {
        id: invoice.id,
        brand: invoice.brand,
        studentName: invoice.studentName,
        status: invoice.status,
        sentDate: invoice.sentDate || null,
      },
    })
  }
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
