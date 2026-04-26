export type Brand = 'escot' | 'kakitsubata';
export type BrandFilter = 'all' | 'escot' | 'kakitsubata';

export type LeadStatus =
  | '新規問い合わせ'
  | '初メール送付済'
  | '面談・体験授業待ち'
  | '体験後メール送付済'
  | '入塾決定'
  | '追わない';

export interface Inquiry {
  id: string;
  brand: Brand;
  name: string;
  subject: string;
  assignee: string;
  updatedAt: Date;
  status: LeadStatus;
}

export type InvoiceStatus = 
  | '日程決め' 
  | '日程回答待ち' 
  | '請求書出力待ち' 
  | '請求書確認待ち' 
  | '請求書発送待ち' 
  | '発送確認済';

export interface Invoice {
  id: string;
  brand: Brand;
  studentId?: string;
  studentName: string;
  assignee: string;
  status: InvoiceStatus;
  sentDate?: Date;
}
