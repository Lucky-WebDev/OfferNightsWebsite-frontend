export type ItemStatus = 'completed' | 'pending' | 'failed';

export interface DataFilter {
  id: string;
  status: ItemStatus;
  orderDetails: string;
  orderDate: number;
  orderID: string;
  sourceName: string;
  sourceDesc: string;
  amountCrypto: number;
  amount: number;
  cryptoCurrency: string;
  currency: string;
}
