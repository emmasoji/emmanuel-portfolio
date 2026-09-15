import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type ProjectStatus = "deployed" | "undeployed";

interface Project {
    number: string;
    title: string;
    type: string;
    description: string;
    technologies: string[];
    status: ProjectStatus;
    featured: boolean;
    liveUrl?: string;
}

const projects: Project[] = [
    {
        number: "01",
        title: "DUDE",
        type: "AI Assistant",
        description:
            "An AI assistant I'm building with a React frontend and Python backend, using FastAPI and the Groq API to power conversational AI.",
        technologies: ["React", "TypeScript", "Python", "FastAPI", "Groq API"],
        status: "undeployed",
        featured: true
    },
    {
        number: "02",
        title: "TboyArts",
        type: "E-commerce",
        description:
            "A modern art e-commerce platform designed for discovering and showcasing original artworks, with product browsing and an online shopping experience.",
        technologies: ["React", "TypeScript", "Supabase", "Vite"],
        status: "deployed",
        featured: false,
        liveUrl: "https://tboyarts.netlify.app/"
    }
];

const Projects = () => {
    const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);

    /*
     * Automatically remove the notification
     * after a short period.
     */
    useEffect(() => {
        if (!showDevelopmentModal) return;

        const timer = setTimeout(() => {
            setShowDevelopmentModal(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, [showDevelopmentModal]);

    const handleProjectClick = (project: Project) => {
        if (project.status === "deployed" && project.liveUrl) {
            window.open(project.liveUrl, "_blank", "noopener,noreferrer");
            return;
        }

        setShowDevelopmentModal(true);
    };

    const handleProjectKeyDown = (
        event: React.KeyboardEvent<HTMLElement>,
        project: Project
    ) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleProjectClick(project);
        }
    };

    return (
        <>
            <section
                id="projects"
                className="bg-white px-5 py-24 text-zinc-950 dark:bg-zinc-950 dark:text-white sm:px-8 lg:px-10"
            >
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
                    >
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                                Selected work
                            </p>

                            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                                Things I've
                                <span className="text-zinc-400 dark:text-zinc-600">
                                    {" "}
                                    been building.
                                </span>
                            </h2>
                        </div>

                        <p className="max-w-sm text-sm leading-6 text-zinc-500">
                            A collection of projects I'm building while learning
                            and exploring software development and AI.
                        </p>
                    </motion.div>

                    {/* Projects */}
                    <div className="mt-16 space-y-6">
                        {projects.map((project, index) => (
                            <motion.article
                                key={project.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true,
                                    amount: 0.15
                                }}
                                transition={{
                                    delay: index * 0.1
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={
                                    project.status === "deployed"
                                        ? `Open ${project.title} website`
                                        : `${project.title} is currently in development`
                                }
                                onClick={() => handleProjectClick(project)}
                                onKeyDown={event =>
                                    handleProjectKeyDown(event, project)
                                }
                                className={`group relative cursor-pointer overflow-hidden rounded-3xl border p-6 outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-violet-500 sm:p-8 lg:p-10 ${
                                    project.featured
                                        ? "border-violet-500/20 bg-zinc-950 text-white dark:bg-zinc-900"
                                        : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
                                }`}
                            >
                                {/* Decorative glow */}
                                {project.featured && (
                                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl transition-opacity duration-500 group-hover:bg-violet-600/30" />
                                )}

                                <div className="relative grid gap-10 lg:grid-cols-[100px_1fr_auto]">
                                    {/* Number */}
                                    <div
                                        className={`font-mono text-sm ${
                                            project.featured
                                                ? "text-zinc-500"
                                                : "text-zinc-400 dark:text-zinc-600"
                                        }`}
                                    >
                                        {project.number}
                                    </div>

                                    {/* Main content */}
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {/* Project type */}
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs ${
                                                    project.featured
                                                        ? "bg-violet-500/10 text-violet-300"
                                                        : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                                }`}
                                            >
                                                {project.type}
                                            </span>

                                            {/* Status */}
                                            <span
                                                className={`flex items-center gap-1.5 text-xs ${
                                                    project.status ===
                                                    "deployed"
                                                        ? project.featured
                                                            ? "text-emerald-400"
                                                            : "text-emerald-600 dark:text-emerald-400"
                                                        : project.featured
                                                          ? "text-amber-400"
                                                          : "text-amber-600 dark:text-amber-400"
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        project.status ===
                                                        "deployed"
                                                            ? "bg-emerald-500"
                                                            : "bg-amber-500"
                                                    }`}
                                                />

                                                {project.status === "deployed"
                                                    ? "Deployed"
                                                    : "Undeployed"}
                                            </span>
                                        </div>

                                        <h3 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                                            {project.title}
                                        </h3>

                                        <p
                                            className={`mt-4 max-w-2xl leading-7 ${
                                                project.featured
                                                    ? "text-zinc-400"
                                                    : "text-zinc-600 dark:text-zinc-400"
                                            }`}
                                        >
                                            {project.description}
                                        </p>

                                        {/* Technologies */}
                                        <div className="mt-7 flex flex-wrap gap-2">
                                            {project.technologies.map(
                                                technology => (
                                                    <span
                                                        key={technology}
                                                        className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] ${
                                                            project.featured
                                                                ? "border-zinc-800 text-zinc-400"
                                                                : "border-zinc-200 text-zinc-500 dark:border-zinc-800"
                                                        }`}
                                                    >
                                                        {technology}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Project action */}
                                    <div className="flex items-start gap-2 lg:justify-end">
                                        <button
                                            type="button"
                                            onClick={event => {
                                                event.stopPropagation();
                                                handleProjectClick(project);
                                            }}
                                            aria-label={
                                                project.status === "deployed"
                                                    ? `Open ${project.title}`
                                                    : `View ${project.title} development status`
                                            }
                                            className={`rounded-full border p-3 transition-all duration-300 hover:-translate-y-1 ${
                                                project.featured
                                                    ? "border-zinc-800 text-zinc-400 hover:border-violet-500/50 hover:text-white"
                                                    : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:hover:text-white"
                                            }`}
                                        >
                                            {project.status === "deployed" ? (
                                                <ArrowUpRight size={17} />
                                            ) : (
                                                <ExternalLink size={17} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Development Modal */}
            <AnimatePresence>
                {showDevelopmentModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setShowDevelopmentModal(false)}
                            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 40,
                                scale: 0.92
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1
                            }}
                            exit={{
                                opacity: 0,
                                y: 25,
                                scale: 0.95
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                            className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="development-modal-title"
                        >
                            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
                                {/* Violet glow */}
                                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />

                                {/* Close button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDevelopmentModal(false)
                                    }
                                    aria-label="Close modal"
                                    className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
                                >
                                    <X size={18} />
                                </button>

                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0.5, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        delay: 0.1,
                                        type: "spring",
                                        stiffness: 300
                                    }}
                                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                >
                                    <span className="text-2xl">⚡</span>
                                </motion.div>

                                {/* Content */}
                                <div className="relative mt-6">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                                        Project status
                                    </p>

                                    <h3
                                        id="development-modal-title"
                                        className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white"
                                    >
                                        Project currently in development
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                                        This project isn't publicly deployed
                                        yet. I'm still working on it and it will
                                        be available here once it's ready.
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="relative mt-6 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />

                                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                        Currently under development
                                    </span>
                                </div>

                                {/* Progress */}
                                <div className="relative mt-6 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <motion.div
                                        initial={{ width: "100%" }}
                                        animate={{ width: "0%" }}
                                        transition={{
                                            duration: 4,
                                            ease: "linear"
                                        }}
                                        className="h-full bg-violet-600"
                                    />
                                </div>

                                <p className="relative mt-3 text-center text-[11px] text-zinc-400">
                                    This message will close automatically
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Projects;
