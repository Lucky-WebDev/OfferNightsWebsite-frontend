import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import {useEffect} from 'react';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '../../../components/Footer';

import RecentOrders from './RecentOrders';
import { useDispatch } from 'react-redux';
import { getAllSeller } from '../../../actions/sellerAction';

function ApplicationsTransactions() {
  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(getAllSeller());
  }, [])

  return (
    <>
      <Helmet>
        <title>OFFERNIGHTS | Seller</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsTransactions;
