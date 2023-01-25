import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getLeads, getAncestor } from '../services/api';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const CoordinatorProfile = ({ userProfile }) => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [leads, setLeads] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getLeadsData = async () => {
      let leadsData = await getLeads(user.signInUserSession.idToken.jwtToken);
      setLeads(leadsData);
      return leadsData;
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
          console.log(userProfile);
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

  function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64.data);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const downloadXLSFile = () => {
    const anchor_href =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + leads;
    console.log(anchor_href);
    const fileBlob = new Blob([_base64ToArrayBuffer(leads)], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(fileBlob, 'registros-ciudadanos.xlsx');
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
    <div className='container'>
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

      {!leads && (
        <div className='mt-8'>
          <p className='text-pink-800 text-sm font-bold mt-2'>Aún no tienes registros</p>
        </div>
      )}
      {leads && (
        <div>
          <div className='mt-8'>
            <p className='text-pink-800 text-sm font-bold mt-2'>
              Da click en el boton Descargar para obtener tus registros
            </p>
          </div>
          <div className='mt-4 flex'>
            <button
              type='button'
              onClick={downloadXLSFile}
              className='inline-block w-full px-6 py-4 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out max-w-xs'
            >
              Descargar registros
            </button>
          </div>
        </div>
      )}

      <button
        type='button'
        onClick={() => {
          signOut();
          localStorage.setItem('alreadyLoaded', false);

          setTimeout(() => {
            navigate('/');
          }, 500);
        }}
        className='mt-8 w-full inline-block px-6 py-4 bg-pink-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-pink-700 hover:shadow-lg focus:bg-pink-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-pink-800 active:shadow-lg transition duration-150 ease-in-out max-w-xs'
      >
        Salir
      </button>
    </div>
  );
};

export default CoordinatorProfile;
