import React from "react"
import { Button } from "./ui/button"
import { NavLink } from "react-router"
import { motion } from "framer-motion"

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="
        sticky top-0 z-50 w-full
        backdrop-blur-md
        bg-background/70
        border-b border-border
      "
    >
      <div className="mx-auto max-w-7xl h-16 px-6 flex items-center justify-between">

        {/* ================= Brand ================= */}
        <NavLink to="/" className="flex items-center gap-2">
          <span
            className="
              inline-flex h-8 w-8 items-center justify-center rounded-lg
              bg-gradient-to-br from-primary to-primary/40
              text-primary-foreground font-bold
              shadow-sm
            "
          >
            A
          </span>
          <span className="text-base font-semibold tracking-tight">
            Auth App
          </span>
        </NavLink>

        {/* ================= Right Nav ================= */}
        <div className="flex items-center gap-5">

          <NavItem to="/">Home</NavItem>

          {/* ===== Login (Ghost + Glow Hover) ===== */}
          <NavLink to="/login">
            <Button
              size="sm"
              variant="ghost"
              className="
                relative overflow-hidden
                text-foreground
                hover:text-primary
                transition-all
                after:absolute after:inset-0
                after:rounded-md
                after:bg-primary/10
                after:opacity-0
                hover:after:opacity-100
              "
            >
              Login
            </Button>
          </NavLink>

          {/* ===== Sign Up (Primary + Lift + Glow) ===== */}
          <NavLink to="/Signup">
            <Button
              size="sm"
              className="
                relative
                bg-primary text-primary-foreground
                shadow-sm
                transition-all duration-300
                hover:-translate-y-[1px]
                hover:shadow-lg
                hover:shadow-primary/30
                focus-visible:ring-primary/50
              "
            >
              Sign Up
            </Button>
          </NavLink>

        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

/* ================= Nav Item ================= */

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
          relative text-sm font-medium transition-colors
          ${isActive ? "text-primary" : "text-muted-foreground"}
          hover:text-primary
        `
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <motion.span
              layoutId="nav-underline"
              className="
                absolute -bottom-1 left-0 right-0 h-[2px]
                bg-primary rounded-full
              "
            />
          )}
        </>
      )}
    </NavLink>
  )
}
