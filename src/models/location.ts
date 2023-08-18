export type CryptoOrderStatus = 'completed' | 'pending' | 'failed';

export interface CryptoOrder {
  id: number;
  address: string;
  postalCode: string;
  latitude: string;
  longitude: string;
}
