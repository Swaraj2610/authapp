import useAuth from "@/auth/Store";
import { Spinner } from "@/components/ui/spinner";
import { refreshToken } from "@/services/Authservice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function OauthSuccess() {
  const navigate = useNavigate();
  const changeLoginData = useAuth((state) => state.changeLocalLoginData);
  const [isRefreshing, setIsRefreshing] = useState<Boolean>(false);
 useEffect(() => {
  async function getAccessToken() {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const responseLoginData = await refreshToken();
      changeLoginData(
        responseLoginData.accessToken,
        responseLoginData.userDto,
        true
      );
      toast.success("Login success!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error while login");
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  }

  getAccessToken(); // ← THIS WAS MISSING
}, []);

  return (

    <div className="p-10 flex flex-col gap-3 justify-center  items-center">
        <Spinner/>
        <h1 className="text-2xl font-semibold">Please wait</h1>
    </div>
  );
}

export default OauthSuccess;
