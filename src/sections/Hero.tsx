import { ArrowDown, ArrowUpRight } from "lucide-react";

import { FaLinkedinIn } from "react-icons/fa";
import { motion } from "motion/react";

const Hero = () => {
    return (
        <section
            id="home"
            className="relative flex min-h-screen items-center overflow-hidden bg-white px-5 pb-20 pt-32 text-zinc-950 dark:bg-zinc-950 dark:text-white sm:px-8 lg:px-10"
        >
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/3 h-100 w-100 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px] dark:bg-violet-500/15" />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-size-[60px_60px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)]" />
            </div>

            <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Content */}
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400"
                    >
                        Software Developer • AI Builder
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.08 }}
                        className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-8xl"
                    >
                        Building ideas
                        <span className="block text-zinc-400 dark:text-zinc-600">
                            into reality.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.16 }}
                        className="mt-7 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg"
                    >
                        I'm Emmanuel Oluwasoji, a software development student
                        from Nigeria building web applications and exploring AI
                        through real-world projects.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.24 }}
                        className="mt-9 flex flex-wrap items-center gap-3"
                    >
                        <a
                            href="#projects"
                            className="group inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-zinc-950"
                        >
                            View my work
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>

                        <a
                            href="#contact"
                            className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        >
                            Let's connect
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="mt-8 flex items-center gap-3"
                    >
<a
  href="https://www.linkedin.com/in/emmanuel-oluwasoji-147b3827b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  target="_blank"
  rel="noreferrer"
  aria-label="LinkedIn"
  className="text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white"
>
  <FaLinkedinIn size={19} />
</a>
                    </motion.div>
                </div>

                {/* Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mx-auto hidden h-105 w-full max-w-105 lg:block"
                >
                    <div className="absolute inset-8 rounded-[2.5rem] border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900" />

                    <motion.div
                        animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute left-1/2 top-1/2 flex h-52 w-52 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-4xl border border-violet-500/20 bg-white/80 shadow-2xl shadow-violet-500/10 backdrop-blur-xl dark:bg-zinc-950/80"
                    >
                        <div className="text-center">
                            <p className="font-mono text-5xl font-bold tracking-tighter">
                                EO<span className="text-violet-600">.</span>
                            </p>

                            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                                Build · Learn · Repeat
                            </p>
                        </div>
                    </motion.div>

                    <div className="absolute -right-2 top-14 rounded-full border border-zinc-200 bg-white px-4 py-2 font-mono text-xs text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        React
                    </div>

                    <div className="absolute -bottom-2 left-4 rounded-full border border-zinc-200 bg-white px-4 py-2 font-mono text-xs text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        Python
                    </div>

                    <div className="absolute bottom-20 right-0 rounded-full border border-zinc-200 bg-white px-4 py-2 font-mono text-xs text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        AI
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.a
                href="#about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-400 sm:flex"
            >
                <span className="text-[10px] uppercase tracking-[0.2em]">
                    Scroll
                </span>

                <ArrowDown size={15} className="animate-bounce" />
            </motion.a>
        </section>
    );
};

export default Hero;
