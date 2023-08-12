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
import { Circle, MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { StateType } from '../../../../reducer/dataType';
import isEmpty from '../../../../validation/is-empty';

import LoadingSpinner from '../../../../components/Loader';

import L from 'leaflet';
import { addSellerLocation, getMySellerLocation } from '../../../../actions/sellerAction';
import SellerLocationTable from './TableForm/SellerLocationTable';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('../../../../config/marker/seller-marker.png'),
  iconUrl: require('../../../../config/marker/seller-marker.png'),
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
    dispatch(getMySellerLocation(currentUser._id))
  
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
        houseNumber: null,
        address: null,
        code: null,
        lat: null,
        lng: null,
        thinking: null,
        typeProperty: null,
        realtorContact: null,
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
  
    const onAddLocation = (e) => {
      e.preventDefault();
  
      handleMapClose();
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
        houseNumber: sellerInfo.houseNumber,
        address: sellerInfo.address,
        code: sellerInfo.code,
        lat: sellerInfo.lat,
        lng: sellerInfo.lng,
        youRealtor: sellerInfo.youRealtor,
        withRealtor: sellerInfo.withRealtor,
        thinking: sellerInfo.thinking,
        typeProperty: sellerInfo.typeProperty,
        realtorContact: sellerInfo.realtorContact,
      };
  
      handleClose();
      dispatch(addSellerLocation(sellerRequest));
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
                    <MapClickHandler />
                    <Marker position={position}>
                      <Popup>
                        {sellerInfo.address}
                      </Popup>
                    </Marker>
                    <Circle center={position} pathOptions={{ color: 'red' }} />
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
                        Property Address
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
                        *Property Address?:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <TextField
                        name="address"
                        value={sellerInfo.address}
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
                        value={sellerInfo.youRealtor}
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
                        *Are you working with a realtor?:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sellerInfo.withRealtor}
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
                        What are you thinking off? :
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sellerInfo.thinking}
                        name="thinking"
                        style={{ width: '50%' }}
                        label="*Type of house you are looking for?"
                        onChange={onChange}
                        defaultValue={'Yes'}
                      >
                        <MenuItem value={'Downsizing'}>Downsizing</MenuItem>
                        <MenuItem value={'Upgrading'}>Upgrading</MenuItem>
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
                        What are you thinking off? :
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sellerInfo.typeProperty}
                        name="typeProperty"
                        style={{ width: '50%' }}
                        label="*Type of house you are looking for?"
                        onChange={onChange}
                        defaultValue={'Yes'}
                      >
                        <MenuItem value={'Condo'}>Condo</MenuItem>
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
                        Can a realtor contact you if they have a buyer for you unit? :
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sellerInfo.realtorContact}
                        name="realtorContact"
                        style={{ width: '50%' }}
                        label="*Type of house you are looking for?"
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
                        Add Active Showing
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
                  <AddLocationAltIcon /> Selling Area
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
  