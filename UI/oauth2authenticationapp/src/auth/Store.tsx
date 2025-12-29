import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";
import { loginUser, logout } from "@/services/Authservice";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const Local_KEY = "auth_state";
// type AuthStatus= "idle" | "authenticating" | "authenticated" | "Anonymous" | "error";

// global auth state
type Authstate = {
  accessToken: string | null;
  user: User | null;
  authstatus: boolean;
  authLoading: boolean;
  login: (loginData: LoginData) => Promise<LoginResponseData>;
  logout: (silent?: boolean) => void;
  checkLogin: () => boolean | undefined;
  changeLocalLoginData: (
    accessToken: string,
    user: User,
    authstatus: boolean
  ) => void;
};

// logic for global state
const useAuth = create<Authstate>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      authstatus: false,
      authLoading: false,
      changeLocalLoginData(accessToken, user, authstatus) {
        set({ accessToken, user, authstatus });
      },
      // login function
      login: async (loginData: LoginData) => {
        console.log("Started Login.....");
        set({ authLoading: true });
        try {
          const loginResponseData = await loginUser(loginData);
          set({
            accessToken: loginResponseData.accessToken,
            user: loginResponseData.userDto,
            authstatus: true,
          });
          return loginResponseData;
        } catch (error) {
          throw error;
        } finally {
          set({ authLoading: false });
        }
      },
      // logout function
      logout: async () => {
        try {
          await logout();
          toast.success("Logout successful !");
        } catch (error) {
          throw error;
        } finally {
          set({ authLoading: false });
        }
        set({
          accessToken: null,
          user: null,
          authstatus: false,
        });
      },

      checkLogin: () => {
        if (get().accessToken && get().authstatus) return true;
        return false;
      },
    }),
    {
      name: Local_KEY,
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: { ...state.user, password: null },
        authstatus: state.authstatus,
      }),
    }
  )
);

// export the global auth state
export default useAuth;
