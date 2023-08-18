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
  Autocomplete,
  Switch
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import UploadTwoToneIcon from '@mui/icons-material/AddLocationAlt';

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
  addSellerLocation,
  getMySellerLocation
} from '../../../../actions/sellerAction';
import SellerLocationTable from './TableForm/SellerLocationTable';
import useDebounce from '../../../../hook/useDebounce';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../../config/marker/seller-marker.png'),
  iconUrl: require('../../../../config/marker/seller-marker.png'),
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

function SellerAreaTab() {
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
    dispatch(getMySellerLocation(currentUser._id));
  }, [])

  const mapBounds: any = [
    [69.5335129, -133.8220681],
    [47.31166455, -56.44995099337655]
  ];
  const ZOOM_LEVEL = 9;
  const mapRef = useRef();

  const [position, setPosition] = useState({
    lat: '',
    lng: ''
  });

  const [sellerInfo, setSellerInfo] = useState({
    youRealtor: null,
    withRealtor: null,
    country: null,
    state: null,
    city: null,
    county: null,
    region: null,
    quarter: null,
    village: null,
    road: null,
    highway: null,
    suburb: null,
    houseNumber: null,
    address: null,
    code: null,
    lat: null,
    lng: null,
    thinking: null,
    typeProperty: null,
    realtorContact: null
  });

  const [addShow, setAddShow] = useState(true);
  const [progress, setProgress] = useState(false);

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
            .then((data) => {
              const display_name = data.display_name;
              const place_id = data.address.postcode;

              setSellerInfo({
                ...sellerInfo,
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
      }
    });

    return null;
  };

  const onChange = (e) => {
    setSellerInfo({
      ...sellerInfo,
      [e.target.name]: e.target.value
    });
  };

  const onSaveActiveShowing = (e) => {
    e.preventDefault();

    handleCloseConfirm();

    if (isEmpty(sellerInfo.youRealtor)) {
      enqueueSnackbar("Please answer 'Are you a realtor?'.");
      return;
    }
    if (isEmpty(sellerInfo.address)) {
      enqueueSnackbar('Please select or fill the current address.');
      return;
    }
    if (isEmpty(sellerInfo.withRealtor)) {
      enqueueSnackbar("Please answer 'Are you working with a realtor?'.");
      return;
    }

    const sellerRequest = {
      userId: currentUser._id,
      name: currentUser.firstName + ' ' + currentUser.lastName,
      country: sellerInfo.country,
      state: sellerInfo.state,
      city: sellerInfo.city,
      county: sellerInfo.county,
      region: sellerInfo.region,
      quarter: sellerInfo.quarter,
      village: sellerInfo.village,
      road: sellerInfo.road,
      highway: sellerInfo.highway,
      suburb: sellerInfo.suburb,
      houseNumber: sellerInfo.houseNumber,
      address: sellerInfo.address,
      code: sellerInfo.code,
      lat: sellerInfo.lat,
      lng: sellerInfo.lng,
      youRealtor: sellerInfo.youRealtor,
      withRealtor: sellerInfo.withRealtor,
      thinking: sellerInfo.thinking,
      typeProperty: sellerInfo.typeProperty,
      realtorContact: sellerInfo.realtorContact
    };

    handleClose();
    dispatch(addSellerLocation(sellerRequest));
  };

  const [address, setAddress] = useState<AddressType>({
    lat: '',
    lon: '',
    label: ''
  });
  const [options, setOptions] = useState([]);

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

          setSellerInfo({
            ...sellerInfo,
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

  const [inputValue, setInputValue] = useState('');
  const debouncedInput: string = useDebounce<string>(inputValue, 2000);

  useEffect(() => {
    if (debouncedInput) {
      placeToPosition(debouncedInput);
    }
  }, [debouncedInput]);

  useEffect(() => {
    console.log({ address });
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
                <Grid item xs={12}>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="House Name | Street"
                      required
                      name="street"
                      value={sellerInfo.houseNumber ?? '' + sellerInfo.road ?? '' + sellerInfo.highway ?? '' + sellerInfo.suburb ?? ''}
                      onChange={onPlaceChange}
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="City"
                      required
                      name="city"
                      value={sellerInfo.city ?? ''}
                      onChange={onPlaceChange}
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="County"
                      required
                      name="county"
                      value={sellerInfo.county ?? ''}
                      onChange={onPlaceChange}
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="State"
                    required
                    name="state"
                    value={sellerInfo.state ?? ''}
                    onChange={onPlaceChange}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Postal Code"
                    required
                    name="code"
                    value={sellerInfo.code ?? ''}
                    onChange={onPlaceChange}
                    variant="outlined"
                    fullWidth
                    disabled
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
                      *Are you a realtor?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={sellerInfo.youRealtor}
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
                      value={sellerInfo.withRealtor}
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
                      *What are you thinking off?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={sellerInfo.thinking}
                      name="thinking"
                      label="*What are you thinking off?"
                      onChange={onChange}
                      defaultValue={'Yes'}
                      fullWidth
                    >
                      <MenuItem value={'Downsizing'}>Downsizing</MenuItem>
                      <MenuItem value={'Upgrading'}>Upgrading</MenuItem>
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
                      *Type of Property?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={sellerInfo.typeProperty}
                      name="typeProperty"
                      label="*Type of Property?"
                      onChange={onChange}
                      defaultValue={'Yes'}
                      fullWidth
                    >
                      <MenuItem value={'Condo'}>Condo</MenuItem>
                      <MenuItem value={'House'}>House</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      mt={2}
                    >
                      *Can a realtor contact you if they have a buyer for your
                      unit?
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12} sm={12} md={12}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={sellerInfo.realtorContact}
                      name="realtorContact"
                      label="*Can a realtor contact you if they have a buyer for your unit?"
                      onChange={onChange}
                      defaultValue={'Yes'}
                      fullWidth
                    >
                      <MenuItem value={'Yes'}>Yes</MenuItem>
                      <MenuItem value={'No'}>No</MenuItem>
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
                      <Marker position={position}>
                        <Popup>{sellerInfo.address}</Popup>
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
                primary="Add Area for selling"
                secondary="You can add your area for selling."
              />
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
              ></SnackbarProvider>
              <Button size="large" variant="outlined" onClick={handleOpen}>
                <AddLocationAltIcon /> Add your property
              </Button>
            </ListItem>
            <Divider component="li" />
            <Grid container pt={3} pb={2} spacing={1}>
              <SellerLocationTable />
            </Grid>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SellerAreaTab;
