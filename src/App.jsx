import { Route, Routes } from 'react-router-dom';
import './index.css';
import CoordinadorRegister from './routes/coordinator-register';
import DirectorRegister from './routes/director-register';
import PromotorRegister from './routes/promotor-register';
import RegistrarRepresentanteCalle from './routes/registrar-representante-calle';
import RegistrarLona from './routes/registrar-lona';
import RegistrarBarda from './routes/registrar-barda';
import RegistrarPromovido from './routes/registrar-promovido';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import Home from './components/Home';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const App = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Authenticator.Provider>
            <Home />
          </Authenticator.Provider>
        }
      />
      <Route
        exact
        path='/registrar-representante-calle'
        element={
          <Authenticator.Provider>
            <RegistrarRepresentanteCalle />
          </Authenticator.Provider>
        }
      />
      <Route
        exact
        path='/registrar-lona'
        element={
          <Authenticator.Provider>
            <RegistrarLona />
          </Authenticator.Provider>
        }
      />
      <Route
        exact
        path='/registrar-barda'
        element={
          <Authenticator.Provider>
            <RegistrarBarda />
          </Authenticator.Provider>
        }
      />
      <Route
        exact
        path='/registrar-promovido'
        element={
          <Authenticator.Provider>
            <RegistrarPromovido />
          </Authenticator.Provider>
        }
      />
      <Route
        exact
        path='/dirigente'
        element={
          <Authenticator.Provider>
            <DirectorRegister />
          </Authenticator.Provider>
        }
      />
      <Route
        exact
        path='/coordinador'
        element={
          <Authenticator.Provider>
            <CoordinadorRegister />
          </Authenticator.Provider>
        }
      />
      <Route
        exact
        path='/promotor'
        element={
          <Authenticator.Provider>
            <PromotorRegister />
          </Authenticator.Provider>
        }
      />
    </Routes>
  );
};

export default App;
