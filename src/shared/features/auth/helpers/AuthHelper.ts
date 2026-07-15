// import { jwtDecode } from "jwt-decode";

// type DecodedToken = {
//   Name: string;
//   UserId: string;
//   role: string;
// };

// export type PageRight = {
//   name: string;
//   roleLevel: number; 
// };

// export type UserProfile = {
//   name: string;
//   id: string;
//   phone: string;
//   note: string;
//   role: {
//     id: number;
//     name: string;
//   };
//   pageRights?: PageRight[]; 
// };

// const ROLE_MAP: Record<number, string> = {
//   1: "Super Admin",
//   2: "Admin",
//   3: "Engineer",
//   4: "Supervisor",
// };

// const AuthHelper = {
//   setAccessToken: (token: string) => {
//     if (!token) return;

//     try {
//       localStorage.setItem("_at", token);

//       const decoded = jwtDecode<DecodedToken>(token);
//       const roleId = Number(decoded.role);

//       const userProfile: UserProfile = {
//         name: decoded.Name,
//         id: decoded.UserId,
//         phone: "",
//         note: "",
//         role: {
//           id: roleId,
//           name: ROLE_MAP[roleId] || "User",
//         },
//         pageRights: [], 
//       };

//       AuthHelper.setUserProfile(userProfile);
//     } catch (error) {
//       console.error("JWT decode failed", error);
//       AuthHelper.logout();
//     }
//   },

//   getAccessToken: (): string | null => {
//     return localStorage.getItem("_at");
//   },

//   isAuthenticated: (): boolean => {
//     return !!localStorage.getItem("_at");
//   },

//   setUserProfile: (profile: UserProfile) => {
//     localStorage.setItem("userProfile", JSON.stringify(profile));
//   },

//   getUserProfile(): UserProfile | null {
//     const profileString = localStorage.getItem("userProfile");
//     if (!profileString) return null;
//     try {
//       return JSON.parse(profileString);
//     } catch (e) {
//       return null;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem("_at");
//     localStorage.removeItem("userProfile");
//     window.location.href = "/";
//   },
// };

// export { AuthHelper };


import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  Name: string;
  UserId: string;
  role: string;
};

export type PageRight = {
  name: string;
  roleLevel: number;
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
  pageRights?: PageRight[];
};

const ROLE_MAP: Record<number, string> = {
  1: "Super Admin",
  2: "Admin",
  3: "Engineer",
  4: "Supervisor",
};

const ACCESS_TOKEN_KEY = "_at";
const REFRESH_TOKEN_KEY = "_rt";
const PROFILE_KEY = "userProfile";

const AuthHelper = {
  setAccessToken: (token: string) => {
    if (!token) return;

    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);

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
        pageRights: [],
      };

      AuthHelper.setUserProfile(userProfile);
    } catch (error) {
      console.error("JWT decode failed", error);
      AuthHelper.logout();
    }
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setRefreshToken: (token: string) => {
    if (!token) return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setUserProfile: (profile: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  getUserProfile(): UserProfile | null {
    const profileString = localStorage.getItem(PROFILE_KEY);
    if (!profileString) return null;
    try {
      return JSON.parse(profileString);
    } catch (e) {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    window.location.href = "/";
  },
};

export { AuthHelper };