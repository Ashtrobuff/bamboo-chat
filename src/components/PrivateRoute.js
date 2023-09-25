import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Route, Navigate, Routes } from 'react-router-dom';

const PrivateRoute = ({ path, children }) => {
  const { User } = useAuth();
  return (
    <Routes>
      {User 
        ? <Route path={path} element={children} /> 
        : <Route path='*' element={<Navigate to="/login" replace />} />
      }
    </Routes>
  );
}

export default PrivateRoute;
