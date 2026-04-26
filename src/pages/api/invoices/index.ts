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
      const invoices = await prisma.invoice.findMany({
        orderBy: { id: 'desc' },
      });
      return res.status(200).json(invoices);
    } catch (error: any) {
      console.error('[API/Invoices] Fetch error:', error);
      return res.status(500).json({ message: 'Fetch failed', error: error.message });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const invoice = await prisma.invoice.create({ data });
      return res.status(201).json(invoice);
    } catch (error: any) {
      console.error('[API/Invoices] Creation error details:', error);
      return res.status(500).json({ 
        message: 'Create failed', 
        error: error.message,
      });
    }
  }

  // オールリセット機能用
  if (req.method === 'PATCH') {
    try {
      const { action } = req.body;
      if (action === 'reset_all') {
        await prisma.invoice.updateMany({
          data: { status: '日程決め' }
        });
        return res.status(200).json({ message: 'All invoices reset successfully' });
      }
      return res.status(400).json({ message: 'Invalid action' });
    } catch (error: any) {
      console.error('[API/Invoices] Reset error:', error);
      return res.status(500).json({ message: 'Reset failed', error: error.message });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}
