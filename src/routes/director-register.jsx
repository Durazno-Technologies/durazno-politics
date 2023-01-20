import { useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { I18n } from 'aws-amplify';
import { Authenticator, useAuthenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { components, formFields } from '../components/AuthUIDirector';
import { getAncestor, createAncestor } from '../services/api';

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

  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAncestorData = async () => {
      const ancestorData = await getAncestor(
        user.attributes.sub,
        user.signInUserSession.idToken.jwtToken,
      );
      if (!ancestorData) {
        console.log('create ancestor');
        const newAncestor = await createAncestor(user);
        console.log(newAncestor);
      } else {
        console.log(user);
        if (user.attributes['custom:role'] === 'Coordinador') {
          console.log(user);
          navigate('/dirigente');
        }
      }
    };
    if (authStatus === 'authenticated') {
      getAncestorData();
    }
  }, [authStatus]);

  return (
    <div className='mt-8'>
      {authStatus === 'configuring' && 'Loading...'}
      {authStatus !== 'authenticated' ? (
        <Authenticator
          signUpAttributes={['name', 'phone_number', 'email']}
          components={components}
          formFields={formFields}
          services={services}
        />
      ) : (
        <div className='container'>
          <div className='mt-24 border border-solid border-red-50'>
            <p className='text-pink-900 text-lg font-bold'>Hola {user.attributes.name}</p>
            <p className='text-pink-800 text-sm font-bold mt-2'>
              Da click en el boton Descargar para obtener los registros de la gente
            </p>
          </div>
          <div className='mt-8 flex flex-col '>
            <a
              href='#_'
              className='relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300'
            >
              <span className='absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease'></span>
              <span className='relative'>Descargar Registros</span>
            </a>
            <a
              onClick={signOut}
              className='mt-4 relative rounded px-5 py-2.5 overflow-hidden group bg-pink-800 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300'
            >
              <span className='absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease'></span>
              <span className='relative'>Salir</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorRegister;
