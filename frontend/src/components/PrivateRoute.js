import { Navigate, Route, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function PrivateRoute() {
  const { accessToken } = useAuth();

  return (accessToken ? <Outlet /> : <Navigate to="/signin" />);
}