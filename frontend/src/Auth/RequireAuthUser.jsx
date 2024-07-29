import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ role,isLoggedIn, children }) => {
    if (isLoggedIn && role==="User") {
        return children;
    }
    return <Navigate to="/login" />;
};

export default RequireAuth;
