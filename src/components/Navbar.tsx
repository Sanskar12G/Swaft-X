import { motion } from "framer-motion";
import { MapPin, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Swaft <span className="text-primary">X</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#compare" className="hover:text-foreground transition-colors">Compare Fares</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <a href="#" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Try Once
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4 text-sm"
        >
          <a href="#compare" className="text-muted-foreground hover:text-foreground">Compare Fares</a>
          <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
          <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
          <a href="#" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-center">
            Try Once
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
