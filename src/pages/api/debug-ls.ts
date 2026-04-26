import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const root = process.cwd();
  const prismaDir = path.join(root, 'prisma');
  
  let prismaFiles: string[] = [];
  try {
    prismaFiles = fs.readdirSync(prismaDir);
  } catch (e: any) {
    prismaFiles = [`Error reading prisma dir: ${e.message}`];
  }

  res.status(200).json({
    cwd: root,
    prismaDir,
    prismaFiles,
    env: process.env.DATABASE_URL,
    exists: fs.existsSync(path.join(prismaDir, 'dev.db'))
  });
}
