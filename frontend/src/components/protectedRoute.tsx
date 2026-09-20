import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAppData } from "../context/AppContext";

const ProtectedRoute = () => {
    const {isAuth, user, loading} = useAppData();

    if (loading) { return null; }

    const location = useLocation();

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role === null && location.pathname !== "/select-role") {
        return <Navigate to="/select-role" replace />;
    }

    if (user?.role !== null && location.pathname === "/select-role") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;

}

export default ProtectedRoute;