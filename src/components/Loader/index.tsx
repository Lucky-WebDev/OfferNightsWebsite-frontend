import { useEffect, FC } from 'react';
import NProgress from 'nprogress';
import { Box, CircularProgress } from '@mui/material';

interface SpinnerProps {
  loading: boolean
}

const LoadingSpinner = ({loading}) => {
  useEffect(() => {
    if(loading) NProgress.start();
    else NProgress.done()

    return () => {
      NProgress.done();
    };
  }, [loading]);

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress size={64} disableShrink thickness={3} />
    </Box>
  );
}

export default LoadingSpinner;
