import { useState, useEffect } from 'react';
import { getAncestors } from '../services/api';

function useGetAncestor(role) {
  const [ancestors, setAncestors] = useState([]);

  useEffect(() => {
    let ignore = false;

    const getAncestorsData = async () => {
      const ancestors = await getAncestors(role);
      if (!ignore) {
        setAncestors(ancestors);
      }
    };
    getAncestorsData();

    return () => {
      ignore = true;
    };
  }, []);

  return { ancestors };
}

export default useGetAncestor;
