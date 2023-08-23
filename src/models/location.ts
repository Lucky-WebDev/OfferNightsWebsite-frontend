export type ItemStatus = 'completed' | 'pending' | 'failed';

export interface DataFilter {
  id: number;
  address: string;
  postalCode: string;
  latitude: string;
  longitude: string;
}
