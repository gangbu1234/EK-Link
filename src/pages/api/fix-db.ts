import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Invoiceテーブルに assignee カラムを追加するSQLを直接実行
    // PostgreSQLではダブルクォーテーションでテーブル名を囲む必要があります
    await prisma.$executeRawUnsafe(`ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "assignee" TEXT DEFAULT '未設定'`);
    
    // 他の不足している可能性があるカラム（createdAt, updatedAt）も念のため追加
    await prisma.$executeRawUnsafe(`ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Invoice" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
    
    // Inquiryテーブルに createdAt カラムを追加
    await prisma.$executeRawUnsafe(`ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

    return res.status(200).json({
      status: 'success',
      message: 'Database schema updated successfully.'
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
