// import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
// import { Outlet, Navigate } from "react-router-dom";
// import { Navbar } from "@/shared/components/navbar/Navbar";

// // const PrivateRoute = () => {
// //   const isAuthenticated = AuthHelper.isAuthenticated();
// //   if (!isAuthenticated) return <Navigate to="/signin" replace />;

// //   return (
// //     <div>
// //       <Navbar />
// //       <main>
// //           <Outlet />
// //       </main>
// //     </div>
// //   );
// // };
// const PrivateRoute = () => {
//   const isAuthenticated = AuthHelper.isAuthenticated();
//   if (!isAuthenticated) return <Navigate to="/" replace />;

//   return (
//     <div>
//       <Navbar />
//       <main className="pt-18"> {/* ✅ added padding so content not hidden behind navbar */}
//         <Outlet />
//       </main>
//     </div>
//   );
// };
// export { PrivateRoute };


import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthService } from "@/shared/features/auth/services/AuthService";
import { Navbar } from "@/shared/components/navbar/Navbar";

const PrivateRoute = () => {
  const [checkingSession, setCheckingSession] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        /*
         * restoreSession() performs:
         *
         * 1. Check access token.
         *
         * 2. If access token is valid:
         *      continue.
         *
         * 3. If access token expired:
         *      use refresh token.
         *
         * 4. Save newly generated AT + RT.
         *
         * 5. Continue without asking user to login.
         */
        const validSession =
          await AuthService.restoreSession();

        if (mounted) {
          setIsAuthenticated(validSession);
        }
      } catch (error) {
        console.error(
          "Unable to restore authentication session",
          error,
        );

        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Do not render protected UI or redirect while
   * checking whether the refresh token can restore
   * the user's session.
   */
  if (checkingSession) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return (
    <div>
      <Navbar />

      <main className="pt-18">
        <Outlet />
      </main>
    </div>
  );
};

export { PrivateRoute };