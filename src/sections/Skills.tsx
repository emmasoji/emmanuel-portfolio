import {
    BrainCircuit,
    Code2,
    Database,
    GitBranch,
    Server,
    Wrench
} from "lucide-react";
import { motion } from "motion/react";

const skillGroups = [
    {
        icon: Code2,
        title: "Frontend",
        description: "Building responsive interfaces and web experiences.",
        skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Vite"]
    },
    {
        icon: Server,
        title: "Backend",
        description: "Learning to build APIs and server-side applications.",
        skills: ["Python", "FastAPI", "Flask", "REST APIs"]
    },
    {
        icon: BrainCircuit,
        title: "AI & APIs",
        description: "Exploring practical AI application development.",
        skills: ["Groq API", "AI Integration", "Prompt Engineering"]
    },
    {
        icon: Database,
        title: "Data & Services",
        description: "Working with cloud services and application data.",
        skills: ["Supabase", "PostgreSQL", "Authentication"]
    },
    {
        icon: GitBranch,
        title: "Development Tools",
        description: "Tools I use to build and manage projects.",
        skills: ["Git", "GitHub", "npm", "Vite", "VS Code", "Termux"]
    },
    {
        icon: Wrench,
        title: "Currently Learning",
        description: "Technologies I'm actively improving.",
        skills: [
            "Advanced Python",
            "FastAPI",
            "AI Development",
            "Backend Architecture"
        ]
    }
];

const Skills = () => {
    return (
        <section
            id="skills"
            className="bg-zinc-50 px-5 py-24 text-zinc-950 dark:bg-zinc-900/40 dark:text-white sm:px-8 lg:px-10"
        >
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                        Toolbox
                    </p>

                    <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                        What I work
                        <span className="text-zinc-400 dark:text-zinc-600">
                            {" "}
                            with.
                        </span>
                    </h2>

                    <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500">
                        Technologies and tools I'm using while building projects
                        and developing my skills as a software developer.
                    </p>
                </motion.div>

                {/* Skills grid */}
                <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {skillGroups.map((group, index) => {
                        const Icon = group.icon;

                        return (
                            <motion.div
                                key={group.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ delay: index * 0.06 }}
                                whileHover={{ y: -4 }}
                                className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-xl hover:shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:shadow-black/20"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                        <Icon size={19} />
                                    </div>

                                    <span className="font-mono text-[10px] text-zinc-400">
                                        0{index + 1}
                                    </span>
                                </div>

                                <h3 className="mt-6 font-semibold">
                                    {group.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-zinc-500">
                                    {group.description}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {group.skills.map(skill => (
                                        <span
                                            key={skill}
                                            className="rounded-lg bg-zinc-100 px-2.5 py-1.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Skills;
