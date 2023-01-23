import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { authStatus, user } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      if (user) {
        if (user.attributes['custom:role'] === 'Dirigente') {
          navigate('/dirigente');
        }
        if (user.attributes['custom:role'] === 'Coordinador') {
          navigate('/coordinador');
        }
      }
    }
  }, [authStatus]);

  return (
    <div className='container mt-8 flex justify-center'>
      <div>
        <h1 className='mt-12 text-pink-700 text-lg font-bold'>Selecciona tu perfil</h1>
        <div className='mt-8 flex flex-col'>
          <button
            type='button'
            className='inline-block w-full px-6 py-4 bg-pink-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-pink-700 hover:shadow-lg focus:bg-pink-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-pink-800 active:shadow-lg transition duration-150 ease-in-out max-w-xs'
            onClick={() => navigate('/dirigente')}
          >
            Dirigente
          </button>
          <button
            type='button'
            className='mt-4 w-full inline-block px-6 py-4 bg-pink-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-pink-700 hover:shadow-lg focus:bg-pink-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-pink-800 active:shadow-lg transition duration-150 ease-in-out max-w-xs'
            onClick={() => navigate('/coordinador')}
          >
            Coordinador
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
