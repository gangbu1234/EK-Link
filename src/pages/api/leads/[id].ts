import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const data = req.body;
    const updated = await prisma.inquiry.update({
      where: { id: String(id) },
      data
    });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    await prisma.inquiry.delete({ where: { id: String(id) } });
    return res.status(204).end();
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
