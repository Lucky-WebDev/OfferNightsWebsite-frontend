import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';

import SidebarLayout from './layouts/SidebarLayout';
import BaseLayout from './layouts/BaseLayout';
import SuspenseLoader from './components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

const Overview = Loader(lazy(() => import('./content/overview')));

// Auth

const Register = Loader(lazy(() => import('./content/auth/Register')));
const Login = Loader(lazy(() => import('./content/auth/Login')));
const Verify = Loader(lazy(() => import('./content/auth/Verify')));

// Management

const Agent = Loader(lazy(() => import('./content/management/ActiveAgent')));

const Buyer = Loader(lazy(() => import('./content/management/Buyer')));

const Seller = Loader(lazy(() => import('./content/management/Seller')));

const ActiveShowingAgents = Loader(
  lazy(() => import('./content/management/ActiveShowingAgents'))
);

const Contact = Loader(lazy(() => import('./content/management/Contact')));

const UserProfile = Loader(
  lazy(() => import('./content/applications/Users/profile'))
);
const UserSettings = Loader(
  lazy(() => import('./content/applications/Users/settings'))
);

// Status

const Status404 = Loader(
  lazy(() => import('./content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('./content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('./content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('./content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Overview />
      },
      {
        path: 'overview',
        element: <Navigate to="/" replace />
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="" replace />
      },
      {
        path: '',
        element: <Overview />
      }
    ]
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        element: <Navigate to="login" replace />
      },
      {
        path: 'sign-in',
        element: <Login />
      },
      {
        path: 'sign-up',
        element: <Register />
      },
      {
        path: 'email-verify',
        element: <Verify />
      },
      {
        path: 'profile',
        element: <Register />
      },
      {
        path: 'setting',
        element: <Register />
      }
    ]
  },
  {
    path: 'profile',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="details" replace />
      },
      {
        path: 'details',
        element: <UserProfile />
      },
      {
        path: 'settings',
        element: <UserSettings />
      }
    ]
  },
  {
    path: 'management',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="my-offer" replace />
      },
      {
        path: 'active-agents',
        element: <Agent />
      },
      {
        path: 'active-showing-agents',
        element: <ActiveShowingAgents />
      },
      {
        path: 'buyers',
        element: <Buyer />
      },
      {
        path: 'sellers',
        element: <Seller />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            element: <Navigate to="details" replace />
          },
          {
            path: 'details',
            element: <UserProfile />
          },
          {
            path: 'settings',
            element: <UserSettings />
          }
        ]
      }
    ]
  }
];

export default routes;
