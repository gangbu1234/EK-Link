import { Brand, Inquiry, Invoice, LeadStatus } from '../types';

const now = new Date();
const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

export const mockInquiries: Inquiry[] = [
  { id: '1', brand: 'escot', name: '山田 太郎', subject: '英語', assignee: '鈴木', updatedAt: fourDaysAgo, status: '新規問い合わせ' },
  { id: '2', brand: 'kakitsubata', name: '佐藤 花子', subject: '数学', assignee: '田中', updatedAt: twoDaysAgo, status: '初メール送付済' },
  { id: '3', brand: 'escot', name: '高橋 健太', subject: '国語', assignee: '伊藤', updatedAt: now, status: '面談・体験授業待ち' },
  { id: '4', brand: 'kakitsubata', name: '渡辺 美咲', subject: '英語', assignee: '佐藤', updatedAt: fourDaysAgo, status: '体験後メール送付済' },
  { id: '5', brand: 'escot', name: '伊藤 翔', subject: '理科', assignee: '鈴木', updatedAt: twoDaysAgo, status: '入塾決定' },
  { id: '6', brand: 'kakitsubata', name: '中村 結衣', subject: '社会', assignee: '田中', updatedAt: now, status: '新規問い合わせ' },
  { id: '7', brand: 'escot', name: '小林 大輔', subject: '数学', assignee: '伊藤', updatedAt: fourDaysAgo, status: '初メール送付済' },
  { id: '8', brand: 'kakitsubata', name: '加藤 さくら', subject: '国語', assignee: '佐藤', updatedAt: twoDaysAgo, status: '面談・体験授業待ち' },
  { id: '9', brand: 'escot', name: '吉田 陸', subject: '英語', assignee: '鈴木', updatedAt: now, status: '体験後メール送付済' },
  { id: '10', brand: 'kakitsubata', name: '山田 葵', subject: '理科', assignee: '田中', updatedAt: fourDaysAgo, status: '入塾決定' },
];

export const mockInvoices: Invoice[] = [
  { id: '1', brand: 'escot', studentName: '山田 太郎', assignee: '岡部', status: '日程決め' },
  { id: '2', brand: 'kakitsubata', studentName: '佐藤 花子', assignee: '夏井', status: '日程回答待ち' },
  { id: '3', brand: 'escot', studentName: '高橋 健太', assignee: '高野', status: '発送確認済', sentDate: twoDaysAgo },
  { id: '4', brand: 'kakitsubata', studentName: '渡辺 美咲', assignee: '甲田', status: '請求書出力待ち' },
  { id: '5', brand: 'escot', studentName: '伊藤 翔', assignee: '岡部', status: '請求書確認待ち' },
  { id: '6', brand: 'kakitsubata', studentName: '中村 結衣', assignee: '夏井', status: '発送確認済', sentDate: now },
  { id: '7', brand: 'escot', studentName: '小林 大輔', assignee: '高野', status: '日程決め' },
  { id: '8', brand: 'kakitsubata', studentName: '加藤 さくら', assignee: '甲田', status: '請求書発送待ち' },
  { id: '9', brand: 'escot', studentName: '吉田 陸', assignee: '岡部', status: '発送確認済', sentDate: fourDaysAgo },
  { id: '10', brand: 'kakitsubata', studentName: '山田 葵', assignee: '夏井', status: '日程決め' },
];
