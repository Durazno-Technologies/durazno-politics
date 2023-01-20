import { useAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import { components, formFields } from './AuthUIHome';
import Profile from './Profile';

const Home = () => {
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
        <Profile />
      )}
    </>
  );
};

export default Home;
