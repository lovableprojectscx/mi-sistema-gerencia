
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

const ProtectedRoute = ({ requireAdmin = false }: ProtectedRouteProps) => {
    const { user, profile, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // 1. Not logged in -> Redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Require Admin check
    if (requireAdmin && !isAdmin) {
        // If logged in but not admin, redirect to dashboard or show forbidden
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Authorized -> Render content
    return <Outlet />;
};

export default ProtectedRoute;
