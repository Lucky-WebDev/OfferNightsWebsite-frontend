import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';

function RecentOrders() {
  const allAgents: any = useSelector(
    (state: StateType) => state.auth.allAgents
  );

  const tableItems: any = allAgents;

  return (
    <Card>
      {allAgents == null ? (
        <RecentOrdersTable tableItems={[]} />
      ) : (
        <RecentOrdersTable tableItems={tableItems} />
      )}
    </Card>
  );
}

export default RecentOrders;
