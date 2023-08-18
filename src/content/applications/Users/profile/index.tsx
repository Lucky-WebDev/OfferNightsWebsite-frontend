import { Helmet } from 'react-helmet-async';
import Footer from '../../../../components/Footer';

import { Grid, Container } from '@mui/material';

import ProfileCover from './ProfileCover';
import RecentActivity from './RecentActivity';
import MyCards from './MyCards';
import Addresses from './Addresses';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllAgents } from '../../../../actions/mapAction';
import { getAllSeller } from '../../../../actions/sellerAction';
import { getAllBuyers } from '../../../../actions/buyerAction';

function ManagementUserProfile() {
  const user = {
    savedCards: 7,
    name: 'Catherine Pike',
    coverImg: '/static/images/houses/main.jpg',
    avatar: '/static/images/avatars/main.jpg',
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage",
    jobtitle: 'Web Developer',
    location: 'Barcelona, Spain',
    followers: '465'
  };

  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(getAllAgents());
  }, [])
  
  useEffect(() => {
    dispatch(getAllBuyers());
  }, [])

  useEffect(() => {
    dispatch(getAllSeller());
  }, [])

  return (
    <div className="font-face-gm">
      <Helmet>
        <title>OFFERNIGHTS | Profile</title>
      </Helmet>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={8}>
            <ProfileCover user={user} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid>
          <Grid item xs={12} md={7}>
            <MyCards />
          </Grid>
          <Grid item xs={12} md={5}>
            <Addresses />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
}

export default ManagementUserProfile;
