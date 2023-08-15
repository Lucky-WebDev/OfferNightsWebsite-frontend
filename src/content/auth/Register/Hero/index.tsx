import { Stack, Button, Container, Grid, Typography, TextField, Select, MenuItem, Checkbox } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'

import { SnackbarProvider, enqueueSnackbar } from 'notistack'

import { useState } from 'react';
import { styled } from '@mui/material/styles';

import {signUp} from '../../../../actions/authAction';

import isEmail from '../../../../validation/is-email';
import isEmpty from '../../../../validation/is-empty';

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

function Hero() {

  const navigate: any = useNavigate()

  const dispatch: any = useDispatch();

  const [profile, setProfile] = useState({
    type: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termAgree: false,
  });

  const onChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
    
    if(profile.password == profile.confirmPassword) { 
      return;
    }
  };

  const checkedChange = (e) => {
    setProfile({
      ...profile,
      termAgree: e.target.checked
    })
  }
  
  const onClick = e => {
    if (isEmpty(profile.type)) {
      enqueueSnackbar('Please fill the type.')
      return;
    }
    if (isEmpty(profile.firstName)) {
      enqueueSnackbar('Please fill the firstName.')
      return;
    }
    if (isEmpty(profile.lastName)) {
      enqueueSnackbar('Please fill the lastName.')
      return;
    }
    if (!isEmail(profile.email)) {
      enqueueSnackbar('Please enter the valid email.')
      return;
    }
    if (isEmpty(profile.email)) {
      enqueueSnackbar('Please fill the email.')
      return;
    }
    if (isEmpty(profile.password)) {
      enqueueSnackbar('Please fill the password.')
      return;
    }
    if (profile.password.length < 6) {
      enqueueSnackbar('Password must be longer than 6 characters.')
      return;
    }
    if (profile.password !== profile.confirmPassword) {
      enqueueSnackbar('Please enter the correct password.')
      return;
    }
    
    if (profile.termAgree == false) {
      enqueueSnackbar('You should understand and agree to the Terms of Service and Privacy Policy.');
      return; 
    }

    e.preventDefault();
    dispatch(signUp(profile));
    navigate('/user/email-verify')
  }

  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={10} lg={8} mx="auto">
          <TypographyH1 sx={{ mb: 2 }} variant="h1">
            Sign Up
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="bold"
          >
            Please sign up using your information
          </TypographyH2>

          <TypographyH2
              sx={{ lineHeight: 1.5, pb: 1.5 }}
              variant="h4"
              textAlign={'left'}
              color="text.secondary"
              fontWeight="bold"
            >
              Type
          </TypographyH2>
          <Stack>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={profile.type}
              name='type'
              label="*Type"
              onChange={onChange}
            >
              <MenuItem value={'agent'}>Agent</MenuItem>
              <MenuItem value={'buyer'}>Buyer</MenuItem>
              <MenuItem value={'seller'}>Seller</MenuItem>
            </Select><br />
          </Stack>
          
          <TypographyH2
              sx={{ lineHeight: 1.5, pb: 1.5 }}
              variant="h4"
              textAlign={'left'}
              color="text.secondary"
              fontWeight="bold"
            >
              Personal Information
          </TypographyH2>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <TextField name="firstName" label="*First Name" value={profile.firstName} variant="outlined" style={{width: '200px'}} onChange={onChange} />
            <TextField name="middleName" label="Middle Name" value={profile.middleName} variant="outlined" style={{width: '200px'}} onChange={onChange} />
            <TextField name="lastName" label="*Last Name" value={profile.lastName} variant="outlined" style={{width: '200px'}} onChange={onChange} />
          </div><br />

          <TypographyH2
              sx={{ lineHeight: 1.5, pb: 1.5 }}
              variant="h4"
              textAlign={'left'}
              color="text.secondary"
              fontWeight="bold"
            >
              Contact Information
          </TypographyH2>
          <Stack>
              <TextField label="*Email" name='email' value={profile.email} type='email' variant="outlined" onChange={onChange} /><br />
          </Stack>
          
          <TypographyH2
              sx={{ lineHeight: 1.5, pb: 1.5 }}
              variant="h4"
              textAlign={'left'}
              color="text.secondary"
              fontWeight="bold"
            >
              Account Information
          </TypographyH2>
          <Stack>
            <TextField label="*Password" name='password' value={profile.password} type='password' variant="outlined" onChange={onChange} /><br />
            <TextField label="*Confirm Password" name='confirmPassword' value={profile.confirmPassword} type='password' variant="outlined" onChange={onChange} />
          </Stack><br />

          <div style={{display: 'flex', justifyContent: "left"}}>
            <Checkbox aria-label='Checkbox demo' name='termAgree' onChange={checkedChange} />
            <TypographyH2
                sx={{ lineHeight: 1.5, pb: 1.5, pt: 1 }}
                variant="h4"
                textAlign={'left'}
                color="text.secondary"
                fontWeight="bold"
              >
                Yes, I understand and agree to the Terms of Service and Privacy Policy.
            </TypographyH2>
          </div><br />

          <SnackbarProvider />
          <Button
            size="large"
            variant="contained"
            onClick={onClick}
          >
            Sign Up
          </Button>

          <Link to={'/user/sign-in'}>
            <Button
              sx={{ ml: 2 }}
              component="a"
              target="_blank"
              rel="noopener"
              size="large"
              variant="text"
            >
              Sign In
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
