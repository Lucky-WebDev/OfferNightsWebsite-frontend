import { Card } from '@mui/material';
import { DataFilter } from '../../../models/data_filter';
import RecentOrdersTable from './RecentOrdersTable';
import { useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';

function RecentOrders() {
  const allActiveShowing: any = useSelector(
    (state: StateType) => state.auth.allActiveShowing
  );

  const tableItems: DataFilter[] = allActiveShowing;

  return (
    <Card>
      <RecentOrdersTable tableItems={tableItems ?? []} />
    </Card>
  );
}

export default RecentOrders;
