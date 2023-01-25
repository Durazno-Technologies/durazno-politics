import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { I18n } from 'aws-amplify';
import { Authenticator, useAuthenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { components, formFields } from '../components/AuthUIDirector';
import { getAncestor, createAncestor } from '../services/api';
import DirectorProfile from '../components/DirectorProfile';

I18n.putVocabularies(translations);
I18n.setLanguage('es');

I18n.putVocabularies({
  es: {
    'Sign In': 'Inicia sesión',
    'Sign Up': 'Regístrate',
  },
});

const DirectorRegister = () => {
  const services = {
    async handleSignUp(formData) {
      let { username, password, attributes } = formData;
      attributes['custom:role'] = 'Dirigente';
      return Auth.signUp({
        username,
        password,
        attributes,
        autoSignIn: {
          enabled: true,
        },
      });
    },
  };

  const { user } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const getAncestorData = async () => {
      const ancestorData = await getAncestor(
        user.attributes.sub,
        user.signInUserSession.idToken.jwtToken,
      );
      if (!ancestorData) {
        const newAncestor = await createAncestor(user);
        setUserInfo(newAncestor.data);
      } else {
        console.log(user);
        if (user.attributes['custom:role'] === 'Coordinador') {
          console.log(user);
          navigate('/coordinador');
        }
        if (user.attributes['custom:role'] === 'Promotor') {
          console.log(user);
          navigate('/promotor');
        }
      }
    };
    if (authStatus === 'authenticated') {
      getAncestorData();
    }
  }, [authStatus]);

  useEffect(() => {
    console.log('si entra al director');
    localStorage.setItem('alreadyLoaded', true);
  }, []);

  return (
    <div className='mt-8'>
      {authStatus === 'configuring' && 'Loading...'}
      {authStatus !== 'authenticated' ? (
        <>
          <div>
            <button
              onClick={() => {
                navigate('/');
                localStorage.setItem('alreadyLoaded', false);
              }}
              className='underline text-blue-800'
            >
              Seleccionar perfil
            </button>
          </div>
          <Authenticator
            signUpAttributes={['name', 'phone_number', 'email']}
            components={components}
            formFields={formFields}
            services={services}
            className='mt-8'
            initialState='signIn'
          />
        </>
      ) : (
        <DirectorProfile userProfile={userInfo} />
      )}
    </div>
  );
};

export default DirectorRegister;
