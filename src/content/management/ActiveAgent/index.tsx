import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import { Grid, Container, Card } from '@mui/material';
import Footer from '../../../components/Footer';

import { MapContainer, useMapEvents, TileLayer, Circle, Popup } from 'react-leaflet';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAgents } from '../../../actions/mapAction';
import RecentOrders from './RecentOrders';
import { StateType } from '../../../reducer/dataType';

function ApplicationsTransactions() {
  const dispatch: any = useDispatch();
  
  // const [center, setCenter] = useState({ lat: 53.00875725, lng: -102.34691034378578 })
  const ZOOM_LEVEL = 9
  const mapRef = useRef()

  const [position, setPosition] = useState({
    lat: null,
    lng: null
  })

  // dispatch(getAllAgents())

  useEffect(() => {
    dispatch(getAllAgents())
  }, [])

  const MapClickHandler = () => {
    let map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
  
        try {
          let url = "https://nominatim.openstreetmap.org/reverse?format=json" +"&lat=" + lat + "&lon=" + lng;
              
          await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
              "Access-Control-Allow-Origin": "https://o2cj2q.csb.app"
            }
          })
            .then((response) => response.json())
            .then((data) => {
              setPosition({
                lat,
                lng
              })
            });
        } catch (error) {
          console.log('Error', error);
        }
      },
    });
    return null;
  }

  const mapBounds: any = [[69.5335129, -153.8220681], [43.31166455, -56.44995099337655]];

  const location = [ 28.365724898272077, -81.55254364013672 ];
  const zoom = 14;
  const epcotCenter = [ 28.373711392892478, -81.54936790466309 ];

  const allAgents: any = useSelector((state: StateType) => state.auth.activeArea);
  console.log(allAgents)
  
  return (
    <>
      <Helmet>
        <title>OfferNights | Active Agents</title>
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
            <Card>
              <MapContainer bounds={mapBounds} style={{ height: '650px', width: '100%' }} zoom={ZOOM_LEVEL} ref={mapRef}>
                {allAgents && allAgents.map((agent, index) => {
                    <Circle center={[agent.lat, agent.lng]} pathOptions={{color: 'red'}}>
                      <Popup>
                        {index}
                      </Popup>
                    </Circle>
                })}
                
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
              </MapContainer><br />
              {/* <Map center={location} zoom={zoom}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
                <Circle color="magenta" center={epcotCenter} radius={400} />
              </Map> */}
            </Card>
          </Grid>
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
