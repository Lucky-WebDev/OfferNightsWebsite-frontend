import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';

function RecentOrders() {

  const allAgents: any = useSelector((state: StateType) => state.auth.allAgents);
  
  const cryptoOrders: any = allAgents;
  
  return (
    <Card>
      {allAgents == null ? (<RecentOrdersTable cryptoOrders={[]} />) : (<RecentOrdersTable cryptoOrders={cryptoOrders} />)}
    </Card>
  );
}

export default RecentOrders;
