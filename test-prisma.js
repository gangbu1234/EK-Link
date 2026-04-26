const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.invoice.create({
      data: {
        brand: 'escot',
        studentName: 'Test Script',
        studentId: '999-script',
        targetMonth: '2026-04',
        amount: 1000,
        paymentMethod: '振込',
        status: '作成済み'
      }
    });
    console.log('Success:', res);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
