import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';

function RecentOrders() {
  // const dispatch: any = useDispatch()

  // useEffect(() => {
  //   dispatch(getTypeUsers('buyer'))
  // }, [])

  const allAgents: any = useSelector((state: StateType) => state.auth.allAgents);
  
  const cryptoOrders: any = allAgents;
  
  return (
    <Card>
      {allAgents == null ? (<RecentOrdersTable cryptoOrders={[]} />) : (<RecentOrdersTable cryptoOrders={cryptoOrders} />)}
    </Card>
  );
}

export default RecentOrders;
