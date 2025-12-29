import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BarChart3,
  User,
  ShieldCheck,
  Activity,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import type UserT from "@/models/User";
import toast from "react-hot-toast";
import useAuth from "@/auth/Store";
import { getCurrentUser, getAllUser } from "@/services/Authservice";

/* ---------------- Types ---------------- */
type ActivityT = {
  id: number;
  message: string;
  time: string;
};

function Userhome() {
  const user = useAuth((state) => state.user);

  const [currentUser, setCurrentUser] = useState<UserT | null>(null);
  const [users, setUsers] = useState<UserT[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- Config ---------------- */
  const USERS_PER_PAGE = 6;

  /* ---------------- Recent Activity (Dynamic) ---------------- */
  const [activities] = useState<ActivityT[]>([
    {
      id: 1,
      message: "Logged in from Chrome (Windows)",
      time: "2 minutes ago",
    },
    {
      id: 2,
      message: "Password updated",
      time: "1 hour ago",
    },
    {
      id: 3,
      message: "New device added to trusted list",
      time: "Yesterday",
    },
    {
      id: 4,
      message: "Logged out from Safari (iPhone)",
      time: "2 days ago",
    },
  ]);

  /* ---------------- Fetch Users ---------------- */
  useEffect(() => {
    async function fetchUsers() {
      try {
        const allUsers = await getAllUser();
        setUsers(allUsers);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load users");
      }
    }

    fetchUsers();
  }, []);

  /* ---------------- Fetch Current User ---------------- */
  const getUserData = async () => {
    try {
      if (!user?.email) return;
      const data = await getCurrentUser(user.email);
      setCurrentUser(data);
      toast.success("You are able to access secured APIs");
    } catch (error) {
      console.error(error);
      toast.error("Error in getting user data");
    }
  };

  /* ---------------- Pagination ---------------- */
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8"
      >
        Dashboard Overview
      </motion.h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Total Users",
            value: users.length.toString(),
            icon: <User className="w-8 h-8 text-primary" />,
          },
          {
            title: "Security Score",
            value: "98%",
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
          },
          {
            title: "Active Sessions",
            value: "12",
            icon: <Activity className="w-8 h-8 text-primary" />,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-muted rounded-xl">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-semibold">
                    {stat.value}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Users Logged In */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          Users Logged In
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedUsers.map((u, index) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="group"
            >
              <Card className="relative bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/40">
                <CardContent className="p-5">
                  <p className="text-lg font-medium">
                    {u.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Provider:{" "}
                    <span className="font-medium">
                      {u.provide}
                    </span>
                  </p>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none ring-1 ring-primary/30" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </section>

      {/* Recent Activity (Dynamic) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg mb-10">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Recent Activity
            </h2>

            <ul className="space-y-4">
              {activities.map((activity, index) => (
                <motion.li
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <Clock className="w-4 h-4 mt-1 text-primary" />
                  <div>
                    <p className="text-sm">
                      {activity.message}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* CTA */}
      <div className="text-center">
        <Button
          onClick={getUserData}
          className="rounded-2xl px-8 text-lg"
        >
          Get current user
        </Button>

        {currentUser && (
          <p className="mt-4 text-lg font-medium">
            Logged in as: {currentUser.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default Userhome;
