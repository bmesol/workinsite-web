
import { AuthHelper, type UserProfile } from "@/shared/features/auth/helpers/AuthHelper";
import { useState, useEffect } from "react";


const useMenu = () => {
  // Lazy initial state reads from localStorage synchronously on mount —
  // avoids a null→profile transition that would cause menu items to briefly
  // compute with no user (hiding permission-gated items on the first render).
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    () => AuthHelper.getUserProfile(),
  );

  useEffect(() => {
    const profile = AuthHelper.getUserProfile();
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  return { userProfile };
};

export { useMenu };
