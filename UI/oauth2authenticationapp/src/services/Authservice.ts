import apiClient from "@/config/ApiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type RegisterData from "@/models/RegisterData";
import type User from "@/models/User";


// register function
export const registerUser = async (signUpData: RegisterData) => {
//   api call to server data
    const respose=await apiClient.post(`/auth/register`,signUpData);
    return respose.data;
};

//login function
export const loginUser=async(loginData:LoginData)=>{
    const response=await apiClient.post<LoginResponseData>(`/auth/login`,loginData);
    return response.data;
}

//login function
export const logout=async()=>{
    const response=await apiClient.post<LoginResponseData>(`/auth/logout`);
    return response.data;
}

//login function
export const getCurrentUser=async(email?:string)=>{
      if (!email) {
    throw new Error("Email is required to fetch user");
  }
  console.log(email)
    const response=await apiClient.get<User>(`/users/email/${email}`);
    console.log("response",response);
    return response.data;
}

//login function
export const refreshToken=async()=>{
    const response=await apiClient.post<LoginResponseData>(`/auth/refreshToken`);
    return response.data;
}

//delete user
export const deleteUser = async (userId: string): Promise<void> => {
  if (!userId) {
    throw new Error("User ID is required to delete user");
  }

  await apiClient.delete(`/users/${userId}`);
};


export const getAllUser= async (): Promise<User[]>=>{
   const userList= await apiClient.get<User[]>(`/users`);
   if (!Array.isArray(userList.data)) {
    throw new Error("Invalid users response");
  }
   return userList.data;
}