import { Routes, Route } from "react-router-dom";
import SignInPage from "@/shared/features/auth/containers/sign-in-page/SignInPage";
import { SignUpPage } from "@/shared/features/auth/containers/sign-up-page/SignUpPage";
import { ForgetPinPage } from "@/shared/features/auth/containers/forget-pin-page/ForgetPinPage";
import { OtpVerificationPage } from "@/shared/features/auth/containers/otp-verification-page/OtpVerificationPage";
import { PrivateRoute } from "@/shared/components/routehandlers/PrivateRoute";
import { EnsureUnauthenticatedRoute } from "@/shared/components/routehandlers/EnsureUnauthenticatedRoute";
import { SiteListPage } from "@/shared/features/sites/containers/SiteListPage";
import { UrlPages } from "@/shared/utils/UrlPages";
import { NotFoundPage } from "./NotFoundPage";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<EnsureUnauthenticatedRoute />}> 
        <Route path="/" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-pin" element={<ForgetPinPage />} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
      </Route>

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/sitelist" element={<SiteListPage />} />
        {Object.entries(UrlPages).map(([path, item]) => {
          const Component = item.page;
          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Route>

       <Route path="*" element={<NotFoundPage />} />    </Routes>
  );
};

export default App;

