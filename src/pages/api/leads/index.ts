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
    try {
      const leads = await prisma.inquiry.findMany({
        orderBy: { updatedAt: 'desc' },
      });
      return res.status(200).json(leads);
    } catch (error: any) {
      console.error('[API/Leads] Fetch error:', error);
      return res.status(500).json({ message: 'Fetch failed', error: error.message });
    }
  }
  
  if (req.method === 'POST') {
    try {
      console.log('[API/Leads] Creating with data:', req.body);
      const data = req.body;
      const lead = await prisma.inquiry.create({ data });
      console.log('[API/Leads] Created successfully:', lead.id);
      return res.status(201).json(lead);
    } catch (error: any) {
      console.error('[API/Leads] Creation error details:', error);
      return res.status(500).json({ 
        message: 'Create failed', 
        error: error.message,
        details: error.code || 'No error code'
      });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}
