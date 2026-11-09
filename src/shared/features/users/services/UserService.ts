import { userApiClient } from "@/shared/services/ApiClient";
import type { UserCreationRequest } from "../DTOs/UserCreationRequest";
import type { User } from "../DTOs/User";
import type { ProfileUpdationRequest } from "../DTOs/ProfileUpdationRequest";


export type UserUpdationRequest = {
  name: string;
  phone: string;
  roleId: number;
  isActive: boolean;
  note: string;
};

const createUserService = () => {

  const getUsers = async (searchString: string = ""): Promise<User[]> => {
    const { data } = await userApiClient.get(`users?searchString=${searchString}`);
    return data;
  };

  const getUser = async (id: number) => {
    const { data } = await userApiClient.get(`users/${id}`);
    return data;
  };

  const createUser = async (user: UserCreationRequest) => {
    const { data } = await userApiClient.post("users", user);
    return data;
  };

  const updateUser = async (id: number, user: UserUpdationRequest) => {
    await userApiClient.put(`users/${id}`, user);
  };

  const updatePin = async (id: number, pin: string) => {
    await userApiClient.put(`users/${id}/password`, { password: pin });
  };

  const getProfile = async () => {
    const { data } = await userApiClient.get("users/profile");
    return data;
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

export { createUserService };
