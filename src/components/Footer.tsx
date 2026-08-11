import { ArrowUp, Mail } from "lucide-react";
import { FaLinkedinIn, FaWhatsapp, FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="border-t border-zinc-200 bg-white px-5 py-10 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    {/* Brand */}
                    <div>
                        <a
                            href="#home"
                            className="font-mono text-xl font-bold tracking-tighter"
                        >
                            EO<span className="text-violet-600">.</span>
                        </a>

                        <p className="mt-2 max-w-sm text-sm text-zinc-500">
                            Software developer in progress, building things and
                            learning along the way.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap items-center gap-5">
                        <a
                            href="#about"
                            className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white"
                        >
                            About
                        </a>

                        <a
                            href="#projects"
                            className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white"
                        >
                            Projects
                        </a>

                        <a
                            href="#skills"
                            className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white"
                        >
                            Skills
                        </a>

                        <a
                            href="#contact"
                            className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white"
                        >
                            Contact
                        </a>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 flex flex-col justify-between gap-5 border-t border-zinc-100 pt-6 dark:border-zinc-900 sm:flex-row sm:items-center">
                    <p className="text-xs text-zinc-400">
                        © {new Date().getFullYear()} Emmanuel Oluwasoji. Built
                        with React.
                    </p>

                    <div className="flex items-center gap-2">
                        <a
                            href="mailto:emmasoji56@gmail.com"
                            aria-label="Email"
                            className="rounded-full p-2.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white"
                        >
                            <Mail size={17} />
                        </a>

                        <a
                            href="https://wa.me/2347069737424"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="WhatsApp"
                            className="rounded-full p-2.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white"
                        >
                            <FaWhatsapp size={17} />
                        </a>

                        <a
                            href="https://www.linkedin.com/in/emmanuel-oluwasoji-147b3827b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="rounded-full p-2.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white"
                        >
                            <FaLinkedinIn size={17} />
                        </a>
                        <a
                            href="https://github.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub"
                            className="rounded-full p-2.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-white"
                        >
                            <FaGithub size={17} />
                        </a>

                        <a
                            href="#home"
                            aria-label="Back to top"
                            className="ml-2 rounded-full border border-zinc-200 p-2.5 text-zinc-500 transition-transform hover:-translate-y-1 dark:border-zinc-800 dark:text-zinc-400"
                        >
                            <ArrowUp size={17} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
