import { Route, Routes } from 'react-router-dom';
import './index.css';
import Pregister from './routes/pre-register';
import CoordinadorRegister from './routes/coordinator-register';
import DirectorRegister from './routes/director-register';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const App = () => {
  // Use the value of authStatus to decide which page to render
  return (
    <Routes>
      <Route path='/' element={<Pregister />} />
      <Route path='/pre-registro' element={<Pregister />} />
      <Route
        path='/dirigente'
        element={
          <Authenticator.Provider>
            <DirectorRegister />
          </Authenticator.Provider>
        }
      />
      <Route
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
