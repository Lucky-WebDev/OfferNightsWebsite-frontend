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
  LinearProgress
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import UploadTwoToneIcon from '@mui/icons-material/AddLocationAlt';

import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
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

function ActiveShowingTab() {
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
    road: null,
    houseNumber: null,
    listingAgent: null
  });

  const [addShow, setAddShow] = useState(true);
  const [progress, setProgress] = useState(false);

  const MapClickHandler = () => {
    let map = useMapEvents({
      click: async (e) => {
        setProgress(true);
        const { lat, lng } = e.latlng;
        const api_key: string = 'AIzaSyBaBJNvo7jQhIkQKRFalCVeWDMVO-CXOD0';

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
                houseNumber: data.address.houseNumber,
                lat: lat,
                lng: lng,
                address: display_name,
                code: place_id
              });

              console.log(showingItem);
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
    setShowingItem({
      ...showingItem,
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

    if (isEmpty(showingItem.listing)) {
      enqueueSnackbar('Please input listing.');
      return;
    }
    if (isEmpty(showingItem.address)) {
      enqueueSnackbar('Please select or fill the current address.');
      return;
    }
    if (isEmpty(showingItem.code)) {
      enqueueSnackbar('Please select or fill the new Postal code.');
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

  console.log({ progress });

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
              You can select your active area. And then you can click Add
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
                      {showingItem.address }
                    </Popup>
                  </Marker>
                  <Circle center={position} pathOptions={{ color: 'red' }} />
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </>
              )}
            </MapContainer>
            <br />

            <Button
              startIcon={<UploadTwoToneIcon />}
              variant="contained"
              disabled={addShow}
              onClick={onAddLocation}
            >
              Select the position
            </Button>
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
                      Select the position on OpenStreetMap
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
                      *Listing:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <TextField
                      name="listing"
                      value={showingItem.listing}
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
                      Offer Date:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <TextField
                      name="offerDate"
                      type="date"
                      value={showingItem.offerDate}
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
                      *Address:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <TextField
                      name="address"
                      value={showingItem.address}
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
                      *Postal Code:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <TextField
                      name="code"
                      value={showingItem.code}
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
                      Unit:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <TextField
                      name="unit"
                      value={showingItem.unit}
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
                      *List Price:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <TextField
                      name="price"
                      type="number"
                      value={showingItem.price}
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
                      *Are you listing Agent? :
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={showingItem.listingAgent}
                      name="listingAgent"
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
                primary="Add Active Showing"
                secondary="You can add your active showing"
              />
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
              ></SnackbarProvider>
              <Button size="large" variant="outlined" onClick={handleOpen}>
                <AddLocationAltIcon /> Active Showing
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
