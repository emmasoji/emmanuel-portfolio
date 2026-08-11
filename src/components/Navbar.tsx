import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X, Monitor } from "lucide-react";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" }
];

const whatsappMessage = encodeURIComponent(
    "Hello Emmanuel, I came across your portfolio and I'd like to discuss an opportunity."
);

const Navbar = () => {
    const { theme, resolvedTheme, setTheme } = useTheme();

    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    /* Detect page scroll */
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    /* Prevent background scrolling when mobile menu is open */
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleNavigation = (href: string) => {
        setIsOpen(false);

        const element = document.querySelector(href);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    const cycleTheme = () => {
        if (theme === "system") {
            setTheme("light");
        } else if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("system");
        }
    };

    const ThemeIcon =
        theme === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;

    const themeLabel =
        theme === "system"
            ? "System theme"
            : theme === "dark"
              ? "Dark theme"
              : "Light theme";

    return (
        <>
            <header
                className={`fixed left-0 right-0 top-0 z-50 px-4 transition-all duration-300 sm:px-6 ${
                    isScrolled ? "pt-3" : "pt-5"
                }`}
            >
<nav
  className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 text-zinc-950 transition-all duration-300 dark:text-white sm:px-5 ${
    isScrolled
      ? "border-zinc-200/80 bg-white/80 shadow-lg shadow-zinc-950/5 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80"
      : "border-transparent bg-transparent"
  }`}
>
                    {/* Logo */}
                    <button
                        onClick={() => handleNavigation("#home")}
                        className="font-mono text-xl font-bold tracking-tighter
            text-zinc-950 dark:text-white"
                        aria-label="Go to home"
                    >
                        EO<span className="text-violet-600">.</span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-7 lg:flex">
                        {navLinks.map(link => (
                            <button
                                key={link.href}
                                onClick={() => handleNavigation(link.href)}
                                className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-1 lg:flex">
                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/emmanuel-oluwasoji-147b3827b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="rounded-full p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                        >
                            <FaLinkedinIn size={17} />
                        </a>

                        {/* Theme */}
                        <button
                            onClick={cycleTheme}
                            aria-label={`Current theme: ${themeLabel}. Click to change.`}
                            title={themeLabel}
                            className="rounded-full p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                        >
                            <ThemeIcon size={18} />
                        </button>

                        {/* Let's Talk */}
                        <a
                            href={`https://wa.me/2347069737424?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-xs font-medium text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-zinc-950"
                        >
                            Let's Talk
                            <ArrowUpRight size={14} />
                        </a>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-1 lg:hidden">
                        <button
                            onClick={cycleTheme}
                            aria-label={`Current theme: ${themeLabel}. Click to change.`}
                            title={themeLabel}
                            className="rounded-full p-2.5 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                        >
                            <ThemeIcon size={19} />
                        </button>

                        <button
                            onClick={() => setIsOpen(current => !current)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                            className="rounded-full p-2.5 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                        >
                            {isOpen ? <X size={21} /> : <Menu size={21} />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-white text-zinc-950
                        dark:bg-zinc-950 dark:text-white lg:hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex h-full flex-col px-6 pb-8 pt-28"
                        >
                            {/* Navigation */}
                            <div className="flex flex-col">
                                {navLinks.map((link, index) => (
                                    <motion.button
                                        key={link.href}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: index * 0.05
                                        }}
                                        onClick={() =>
                                            handleNavigation(link.href)
                                        }
                                        className="border-b border-zinc-100 py-5 text-left text-2xl font-medium
text-zinc-950 dark:border-zinc-900 dark:text-white"
                                    >
                                        <span className="mr-4 font-mono text-xs text-zinc-400">
                                            0{index + 1}
                                        </span>

                                        {link.name}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Bottom */}
                            <div className="mt-auto">
                                <a
                                    href={`https://wa.me/2347069737424?text=${whatsappMessage}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between rounded-2xl bg-zinc-950 px-5 py-4 text-sm font-medium text-white dark:bg-white dark:text-zinc-950"
                                >
                                    <span className="flex items-center gap-2">
                                        <FaWhatsapp size={18} />
                                        Let's talk on WhatsApp
                                    </span>

                                    <ArrowUpRight size={18} />
                                </a>

                                <div className="mt-5 flex items-center justify-between">
                                    <a
                                        href="https://www.linkedin.com/in/emmanuel-oluwasoji-147b3827b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-sm text-zinc-500"
                                    >
                                        <FaLinkedinIn size={16} />
                                        LinkedIn
                                    </a>

                                    <span className="text-xs text-zinc-400">
                                        {themeLabel}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
