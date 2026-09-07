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

// const ACCESS_TOKEN_KEY = "_at";
// const REFRESH_TOKEN_KEY = "_rt";
// const PROFILE_KEY = "userProfile";

// const AuthHelper = {
//   setAccessToken: (token: string) => {
//     if (!token) return;

//     try {
//       localStorage.setItem(ACCESS_TOKEN_KEY, token);

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
//     return localStorage.getItem(ACCESS_TOKEN_KEY);
//   },

//   setRefreshToken: (token: string) => {
//     if (!token) return;
//     localStorage.setItem(REFRESH_TOKEN_KEY, token);
//   },

//   getRefreshToken: (): string | null => {
//     return localStorage.getItem(REFRESH_TOKEN_KEY);
//   },

//   isAuthenticated: (): boolean => {
//     return !!localStorage.getItem(ACCESS_TOKEN_KEY);
//   },

//   setUserProfile: (profile: UserProfile) => {
//     localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
//   },

//   getUserProfile(): UserProfile | null {
//     const profileString = localStorage.getItem(PROFILE_KEY);
//     if (!profileString) return null;
//     try {
//       return JSON.parse(profileString);
//     } catch (e) {
//       return null;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem(ACCESS_TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//     localStorage.removeItem(PROFILE_KEY);
//     window.location.href = "/";
//   },
// };

// export { AuthHelper };


import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  Name?: string;
  UserId?: string;
  role?: string;
  exp?: number;
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

      /*
       * Preserve existing profile information.
       *
       * This is important because setAccessToken() is also called every time
       * the access token is refreshed.
       *
       * We don't want a token refresh to erase phone, note or pageRights.
       */
      const existingProfile = AuthHelper.getUserProfile();

      const userProfile: UserProfile = {
        name: decoded.Name ?? existingProfile?.name ?? "",
        id: decoded.UserId ?? existingProfile?.id ?? "",
        phone: existingProfile?.phone ?? "",
        note: existingProfile?.note ?? "",
        role: {
          id: roleId || existingProfile?.role?.id || 0,
          name:
            ROLE_MAP[roleId] ||
            existingProfile?.role?.name ||
            "User",
        },
        pageRights: existingProfile?.pageRights ?? [],
      };

      AuthHelper.setUserProfile(userProfile);
    } catch (error) {
      console.error("JWT decode failed", error);

      /*
       * Don't redirect immediately just because decoding failed.
       * Remove the bad authentication data instead.
       */
      AuthHelper.clearAuthData();
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

  /**
   * Checks whether an access token is currently usable.
   */
  isAccessTokenValid: (token?: string | null): boolean => {
    const accessToken = token ?? AuthHelper.getAccessToken();

    if (!accessToken) {
      return false;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(accessToken);

      if (!decoded.exp) {
        return false;
      }

      /*
       * JWT exp is stored in seconds.
       * Date.now() is milliseconds.
       *
       * 10-second buffer avoids using a token which is about to expire.
       */
      const expiryTime = decoded.exp * 1000;
      const bufferTime = 10 * 1000;

      return expiryTime > Date.now() + bufferTime;
    } catch (error) {
      console.error("Unable to decode access token", error);
      return false;
    }
  },

  /**
   * Synchronous check only.
   *
   * This does NOT attempt refresh.
   * Route guards use AuthService.restoreSession() for the complete check.
   */
  isAuthenticated: (): boolean => {
    return AuthHelper.isAccessTokenValid();
  },

  setUserProfile: (profile: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  getUserProfile: (): UserProfile | null => {
    const profileString = localStorage.getItem(PROFILE_KEY);

    if (!profileString) {
      return null;
    }

    try {
      return JSON.parse(profileString);
    } catch {
      return null;
    }
  },

  /**
   * Removes authentication information without performing navigation.
   *
   * Useful from route guards and refresh handling.
   */
  clearAuthData: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
  },

  /**
   * User/forced logout.
   */
  logout: () => {
    AuthHelper.clearAuthData();
    window.location.href = "/";
  },
};

export { AuthHelper };