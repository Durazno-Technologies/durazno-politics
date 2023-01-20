import { useState } from 'react';
import { TextField } from '@aws-amplify/ui-react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import useGetAncestor from '../hooks/useGetAncestor';

function SignUpRole() {
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [ancestorIdentifier, setAncestorIdentifier] = useState('');

  const { ancestors } = useGetAncestor();

  console.log(ancestors);

  const handleRoleChange = () => {
    setIsCoordinator(!isCoordinator);
  };

  const handleAncestorIdentifierChange = (e) => {
    setAncestorIdentifier(e.target.value);
  };

  console.log(ancestorIdentifier);

  return (
    <div className='mt-4'>
      <div className='flex align-center'>
        <Toggle id='role' defaultChecked={isCoordinator} onChange={handleRoleChange} />
        <label htmlFor='role' className='ml-4'>
          ¿Eres Coordinador?
        </label>
      </div>
      {isCoordinator && (
        <div className='mt-4'>
          <label className='text-gray-600 font-medium'>Identificador del dirigente</label>
          <TextField
            placeholder='Identificador'
            label=''
            errorMessage='There is an error'
            onChange={handleAncestorIdentifierChange}
          />
        </div>
      )}
    </div>
  );
}

export default SignUpRole;
