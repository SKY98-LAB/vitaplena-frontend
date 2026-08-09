import { useContext } from 'react';
import { AuthContext } from '../contexts/auth-context';

function useAuth() {
  const contexto = useContext(AuthContext);
  if (contexto === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return contexto;
}

export default useAuth;
