import { Card } from '@mui/material';
import { CryptoOrder } from '../../../models/crypto_order';
import RecentOrdersTable from './RecentOrdersTable';
import { subDays } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTypeUsers } from '../../../actions/authAction';
import { StateType } from '../../../reducer/dataType';

function RecentOrders() {
  const allActiveShowing: any = useSelector((state: StateType) => state.auth.allActiveShowing);
  
  const cryptoOrders: CryptoOrder[] = allActiveShowing

  return (
    <Card>
      {/* {allActiveShowing == null ? (<RecentOrdersTable cryptoOrders={[]} />) : (<RecentOrdersTable cryptoOrders={cryptoOrders} />)} */}
      <RecentOrdersTable cryptoOrders={cryptoOrders ?? []} />
    </Card>
  );
}

export default RecentOrders;
