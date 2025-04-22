import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// Fade-up animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      type: "spring",
      stiffness: 50,
      damping: 12,
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const HomePage = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  // State to manage dark mode
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Check if dark mode preference is already stored in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      setDarkMode(savedMode === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode and save the choice to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // FAQ Data
  const faqData = [
    {
      q: "What is Mr.K's CV?",
      a: "Mr.K's CV is an online tool that allows you to create, customize, and download professional resumes in minutes.",
    },
    {
      q: "Is Mr.K's CV free to use?",
      a: "Yes, you can use the basic features for free. Premium templates and features may require a subscription.",
    },
    {
      q: "Can I download my resume as a PDF?",
      a: "Absolutely! You can preview and download your resume in PDF format directly from the dashboard.",
    },
    {
      q: "Do I need to sign up to use it?",
      a: "No sign-up is required for basic use, but creating an account lets you save, edit, and manage your resumes more easily.",
    },
    {
      q: "Can I customize templates?",
      a: "Yes, we offer a variety of templates and customization options including fonts, and layout tweaks.",
    },
  ];

  // Accordion Item Component
  const AccordionItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <motion.div
        className="rounded-xl border bg-muted/10 dark:bg-muted/20 p-5 shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left font-semibold text-lg focus:outline-none"
        >
          {question}
          <motion.span
            initial={false}
            animate={{ rotate: isOpen ? 45 : 0 }}
            className="text-primary text-2xl transition-transform duration-300"
          >
            +
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.p
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 text-muted-foreground overflow-hidden"
            >
              {answer}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="container"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <motion.section
          className="relative flex flex-col items-center gap-6 py-12 text-center md:py-20 overflow-hidden"
          variants={fadeUp}
        >
          {/* Animated blob background */}
          <motion.div
            className="absolute -top-20 left-1/2 h-[400px] w-[400px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-20 blur-3xl rounded-full -z-10"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />

          <motion.h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            variants={fadeUp}
            custom={1}
          >
            Build a job-winning <span className="text-primary">resume</span> for free
          </motion.h1>

          <motion.p
            className="max-w-[700px] text-lg text-muted-foreground md:text-xl"
            variants={fadeUp}
            custom={2}
          >
            Create professional resumes in minutes with our ultra-fast, free resume builder.
            No hidden fees, no watermarks, just pure performance.
          </motion.p>

          {/* Lottie Animation */}
          <motion.div variants={fadeUp} custom={2}>
            <Player
              autoplay
              loop
              src="https://assets5.lottiefiles.com/packages/lf20_ktwnwv5m.json"
              style={{ height: "300px", width: "300px" }}
              className="mx-auto"
            />
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row"
            variants={fadeUp}
            custom={3}
          >
            <Link to="/editor">
              <Button size="lg" className="transition-transform duration-300 hover:scale-[1.07]">
                Create Your Resume
              </Button>
            </Link>
            <Link to="/templates">
              <Button
                variant="outline"
                size="lg"
                className="transition-transform duration-300 hover:scale-[1.07]"
              >
                Browse Templates
              </Button>
            </Link>
          </motion.div>
        </motion.section>

        {/* Dark Mode Toggle Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition-colors duration-300"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Stats Section with Counters */}
        <motion.section
          ref={ref}
          className="py-12 md:py-20 text-center bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900"
        >
          <h2 className="text-3xl font-bold mb-10">Trusted by</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              ["Users", 120000],
              ["Resumes Created", 300000],
              ["Templates Available", 20],
            ].map(([label, value], i) => (
              <motion.div
                key={label}
                className="backdrop-blur-md bg-white/20 dark:bg-white/10 p-6 rounded-2xl shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <h3 className="text-4xl font-extrabold text-primary">
                  {inView && <CountUp end={value as number} duration={2} />}
                </h3>
                <p className="mt-2 text-muted-foreground">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section with Glassmorphism */}
        <section className="py-12 md:py-20">
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              ["Ultra-Fast Performance", "Experience lightning-fast editing and preview with our optimized platform."],
              ["Real-Time Preview", "See changes instantly as you type with our real-time preview."],
              ["Multi-Page Support", "Content automatically flows to additional pages as needed."],
              ["Professional Templates", "Choose from a variety of professional templates for any industry."],
              ["Completely Free", "All features available at no cost, with no watermarks or hidden fees."],
              ["Downloadable in PDF", "Export your resume in a polished PDF file ready for applications."],
            ].map(([title, description], index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-muted/20 p-8 rounded-xl shadow-xl space-y-4"
                variants={fadeUp}
                custom={index}
              >
                <h3 className="text-2xl font-semibold text-primary">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="space-y-4 text-left">
              {faqData.map((item, index) => (
                <AccordionItem key={index} question={item.q} answer={item.a} index={index} />
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomePage;
