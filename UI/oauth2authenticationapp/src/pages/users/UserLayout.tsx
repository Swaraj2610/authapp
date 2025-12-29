import useAuth from "@/auth/Store"
import { Navigate, Outlet } from "react-router"

function UserLayout() {
  const checkLogin = useAuth((state) => state.checkLogin);  

  if (checkLogin()) 
  return <> <Outlet /></>;
  else return <Navigate to={"/login"} />;
}

export default UserLayout
