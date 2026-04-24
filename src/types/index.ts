export type Brand = 'escot' | 'kakitsubata';

export type LeadStatus =
  | '新規問い合わせ'
  | '初メール送付済'
  | '面談・体験授業待ち'
  | '体験後メール送付済'
  | '入塾決定';

export interface Inquiry {
  id: string;
  brand: Brand;
  name: string;
  contact: string;
  subject: string;
  assignee: string;
  updatedAt: Date;
  status: LeadStatus;
}

export type InvoiceStatus = '日程決め' | '作成済み' | '発送済み';

export type PaymentMethod = '振込' | '引落';

export interface Invoice {
  id: string;
  brand: Brand;
  studentName: string;
  targetMonth: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  sentDate?: Date;
}
