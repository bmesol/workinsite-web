import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { Navigate, Outlet } from "react-router-dom";

// const EnsureUnauthenticatedRoute = () => {
//   const isAuthenticated = AuthHelper.isAuthenticated();
//   return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
// };

const EnsureUnauthenticatedRoute = () => {
  const isAuthenticated = AuthHelper.isAuthenticated();
  return isAuthenticated ? <Navigate to="/sitelist" replace /> : <Outlet />; // ✅ changed from "/"
};

export { EnsureUnauthenticatedRoute };
