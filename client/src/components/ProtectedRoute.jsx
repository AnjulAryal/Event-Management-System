import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute component - Checks for an authenticated user and their specific role.
 * 
 * @param {Object} props
 * @param {JSX.Element} props.children - The component to render if authorized
 * @param {Array<string>} [props.allowedRoles] - Roles permitted to visit this route (e.g. ['admin'])
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    // Get the user from localStorage saved during login
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();

    // 1. Not logged in: Redirect to login page
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Logged in but unauthorized role: Redirect back to their respective main dashboard
    const userRole = user.isAdmin ? 'admin' : 'user';
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.warn(`User role '${userRole}' is NOT authorized to access this page.`);
        // Simple logic: admins shouldn't see user pages, and vice versa
        const redirectPath = user.isAdmin ? '/admin-dashboard' : '/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    // 3. Authorized: Render the children
    return children;
};

export default ProtectedRoute;
