import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { styled } from '@mui/material/styles';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import DoNotDisturbOutlinedIcon from '@mui/icons-material/DoNotDisturbOutlined';
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { StateType, UserType } from '../../../../reducer/dataType';
import { useState } from 'react';
import {editProfile} from '../../../../actions/authAction'
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import isEmpty from '../../../../validation/is-empty';

function EditProfileTab() {
  // const navigate: any = useNavigate();
  const dispatch: any = useDispatch();

  const currentUser: UserType = useSelector((state: StateType) => state.auth.user);
  const token: string = useSelector((state: StateType) => state.auth.token)

  const [updatePossible, setUpdatePossible] = useState({
    personal: true,
  })

  const onSaveClick = e => {
    e.preventDefault();
    
    if(billing.amountPaid == null) {
      enqueueSnackbar('You should input Amount Paid.')
      return;
    }

    if(billing.amountPerMonth == null) {
      enqueueSnackbar('You should input Amount Per Month.')
      return;
    }
    
    setUpdatePossible({
      ...updatePossible,
      personal: true
    })

    dispatch(editProfile(currentUser._id, token, billing));
  }

  const onCancelClick = e => {
    e.preventDefault();
  }

  const [billing, setBilling] = useState({
    type: currentUser.type,
    firstName: currentUser.firstName,
    middleName: currentUser.middleName,
    lastName: currentUser.lastName,
    billingDate: null,
    nextBillingDate: null,
    amountPaid: null,
    amountPerMonth: null,
    status: null
  })

  const onChange = e => {
    setBilling({
      ...billing, 
      [e.target.name]: e.target.value
    })
  }

  const onEditClick = (e) => {
    e.preventDefault()
    
    setUpdatePossible({
      ...updatePossible,
      personal: !updatePossible.personal
    })
  }

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
            <SnackbarProvider
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            ></SnackbarProvider>
            <Box>
              <Typography variant="h4" gutterBottom>
                Billing Informations
              </Typography>
              <Typography variant="subtitle2">
                Manage informations related to your billing details
              </Typography>
            </Box>
            <div>
              <Button variant="text" onClick={onEditClick} disabled={updatePossible.personal == true ? false : true} startIcon={<EditTwoToneIcon />}>
                Edit
              </Button>
              <Button variant="text" onClick={onEditClick} disabled={updatePossible.personal == true ? true : false} startIcon={<DoNotDisturbOutlinedIcon />}>
                Cancel
              </Button>
            </div>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    *Type:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={billing.type}
                    name='type'
                    label="*Type"
                    disabled={true}
                    onChange={onChange}
                  >
                    <MenuItem value={'agent'}>Agent</MenuItem>
                    <MenuItem value={'buyer'}>Buyer</MenuItem>
                    <MenuItem value={'seller'}>Seller</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Billing Date:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="billingDate" disabled={updatePossible.personal} value={billing.billingDate} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Next Billing Date:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="nextBillingDate" disabled={updatePossible.personal} value={billing.nextBillingDate} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    *Amount Paid:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="amountPaid" disabled={updatePossible.personal} value={billing.amountPaid} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Amount Per Month:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="amountPerMonth" disabled={updatePossible.personal} value={billing.amountPerMonth} onChange={onChange} variant="outlined" />
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
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
                Confirm and Paid
              </Typography>
              <Typography variant="subtitle2">
                Would you like to pay?
              </Typography>
            </Box>
            <div>
              
              <Button variant="text" onClick={onSaveClick} startIcon={<DownloadDoneOutlinedIcon />}>
                Pay
              </Button>
              <Button variant="text" onClick={onCancelClick} startIcon={<HighlightOffOutlinedIcon />}>
                Cancel
              </Button>
            </div>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default EditProfileTab;
