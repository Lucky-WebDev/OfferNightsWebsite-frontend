import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import './index.css';
import App from './App';
import { SidebarProvider } from './contexts/SidebarContext';
import * as serviceWorker from './serviceWorker';
import './fonts/Kollektif.ttf';

ReactDOM.render(
  <HelmetProvider>
    <SidebarProvider>
      <BrowserRouter>
      <div className='container'>
      <App />
      </div>
      </BrowserRouter>
    </SidebarProvider>
  </HelmetProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
