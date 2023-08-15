import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from '../../../components/PageTitleWrapper';
import { Grid, Container, Card } from '@mui/material';
import Footer from '../../../components/Footer';

import { MapContainer, useMapEvents, TileLayer, Circle, Popup, Marker, Polygon } from 'react-leaflet';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBuyers } from '../../../actions/buyerAction';
import RecentOrders from './RecentOrders';
import { StateType } from '../../../reducer/dataType';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../config/marker/buyer-marker.png'),
  iconUrl: require('../../../config/marker/buyer-marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function ApplicationsTransactions() {
  const dispatch: any = useDispatch();
  
  const ZOOM_LEVEL = 9
  const mapRef = useRef()

  const [position, setPosition] = useState({
    lat: null,
    lng: null
  })

  useEffect(() => {
    dispatch(getAllBuyers())
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

  const allBuyerInfo: any = useSelector((state: StateType) => state.auth.allBuyerInfo);
  
  return (
    <>
      <Helmet>
        <title>OFFERNIGHTS | Buyer</title>
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
                {allBuyerInfo.map((buyer) => (
                  <>
                  <Marker key={buyer.id} position={[buyer.lat, buyer.lng]}>
                    <Popup>
                      {buyer.address}
                    </Popup>
                  </Marker>
                  <Polygon positions={[[
                    [Number(buyer.lat)-Number(buyer.radius)/200, Number(buyer.lng)+Number(buyer.radius)/200],
                    [Number(buyer.lat)-Number(buyer.radius)/200, Number(buyer.lng)-Number(buyer.radius)/200],
                    [Number(buyer.lat)+Number(buyer.radius)/200, Number(buyer.lng)-Number(buyer.radius)/200],
                    [Number(buyer.lat)+Number(buyer.radius)/200, Number(buyer.lng)+Number(buyer.radius)/200],
                    [Number(buyer.lat)-Number(buyer.radius)/200, Number(buyer.lng)+Number(buyer.radius)/200],
                  ]]} />
                  </>
                ))}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
              </MapContainer><br />
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
