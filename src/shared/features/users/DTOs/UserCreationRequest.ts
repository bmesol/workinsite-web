import type { UserBase } from "./UserBase";

interface UserCreationRequest extends UserBase {
  password: string;
  language: string;
}

export type { UserCreationRequest };
