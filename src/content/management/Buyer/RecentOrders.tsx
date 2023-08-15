import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';

function RecentOrders() {

  const allBuyerInfo: any = useSelector((state: StateType) => state.auth.allBuyerInfo);
  
  const cryptoOrders: any = allBuyerInfo;
  
  return (
    <Card>
      {allBuyerInfo == null ? (<RecentOrdersTable cryptoOrders={[]} />) : (<RecentOrdersTable cryptoOrders={cryptoOrders} />)}
    </Card>
  );
}

export default RecentOrders;
