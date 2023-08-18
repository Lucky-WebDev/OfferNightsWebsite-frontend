import { useRoutes, useNavigate } from 'react-router-dom';
import router from './router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';

import { Provider, useDispatch } from 'react-redux';
import { persistor, store } from './store';

import React, {useState, useEffect} from 'react';
import setAuthToken from './api/setAuthToken';

import { PersistGate } from 'redux-persist/integration/react';

import 'leaflet/dist/leaflet.css'
import { SnackbarProvider } from 'notistack';
import './App.css'

function App() {
  const content = useRoutes(router);
  const navigate: any = useNavigate()
  
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    } else {
      navigate('/')
    }
  }, []);

  return (
    
      <React.StrictMode>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CssBaseline />
                <SnackbarProvider
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >
                  <div className="container font-face-gm">
                  {content}
                  </div>
                </SnackbarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </React.StrictMode>
  );
}
export default App;
