import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '../../../components/Footer';

import RecentOrders from './RecentOrders';
import { useDispatch } from 'react-redux';
import { getAllActiveShowing } from '../../../actions/showingAction';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../config/marker/showing-marker.png'),
  iconUrl: require('../../../config/marker/showing-marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function ApplicationsTransactions() {
  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(getAllActiveShowing());
  }, [])

  return (
    <>
      <Helmet>
        <title>OFFERNIGTHS | Active Showing Agents</title>
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
