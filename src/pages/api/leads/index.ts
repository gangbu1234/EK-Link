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
    const leads = await prisma.inquiry.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return res.status(200).json(leads);
  }
  
  if (req.method === 'POST') {
    const data = req.body;
    const lead = await prisma.inquiry.create({ data });
    return res.status(201).json(lead);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}
