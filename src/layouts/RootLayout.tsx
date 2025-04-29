import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function RootLayout() {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFooterVisible(true);
    }, 100); // slight delay
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-xl flex items-center">
              <span className="text-primary">Mr.K's</span>CV
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                My Resumes
              </Link>
              <Link to="/templates" className="text-sm font-medium hover:text-primary">
                Templates
              </Link>
              <Link to="/editor" className="text-sm font-medium hover:text-primary">
                Create Resume
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin-login">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
            <Link to="/user-login">
              <Button variant="outline" size="sm">Create Account</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer with animation */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        animate={footerVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-10 py-10 px-6 border-t backdrop-blur-md bg-white/60 dark:bg-slate-900/40 shadow-inner"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding and Copyright */}
          <div className="text-center md:text-left">
          <Link to="/" className="font-bold text-xl flex items-center">
              <span className="text-primary">Mr.K's</span>CV
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-6 flex-wrap items-center justify-center text-sm">
            <Link to="/dashboard" className="hover:text-primary transition hover:scale-105">My Resumes</Link>
            <Link to="/templates" className="hover:text-primary transition hover:scale-105">Templates</Link>
            <Link to="/editor" className="hover:text-primary transition hover:scale-105">Create Resume</Link>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#" className="hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-muted-foreground hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38c-.84.5-1.76.86-2.75 1.05a4.3 4.3 0 00-7.5 3.93 12.2 12.2 0 01-8.87-4.5 4.3 4.3 0 001.33 5.74A4.3 4.3 0 012 9.54v.05a4.3 4.3 0 003.45 4.21 4.3 4.3 0 01-1.93.07 4.3 4.3 0 004.02 2.99A8.6 8.6 0 012 19.54a12.2 12.2 0 006.6 1.94c7.93 0 12.26-6.56 12.26-12.26 0-.19 0-.38-.01-.57A8.7 8.7 0 0024 4.56a8.52 8.52 0 01-2.54.7z" />
              </svg>
            </a>
            {/* Add more icons like LinkedIn, GitHub etc. */}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
