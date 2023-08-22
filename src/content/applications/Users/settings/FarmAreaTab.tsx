import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  CardMedia,
  Modal,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  DialogTitle,
  TextField,
  Autocomplete
} from '@mui/material';

import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { styled } from '@mui/material/styles';

import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { useSelector, useDispatch } from 'react-redux';
import { StateType } from '../../../../reducer/dataType';
import { useState, useRef, lazy, Suspense, useMemo, useEffect } from 'react';
import SuspenseLoader from '../../../../components/SuspenseLoader';

import { addLocation, getActiveArea } from '../../../../actions/mapAction';
import { enqueueSnackbar } from 'notistack';
import useDebounce from '../../../../hook/useDebounce';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../../config/marker/farming-marker.png'),
  iconUrl: require('../../../../config/marker/farming-marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

interface AddressType {
  lat: string;
  lon: string;
  label: '';
}

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const TableForm = Loader(
  lazy(
    () => import('../../../../content/applications/Users/settings/TableForm')
  )
);

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
);

const CardCoverAction = styled(Box)(
  ({ theme }) => `
    position: absolute;
    right: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`
);

function FarmAreaTab() {
  const dispatch: any = useDispatch();
  const [position, setPosition] = useState({
    lat: '',
    lng: ''
  });

  const [polygon, setPolygon] = useState([]);

  const [open, setOpen] = useState(false);
  const [addShow, setAddShow] = useState(true);
  const handleOpen = () => {
    setOpen(true);
    setAddShow(true);
  };
  const handleClose = () => setOpen(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const currentUser: any = useSelector((state: StateType) => state.auth.user);
  const myActiveArea: any = useSelector((state: StateType) => state.auth.activeArea);

  const handleClickOpenConfirm = () => {
    if(myActiveArea.length < 4) {
      setOpenConfirm(true);
    } else {
      enqueueSnackbar('You can not select more than 4 active areas')
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  useEffect(() => {
    dispatch(getActiveArea(currentUser._id));
  }, [])

  const [mapInfo, setMapInfo] = useState({
    country: null,
    city: null,
    county: null,
    quarter: null,
    state: null,
    region: null,
    village: null,
    road: null,
    highway: null,
    suburb: null,
    houseNumber: null,
    lat: null,
    lng: null,
    address: null,
    code: null
  });

  const ZOOM_LEVEL = 9;
  const mapRef = useRef();

  const [mapBounds, setMapBounds] = useState([
    [69.5335129, -153.8220681],
    [43.31166455, -56.44995099337655]
  ])

  const MapClickHandler = () => {
    let map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        try {
          // const response = await axios.get(
          //   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          // );
          if(myActiveArea.length >= 4) {
            enqueueSnackbar('You can not any farming area anymore.')
            // handleClose();
            return;
          }

          let url =
            'https://nominatim.openstreetmap.org/reverse?format=jsonv2' +
            '&lat=' +
            lat +
            '&lon=' +
            lng;

          await fetch(url, {
            method: 'GET',
            mode: 'cors'
            // headers: {
            //   "Access-Control-Allow-Origin": "https://nominatim.openstreetmap.org"
            // }
          })
            .then((response) => response.json())
            .then((data) => {
              setMapBounds([
                [lat-10, lng-10],
                [lat+10, lng+10]
              ])
              
              console.log(data);
              const display_name = data.display_name;
              const place_id = data.address.postcode;

              setMapInfo({
                ...mapInfo,
                country: data.address.country,
                state: data.address.state,
                city: data.address.city,
                county: data.address.county,
                region: data.address.region,
                quarter: data.address.quarter,
                village: data.address.village,
                road: data.address.road,
                highway: data.address.highway,
                suburb: data.address.suburb,
                houseNumber: data.address.houseNumber,
                lat: lat,
                lng: lng,
                address: display_name,
                code: place_id
              });

              setAddShow(false)
            })
            .catch((err) => console.log(err));
      
          
          
          setPosition({
            lat: lat,
            lng: lng
          });

          const points = [
            [
              [Number(lat)-Number(currentUser.radius)/200, Number(lng)+Number(currentUser.radius)/200],
              [Number(lat)-Number(currentUser.radius)/200, Number(lng)-Number(currentUser.radius)/200],
              [Number(lat)+Number(currentUser.radius)/200, Number(lng)-Number(currentUser.radius)/200],
              [Number(lat)+Number(currentUser.radius)/200, Number(lng)+Number(currentUser.radius)/200],
              [Number(lat)-Number(currentUser.radius)/200, Number(lng)+Number(currentUser.radius)/200],
            ]
          ];

          setPolygon(points)
        } catch (error) {
          console.log('Error', error);
        }
      }
    });

    return null;
  };

  const onAddLocation = (e) => {
    e.preventDefault();

    const location: any = {
      type: currentUser.type,
      name: currentUser.firstName + ' ' + currentUser.lastName,
      email: currentUser.email,
      cell: currentUser.cell,
      country: mapInfo.country,
      state: mapInfo.state,
      city: mapInfo.city,
      county: mapInfo.county,
      region: mapInfo.region,
      quarter: mapInfo.quarter,
      village: mapInfo.village,
      road: mapInfo.road,
      highway: mapInfo.highway,
      suburb: mapInfo.suburb,
      houseNumber: mapInfo.houseNumber,
      address: mapInfo.address,
      code: mapInfo.code,
      lat: mapInfo.lat,
      lng: mapInfo.lng
    };

    dispatch(addLocation(currentUser._id, location));
    handleClose();
    handleCloseConfirm();
  };

  const user = {
    coverImg: '/static/images/background/map.png',
    avatar: '/static/images/avatars/main.jpg'
  };

  const [inputValue, setInputValue] = useState('');
  const [address, setAddress] = useState<AddressType>({
    lat: '',
    lon: '',
    label: ''
  });
  const [options, setOptions] = useState([]);

  const placeToPosition = async (place) => {
    try {
      let url =
        'https://nominatim.openstreetmap.org/search?format=jsonv2&q=' + place;

      await fetch(url, {
        method: 'GET',
        mode: 'cors'
        // headers: {
        //   "Access-Control-Allow-Origin": "https://o2cj2q.csb.app"
        // }
      })
        .then((response) => response.json())
        .then((data: any) => {
          const options = data.map((item: any) => {
            return { ...item, label: item.display_name };
          });
          setOptions(options);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log('Error', error);
    }
  };

  const positionToPlace = async (lat, lng) => {
    try {
      let url =
        'https://nominatim.openstreetmap.org/reverse?format=jsonv2' +
        '&lat=' +
        lat +
        '&lon=' +
        lng;

      await fetch(url, {
        method: 'GET',
        mode: 'cors'
        // headers: {
        //   "Access-Control-Allow-Origin": "https://o2cj2q.csb.app"
        // }
      })
        .then((response) => response.json())
        .then((data) => {
          const display_name = data.display_name;
          const place_id = data.address.postcode;

          setMapInfo({
            ...mapInfo,
            country: data.address.country,
            state: data.address.state,
            city: data.address.city,
            county: data.address.county,
            region: data.address.region,
            quarter: data.address.quarter,
            village: data.address.village,
            road: data.address.road,
            highway: data.address.highway,
            suburb: data.address.suburb,
            houseNumber: data.address.houseNumber,
            lat: lat,
            lng: lng,
            address: display_name,
            code: place_id
          });
        })
        .catch((err) => console.log(err));

      setPosition({
        lat: lat,
        lng: lng
      });

      setAddShow(false);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const debouncedInput: string = useDebounce<string>(inputValue, 2000);

  useEffect(() => {
    if (debouncedInput) {
      placeToPosition(debouncedInput);
    } else {
      placeToPosition(debouncedInput);
    }
  }, [debouncedInput]);

  useEffect(() => {
    if (address) {
      setPosition({
        lat: address.lat,
        lng: address.lon
      });
      positionToPlace(address.lat, address.lon);
    }
    
  }, [address]);

  const onSelectChange = (newValue) => {
    setAddress(newValue);

    placeToPosition(inputValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Farming Area
              </Typography>
              <Typography variant="subtitle2">
                Add up to 4 areas
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                OpenStreetMap
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                You can select your active area. And then you can click Add
                button.
              </Typography>

              <MapContainer
                bounds={mapBounds}
                style={{ height: '600px', width: '100%' }}
                zoom={ZOOM_LEVEL}
                ref={mapRef}
              >
                <Marker position={position}>
                  <Popup>{mapInfo.address}</Popup>
                </Marker>
                <Polygon positions={[[
                  [Number(position.lat)-Number(currentUser.radius)/200, Number(position.lng)+Number(currentUser.radius)/200],
                  [Number(position.lat)-Number(currentUser.radius)/200, Number(position.lng)-Number(currentUser.radius)/200],
                  [Number(position.lat)+Number(currentUser.radius)/200, Number(position.lng)-Number(currentUser.radius)/200],
                  [Number(position.lat)+Number(currentUser.radius)/200, Number(position.lng)+Number(currentUser.radius)/200],
                  [Number(position.lat)-Number(currentUser.radius)/200, Number(position.lng)+Number(currentUser.radius)/200],
                ]]} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
              </MapContainer>
              <br />

              <Box
                width={'100%'}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Button
                  startIcon={<UploadTwoToneIcon />}
                  disabled={addShow}
                  variant="contained"
                  onClick={handleClickOpenConfirm}
                >
                  Add Location
                </Button>
                <Typography id="modal-modal-title" variant="h6" component="h2" mt={2}>
                  Please input place name and then click correct position. 
                </Typography>
                <Autocomplete
                  value={address}
                  onChange={(event: any, newValue: string | null) => {
                    onSelectChange(newValue);
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  sx={{ width: 600 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Address" />
                  )}
                />
              </Box>
            </Box>
          </Modal>
          <Dialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Active Area</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do you really add new Active area?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirm}>Disagree</Button>
              <Button onClick={onAddLocation} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={8} md={9}>
                  <CardCover>
                    <CardMedia image={user.coverImg} />
                    <CardCoverAction>
                      <label htmlFor="change-cover">
                        <Button
                          startIcon={<UploadTwoToneIcon />}
                          variant="contained"
                          component="span"
                          onClick={handleOpen}
                        >
                          OpenStreetMap
                        </Button>
                      </label>
                    </CardCoverAction>
                  </CardCover>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <TableForm />
      </Grid>
    </Grid>
  );
}

export default FarmAreaTab;
