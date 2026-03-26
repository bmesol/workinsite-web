import signInPageIllustration from "@/assets/images/siginin-illustration.png";
 import "./SignInPageStyle.scss";
import { SignInForm } from "@/shared/features/auth/components/signinform/SignInForm";


const SignInPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-start md:items-center bg-gray-50 bg-white  ">
      <div className="w-full mx-auto flex flex-col md:flex-row items-start md:items-center px-4 md:px-10 signin-page-bg ">

        {/* Left column */}
        <div className="w-full md:w-7/12 ">
          <div className="p-6">
            <img
              src={signInPageIllustration}
              alt="Sign In Illustration"
              className="w-11/12 sm:w-8/12 md:w-10/12 h-auto mx-auto md:mx-0"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="w-full md:w-5/12">
          <SignInForm />
        </div>

      </div>
    </div>
  );
};

export default SignInPage;