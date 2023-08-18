import { Stack, Button, Container, Grid, Typography, TextField, Select, MenuItem, Checkbox } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { SnackbarProvider, enqueueSnackbar } from 'notistack'

import { useState } from 'react';
import { styled } from '@mui/material/styles';

import {signUp} from '../../../../actions/authAction';
import { checkToken } from '../../../../actions/authAction';

import isEmpty from '../../../../validation/is-empty';
import { StateType } from '../../../../reducer/dataType';

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
  const dispatch: any = useDispatch()
  const navigate: any = useNavigate()

  const [token, setToken] = useState('');

  const signUpInfo: any = useSelector((state: StateType) => state.auth.signUpInfo);

  const error: any = useSelector((state: StateType) => state.auth.error);

  const onBackClick = e => {
    e.preventDefault();
    navigate('/user/sign-up')
  }

  const onVerifyCheck = e => {
    e.preventDefault();
    if(isEmpty(token)) {
      enqueueSnackbar('Email token is empty. Please fill in the gaps')
      return;
    }

    let data = {
      ...signUpInfo,
      token: token
    }
    dispatch(checkToken(data))
  }

  const onChange = e => {
    setToken(e.target.value);
  }

  const onResendClick = e => {
    dispatch(signUp(signUpInfo))
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
            Email Verify
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="bold"
          >
            Please verify your email address
          </TypographyH2>

          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 1.5 }}
            variant="h4"
            textAlign={'center'}
            color="text.secondary"
            fontWeight="bold"
          >
            You should verify your email address and then you can visit our website.<br /> 
            You can confirm the verification code for your email in Email Server and then you can inform us via below verification code field.
          </TypographyH2><br />
          <Stack>
            <Link to={''} onClick={onResendClick}>
              <TypographyH2
                sx={{ lineHeight: 1.5, pb: 1.5 }}
                variant="h4"
                textAlign={'center'}
                color="text.secondary"
                fontWeight="bold"
              >
                Resend Verification Code to {signUpInfo.email}
              </TypographyH2><br />
            </Link>
            <TextField name="token" label="Verification Code" value={token} variant="outlined" onChange={onChange} /><br />
            <Button
              size="large"
              variant="contained"
              onClick={onVerifyCheck}
            >
              Verify
            </Button>
          </Stack><br /><br /><br />

          <SnackbarProvider />

          <Button
            sx={{ ml: 2 }}
            component="a"
            target="_blank"
            rel="noopener"
            size="large"
            variant="text"
            onClick={onBackClick}
          >
            Back
          </Button>
          
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
