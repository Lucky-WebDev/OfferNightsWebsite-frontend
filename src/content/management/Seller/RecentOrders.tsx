import { Card } from '@mui/material';
import { CryptoOrder } from '../../../models/crypto_order';
import RecentOrdersTable from './RecentOrdersTable';
import { subDays } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTypeUsers } from '../../../actions/authAction';
import { StateType } from '../../../reducer/dataType';

function RecentOrders() {
  const allSellerInfo: any = useSelector((state: StateType) => state.auth.allSellerInfo);
  
  const cryptoOrders: CryptoOrder[] = allSellerInfo

  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders ?? []} />
    </Card>
  );
}

export default RecentOrders;
