import { useState, ChangeEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from '../../../../components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid } from '@mui/material';
import Footer from '../../../../components/Footer';
import { styled } from '@mui/material/styles';

import ActivityTab from './ActivityTab';
import EditProfileTab from './EditProfileTab';
import FarmAreaTab from './FarmAreaTab';
import SecurityTab from './SecurityTab';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveArea } from '../../../../actions/mapAction';
import { StateType } from '../../../../reducer/dataType';
import ActiveShowingTab from './ActiveShowingTab';
import { getMyActiveShowing } from '../../../../actions/showingAction';
import BillingTab from './BillingTab';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUserSettings() {
  const [currentTab, setCurrentTab] = useState<string>('activity');

  const tabs = [
    { value: 'activity', label: 'Activity' },
    { value: 'edit_profile', label: 'Edit Profile' },
    { value: 'farming_area', label: 'Farming Area' },
    { value: 'active_showing', label: 'Active Showing' },
    // { value: 'notifications', label: 'Notifications' },
    { value: 'security', label: 'Passwords/Security' },
    { value: 'billing', label: 'Billing' }
  ];

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const dispatch: any = useDispatch()

  const currentUser: any = useSelector((state: StateType) => state.auth.user);

  dispatch(getActiveArea(currentUser._id))
  dispatch(getMyActiveShowing(currentUser._id))

  return (
    <>
      <Helmet>
        <title>OfferNights | Profile Setting</title>
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
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === 'activity' && <ActivityTab />}
            {currentTab === 'edit_profile' && <EditProfileTab />}
            {currentTab === 'farming_area' && <FarmAreaTab />}
            {currentTab === 'active_showing' && <ActiveShowingTab />}
            {/* {currentTab === 'notifications' && <NotificationsTab />} */}
            {currentTab === 'security' && <SecurityTab />}
            {currentTab === 'billing' && <BillingTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserSettings;
