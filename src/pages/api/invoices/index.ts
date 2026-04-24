import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const invoices = await prisma.invoice.findMany({
      orderBy: { id: 'desc' },
    });
    return res.status(200).json(invoices);
  }
  
  if (req.method === 'POST') {
    const data = req.body;
    const invoice = await prisma.invoice.create({ data });
    return res.status(201).json(invoice);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}
