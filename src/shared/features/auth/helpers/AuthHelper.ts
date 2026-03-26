import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  Name: string;
  UserId: string;
  role: string;
};

export type UserProfile = {
  name: string;
  id: string;
  phone: string;
  note: string;
  role: {
    id: number;
    name: string;
  };
};

const ROLE_MAP: Record<number, string> = {
  1: "Admin",
  2: "Engineer",
  3: "Supervisor",
};

const AuthHelper = {
  setAccessToken: (token: string) => {
    if (!token) return;

    try {
      localStorage.setItem("_at", token);

      const decoded = jwtDecode<DecodedToken>(token);
      const roleId = Number(decoded.role);

      const userProfile: UserProfile = {
        name: decoded.Name,
        id: decoded.UserId,
        phone: "",   
        note: "",    
        role: {
          id: roleId,
          name: ROLE_MAP[roleId] || "User",
        },
      };

      AuthHelper.setUserProfile(userProfile);
    } catch (error) {
      console.error("JWT decode failed", error);
      AuthHelper.logout();
    }
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem("_at");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("_at");
  },

  // ===== User profile handling =====
  setUserProfile: (profile: UserProfile) => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  },

  getUserProfile(): UserProfile | null {
    const profileString = localStorage.getItem("userProfile");
    if (!profileString) return null;
    try {
      return JSON.parse(profileString);
    } catch (e) {
      return null;
    }
  },

  // ===== Logout =====
  logout: () => {
    localStorage.removeItem("_at");
    localStorage.removeItem("userProfile");
    window.location.href = "/";
  },
};

export { AuthHelper };