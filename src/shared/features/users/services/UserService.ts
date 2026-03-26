import { userApiClient } from "@/shared/services/ApiClient";

// DTOs
export type ProfileUpdationRequest = {
  name: string;
  phone: string;
  note: string;
};

export type UserCreationRequest = {
  name: string;
  phone: string;
  pin: string;
};

export type UserUpdationRequest = {
  name: string;
  phone: string;
};

const useUserService = () => {

  const getUsers = async (searchString: string = "") => {
    const response = await userApiClient.get(`users?searchString=${searchString}`);
    return response.data;
  };

  const getUser = async (id: number) => {
    const response = await userApiClient.get(`users/${id}`);
    return response.data;
  };

  const createUser = async (user: UserCreationRequest) => {
    const response = await userApiClient.post("users", user);
    return response.data;
  };

  const updateUser = async (id: number, user: UserUpdationRequest) => {
    await userApiClient.put(`users/${id}`, user);
  };

  const updatePin = async (id: number, pin: string) => {
    await userApiClient.put(`users/${id}/password`, { password: pin });
  };

  const getProfile = async () => {
    const response = await userApiClient.get("users/profile");
    return response.data;
  };

  const updateProfile = async (user: ProfileUpdationRequest) => {
    await userApiClient.put("users/profile", user);
  };

  const updateProfilePin = async (pin: string) => {
    await userApiClient.put("users/profile/password", { password: pin });
  };

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    updatePin,
    getProfile,
    updateProfile,
    updateProfilePin
  };
};

export { useUserService };
