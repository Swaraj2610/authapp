import type User from "./User";

export default interface LoginResponseData {
  accessToken: string;
  userDto: User;
  refreshToken: string;
  expiresIn: number;
};
