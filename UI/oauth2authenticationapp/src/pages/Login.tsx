import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Lock, AlertCircleIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import type LoginData from "@/models/LoginData";
import toast from "react-hot-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/auth/Store";

/* ================= Motion ================= */

const page = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1], // cubic-bezier (easeOut)
    },
  },
};

export default function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // input handler for login form
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const navigation = useNavigate();

  // login state from global store
  const login = useAuth((state) => state.login);
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(loginData);

    if (loginData.email.trim() === "") {
      toast.error("Please enter your email.");
      return;
    }
    if (loginData.password.trim() === "") {
      toast.error("Please enter your password.");
      return;
    }
    try {
      setLoading(true);
      await login(loginData);
      toast.success("Login successful !");
      setLoginData({
        email: "",
        password: "",
      });
      navigation("/dashboard");
    } catch (error: any) {
      console.log(error);
      toast.error("Login failed ! Please try again.");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      variants={page}
      initial="hidden"
      animate="visible"
      className="
        relative min-h-screen w-full
        flex items-center justify-center
        bg-background text-foreground
        px-4 sm:px-6
        overflow-hidden
      "
    >
      {/* ================= Animated Background ================= */}
      <motion.div
        aria-hidden
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute inset-0 -z-10
          bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.25),transparent_55%),
              radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.18),transparent_60%)]
          bg-size-[200%_200%]
        "
      />

      {/* ================= Login Card ================= */}
      <motion.div variants={card} className="w-full max-w-md">
        <Card
          className="
            relative
            bg-card/85 backdrop-blur-xl
            border border-border
            shadow-lg
          "
        >
          <CardHeader className="space-y-2 px-6 pt-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Securely access your account
            </p>
          </CardHeader>
          {error && (
            <Alert
              variant={"destructive"}
              className="mt-6 ml-4 border-transparent"
            >
              <AlertCircleIcon />
              <AlertTitle>
                {error?.response
                  ? error?.response?.data?.message
                  : "Something went wrong ! Please try again later."}
              </AlertTitle>
            </Alert>
          )}

          <CardContent className="px-6 pb-8 pt-5">
            <div className="space-y-5">
              {/* ===== Email ===== */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="
                      h-10 pl-10
                      focus-visible:ring-primary/40
                    "
                      name="email"
                      value={loginData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* ===== Password ===== */}
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="
                      h-10 pl-10
                      focus-visible:ring-primary/40
                    "
                      name="password"
                      value={loginData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* ===== Login Button (Premium Hover) ===== */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {/* Hover glow */}
                  <span
                    className="
                    absolute inset-0 rounded-md
                    bg-linear-to-r from-primary/40 to-primary/10
                    opacity-0 group-hover:opacity-100
                    blur-md transition-opacity
                  "
                  />
                  <Button
                    disabled={loading}
                    type="submit"
                    className=" cursor-pointer
                    relative z-10
                    w-full h-10 text-sm
                    transition-all
                  "
                  >
                    {loading ? (
                      <>
                        <Spinner /> Please wait...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </motion.div>
              </form>
              {/* ===== Divider ===== */}
              <div className="relative py-1">
                <Separator />
                <span
                  className="
                    absolute left-1/2 top-1/2
                    -translate-x-1/2 -translate-y-1/2
                    bg-card px-2 text-[11px]
                    text-muted-foreground
                  "
                >
                  OR
                </span>
              </div>

              {/* ===== OAuth Buttons (Hover Lift + Border Glow) ===== */}
              <div className="space-y-3">
                <motion.div whileHover={{ y: -2 }}>
                  <Button
                    variant="outline"
                    className=" cursor-pointer
                      h-10 w-full flex gap-2 text-sm
                      transition-all
                      hover:border-primary hover:text-primary
                      hover:shadow-sm
                    "
                  >
                    <svg width="16" height="16" viewBox="0 0 48 48">
                      <path
                        fill="#FFC107"
                        d="M43.6 20.5H42V20H24v8h11.3C33.7 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.5 0 19-8.5 19-19 0-1.3-.1-2.3-.4-3.5z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </motion.div>

                <motion.div whileHover={{ y: -2 }}>
                  <Button
                    variant="outline"
                    className=" cursor-pointer
                      h-10 w-full flex gap-2 text-sm
                      transition-all
                      hover:border-primary hover:text-primary
                      hover:shadow-sm
                    "
                  >
                    <Github className="h-4 w-4" />
                    Continue with GitHub
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* ===== Signup Redirect ===== */}
            <div className="pt-2 text-center">
              <span className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
              </span>
              <NavLink
                to="/Signup"
                className="
      text-sm font-medium text-primary
      hover:underline
      underline-offset-4
      transition-colors
    "
              >
                Sign up
              </NavLink>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.main>
  );
}
