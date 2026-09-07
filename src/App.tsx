// import { Routes, Route } from "react-router-dom";
// import SignInPage from "@/shared/features/auth/pages/sign-in-page/SignInPage";
// import { SignUpPage } from "@/shared/features/auth/pages/sign-up-page/SignUpPage";
// import { ForgetPinPage } from "@/shared/features/auth/pages/forget-pin-page/ForgetPinPage";
// import { OtpVerificationPage } from "@/shared/features/auth/pages/otp-verification-page/OtpVerificationPage";
// import { PrivateRoute } from "@/shared/components/routehandlers/PrivateRoute";
// import { EnsureUnauthenticatedRoute } from "@/shared/components/routehandlers/EnsureUnauthenticatedRoute";
// import { SiteListPage } from "@/shared/features/sites/pages/site-list/SiteListPage";
// import { UrlPages } from "@/shared/utils/UrlPages";
// import { NotFoundPage } from "./NotFoundPage";
// import SupervisorDashboard from "@/shared/features/dashboard/supervisor-dashboard/SupervisorDashboardPage";
// import EngineerDashboard from "@/shared/features/dashboard/Engineering-dashboard/EngineeringDasboardPage";

// const App = () => {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route element={<EnsureUnauthenticatedRoute />}>
//         <Route path="/" element={<SignInPage />} />
//         <Route path="/sign-up" element={<SignUpPage />} />
//         <Route path="/forgot-pin" element={<ForgetPinPage />} />
//         <Route path="/otp-verification" element={<OtpVerificationPage />} />
//       </Route>

//       {/* Private routes */}
//       <Route element={<PrivateRoute />}>
//         <Route path="/sitelist" element={<SiteListPage />} />
//         <Route path="/dashboard" element={<SupervisorDashboard />} />
//         <Route path="/engineer-dashboard" element={<EngineerDashboard />} />
//         {Object.entries(UrlPages).map(([path, item]) => {
//           const Component = item.page;
//           return <Route key={path} path={path} element={<Component />} />;
//         })}
//       </Route>

//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// };

// export default App;



import { Routes, Route } from "react-router-dom";
import SignInPage from "@/shared/features/auth/pages/sign-in-page/SignInPage";
import { SignUpPage } from "@/shared/features/auth/pages/sign-up-page/SignUpPage";
import { ForgetPinPage } from "@/shared/features/auth/pages/forget-pin-page/ForgetPinPage";
import { OtpVerificationPage } from "@/shared/features/auth/pages/otp-verification-page/OtpVerificationPage";
import { PrivateRoute } from "@/shared/components/routehandlers/PrivateRoute";
import { EnsureUnauthenticatedRoute } from "@/shared/components/routehandlers/EnsureUnauthenticatedRoute";
import { SiteListPage } from "@/shared/features/sites/pages/site-list/SiteListPage";
import { UrlPages } from "@/shared/utils/UrlPages";
import { NotFoundPage } from "./NotFoundPage";
import SupervisorDashboard from "@/shared/features/dashboard/supervisor-dashboard/SupervisorDashboardPage";
import EngineerDashboard from "@/shared/features/dashboard/Engineering-dashboard/EngineeringDasboardPage";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<EnsureUnauthenticatedRoute />}>
        <Route path="/" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-pin" element={<ForgetPinPage />} />
        <Route
          path="/otp-verification"
          element={<OtpVerificationPage />}
        />
      </Route>

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/sitelist"
          element={<SiteListPage />}
        />

        <Route
          path="/dashboard"
          element={<SupervisorDashboard />}
        />

        <Route
          path="/engineer-dashboard"
          element={<EngineerDashboard />}
        />

        {Object.entries(UrlPages).map(
          ([path, item]) => {
            const Component = item.page;

            return (
              <Route
                key={path}
                path={path}
                element={<Component />}
              />
            );
          },
        )}
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
};

export default App;