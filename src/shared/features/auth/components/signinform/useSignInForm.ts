
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthService } from "@/shared/features/auth/services/AuthService";
// import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
// import { useUserService } from "@/shared/features/users/services/UserService";
// import { ROLE_IDS } from "@/shared/features/rolesandrights/DTOs/DTOs";

// export const useSignInForm = () => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [pin, setPin] = useState("");
//   const [error, setError] = useState<{ phoneNumber?: string; pin?: string }>({});
//   const navigate = useNavigate();
//   const userService = useUserService();

//   const handleSubmission = async () => {
//     if (!phoneNumber) {
//       setError({ phoneNumber: "Phone number required" });
//       return;
//     }

//     if (pin.length !== 4) {
//       setError({ pin: "PIN must be 4 digits" });
//       return;
//     }

//     try {
//       const token = await AuthService.login(phoneNumber, pin);
//       AuthHelper.setAccessToken(token);

//       const user = await userService.getProfile();
//       AuthHelper.setUserProfile(user);

//       if (user.role.id === ROLE_IDS.SUPERVISOR) {
//         navigate("/dashboard");
//       } else {
//         navigate("/engineer-dashboard");
//       }
//     } catch (err) {
//       alert("Invalid phone number or PIN");
//     }
//   };

//   return {
//     phoneNumber,
//     setPhoneNumber,
//     pin,
//     setPin,
//     error,
//     handleSubmission,
//   };
// };


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/shared/features/auth/services/AuthService";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { useUserService } from "@/shared/features/users/services/UserService";
import { ROLE_IDS } from "@/shared/features/rolesandrights/DTOs/DTOs";

export const useSignInForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<{ phoneNumber?: string; pin?: string }>({});
  const navigate = useNavigate();
  const userService = useUserService();

  const handleSubmission = async () => {
    if (!phoneNumber) {
      setError({ phoneNumber: "Phone number required" });
      return;
    }

    if (pin.length !== 4) {
      setError({ pin: "PIN must be 4 digits" });
      return;
    }

    try {
      const { accessToken, refreshToken } = await AuthService.login(phoneNumber, pin);
      AuthHelper.setAccessToken(accessToken);
      AuthHelper.setRefreshToken(refreshToken);

      const user = await userService.getProfile();
      AuthHelper.setUserProfile(user);

      if (user.role.id === ROLE_IDS.SUPERVISOR) {
        navigate("/dashboard");
      } else {
        navigate("/engineer-dashboard");
      }
    } catch (err) {
      alert("Invalid phone number or PIN");
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    pin,
    setPin,
    error,
    handleSubmission,
  };
};