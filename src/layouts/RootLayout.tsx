import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiFileText,
  FiLayout,
  FiSun,
  FiMoon,
  FiLogOut,
  FiSettings,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiTwitter,
} from "react-icons/fi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/Context/AuthContext";

export default function RootLayout() {
  const [footerVisible, setFooterVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, admin, role, isAuthenticated, logout } = useAuthContext();

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      setDarkMode(savedMode === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Footer animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFooterVisible(true);
    }, 100);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Redirect to login if trying to access protected routes
  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/editor'];
    if (protectedRoutes.some(route => location.pathname.startsWith(route)) && !isAuthenticated) {
      navigate('/user-login');
    }
  }, [location.pathname, isAuthenticated, navigate]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navLinks = [
    {
      path: "/dashboard",
      name: "My Resumes",
      icon: <FiFileText className="mr-1" />,
      roles: ["user", "admin"],
      requiresAuth: true
    },
    {
      path: "/templates",
      name: "Templates",
      icon: <FiLayout className="mr-1" />,
      roles: ["user", "admin"],
      requiresAuth: false
    },
    {
      path: "/editor",
      name: "Create Resume",
      icon: <FiUser className="mr-1" />,
      roles: ["user"],
      requiresAuth: true
    },
    {
      path: "/admin/dashboard",
      name: "Admin Dashboard",
      icon: <FiLayout className="mr-1" />,
      roles: ["admin"],
      requiresAuth: true
    }
  ];

  const MotionButton = motion.create(Button);

  const UserProfileDropdown = () => {
    const currentUser = role === "admin" ? admin : user;
    const userInitial = currentUser?.name?.charAt(0).toUpperCase() || "";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block cursor-pointer"
          >
            <Avatar className="h-8 w-8 bg-gray-200 dark:bg-gray-700">
              <AvatarFallback>
                {userInitial || <FiUser className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigate('/dashboard')}>
            <FiUser className="mr-2" />
            Profile
          </DropdownMenuItem>
          {role === "admin" && (
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              <FiSettings className="mr-2" />
              Admin Settings
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={logout}>
            <FiLogOut className="mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-gray-50 dark:to-slate-900 text-foreground">
      {/* Header */}
      <motion.header
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-md py-2 shadow-sm" : "border-b border-transparent py-4"}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-xl flex items-center">
              <motion.span
                className="text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mr.K's
              </motion.span>
              <span className="ml-1">CV</span>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => {
                if (!link.roles.includes(role || "guest")) return null;
                if (link.requiresAuth && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm font-medium hover:text-primary flex items-center transition-all relative py-2"
                  >
                    <motion.div
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.icon}
                      {link.name}
                    </motion.div>
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="navIndicator"
                        className="h-0.5 bg-primary w-full absolute bottom-0"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark/Light Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </motion.button>

            {/* Dashboard Button - Only shown when authenticated */}
            {isAuthenticated && (
              <Link to="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button size="sm" className="hidden sm:inline-flex">
                    Dashboard
                  </Button>
                </motion.div>
              </Link>
            )}

            {/* User Profile or Sign Up Button */}
            {isAuthenticated ? (
              <UserProfileDropdown />
            ) : (
              <Link to="/user-login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    Create Account
                  </Button>
                </motion.div>
              </Link>
            )}

            {/* Admin Login Button - Always visible */}
            <Link to="/admin-login">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  <FiUser className="mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main content with page transitions */}
      <main className="flex-1 pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Enhanced Dynamic Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        animate={footerVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-20 py-16 px-6 border-t backdrop-blur-md bg-white/80 dark:bg-slate-900/70"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Brand Column - Wider */}
            <div className="md:col-span-2 space-y-6">
              <Link to="/" className="font-bold text-2xl flex items-center">
                <motion.span
                  className="text-primary"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Mr.K's
                </motion.span>
                <span className="ml-2">Resume Builder</span>
              </Link>
              <p className="text-muted-foreground text-lg">
                The ultimate tool for creating professional resumes that get you hired faster.
              </p>
              
              {/* Dynamic Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "10K+", label: "Users" },
                  { value: "50+", label: "Templates" },
                  { value: "95%", label: "Success Rate" },
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm text-center"
                    whileHover={{ y: -5 }}
                  >
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Social Media - Larger */}
              <div className="flex gap-5">
                {[
                  {
                    icon: <FiTwitter className="w-6 h-6" />,
                    color: "hover:text-blue-400",
                    label: "Twitter"
                  },
                  {
                    icon: <FiGithub className="w-6 h-6" />,
                    color: "hover:text-gray-700 dark:hover:text-gray-300",
                    label: "GitHub"
                  },
                  {
                    icon: <FiLinkedin className="w-6 h-6" />,
                    color: "hover:text-blue-600",
                    label: "LinkedIn"
                  },
                  {
                    icon: <FiMail className="w-6 h-6" />,
                    color: "hover:text-red-500",
                    label: "Email"
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className={`flex flex-col items-center text-muted-foreground ${social.color} transition-colors`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                    <span className="text-xs mt-1">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Navigation Columns */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {navLinks.filter(link => !link.requiresAuth).map((link) => (
                  <motion.li key={link.path} whileHover={{ x: 5 }}>
                    <Link
                      to={link.path}
                      className="text-lg text-muted-foreground hover:text-primary flex items-center gap-2"
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Resources</h3>
              <ul className="space-y-4">
                {[
                  { name: "Resume Guide", path: "/guide", icon: <FiFileText className="w-5 h-5" /> },
                  { name: "Blog", path: "/blog", icon: <FiFileText className="w-5 h-5" /> },
                  { name: "Tutorials", path: "/tutorials", icon: <FiFileText className="w-5 h-5" /> },
                  { name: "Webinars", path: "/webinars", icon: <FiFileText className="w-5 h-5" /> },
                ].map((item) => (
                  <motion.li key={item.path} whileHover={{ x: 5 }}>
                    <Link
                      to={item.path}
                      className="text-lg text-muted-foreground hover:text-primary flex items-center gap-2"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Newsletter - Enhanced */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Stay Updated</h3>
              <p className="text-lg text-muted-foreground">
                Get the latest resume tips and job search advice.
              </p>
              
              <motion.div 
                className="space-y-4"
                whileHover={{ scale: 1.01 }}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <MotionButton
                  className="w-full py-3 text-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Subscribe Now
                </MotionButton>
              </motion.div>
              
              <p className="text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Copyright - Enhanced */}
          <motion.div 
            className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} Mr.K's Resume Builder. All rights reserved.
            </div>
            
            <div className="flex gap-6">
              {[
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Cookie Policy", path: "/cookies" },
              ].map((item) => (
                <motion.div key={item.path} whileHover={{ y: -2 }}>
                  <Link
                    to={item.path}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}