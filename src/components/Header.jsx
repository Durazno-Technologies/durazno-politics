import { useState } from 'react'; // import state
import { NavLink, Link } from 'react-router-dom';
export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false); // initiate isNavOpen state with false

  return (
    <div className='flex items-center justify-between border-b border-gray-400 py-8'>
      <Link to='/'>
        <img src='https://durazno-politics.s3.amazonaws.com/mne.jpeg' alt='logo' className='w-24' />
      </Link>
      <nav>
        <section className='MOBILE-MENU flex lg:hidden'>
          <div
            className='HAMBURGER-ICON space-y-2'
            onClick={() => setIsNavOpen((prev) => !prev)} // toggle isNavOpen state on click
          >
            <span className='block h-0.5 w-8 animate-pulse bg-gray-600'></span>
            <span className='block h-0.5 w-8 animate-pulse bg-gray-600'></span>
            <span className='block h-0.5 w-8 animate-pulse bg-gray-600'></span>
          </div>

          <div className={isNavOpen ? 'showMenuNav' : 'hideMenuNav'}>
            <div
              className='CROSS-ICON absolute top-0 right-0 px-8 py-8'
              onClick={() => setIsNavOpen(false)} // change isNavOpen state to false to close the menu
            >
              <svg
                className='h-8 w-8 text-gray-600'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
            </div>
            <ul className='MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px]'>
              <li className=' my-8 uppercase'>
                <NavLink
                  to='/promotor'
                  className={({ isActive }) =>
                    isActive ? 'border-b border-gray-400' : 'not-active-class'
                  }
                >
                  Reportes
                </NavLink>
              </li>
              <li className='my-8 uppercase'>
                <NavLink
                  to='/registrar-representante-calle'
                  className={({ isActive }) =>
                    isActive ? 'border-b border-gray-400' : 'not-active-class'
                  }
                >
                  Registrar Representante de Calle
                </NavLink>
              </li>
              <li className='my-8 uppercase'>
                <NavLink
                  to='/registrar-lona'
                  className={({ isActive }) =>
                    isActive ? 'border-b border-gray-400' : 'not-active-class'
                  }
                >
                  Registrar Lona
                </NavLink>
              </li>
              <li className='my-8 uppercase'>
                <NavLink
                  to='/registrar-barda'
                  className={({ isActive }) =>
                    isActive ? 'border-b border-gray-400' : 'not-active-class'
                  }
                >
                  Registrar Barda
                </NavLink>
              </li>
              <li className='my-8 uppercase'>
                <NavLink
                  to='/registrar-promovido'
                  className={({ isActive }) =>
                    isActive ? 'border-b border-gray-400' : 'not-active-class'
                  }
                >
                  Registrar Promovido
                </NavLink>
              </li>
            </ul>
          </div>
        </section>

        <ul className='DESKTOP-MENU hidden space-x-8 lg:flex'>
          <li className='my-8 uppercase'>
            <NavLink
              to='/promotor'
              className={({ isActive }) =>
                isActive ? 'border-b border-gray-400' : 'not-active-class'
              }
            >
              Reportes
            </NavLink>
          </li>
          <li className='my-8 uppercase'>
            <NavLink
              to='/registrar-representante-calle'
              className={({ isActive }) =>
                isActive ? 'border-b border-gray-400' : 'not-active-class'
              }
            >
              Registrar Representante de Calle
            </NavLink>
          </li>
          <li className='my-8 uppercase'>
            <NavLink
              to='/registrar-lona'
              className={({ isActive }) =>
                isActive ? 'border-b border-gray-400' : 'not-active-class'
              }
            >
              Registrar Lona
            </NavLink>
          </li>
          <li className='my-8 uppercase'>
            <NavLink
              to='/registrar-barda'
              className={({ isActive }) =>
                isActive ? 'border-b border-gray-400' : 'not-active-class'
              }
            >
              Registrar Barda
            </NavLink>
          </li>
          <li className='my-8 uppercase'>
            <NavLink
              to='/registrar-promovido'
              className={({ isActive }) =>
                isActive ? 'border-b border-gray-400' : 'not-active-class'
              }
            >
              Registrar Promovido
            </NavLink>
          </li>
        </ul>
      </nav>
      <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
    </div>
  );
}
