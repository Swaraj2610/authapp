import apiClient from "@/config/ApiClient";
import type LoginData from "@/models/LoginData";
import type RegisterData from "@/models/RegisterData";


// register function
export const registerUser = async (signUpData: RegisterData) => {
//   api call to server data
    const respose=await apiClient.post(`/auth/register`,signUpData);
    return respose.data;
};

//login function
export const loginUser=async(loginData:LoginData)=>{
    console.log(loginData);
    const response=await apiClient.post(`/auth/login`,loginData);
    return response.data;
}