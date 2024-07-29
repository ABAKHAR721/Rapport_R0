// src/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-4">404 - Not Found</h1>
            <p className="lead">The page you are looking for does not exist.</p>
        </div>
    );
};

export default NotFound;
