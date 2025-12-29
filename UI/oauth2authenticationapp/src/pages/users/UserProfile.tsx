import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import useAuth from "@/auth/Store";
import { deleteUser } from "@/services/Authservice";
import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";

export interface User {
  id: string;
  name?: string;
  email: string;
  enable: boolean;
  image?: string;
  updatedAt?: string;
  createdAt?: string;
  provider: string;
}

export default function UserProfile() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (!user?.id) return;

    const confirmed = window.confirm(
      "This action will permanently delete your account. Are you sure?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteUser(user.id);
      toast.success("Account deleted successfully");
      logout();
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // const delete= ;
  console.log("UserProfile user:", user);
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Profile Info Card */}
      <Card className=" relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-cyan-500/10 ">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 to-blue-600" />
        <CardContent className="pt-10 space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-28 w-28 border border-cyan-500/40">
                <AvatarImage src={user?.image} />
                <AvatarFallback> {user?.name?.charAt(0)} </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <Separator /> {/* Info Grid */}
          <div className="grid gap-y-6 gap-x-14 sm:grid-cols-2 text-sm">
            {/* Name */}
            <div className="space-y-1 sm:pl-10">
              <Badge variant="secondary">Full Name</Badge>

              <p className="font-medium">{user?.name}</p>
            </div>
            {/* Email */}
            <div className="space-y-1 sm:pl-10">
              <Badge variant="secondary">Email</Badge>

              <p className="font-medium break-all"> {user?.email} </p>
            </div>
            {/* Provider */}
            <div className="space-y-1 sm:pl-10">
              <Badge variant="secondary">Provider</Badge>
              <p className="font-medium">{user?.provide}</p>
            </div>
            {/* Status */}
            <div className="space-y-1 sm:pl-10">
              <Badge variant="secondary">Status</Badge>
              <p className="font-medium">
                {user?.enable ? "Active" : "Disabled"}
              </p>
            </div>
          </div>
          {/* Action Buttons */}
          {/* Account Actions Card */}
          <Card className=" duration-700 delay-150 transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-red-500/10 ">
            <CardHeader>
              <CardTitle className="text-center"> Account Actions </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="flex justify-center ">
                <Button
                  disabled={loading}
                  className="w-full sm:w-2/3 bg-red-600 text-white gap-2 hover:bg-red-700 transition disabled:opacity-50"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  {loading ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
