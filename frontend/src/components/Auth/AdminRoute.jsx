import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from "../../hooks/auth/useAuth";

const AdminRoute = () => {
    // const { user } = useAuth();

    // const isAuthenticated = !!user; 
    // const isAdmin = user?.role === 'admin';
    const isAuthenticated = true
    const isAdmin = true

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/buscar-medico" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;