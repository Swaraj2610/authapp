import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Github } from "lucide-react";
import { NavLink } from "react-router";

function Oauth2Buttons() {
  return (
    <div>
      {/* ===== OAuth Buttons (Hover Lift + Border Glow) ===== */}
      <div className="space-y-3">
        <NavLink
          to={`${
            import.meta.env.VITE_BASE_URL || "http://localhost:8083"
          }/oauth2/authorization/google`}
          className={"block"}
        >
          <motion.div whileHover={{ y: -2 }}>
            <Button
              type="button"
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
        </NavLink>
        <NavLink
          to={`${
            import.meta.env.VITE_BASE_URL || "http://localhost:8083"
          }/oauth2/authorization/github`}
          className={"block"}
        >
          <motion.div whileHover={{ y: -2 }}>
            <Button
              type="button"
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
        </NavLink>
      </div>
    </div>
  );
}

export default Oauth2Buttons;
