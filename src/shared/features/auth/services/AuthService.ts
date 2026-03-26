import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AuthService = {
  login: async (phoneNumber: string, pin: string): Promise<string> => {
    try {
      const response = await api.post("/auth/login", {
        phone: phoneNumber,
        password: pin,
      });

      return response.data.accessToken;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Invalid phone number or PIN"
      );
    }
  },
};

export { AuthService };


