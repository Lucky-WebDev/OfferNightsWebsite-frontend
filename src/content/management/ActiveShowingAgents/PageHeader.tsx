import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';

function PageHeader() {
  const currentUser: any = useSelector((state: StateType) => state.auth.user);

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Active Showing Agents
        </Typography>
        <Typography variant="subtitle2">
          {currentUser.firstName + ' ' + currentUser.lastName}, these are all active showing agents.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
