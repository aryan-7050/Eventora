import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();

    if (!token || !user) {
        // Redirect to the appropriate login page based on the role we expect for this route
        let redirectPath = '/';
        if (location.pathname.startsWith('/student')) redirectPath = '/student/login';
        else if (location.pathname.startsWith('/admin')) redirectPath = '/admin/login';
        else if (location.pathname.startsWith('/club')) redirectPath = '/club/login';

        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // Role check (optional but recommended)
    if (role && user.role !== role) {
        // If they are logged in but don't have the right role, send to their own portal login
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
