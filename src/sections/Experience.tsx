import { Building2, CalendarDays, MapPin } from "lucide-react";
import { motion } from "motion/react";

const experiences = [
  {
    role: "Industrial Maintenance Intern",
    company: "Pardee Foods",
    location: "Nigeria",
    period: "SIWES · 3 Months",
    description:
      "Completed a three-month industrial training placement in the maintenance department, gaining exposure to industrial maintenance practices and the day-to-day environment of a food production facility.",
    points: [
      "Observed maintenance activities and workplace procedures within a food production environment.",
      "Gained practical exposure to how maintenance teams support production operations.",
      "Learned about the importance of equipment checks, safety procedures, and preventive maintenance.",
      "Worked alongside maintenance personnel and gained experience adapting to an industrial workplace.",
    ],
  },
];

const Experience = () => {
  return (
    <section
      id="experience"
      className="bg-white px-5 py-24 text-zinc-950 dark:bg-zinc-950 dark:text-white sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            Experience
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Where I've
            <span className="text-zinc-400 dark:text-zinc-600">
              {" "}
              learned.
            </span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-14">
          {/* Timeline line */}
          <div className="absolute bottom-0 left-3 top-0 hidden w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />

          {experiences.map((experience) => (
            <motion.article
              key={`${experience.company}-${experience.role}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative sm:pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 hidden h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:flex">
                <div className="h-2 w-2 rounded-full bg-violet-600" />
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8 lg:p-10">
                {/* Top */}
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div>
                    <p className="font-mono text-xs text-violet-600 dark:text-violet-400">
                      {experience.period}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                      {experience.role}
                    </h3>

                    <p className="mt-2 text-base text-zinc-500">
                      {experience.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-950">
                      <CalendarDays size={13} />
                      3 Months
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-950">
                      <MapPin size={13} />
                      {experience.location}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-7 max-w-3xl leading-7 text-zinc-600 dark:text-zinc-400">
                  {experience.description}
                </p>

                {/* Points */}
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {experience.points.map((point) => (
                    <div
                      key={point}
                      className="flex gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />

                      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Education note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-6 flex items-start gap-4 rounded-3xl border border-dashed border-zinc-300 p-6 dark:border-zinc-800"
        >
          <Building2
            size={20}
            className="mt-0.5 shrink-0 text-zinc-400"
          />

          <div>
            <p className="text-sm font-medium">Currently developing</p>

            <p className="mt-1 text-sm leading-6 text-zinc-500">
              I'm continuing to build my software development skills through
              personal projects, practical experimentation, and ongoing study.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;