import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';

function RecentOrders() {
  const allBuyerInfo: any = useSelector(
    (state: StateType) => state.auth.allBuyerInfo
  );

  const tableItems: any = allBuyerInfo;

  return (
    <Card>
      {allBuyerInfo == null ? (
        <RecentOrdersTable tableItems={[]} />
      ) : (
        <RecentOrdersTable tableItems={tableItems} />
      )}
    </Card>
  );
}

export default RecentOrders;
