import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate("/login");
            return;
        }

        if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
            const userRole = (user.role || "").toLowerCase();
            if (userRole === "admin") {
                return; // Admin has access to all protected routes
            }

            const isAuthorized = allowedRoles.some(role => {
                const r = role.toLowerCase();
                if (r === userRole) return true;
                if (r === "candidate" && userRole === "student") return true;
                if (r === "student" && userRole === "candidate") return true;
                return false;
            });

            if (!isAuthorized) {
                navigate("/");
            }
        }
    }, [user, allowedRoles, navigate]);

    if (!user) return null;

    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;