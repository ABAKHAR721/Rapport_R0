import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ role,isLoggedIn, children }) => {
    if (!isLoggedIn && role!=="Admin") {
        return <Navigate to="/login" />;
    }
    return children;
};

export default RequireAuth;
