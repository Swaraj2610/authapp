import { NavLink, useNavigate } from "react-router";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Github , AlertCircleIcon } from "lucide-react";
import React, { useState } from "react";
import type RegisterData from "@/models/RegisterData";
import toast from "react-hot-toast";
import { registerUser } from "@/services/Authservice";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

/* ================= Motion Variants ================= */

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

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

/* ================= Component ================= */



export default function Signup() {

  const [data,setData]=useState<RegisterData>({
    name:"",
    email:"",
    password:"",
    enable:true
  });
  
  const [loading,setLoading]=useState<boolean>(false);
  const [error,setError]=useState<any>(null);

// input email,password,number textarea 
  // input handler
  const handleInputChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    // console.log(event.target.name);
    // console.log(event.target.value);
    setData((value)=>({
      ...value,
      [event.target.name]:event.target.value
    }))
  };

const navigate=useNavigate();
  const handleFormSubmit=async (event:React.FormEvent)=>{
    event.preventDefault();
    console.log("form submitted",data);
    if(data.name.trim()===""){
      toast.error("Name is required !");
      return;
    };

     if(data.email.trim()===""){
      toast.error("Email is required !");
      return;
    };

     if(data.password.trim()===""){
      toast.error("Password is required !");
      return;
    };

    // form submission for registration
    try {
      setLoading(true);
      const result=await registerUser(data);
      console.log("registration successful",result);
      toast.success("Registration successful ! Please login.");
      setData({
        name:"",
        email:"",
        password:"",
        enable:true
      });
      // redirect to login page
      navigate("/login");

    } catch (error) {
      console.log(error)
      // setError(error);
      toast.error("Registration failed ! Please try again.");
        setError(error);
      
    }finally{
      setLoading(false);
    }
  };

  return (
    <motion.main
      variants={page}
      initial="hidden"
      animate="visible"
      className=" relative min-h-screen w-full flex items-center justify-center bg-background text-foreground px-4 sm:px-6  overflow-hidde "
    >
      {/* ===== Animated Futuristic Background ===== */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.18, 0.3, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className=" absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.22),transparent_55%), radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.18),transparent_60%) "
      />

      {/* ===== Signup Card ===== */}
      <motion.div variants={card} className="w-full max-w-md">
        <Card
          className="
            bg-card/85 backdrop-blur-xl
            border border-border
            shadow-lg
          "
        >
          <CardHeader className="space-y-2 px-6 pt-8 text-center">
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-2xl font-semibold tracking-tight"
            >
              Create your account
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-sm text-muted-foreground"
            >
              Get started with secure access in minutes
            </motion.p>
          </CardHeader>
            {error && (
                <Alert variant={"destructive"} className="mt-6 ml-4 border-transparent">
                  <AlertCircleIcon />
                  <AlertTitle>{
                  error?.response ? error?.response?.data?.message:"Something went wrong ! Please try again later."
                }</AlertTitle>
                </Alert> 
            )}
          <CardContent className="px-6 pb-8 pt-5">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* ===== Name ===== */}
              <motion.div variants={fadeUp} className="space-y-1.5">
                <Label>Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Your full name"
                    className="h-10 pl-10 focus-visible:ring-primary/40"
                    name="name"
                    value={data.name}
                    onChange={handleInputChange}
                  />
                </div>
              </motion.div>

              {/* ===== Email ===== */}
              <motion.div variants={fadeUp} className="space-y-1.5">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="h-10 pl-10 focus-visible:ring-primary/40"
                    name="email"
                    value={data.email}
                    onChange={handleInputChange}
                  />
                </div>
              </motion.div>

              {/* ===== Password ===== */}
              <motion.div variants={fadeUp} className="space-y-1.5">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 pl-10 focus-visible:ring-primary/40"
                    name="password"
                    value={data.password}
                    onChange={handleInputChange}
                  />
                </div>
              </motion.div>

              {/* ===== Signup CTA ===== */}
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="w-full h-10 cursor-pointer" disabled={loading}>
                 {loading ? <><Spinner /> Please wait...</> :  "Create Account"}
                </Button>
              </motion.div>
              </form>
              {/* ===== Divider ===== */}
              <motion.div variants={fadeUp} className="relative py-1">
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
              </motion.div>

              {/* ===== OAuth ===== */}
              <motion.div variants={fadeUp} className="space-y-3">
                <motion.div whileHover={{ y: -2 }}>
                  <Button
                    variant="outline"
                    className=" cursor-pointer
                      h-10 w-full flex gap-2 text-sm
                      hover:border-primary hover:text-primary
                      transition-colors
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
                    className="cursor-pointer
                      h-10 w-full flex gap-2 text-sm
                      hover:border-primary hover:text-primary
                      transition-colors
                    "
                  >
                    <Github className="h-4 w-4" />
                    Continue with GitHub
                  </Button>
                </motion.div>
              </motion.div>

              {/* ===== Login Redirect ===== */}
              <motion.div variants={fadeUp} className="pt-2 text-center">
                <span className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <NavLink
                  to="/login"
                  className="
                    text-sm font-medium text-primary
                    hover:underline underline-offset-4
                  "
                >
                  Sign in
                </NavLink>
              </motion.div>

            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.main>
  );
}
