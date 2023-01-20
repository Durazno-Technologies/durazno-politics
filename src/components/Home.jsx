import { useAuthenticator } from '@aws-amplify/ui-react';

const Home = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  console.log(user);
  return (
    <div className='container'>
      <div className='mt-24 border border-solid border-red-50'>
        <p className='text-pink-900 text-lg font-bold'>Hola {user.attributes.name} lol</p>
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
  );
};

export default Home;
