import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import ErrorPage from './error-page';
import Pregister from './routes/pre-register';
import CoordinadorRegister from './routes/coordinator-register';
import DirectorRegister from './routes/director-register';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/coordinador',
    element: (
      <Authenticator.Provider>
        <CoordinadorRegister />
      </Authenticator.Provider>
    ),
  },
  {
    path: '/dirigente',
    element: (
      <Authenticator.Provider>
        <DirectorRegister />
      </Authenticator.Provider>
    ),
  },
  {
    path: '/pre-registro',
    element: <Pregister />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} basename='/delfina-edo-mex' />
  </React.StrictMode>,
);
