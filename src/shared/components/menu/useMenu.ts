// useMenu.ts
// useMenu.ts
import { AuthHelper, type UserProfile } from "@/shared/features/auth/helpers/AuthHelper";
import { useState, useEffect } from "react";




const useMenu = () => {
  // Initialize state with the UserProfile type
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // 1. Pull the data from localStorage via AuthHelper
    const profile = AuthHelper.getUserProfile();

    // 2. Update state if profile exists
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  return { userProfile };
};

export { useMenu };

