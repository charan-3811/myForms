/* eslint-disable react/prop-types */
// PrivateRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const PrivateRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    const location = useLocation(); // Capture the route the user tried to access

    // If not logged in, redirect to the login page with the original route saved
    if (user==='None') {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If logged in, allow access to the requested component
    return children;
};

export default PrivateRoute;
