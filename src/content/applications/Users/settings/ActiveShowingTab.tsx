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
import L from 'leaflet';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

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
import useDebounce from '../../../../hook/useDebounce';

import {
  addActiveShowing,
  doubleCheck,
  getMyActiveShowing
} from '../../../../actions/showingAction';
import ActiveShowingTable from './TableForm/ActiveShowingTable';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../../config/marker/showing-marker.png'),
  iconUrl: require('../../../../config/marker/showing-marker.png'),
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

function ActiveShowingTab() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [mapOpen, setMapOpen] = useState(false);
  const handleMapOpen = () => setMapOpen(true);
  const handleMapClose = () => setMapOpen(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [checkListingFlag, setCheckListingFlag] = useState(false)

  const [showingItem, setShowingItem] = useState({
    offerDate: null,
    listing: null,
    address: null,
    code: null,
    lat: null,
    lng: null,
    unit: null,
    price: null,
    country: null,
    city: null,
    county: null,
    quarter: null,
    state: null,
    region: null,
    village: null,
    highway: null,
    suburb: null,
    road: null,
    houseNumber: null,
    listingAgent: null
  });

  const [options, setOptions] = useState([]);

  const handleClickOpenConfirm = async () => {
    console.log(options)

    if (isEmpty(showingItem.listing)) {
      enqueueSnackbar('Please input listing.');
      return;
    }
    if (isEmpty(showingItem.address)) {
      enqueueSnackbar('Please select or fill the current address.');
      return;
    }
    if (isEmpty(showingItem.price)) {
      enqueueSnackbar('Please fill the Price.');
      return;
    }
    if (isEmpty(showingItem.lat)) {
      enqueueSnackbar('Please select the Latitude.');
      return;
    }
    if (isEmpty(showingItem.lng)) {
      enqueueSnackbar('Please select the Longitude.');
      return;
    }
    if (isEmpty(showingItem.listingAgent)) {
      enqueueSnackbar(
        "Please answer the question for 'Are you listing agent?'."
      );
      return;
    }

    const flag = await doubleCheck({listing: showingItem.listing})
    if(flag) {
      setOpenConfirm(true);
    } else {
      enqueueSnackbar('Listing Double');
      setCheckListingFlag(false)
      return
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const dispatch: any = useDispatch();

  const currentUser: any = useSelector((state: StateType) => state.auth.user);

  useEffect(() => {
    dispatch(getMyActiveShowing(currentUser._id));
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

              setShowingItem({
                ...showingItem,
                country: data.address.country,
                state: data.address.state,
                city: data.address.city,
                county: data.address.county,
                region: data.address.region,
                quarter: data.address.quarter,
                village: data.address.village,
                road: data.address.road,
                houseNumber: data.address.house,
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
        } catch (error) {
          console.log('Error', error);
        }
      }
    });
    return null;
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

          setShowingItem({
            ...showingItem,
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

          console.log(data)
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

  const onChange = (e) => {
    setShowingItem({
      ...showingItem,
      [e.target.name]: e.target.value
    });
  };


  const onSaveActiveShowing = (e) => {
    e.preventDefault();

    handleCloseConfirm();
    handleMapClose();

    const activeShowing = {
      userId: currentUser._id,
      name: currentUser.firstName + ' ' + currentUser.lastName,
      country: showingItem.country,
      state: showingItem.state,
      city: showingItem.city,
      county: showingItem.county,
      region: showingItem.region,
      quarter: showingItem.quarter,
      village: showingItem.village,
      road: showingItem.road,
      houseNumber: showingItem.houseNumber,
      highway: showingItem.highway,
      suburb: showingItem.suburb,
      address: showingItem.address,
      code: showingItem.code,
      lat: showingItem.lat,
      lng: showingItem.lng,
      price: showingItem.price,
      unit: showingItem.unit,
      listing: showingItem.listing,
      offerDate: showingItem.offerDate,
      listingAgent: showingItem.listingAgent
    };

    handleClose();

    dispatch(addActiveShowing(activeShowing));
  };

  const [place, setPlace] = useState({
    street: '',
    city: '',
    county: '',
    state: '',
    code: ''
  });

  const [address, setAddress] = useState<AddressType>({
    lat: '',
    lon: '',
    label: ''
  });


  const placeToPosition = async (place) => {
    try {
      let url =
        'https://nominatim.openstreetmap.org/search?format=jsonv2&q=' +
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
          console.log(data)
          const items = data.map((item: any) => {
            return {
              ...item,
              label: item.display_name 
            };
          });
          console.log(items)
          setOptions(items);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log('Error', error);
    }
  };

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
    setAddress(newValue);
    // placeToPosition(newValue);
  };

  const [checked, setChecked] = useState(false)

  const handleChange = e => {
    setChecked(e.target.checked);
  };

  const [listingValue, setListingValue] = useState('');

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
                    // id="controllable-states-demo"
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
                      value={showingItem.houseNumber ?? '' + showingItem.road ?? '' + showingItem.highway ?? '' + showingItem.suburb ?? ''}
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
                      value={showingItem.city ?? ''}
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
                      value={showingItem.county ?? ''}
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
                    value={showingItem.state ?? ''}
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
                    value={showingItem.code ?? ''}
                    onChange={onPlaceChange}
                    disabled
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider orientation="horizontal" />
                </Grid>

                <Divider />
                <Grid item xs={12} container>
                  <Grid item xs={12}>
                    <TextField
                      label="Listing#"
                      name="listing"
                      value={showingItem.listing}
                      onChange={onChange}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      mt={2}
                    >
                      Offering Date
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={10} md={10}>
                    <TextField
                      name="offerDate"
                      type="date"
                      value={showingItem.offerDate}
                      onChange={onChange}
                      variant="outlined"
                      disabled={!checked}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} pl={2} pt={1}>
                    <Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      label="Unit#"
                      name="unit"
                      value={showingItem.unit}
                      onChange={onChange}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={showingItem.price}
                    onChange={onChange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} container>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    mt={2}
                  >
                    Are you listing a agent?
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} container>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={showingItem.listingAgent}
                    name="listingAgent"
                    label="*Listing Agent"
                    onChange={onChange}
                    defaultValue={'Yes'}
                    fullWidth
                  >
                    <MenuItem value={'Yes'}>Yes</MenuItem>
                    <MenuItem value={'No'}>No</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Grid item xs={12} sm={12} md={12}>
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
                        Add Showing
                      </Button>
                      <Dialog
                        open={openConfirm}
                        onClose={handleCloseConfirm}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          Active Showing Agent
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Do you really add new Active showing agent?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseConfirm}>Disagree</Button>
                          <Button onClick={onSaveActiveShowing} autoFocus>
                            Agree
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <MapContainer
                  bounds={mapBounds}
                  style={{ height: '100%', width: '100%' }}
                  zoom={ZOOM_LEVEL}
                  ref={mapRef}
                >
                    <>
                      <MapClickHandler />
                      <Marker position={position}>
                        <Popup>{showingItem.address}</Popup>
                      </Marker>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </>
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
                primary="Add Showing"
                secondary="You can add your active showing"
              />
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
              ></SnackbarProvider>
              <Button size="large" variant="outlined" onClick={handleOpen}>
                <AddLocationAltIcon /> Add Showing
              </Button>
            </ListItem>
            <Divider component="li" />
            <Grid container pt={3} pb={2} spacing={1}>
              <ActiveShowingTable />
            </Grid>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ActiveShowingTab;
