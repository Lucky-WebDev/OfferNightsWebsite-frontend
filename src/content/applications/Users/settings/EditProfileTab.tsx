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
  Modal,
  Stack,
} from '@mui/material';

import 'leaflet/dist/leaflet.css'

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import DoNotDisturbOutlinedIcon from '@mui/icons-material/DoNotDisturbOutlined';
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { useSelector, useDispatch } from 'react-redux';
import { StateType, UserType } from '../../../../reducer/dataType';
import { useState, useRef, useMemo, forwardRef } from 'react';
import {editProfile, generatePhoneToken, verifyPhone} from '../../../../actions/authAction'
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import isEmpty from '../../../../validation/is-empty';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function EditProfileTab() {
  const dispatch: any = useDispatch();
  const currentUser: any = useSelector((state: StateType) => state.auth.user)

  const profile: UserType = useSelector((state: StateType) => state.auth.user);
  const token: string = useSelector((state: StateType) => state.auth.token)

  const [phoneNumber, setPhoneNumber] = useState(profile.cell)
  const [phoneToken, setPhoneToken] = useState('');
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const handlePhoneModalOpen = () => setPhoneModalOpen(true);
  const handlePhoneModalClose = () => setPhoneModalOpen(false);

  const [updatePossible, setUpdatePossible] = useState({
    personal: true,
    contact: true,
    brokerage: true,
    pictures: true,
  })

  const [updateProfile, setUpdateProfile] = useState({
    type: profile.type,
    cell: profile.cell,
    firstName: profile.firstName,
    middleName: profile.middleName,
    lastName: profile.lastName,
    tradeName: profile.tradeName,
    brokerageName: profile.brokerageName,
    brokerageCity: profile.brokerageCity,
    brokeragePostalCode: profile.brokeragePostalCode,
    brokerageAddress: profile.brokerageAddress,
    brokeragePhone: profile.brokeragePhone,
  })

  const onSaveClick = e => {
    e.preventDefault();

    if(currentUser.status == 'inactive') {
      enqueueSnackbar('You should verify your phone number.')
      return;
    } else {
      setUpdatePossible({
        ...updatePossible,
        personal: true
      })
  
      dispatch(editProfile(profile._id, token, updateProfile));
    }
  }

  const onCancelClick = e => {
    e.preventDefault();
  }


  const onChange = e => {
    setUpdateProfile({
      ...updateProfile, 
      [e.target.name]: e.target.value
    })
  }

  const onTokenChange = e => {
    setPhoneToken(e.target.value);
  }

  const user = {
    savedCards: 7,
    name: 'Catherine Pike',
    coverImg: '/static/images/background/map.png',
    avatar: '/static/images/avatars/main.jpg',
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage",
    jobtitle: 'Web Developer',
    location: 'Barcelona, Spain',
    followers: '465'
  };

  const onEditClick = (e) => {
    e.preventDefault()
    
    setUpdatePossible({
      ...updatePossible,
      personal: !updatePossible.personal
    })
  }

  const onTokenGenerateClick = e => {
    e.preventDefault();

    if(isEmpty(phoneNumber)) {
      enqueueSnackbar('Please fill in Cell Phone field.')
      return;
    }
    console.log(phoneNumber)
    handlePhoneModalOpen()
    enqueueSnackbar('Please check out your phone SMS')
    const data = {
      phone: phoneNumber
    }
    dispatch(generatePhoneToken(data))
  }

  const onVerifyPhoneClick = e => {
    e.preventDefault();
    const verifyInfo = {
      phone: phoneNumber,
      otp: phoneToken
    }
    handlePhoneModalClose()
    dispatch(verifyPhone(currentUser._id, verifyInfo))
  }

  const onChangePhoneNumber = (value) => {
    setPhoneNumber(value)
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
            <Box>
              <Typography variant="h4" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="subtitle2">
                Manage details related to your contact information
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={1}>
                <Grid xs={12}>
                  <Typography variant="subtitle2">
                    You must verify your phone number and you can visit our website.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    *Cell Phone:
                  </Box><br />
                  <Button variant="text" onClick={onTokenGenerateClick} startIcon={<CheckIcon />}>
                    Verify
                  </Button><br />
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  {/* <TextField type='number' name="phoneNumber" value={phoneNumber} onChange={onPhoneNumberChange} variant="outlined" /> */}
                  <PhoneInput
                    country={'ca'}
                    value={phoneNumber}
                    onChange={onChangePhoneNumber}
                  />
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
            <Modal
              open={phoneModalOpen}
              onClose={handlePhoneModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Phone Verify
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  You can fill in the gaps and verify your phone number
                </Typography><br />
                <Stack>
                <TextField name="phoneToken" type="number" value={phoneToken} onChange={onTokenChange} variant="outlined" /><br />
                <Button
                  variant="contained"
                  onClick={onVerifyPhoneClick}
                >
                  Phone Number Verify
                </Button>
                </Stack>
              </Box>
            </Modal>
            <SnackbarProvider
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            ></SnackbarProvider>
            <Box>
              <Typography variant="h4" gutterBottom>
                Personal Informations
              </Typography>
              <Typography variant="subtitle2">
                Manage informations related to your personal details
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
                    value={updateProfile.type}
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
                    *Cell Phone:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="cell" disabled={true} value={updateProfile.cell} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    *First Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="firstName" disabled={updatePossible.personal} value={updateProfile.firstName} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Middle Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="middleName" disabled={updatePossible.personal} value={updateProfile.middleName} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    *Last Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="lastName" disabled={updatePossible.personal} value={updateProfile.lastName} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Trade Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="tradeName" disabled={updatePossible.personal} value={updateProfile.tradeName} onChange={onChange} variant="outlined" />
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      {profile.type == 'agent' ? (
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
                Brokerage Information
              </Typography>
              <Typography variant="subtitle2">
                Manage details related to your associated brokerage information
              </Typography>
            </Box>
          </Box>
          <Divider />
            <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Brokerage Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="brokerageName" disabled={updatePossible.personal} value={updateProfile.brokerageName} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Address:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="brokerageAddress" disabled={updatePossible.personal} value={updateProfile.brokerageAddress} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    City:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="brokerageCity" disabled={updatePossible.personal} value={updateProfile.brokerageCity} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Postal Code:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField name="brokeragePostalCode" disabled={updatePossible.personal} value={updateProfile.brokeragePostalCode} onChange={onChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pt={1.5}>
                    Phone:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <TextField type='number' name="brokeragePhone" disabled={updatePossible.personal} value={updateProfile.brokeragePhone} onChange={onChange} variant="outlined" />
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      ) : ''}
      
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
                Confirm and Save
              </Typography>
              <Typography variant="subtitle2">
                Would you like to save your information?
              </Typography>
            </Box>
            <div>
              
              <Button variant="text" onClick={onSaveClick} startIcon={<DownloadDoneOutlinedIcon />}>
                Save
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
