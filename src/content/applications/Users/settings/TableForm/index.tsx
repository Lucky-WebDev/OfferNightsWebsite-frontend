import { Helmet } from 'react-helmet-async';
import { Grid, Container, Card } from '@mui/material';

import RecentOrdersTable from './RecentOrdersTable';

function TableForm() {
  return (
    <>
      <Helmet>
        <title>Your Farming Area</title>
      </Helmet>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card>
              <RecentOrdersTable />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default TableForm;
