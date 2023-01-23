import { Route, Routes } from 'react-router-dom';
import './index.css';
import Pregister from './routes/pre-register';
import CoordinadorRegister from './routes/coordinator-register';
import DirectorRegister from './routes/director-register';
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
      <Route exact path='/pre-registro' element={<Pregister />} />
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
    </Routes>
  );
};

export default App;
