import { useAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import Home from './components/Home';
import { components, formFields } from './components/AuthUIHome';

const App = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  // Use the value of authStatus to decide which page to render
  return (
    <>
      {authStatus === 'configuring' && 'Loading...'}
      {authStatus !== 'authenticated' ? (
        <div className='mt-8'>
          <Authenticator hideSignUp={true} components={components} formFields={formFields} />
        </div>
      ) : (
        <Home />
      )}
    </>
  );
};

export default App;
