import apiClient from "@/config/ApiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type RegisterData from "@/models/RegisterData";


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