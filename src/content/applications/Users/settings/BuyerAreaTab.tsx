import {
  useState,
  MouseEvent,
  ChangeEvent,
  useRef,
  useEffect,
  JSXElementConstructor,
  ReactElement
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
  TextFieldProps,
  Select,
  MenuItem,
  LinearProgress,
  Autocomplete
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import UploadTwoToneIcon from '@mui/icons-material/AddLocationAlt';

import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { StateType } from '../../../../reducer/dataType';
import isEmpty from '../../../../validation/is-empty';

import {
  addActiveShowing,
  getAllActiveShowing,
  getMyActiveShowing
} from '../../../../actions/showingAction';
import ActiveShowingTable from './TableForm/ActiveShowingTable';
import LoadingSpinner from '../../../../components/Loader';

import L from 'leaflet';
import { addBuyerLocation, getMyBuyerLocation } from '../../../../actions/buyerAction';
import BuyerLocationTable from './TableForm/BuyerLocationTable';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../../config/marker/buyer-marker.png'),
  iconUrl: require('../../../../config/marker/buyer-marker.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})
  
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
  
  const mapStyle = {
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

    dispatch(getMyBuyerLocation(currentUser._id))
  
    const mapBounds: any = [
      [69.5335129, -153.8220681],
      [43.31166455, -56.44995099337655]
    ];
    const ZOOM_LEVEL = 9;
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
        address: null,
        code: null,
        lat: null,
        lng: null,
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
  
    const onAddLocation = (e) => {
      e.preventDefault();
  
      handleMapClose();
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
        enqueueSnackbar(
          "Please fill the best way communicate with you."
        );
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

  useEffect(() => {
    placeToPosition(inputValue);
  }, [inputValue]);

  useEffect(() => {
    console.log({ address });
    if (address) {
      setPosition({
        lat: address.lat,
        lng: address.lon
      });
    }
  }, [address]);

  const onSelectChange = (newValue) => {
    setAddress(newValue);

    placeToPosition(inputValue);
  };
  
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Modal
            open={mapOpen}
            onClose={handleMapClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={mapStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                OpenStreetMap
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                You can select your area for buying. And then you can click Add
                button.
              </Typography>
  
              <MapContainer
                bounds={mapBounds}
                style={{ height: '600px', width: '100%' }}
                zoom={ZOOM_LEVEL}
                ref={mapRef}
              >
                {progress ? (
                  <LoadingSpinner loading={progress} />
                ) : (
                  <>
                    <Marker position={position}>
                      <Popup>
                        {buyerInfo.address }
                      </Popup>
                    </Marker>
                    <MapClickHandler />
                    <Polygon positions={[[
                      [Number(position.lat)-Number(currentUser.radius)/200, Number(position.lng)+Number(currentUser.radius)/200],
                      [Number(position.lat)-Number(currentUser.radius)/200, Number(position.lng)-Number(currentUser.radius)/200],
                      [Number(position.lat)+Number(currentUser.radius)/200, Number(position.lng)-Number(currentUser.radius)/200],
                      [Number(position.lat)+Number(currentUser.radius)/200, Number(position.lng)+Number(currentUser.radius)/200],
                      [Number(position.lat)-Number(currentUser.radius)/200, Number(position.lng)+Number(currentUser.radius)/200],
                    ]]} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  </>
                )}
              </MapContainer>
              <br />
  
              <Box
                width={'100%'}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
              <Button
                startIcon={<UploadTwoToneIcon />}
                variant="contained"
                disabled={addShow}
                onClick={onAddLocation}
              >
                Select the position
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
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Address" />
                )}
              />
              </Box>
            </Box>
          </Modal>
  
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Box
                    pt={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} sm={8} md={9}>
                      <Button variant="outlined" onClick={handleMapOpen}>
                        Major intersection
                      </Button>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                      <Box pr={3} pt={1.5}>
                        *Address?:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <TextField
                        name="address"
                        value={buyerInfo.address}
                        onChange={onChange}
                        variant="outlined"
                        style={{ width: '50%' }}
                      />
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                      <Box pr={3} pt={1.5}>
                        *Are you a realtor? :
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={buyerInfo.youRealtor}
                        name="youRealtor"
                        style={{ width: '50%' }}
                        label="*Are you a realtor?"
                        onChange={onChange}
                        defaultValue={'Yes'}
                      >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                      </Select>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                      <Box pr={3} pt={1.5}>
                        *Are you working with a realtor? :
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={buyerInfo.withRealtor}
                        name="withRealtor"
                        style={{ width: '50%' }}
                        label="*Are you working with a realtor?"
                        onChange={onChange}
                        defaultValue={'Yes'}
                      >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                      </Select>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                      <Box pr={3} pt={1.5}>
                        *Type of house you are looking for? :
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="outlined-basic"
                        value={buyerInfo.typeHouse}
                        name="typeHouse"
                        style={{ width: '50%' }}
                        label="*Type of house you are looking for?"
                        onChange={onChange}
                        defaultValue={'Yes'}
                      >
                        <MenuItem value={'Condo'}>Condo</MenuItem>
                        <MenuItem value={'Townhouse'}>Townhouse</MenuItem>
                        <MenuItem value={'House'}>House</MenuItem>
                      </Select>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                      <Box pr={3} pt={1.5}>
                        *What city are you interested in?:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <TextField
                        name="interestCity"
                        value={buyerInfo.interestCity}
                        onChange={onChange}
                        variant="outlined"
                        style={{ width: '50%' }}
                      />
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                      <Box pr={3} pt={1.5}>
                        *Do you have approved mortage? :
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={buyerInfo.mortage}
                        name="mortage"
                        style={{ width: '50%' }}
                        label="*Listing Agent"
                        onChange={onChange}
                        defaultValue={'Yes'}
                      >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                      </Select>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                      <Box pr={3} pt={1.5}>
                        *Best way to communicate with you?:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={buyerInfo.phone}
                        name="phone"
                        style={{ width: '50%' }}
                        label="*Communication"
                        onChange={onChange}
                        defaultValue={'Email'}
                      >
                        <MenuItem value={'Email'}>Email</MenuItem>
                        <MenuItem value={'Phone'}>Phone</MenuItem>
                        <MenuItem value={'Text'}>Text</MenuItem>
                      </Select>
                    </Grid>
                  </Box>
                </Grid>
  
                <Grid item xs={12}>
                  <Box
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Grid item xs={12} sm={8} md={9}>
                      <SnackbarProvider
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                      ></SnackbarProvider>
                      <Button
                        variant="contained"
                        onClick={handleClickOpenConfirm}
                      >
                        Add Buyer Area
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
  