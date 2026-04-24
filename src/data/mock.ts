import { Brand, Inquiry, Invoice, LeadStatus } from '../types';

const now = new Date();
const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

export const mockInquiries: Inquiry[] = [
  { id: '1', brand: 'escot', name: '山田 太郎', contact: '090-1234-5678', subject: '英語', assignee: '鈴木', updatedAt: fourDaysAgo, status: '新規問い合わせ' },
  { id: '2', brand: 'kakitsubata', name: '佐藤 花子', contact: 'sato@example.com', subject: '数学', assignee: '田中', updatedAt: twoDaysAgo, status: '初メール送付済' },
  { id: '3', brand: 'escot', name: '高橋 健太', contact: '080-9876-5432', subject: '国語', assignee: '伊藤', updatedAt: now, status: '面談・体験授業待ち' },
  { id: '4', brand: 'kakitsubata', name: '渡辺 美咲', contact: 'watanabe@example.com', subject: '英語', assignee: '佐藤', updatedAt: fourDaysAgo, status: '体験後メール送付済' },
  { id: '5', brand: 'escot', name: '伊藤 翔', contact: '070-1111-2222', subject: '理科', assignee: '鈴木', updatedAt: twoDaysAgo, status: '入塾決定' },
  { id: '6', brand: 'kakitsubata', name: '中村 結衣', contact: 'nakamura@example.com', subject: '社会', assignee: '田中', updatedAt: now, status: '新規問い合わせ' },
  { id: '7', brand: 'escot', name: '小林 大輔', contact: '090-3333-4444', subject: '数学', assignee: '伊藤', updatedAt: fourDaysAgo, status: '初メール送付済' },
  { id: '8', brand: 'kakitsubata', name: '加藤 さくら', contact: 'kato@example.com', subject: '国語', assignee: '佐藤', updatedAt: twoDaysAgo, status: '面談・体験授業待ち' },
  { id: '9', brand: 'escot', name: '吉田 陸', contact: '080-5555-6666', subject: '英語', assignee: '鈴木', updatedAt: now, status: '体験後メール送付済' },
  { id: '10', brand: 'kakitsubata', name: '山田 葵', contact: 'yamada2@example.com', subject: '理科', assignee: '田中', updatedAt: fourDaysAgo, status: '入塾決定' },
];

export const mockInvoices: Invoice[] = [
  { id: '1', brand: 'escot', studentName: '山田 太郎', targetMonth: '2024-05', amount: 25000, paymentMethod: '振込', status: '日程決め' },
  { id: '2', brand: 'kakitsubata', studentName: '佐藤 花子', targetMonth: '2024-05', amount: 30000, paymentMethod: '引落', status: '作成済み' },
  { id: '3', brand: 'escot', studentName: '高橋 健太', targetMonth: '2024-05', amount: 20000, paymentMethod: '振込', status: '発送済み', sentDate: twoDaysAgo },
  { id: '4', brand: 'kakitsubata', studentName: '渡辺 美咲', targetMonth: '2024-05', amount: 28000, paymentMethod: '引落', status: '日程決め' },
  { id: '5', brand: 'escot', studentName: '伊藤 翔', targetMonth: '2024-05', amount: 22000, paymentMethod: '振込', status: '作成済み' },
  { id: '6', brand: 'kakitsubata', studentName: '中村 結衣', targetMonth: '2024-05', amount: 35000, paymentMethod: '引落', status: '発送済み', sentDate: now },
  { id: '7', brand: 'escot', studentName: '小林 大輔', targetMonth: '2024-05', amount: 24000, paymentMethod: '振込', status: '日程決め' },
  { id: '8', brand: 'kakitsubata', studentName: '加藤 さくら', targetMonth: '2024-05', amount: 32000, paymentMethod: '引落', status: '作成済み' },
  { id: '9', brand: 'escot', studentName: '吉田 陸', targetMonth: '2024-05', amount: 21000, paymentMethod: '振込', status: '発送済み', sentDate: fourDaysAgo },
  { id: '10', brand: 'kakitsubata', studentName: '山田 葵', targetMonth: '2024-05', amount: 27000, paymentMethod: '引落', status: '日程決め' },
];
