
import { AuthHelper, type UserProfile } from "@/shared/features/auth/helpers/AuthHelper";
import { useState, useEffect } from "react";


const useMenu = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const profile = AuthHelper.getUserProfile();
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  return { userProfile };
};

export { useMenu };

