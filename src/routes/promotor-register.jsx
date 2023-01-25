import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { I18n } from 'aws-amplify';
import ClipLoader from 'react-spinners/ClipLoader';
import { Authenticator, useAuthenticator, translations } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import useGetAncestros from '../hooks/useGetAncestor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { components, formFields } from '../components/AuthUIPromotor';
import { getAncestor, createAncestor } from '../services/api';
import PromotorProfile from '../components/PromotorProfile';

I18n.putVocabularies(translations);
I18n.setLanguage('es');

I18n.putVocabularies({
  es: {
    'Sign In': 'Inicia sesión',
    'Sign Up': 'Regístrate',
  },
});

const PromotorRegister = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { ancestors } = useGetAncestros('Coordinador');
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();

  const services = {
    async handleSignUp(formData) {
      let { username, password, attributes } = formData;
      attributes['custom:role'] = 'Promotor';
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
      if (!formData['custom:ancestorId']) {
        return {
          ['custom:ancestorId']: 'Tienes que ingresar el ID de tu coordinador',
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
        console.log(user);
        const newAncestor = await createAncestor(user);
        console.log(newAncestor);
        setUserInfo(newAncestor.data);
      } else {
        if (user.attributes['custom:role'] === 'Dirigente') {
          console.log(user);
          navigate('/dirigente');
        }
        if (user.attributes['custom:role'] === 'Coordinador') {
          console.log(user);
          navigate('/coordinador');
        }
      }
    };
    if (authStatus === 'authenticated') {
      getAncestorData();
    }
  }, [authStatus]);

  //console.log(ancestors);

  console.log(authStatus);

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
              />
            </>
          ) : (
            <PromotorProfile userProfile={userInfo} />
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

export default PromotorRegister;
