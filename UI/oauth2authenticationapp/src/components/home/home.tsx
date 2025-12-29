import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, Key, Cloud, Github, Chrome } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import useAuth from "@/auth/Store";
import { useNavigate } from "react-router";

/* ================= ANIMATIONS ================= */

const fadeUp: Variants = {
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
  visible: { transition: { staggerChildren: 0.15 } },
};

/* ================= DATA ================= */

const features = [
  {
    icon: <Key />,
    title: "JWT & Refresh Tokens",
    description: "Stateless authentication with secure token rotation.",
  },
  {
    icon: <Cloud />,
    title: "OAuth2 Login",
    description: "Google & GitHub sign-in out of the box.",
  },
  {
    icon: <Lock />,
    title: "Role-Based Access",
    description: "Fine-grained authorization with RBAC.",
  },
];

const steps = [
  { number: "01", title: "Authenticate", desc: "User logs in securely." },
  { number: "02", title: "Authorize", desc: "JWT validates permissions." },
  {
    number: "03",
    title: "Access APIs",
    desc: "Protected APIs respond safely.",
  },
];


/* ================= PAGE ================= */

export default function Home() {
  const navigate = useNavigate();
const checkLogin = useAuth((state) => state?.checkLogin);
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* ===== Animated Gradient Background ===== */}
      <motion.div
        className="
          absolute inset-0 -z-10
          bg-linear-to-r
          from-primary/20
          via-violet-500/20
          to-transparent
          blur-3xl
        "
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* ================= HERO ================= */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="flex flex-col items-center justify-center text-center px-6 py-32"
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-6xl font-bold tracking-tight"
        >
          Secure Authentication <br />
          <span className="bg-linear-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Built for Modern Apps
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          OAuth2, JWT, refresh tokens, and enterprise-grade security for
          scalable systems.
        </motion.p>
      </motion.section>

      {/* ================= FEATURES ================= */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="px-6 py-24 max-w-7xl mx-auto"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl font-semibold text-center mb-14"
        >
          Powerful Authentication Features
        </motion.h2>

        <motion.div variants={stagger} className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -10 }}>
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= SECURITY ================= */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="px-6 py-24 bg-muted/40"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-muted-foreground mb-6">
              Built with encryption, token revocation, audit logs, and rate
              limiting.
            </p>

            <ul className="space-y-3 text-muted-foreground">
              <li>• Encrypted credentials</li>
              <li>• Secure refresh token storage</li>
              <li>• Brute-force protection</li>
              <li>• Stateless scalable design</li>
            </ul>
          </div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldCheck className="w-48 h-48 text-primary mx-auto" />
          </motion.div>
        </div>
      </motion.section>

      {/* ================= OAUTH ================= */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="px-6 py-24 text-center"
      >
        <h2 className="text-3xl font-semibold mb-10">OAuth Providers</h2>

        <div className="flex justify-center gap-12">
          <Provider icon={<Chrome />} name="Google" />
          <Provider icon={<Github />} name="GitHub" />
        </div>
      </motion.section>

      {/* ================= HOW IT WORKS ================= */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="px-6 py-24 bg-muted/40"
      >
        <h2 className="text-3xl font-semibold text-center mb-16">
          How It Works
        </h2>

        <motion.div
          variants={stagger}
          className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center"
        >
          {steps.map((s) => (
            <motion.div key={s.number} variants={fadeUp}>
              <Step {...s} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="px-6 py-28 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">
          Ready to Secure Your Application?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10">
          Plug-and-play authentication so you can focus on building features.
        </p>

        <motion.div whileHover={{ scale: 1.08 }}>
          <Button size="lg" onClick={()=>{
            navigate(checkLogin()? "/dashboard" : "/login")

            // if(checkLogin()){
            //      navigate("/dashboard")
            // }else{
            //   navigate("/login")
            // }
          }}>
            Start Building Now
          </Button>
        </motion.div>
      </motion.section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2025 AuthApp • Secure • Scalable • Developer-First
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({ icon, title, description }: any) {
  return (
    <Card className="bg-card border-border backdrop-blur">
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function Provider({ icon, name }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.15 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className="text-muted-foreground">{name}</span>
    </motion.div>
  );
}

function Step({ number, title, desc }: any) {
  return (
    <div>
      <div className="text-primary text-4xl font-bold mb-4">{number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
