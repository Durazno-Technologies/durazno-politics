import { useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { I18n } from 'aws-amplify';
import ClipLoader from 'react-spinners/ClipLoader';
import { Authenticator, useAuthenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import useGetAncestros from '../hooks/useGetAncestor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { components, formFields } from '../components/AuthUICoordinator';
import { getAncestor, createAncestor } from '../services/api';

I18n.putVocabularies(translations);
I18n.setLanguage('es');

I18n.putVocabularies({
  es: {
    'Sign In': 'Inicia sesión',
    'Sign Up': 'Regístrate',
  },
});

const CoordinatorRegister = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { ancestors } = useGetAncestros('Dirigente');

  const navigate = useNavigate();

  const services = {
    async handleSignUp(formData) {
      let { username, password, attributes } = formData;
      attributes['custom:role'] = 'Coordinador';
      return Auth.signUp({
        username,
        password,
        attributes,
        autoSignIn: {
          enabled: true,
        },
      });
    },
    async validateCustomSignUp(formData) {
      console.log(ancestors);
      if (!formData['custom:ancestorId']) {
        return {
          ['custom:ancestorId']: 'Tienes que ingresar el ID de tu dirigente',
        };
      } else {
        let validAncestor = ancestors.filter(
          (ancestor) => ancestor.identifier === formData['custom:ancestorId'],
        );
        if (validAncestor.length === 0) {
          return {
            ['custom:ancestorId']: 'Identificador invalido',
          };
        }
      }
    },
  };

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
        if (user.attributes['custom:role'] === 'Dirigente') {
          console.log(user);
          navigate('/dirigente');
        }
      }
    };
    if (authStatus === 'authenticated') {
      getAncestorData();
    }
  }, [authStatus]);

  //console.log(ancestors);

  return (
    <div className='mt-8'>
      <ToastContainer
        position='top-right'
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      {ancestors.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className='h-screen flex justify-center items-center'>
          <ClipLoader
            color={'#96272d'}
            size={50}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      )}
    </div>
  );
};

export default CoordinatorRegister;
