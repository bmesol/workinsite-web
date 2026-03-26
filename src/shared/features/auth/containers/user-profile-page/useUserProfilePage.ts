// import { useInputValidate } from "@/shared/features/auth/components/InputValidate/useInputValidate";
// import { useUserService } from "@/shared/features/users/services/UserService";
// import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
// import { toast } from "sonner"; // ✅ sonner use pannuvaen
// import { useState } from "react";

// const useUserProfile = () => {
//   const userService = useUserService();
//   const user = AuthHelper.getUserProfile()!;

//   const [name, setName] = useState(user.name);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isActive, setIsActive] = useState(true);
//   const [notes, setNotes] = useState("");

//   const { error, validate } = useInputValidate({ name, phoneNumber });

//   let isDisabled = false;
//   if (user.role.name === "Supervisor") isDisabled = true;

//   const handleSubmission = async () => {
//     if (validate()) {
//       const userData = { name, phone: phoneNumber, note: notes };
//       try {
//         await userService.updateProfile(userData);
//         const updatedProfile = await userService.getProfile();
//         AuthHelper.setUserProfile(updatedProfile);
//         window.location.reload();
//       } catch (err: any) {
//         const messages = err?.response?.data || [];
//         messages.map((i: any) =>
//           toast.error(i.message) // ✅ sonner style
//         );
//       }
//     }
//   };

//   return {
//     name, setName,
//     phoneNumber, setPhoneNumber,
//     error, isActive, setIsActive,
//     notes, setNotes,
//     user, handleSubmission, isDisabled,
//   };
// };

// export { useUserProfile };

import { useInputValidate } from "@/shared/features/auth/components/InputValidate/useInputValidate";
import { useUserService } from "@/shared/features/users/services/UserService";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { toast } from "sonner";
import { useState } from "react";

const useUserProfile = () => {
  const userService = useUserService();
  const user = AuthHelper.getUserProfile()!;

  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phone || "");
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState(user.note || "");

  const { error, validate } = useInputValidate({ name, phoneNumber });

  let isDisabled = false;
  if (user.role.name === "Supervisor") isDisabled = true;

  const handleSubmission = async () => {
    if (validate()) {
      const userData = { name, phone: phoneNumber, note: notes };
      try {
        await userService.updateProfile(userData);
        const updatedProfile = await userService.getProfile();
        console.log("Updated Profile:", updatedProfile); // ✅ add panninen
        AuthHelper.setUserProfile(updatedProfile);
        window.location.reload();
      } catch (err: any) {
        const messages = err?.response?.data || [];
        messages.map((i: any) => toast.error(i.message));
      }
    }
  };

  return {
    name, setName,
    phoneNumber, setPhoneNumber,
    error, isActive, setIsActive,
    notes, setNotes,
    user, handleSubmission, isDisabled,
  };
};

export { useUserProfile };