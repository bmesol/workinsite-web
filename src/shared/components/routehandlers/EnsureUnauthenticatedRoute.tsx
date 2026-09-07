// import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
// import { Navigate, Outlet } from "react-router-dom";

// // const EnsureUnauthenticatedRoute = () => {
// //   const isAuthenticated = AuthHelper.isAuthenticated();
// //   return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
// // };

// const EnsureUnauthenticatedRoute = () => {
//   const isAuthenticated = AuthHelper.isAuthenticated();
//   return isAuthenticated ? <Navigate to="/sitelist" replace /> : <Outlet />; // ✅ changed from "/"
// };

// export { EnsureUnauthenticatedRoute };


import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthService } from "@/shared/features/auth/services/AuthService";

const EnsureUnauthenticatedRoute = () => {
  const [checkingSession, setCheckingSession] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        /*
         * If the user visits "/" while an old access token
         * has expired but the 7-day refresh token is still
         * valid, restore the session automatically.
         */
        const validSession =
          await AuthService.restoreSession();

        if (mounted) {
          setIsAuthenticated(validSession);
        }
      } catch (error) {
        console.error(
          "Unable to check existing session",
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

  if (checkingSession) {
    return null;
  }

  /*
   * Existing valid/recoverable session:
   * don't show sign-in page.
   */
  if (isAuthenticated) {
    return (
      <Navigate
        to="/sitelist"
        replace
      />
    );
  }

  return <Outlet />;
};

export { EnsureUnauthenticatedRoute };
