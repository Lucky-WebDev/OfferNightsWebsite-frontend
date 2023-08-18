import {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Button,
  TextField,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Select,
  MenuItem,
  Autocomplete
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents
} from 'react-leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { StateType } from '../../../../reducer/dataType';
import isEmpty from '../../../../validation/is-empty';

import LoadingSpinner from '../../../../components/Loader';

import L from 'leaflet';
import {
  addBuyerLocation,
  getMyBuyerLocation
} from '../../../../actions/buyerAction';
import BuyerLocationTable from './TableForm/BuyerLocationTable';
import useDebounce from '../../../../hook/useDebounce';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../../config/marker/buyer-marker.png'),
  iconUrl: require('../../../../config/marker/buyer-marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

interface AddressType {
  lat: string;
  lon: string;
  label: '';
}

function BuyerAreaTab() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [mapOpen, setMapOpen] = useState(false);
  const handleMapOpen = () => setMapOpen(true);
  const handleMapClose = () => setMapOpen(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleClickOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const currentUser: any = useSelector((state: StateType) => state.auth.user);

  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(getMyBuyerLocation(currentUser._id));
  }, [])

  const mapBounds: any = [
    [69.5335129, -133.8220681],
    [47.31166455, -56.44995099337655]
  ];
  const ZOOM_LEVEL = 10;
  const mapRef = useRef();

  const [position, setPosition] = useState({
    lat: '',
    lng: ''
  });

  const [buyerInfo, setBuyerInfo] = useState({
    youRealtor: null,
    withRealtor: null,
    typeHouse: null,
    interestCity: null,
    mortage: null,
    phone: null,
    country: null,
    state: null,
    city: null,
    county: null,
    region: null,
    quarter: null,
    village: null,
    road: null,
    houseNumber: null,
    highway: null,
    suburb: null,
    address: null,
    code: null,
    lat: null,
    lng: null
  });

  const [addShow, setAddShow] = useState(true);
  const [progress, setProgress] = useState(false);

  const [options, setOptions] = useState([]);

  const MapClickHandler = () => {
    let map = useMapEvents({
      click: async (e) => {
        setProgress(true);
        const { lat, lng } = e.latlng;
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
            .then((data: any) => {
              const display_name = data.display_name;
              const place_id = data.address.postcode;

              setBuyerInfo({
                ...buyerInfo,
                country: data.address.country,
                state: data.address.state,
                city: data.address.city,
                county: data.address.county,
                region: data.address.region,
                quarter: data.address.quarter,
                village: data.address.village,
                road: data.address.road,
                houseNumber: data.address.houseNumber,
                highway: data.address.highway,
                suburb: data.address.suburb,
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
          setProgress(false);
        } catch (error) {
          console.log('Error', error);
        }
      }
    });

    return null;
  };

  const onChange = (e) => {
    setBuyerInfo({
      ...buyerInfo,
      [e.target.name]: e.target.value
    });
  };

  const onSaveActiveShowing = (e) => {
    e.preventDefault();

    handleCloseConfirm();

    if (isEmpty(buyerInfo.youRealtor)) {
      enqueueSnackbar("Please answer 'Are you a realtor?'.");
      return;
    }
    if (isEmpty(buyerInfo.address)) {
      enqueueSnackbar('Please select or fill the current address.');
      return;
    }
    if (isEmpty(buyerInfo.withRealtor)) {
      enqueueSnackbar("Please answer 'Are you working with a realtor?'.");
      return;
    }
    if (isEmpty(buyerInfo.typeHouse)) {
      enqueueSnackbar('Please fill the type of house you are looking for.');
      return;
    }
    if (isEmpty(buyerInfo.interestCity)) {
      enqueueSnackbar('Please select city you are interested in.');
      return;
    }
    if (isEmpty(buyerInfo.mortage)) {
      enqueueSnackbar("Please answer 'Do you have approved mortage?'.");
      return;
    }
    if (isEmpty(buyerInfo.phone)) {
      enqueueSnackbar('Please fill the best way communicate with you.');
      return;
    }

    const buyerRequest = {
      userId: currentUser._id,
      name: currentUser.firstName + ' ' + currentUser.lastName,
      country: buyerInfo.country,
      state: buyerInfo.state,
      city: buyerInfo.city,
      county: buyerInfo.county,
      region: buyerInfo.region,
      quarter: buyerInfo.quarter,
      village: buyerInfo.village,
      road: buyerInfo.road,
      highway: buyerInfo.highway,
      suburb: buyerInfo.suburb,
      houseNumber: buyerInfo.houseNumber,
      address: buyerInfo.address,
      code: buyerInfo.code,
      lat: buyerInfo.lat,
      lng: buyerInfo.lng,
      youRealtor: buyerInfo.youRealtor,
      withRealtor: buyerInfo.withRealtor,
      typeHouse: buyerInfo.typeHouse,
      interestCity: buyerInfo.interestCity,
      mortage: buyerInfo.mortage,
      phone: buyerInfo.phone,
      radius: currentUser.radius
    };

    handleClose();
    dispatch(addBuyerLocation(buyerRequest));
  };

  const [address, setAddress] = useState<AddressType>({
    lat: '0',
    lon: '0',
    label: ''
  });

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

          setBuyerInfo({
            ...buyerInfo,
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
      setProgress(false);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const placeToPosition = async (place) => {
    try {
      let url =
        'https://nominatim.openstreetmap.org/search?format=json&q=' +
        place +
        '&limit=20';

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

  const [place, setPlace] = useState({
    street: '',
    city: '',
    county: '',
    state: '',
    code: ''
  });

  const onPlaceChange = (e) => {
    setPlace({
      ...place,
      [e.target.name]: e.target.value
    });
  };

  const [inputValue, setInputValue] = useState('');
  const debouncedInput: string = useDebounce<string>(inputValue, 2000);

  useEffect(() => {
    if (debouncedInput) {
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
    console.log(newValue)
    setAddress(newValue);
    // placeToPosition(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4} spacing={1} container>
              <Grid item xs={12} sm={12} md={12}>
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
                    renderInput={(params) => (
                      <TextField {...params} label="Address" />
                    )}
                  />
                </Grid>
                <Divider orientation="horizontal" />
                <Grid item xs={12}>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="House Name | Street"
                      required
                      name="street"
                      value={buyerInfo.houseNumber ?? '' + buyerInfo.road ?? '' + buyerInfo.highway ?? '' + buyerInfo.suburb ?? ''}
                      onChange={onPlaceChange}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="City"
                      required
                      name="city"
                      value={buyerInfo.city ?? ''}
                      onChange={onPlaceChange}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="County"
                      required
                      name="county"
                      value={buyerInfo.county ?? ''}
                      onChange={onPlaceChange}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="State"
                    required
                    name="state"
                    value={buyerInfo.state ?? ''}
                    onChange={onPlaceChange}
                    disabled
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Postal Code"
                    required
                    name="code"
                    value={buyerInfo.code ?? ''}
                    onChange={onPlaceChange}
                    disabled
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider orientation="horizontal" />
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      mt={2}
                    >
                      *Are you listing a agent?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={buyerInfo.youRealtor}
                      name="youRealtor"
                      label="*Are you a realtor?"
                      onChange={onChange}
                      defaultValue={'Yes'}
                      fullWidth
                    >
                      <MenuItem value={'Yes'}>Yes</MenuItem>
                      <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      mt={2}
                    >
                      *Are you working with a realtor?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={buyerInfo.withRealtor}
                      name="withRealtor"
                      label="*Are you working with a realtor?"
                      onChange={onChange}
                      defaultValue={'Yes'}
                      fullWidth
                    >
                      <MenuItem value={'Yes'}>Yes</MenuItem>
                      <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      mt={2}
                    >
                      *Type of house you are looking for?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={buyerInfo.typeHouse}
                      name="typeHouse"
                      onChange={onChange}
                      defaultValue={'Yes'}
                      fullWidth
                    >
                      <MenuItem value={'Condo'}>Condo</MenuItem>
                      <MenuItem value={'Townhouse'}>Townhouse</MenuItem>
                      <MenuItem value={'House'}>House</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12}>
                    <TextField
                      label="*What city are you interested in?"
                      name="interestCity"
                      value={buyerInfo.interestCity}
                      onChange={onChange}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      mt={2}
                    >
                      *Do you have approved mortage?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={buyerInfo.mortage}
                      name="mortage"
                      onChange={onChange}
                      defaultValue={'Yes'}
                      fullWidth
                    >
                      <MenuItem value={'Yes'}>Yes</MenuItem>
                      <MenuItem value={'No'}>No</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      mt={2}
                    >
                      Best way to communicate with you
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={buyerInfo.phone}
                      name="phone"
                      onChange={onChange}
                      defaultValue={'Yes'}
                      fullWidth
                    >
                      <MenuItem value={'Phone'}>Phone</MenuItem>
                      <MenuItem value={'Text'}>Text</MenuItem>
                      <MenuItem value={'Email'}>Email</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} spacing={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Grid item xs={12} pt={1} sm={12} md={12}>
                        <SnackbarProvider
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                          }}
                        ></SnackbarProvider>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleClickOpenConfirm}
                        >
                          Add your property
                        </Button>
                        <Dialog
                          open={openConfirm}
                          onClose={handleCloseConfirm}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            Seller Area
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Do you really add new seller area?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseConfirm}>
                              Disagree
                            </Button>
                            <Button onClick={onSaveActiveShowing} autoFocus>
                              Agree
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <MapContainer
                  bounds={mapBounds}
                  style={{ height: '100%', width: '100%' }}
                  zoom={ZOOM_LEVEL}
                  ref={mapRef}
                >
                  {progress ? (
                    <LoadingSpinner loading={progress} />
                  ) : (
                    <>
                      <MapClickHandler />
                      <Marker position={[position.lat, position.lng]}>
                        <Popup>{buyerInfo.address}</Popup>
                      </Marker>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </>
                  )}
                </MapContainer>
              </Grid>
            </Grid>
          </Box>
        </Modal>
        <Card>
          <List>
            <ListItem sx={{ p: 3 }}>
              <ListItemText
                primaryTypographyProps={{ variant: 'h3', gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: 'subtitle2',
                  lineHeight: 1
                }}
                primary="Add Area for buying"
                secondary="You can add your area for buying."
              />
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
              ></SnackbarProvider>
              <Button size="large" variant="outlined" onClick={handleOpen}>
                <AddLocationAltIcon /> Buying Area
              </Button>
            </ListItem>
            <Divider component="li" />
            <Grid container pt={3} pb={2} spacing={1}>
              <BuyerLocationTable />
            </Grid>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default BuyerAreaTab;
