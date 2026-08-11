import { ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { motion } from "motion/react";

const About = () => {
  return (
    <section
      id="about"
      className="bg-zinc-50 px-5 py-24 text-zinc-950 dark:bg-zinc-900/40 dark:text-white sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              About me
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Still learning.
              <span className="block text-zinc-400 dark:text-zinc-600">
                Still building.
              </span>
            </h2>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl"
          >
            <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
              I'm Emmanuel Oluwasoji, a software development student from
              Nigeria who enjoys turning ideas into working digital products.
            </p>

            <p className="mt-5 leading-7 text-zinc-600 dark:text-zinc-400">
              My current focus is on frontend development, backend development,
              and AI-powered applications. I'm learning by building real
              projects rather than only following tutorials.
            </p>

            <p className="mt-5 leading-7 text-zinc-600 dark:text-zinc-400">
              I'm particularly interested in React, TypeScript, Python,
              FastAPI, APIs, and the possibilities of AI. One of the projects
              I'm currently building is DUDE, an AI assistant powered by the
              Groq API.
            </p>

            {/* Info */}
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <GraduationCap
                  size={20}
                  className="mt-0.5 shrink-0 text-violet-600"
                />

                <div>
                  <p className="text-sm font-medium">Education</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    ND — Industrial Maintenance Engineering
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <MapPin
                  size={20}
                  className="mt-0.5 shrink-0 text-violet-600"
                />

                <div>
                  <p className="text-sm font-medium">Based in</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Nigeria · Open to remote opportunities
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-950 dark:text-white"
            >
              Let's work together
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;