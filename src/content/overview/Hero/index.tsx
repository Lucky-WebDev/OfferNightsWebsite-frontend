import { Box, Button, Container, Grid, Typography } from '@mui/material';

import { Link, Link as RouterLink } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { StateType } from '../../../reducer/dataType';
import Paper from '@mui/material/Paper';

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

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

function Hero() {
  const isAuthenticated: boolean = useSelector((state: StateType) => state.auth.isAuthenticated)

  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={10} lg={8} mx="auto">
          <LabelWrapper color="success">Version 1.0.0</LabelWrapper>
          <TypographyH1 sx={{ mb: 2 }} variant="h1">
            OFFERNIGHTS
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="bold"
          >
            Embark on a virtual journey around the globe and let our captivating travel blog transport you to breathtaking destinations, 
            inspiring you to explore the world like never before
            
          </TypographyH2>
          {isAuthenticated == false ? (
            <div>
              <Link to={'/user/sign-up'}>
                <Button
                  size="large"
                  variant="contained"
                >
                  Sign Up
                </Button>
              </Link>
              
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
            </div>
          ) : (
            <Link to={'/profile/settings'}>
              <Button
                size="large"
                variant="contained"
              >
                My Profile
              </Button>
            </Link>
          )}
          <br />
          <br />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
