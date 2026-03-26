import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { Outlet, Navigate } from "react-router-dom";
import { Navbar } from "@/shared/components/navbar/Navbar";

// const PrivateRoute = () => {
//   const isAuthenticated = AuthHelper.isAuthenticated();
//   if (!isAuthenticated) return <Navigate to="/signin" replace />;

//   return (
//     <div>
//       <Navbar />
//       <main>
//           <Outlet />
//       </main>
//     </div>
//   );
// };
const PrivateRoute = () => {
  const isAuthenticated = AuthHelper.isAuthenticated();
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div>
      <Navbar />
      <main className="pt-18"> {/* ✅ added padding so content not hidden behind navbar */}
        <Outlet />
      </main>
    </div>
  );
};
export { PrivateRoute };