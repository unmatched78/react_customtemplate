import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  console.log('[PrivateRoute] loading =', loading, ' user =', user);
  if (loading) return <div>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
