import { Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';

import { Link, Link as RouterLink} from 'react-router-dom';

import { styled } from '@mui/material/styles';

import { SnackbarProvider, enqueueSnackbar } from 'notistack'

import {useState} from 'react';
import {useDispatch} from 'react-redux';

import {signIn} from '../../../../actions/authAction';

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
  const dispatch: any = useDispatch();

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const onChange = e => {
    setUser({
      ...user, 
      [e.target.name]: e.target.value
    })
  }

  const onClick = e => {
    e.preventDefault();

    if (isEmpty(user.email)) {
      enqueueSnackbar('Please fill the email.')
      return;
    }
    if (!isEmail(user.email)) {
      enqueueSnackbar('Please fill valid email.')
      return;
    }
    if (isEmpty(user.password)) {
      enqueueSnackbar('Please fill the password.')
      return;
    }

    console.log(user)
    dispatch(signIn(user))
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
            Sign In
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="bold"
          >
            Please sign in using your account
          </TypographyH2>

          <Stack>
              <TextField label="*Email" name='email' value={user.email} type='email' variant="outlined" onChange={onChange} /><br />
          </Stack>

          <Stack>
            <TextField label="*Password" name='password' value={user.password} type='password' variant="outlined" onChange={onChange} /><br />
          </Stack><br />
          
          <SnackbarProvider />
          <Button
            onClick={onClick}
            size="large"
            variant="contained"
          >
            Sign In
          </Button>

          <Link to={'/user/sign-up'}>
            <Button
              sx={{ ml: 2 }}
              component="a"
              target="_blank"
              rel="noopener"
              size="large"
              variant="text"
            >
              Sign up
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
