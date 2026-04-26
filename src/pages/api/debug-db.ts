import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const leadCount = await prisma.inquiry.count();
    const invoiceCount = await prisma.invoice.count();
    const latestLeads = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' }
    });
    
    return res.status(200).json({
      database: 'connected',
      counts: {
        leads: leadCount,
        invoices: invoiceCount
      },
      latestLeads
    });
  } catch (error: any) {
    return res.status(500).json({
      database: 'error',
      message: error.message
    });
  }
}
