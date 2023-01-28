import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getLeads, getAncestor, getAncestorMunicipality, updateAncestor } from '../services/api';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import Header from './Header';

const CoordinatorProfile = ({ userProfile }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [representantesLeads, setRepresentantesLeads] = useState('');
  const [lonasLeads, setLonasLeads] = useState('');
  const [bardasLeads, setBardasLeads] = useState('');
  const [promovidosLeads, setPromovidosLeads] = useState('');

  useEffect(() => {
    const getLeadsData = async () => {
      let repreLeadsData = await getLeads(
        user.signInUserSession.idToken.jwtToken,
        'Representante de Calle',
      );
      if (repreLeadsData) {
        setRepresentantesLeads(repreLeadsData);
      }
      let lonasLeadsData = await getLeads(user.signInUserSession.idToken.jwtToken, 'Lona');
      if (lonasLeadsData) {
        setLonasLeads(lonasLeadsData);
      }
      let bardasLeadsData = await getLeads(user.signInUserSession.idToken.jwtToken, 'Barda');

      if (bardasLeadsData) {
        setBardasLeads(bardasLeadsData);
      }

      let promovidosLeadsData = await getLeads(
        user.signInUserSession.idToken.jwtToken,
        'Promovido',
      );
      if (promovidosLeadsData) {
        setPromovidosLeads(promovidosLeadsData);
      }
    };
    const getUserInfo = async () => {
      let info = await getAncestor(user.attributes.sub, user.signInUserSession.idToken.jwtToken);
      if (info) {
        setUserInfo(info.data);
      }
    };
    if (user) {
      try {
        setIsLoading(true);
        getLeadsData();
        if (Object.keys(userProfile).length === 0) {
          getUserInfo();
        } else {
          setUserInfo(userProfile);
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (Object.keys(userProfile).length > 0) {
      setUserInfo(userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    const getAncestorMunicipalityData = async () => {
      try {
        const municipality = await getAncestorMunicipality(user.signInUserSession.idToken.jwtToken);

        if (municipality) {
          const updatedAncestor = await updateAncestor(
            municipality,
            userInfo.id,
            user.signInUserSession.idToken.jwtToken,
          );
          setUserInfo(updatedAncestor);
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (Object.keys(userInfo).length > 0) {
      if (!Object.hasOwn(userInfo, 'municipality')) {
        getAncestorMunicipalityData();
      }
    }
  }, [userInfo]);

  function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64.data);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const downloadXLSFile = (leads, name) => {
    const fileBlob = new Blob([_base64ToArrayBuffer(leads)], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(fileBlob, `${name}.xlsx`);
    toast.success('Archivo generado correctamente, revisa tu carpeta de descargas!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };
  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <ClipLoader color={'#96272d'} size={50} aria-label='Loading Spinner' data-testid='loader' />
      </div>
    );
  }

  return (
    <div className='container mb-8'>
      <Header />

      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      {user && Object.keys(user).length > 0 && (
        <div className='mt-12 border border-solid border-red-50'>
          <p className='text-pink-900 text-lg font-bold'>
            Hola {user.attributes.name.toLocaleUpperCase()}
          </p>
        </div>
      )}

      {userInfo && Object.keys(userInfo).length > 0 && (
        <>
          <div className='mt-8'>
            {!userInfo.municipality ? (
              <div className='flex items-center'>
                <p className='text-pink-800 text-sm font-bold'>
                  Municipio:
                  <span className='bg-pink-800 ml-2 px-2 py-2 text-white'>N/A</span>
                </p>
              </div>
            ) : (
              <p className='text-pink-800 text-sm font-bold'>
                Municipio:
                <span className='bg-pink-800 ml-2 px-2 py-2 text-white'>
                  {userInfo.municipality}
                </span>
              </p>
            )}
          </div>
          <div className='mt-8'>
            <p className='text-pink-800 text-sm font-bold'>
              Rol:
              <span className='bg-pink-800 ml-2 px-2 py-2 text-white'>{userInfo.role}</span>
            </p>
          </div>
          <div className='mt-8'>
            <p className='text-pink-800 text-sm font-bold'>
              Tu identificador es el
              <span className='bg-pink-800 ml-2 px-2 py-2 text-white'>{userInfo.identifier}</span>
            </p>
          </div>
        </>
      )}

      <div className='mt-16'>
        {!representantesLeads && (
          <div className='mt-8'>
            <p className='text-pink-800 text-sm font-bold mt-2'>
              *Aún no tienes registros de Representantes de Calle
            </p>
          </div>
        )}
        {representantesLeads && (
          <div>
            <div className='mt-4 flex'>
              <button
                type='button'
                onClick={() => {
                  downloadXLSFile(representantesLeads, 'Representantes de Calle');
                }}
                className='inline-block w-full px-6 py-4 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out max-w-xs'
              >
                Descargar Representantes de Calles
              </button>
            </div>
          </div>
        )}

        {!lonasLeads && (
          <div className='mt-8'>
            <p className='text-pink-800 text-sm font-bold mt-2 '>
              *Aún no tienes registros de Lonas
            </p>
          </div>
        )}
        {lonasLeads && (
          <div>
            <div className='mt-4 flex'>
              <button
                type='button'
                onClick={() => {
                  downloadXLSFile(lonasLeads, 'Lonas');
                }}
                className='inline-block w-full px-6 py-4 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out max-w-xs'
              >
                Descargar Lonas
              </button>
            </div>
          </div>
        )}

        {!bardasLeads && (
          <div className='mt-8'>
            <p className='text-pink-800 text-sm font-bold mt-2'>
              *Aún no tienes registros de Bardas
            </p>
          </div>
        )}
        {bardasLeads && (
          <div>
            <div className='mt-4 flex'>
              <button
                type='button'
                onClick={() => {
                  downloadXLSFile(bardasLeads, 'Bardas');
                }}
                className='inline-block w-full px-6 py-4 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out max-w-xs'
              >
                Descargar Bardas
              </button>
            </div>
          </div>
        )}

        {!promovidosLeads && (
          <div className='mt-8'>
            <p className='text-pink-800 text-sm font-bold mt-2'>
              *Aún no tienes registros de Promovidos
            </p>
          </div>
        )}
        {promovidosLeads && (
          <div>
            <div className='mt-4 flex'>
              <button
                type='button'
                onClick={() => {
                  downloadXLSFile(promovidosLeads, 'Promovidos');
                }}
                className='inline-block w-full px-6 py-4 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out max-w-xs'
              >
                Descargar Promovidos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorProfile;
