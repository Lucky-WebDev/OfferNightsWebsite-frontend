import { Card } from '@mui/material';
import { CryptoOrder } from '../../../models/crypto_order';
import RecentOrdersTable from './RecentOrdersTable';
import { useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';

function RecentOrders() {
  const allActiveShowing: any = useSelector((state: StateType) => state.auth.allActiveShowing);
  
  const cryptoOrders: CryptoOrder[] = allActiveShowing

  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders ?? []} />
    </Card>
  );
}

export default RecentOrders;
