import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "motion/react";

const whatsappMessage = encodeURIComponent(
    "Hello Emmanuel, I came across your portfolio and I'd like to discuss an opportunity."
);

const Contact = () => {
    return (
        <section
            id="contact"
            className="bg-zinc-50 px-5 py-24 text-zinc-950 dark:bg-zinc-900/40 dark:text-white sm:px-8 lg:px-10"
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                            Get in touch
                        </p>

                        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                            Let's build
                            <span className="block text-zinc-400 dark:text-zinc-600">
                                something.
                            </span>
                        </h2>

                        <p className="mt-6 max-w-md leading-7 text-zinc-500">
                            Have a project idea, opportunity, or just want to
                            talk about technology? I'm always open to
                            connecting.
                        </p>

                        <div className="mt-9 space-y-4">

                            {/* Email */}
                            <a
                                href="mailto:emmasoji56@gmail.com"
                                className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-transform hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-950"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                    <Mail size={18} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-zinc-400">
                                        Email
                                    </p>

                                    <p className="mt-1 truncate text-sm font-medium">
                                        emmasoji56@gmail.com
                                    </p>
                                </div>

                                <ArrowUpRight
                                    size={17}
                                    className="ml-auto text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>

                            {/* Phone */}
                            <a
                                href="tel:+2347069737424"
                                className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-transform hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-950"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                    <Phone size={18} />
                                </div>

                                <div>
                                    <p className="text-xs text-zinc-400">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        +234 706 973 7424
                                    </p>
                                </div>

                                <ArrowUpRight
                                    size={17}
                                    className="ml-auto text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>

                            {/* Location */}
                            <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                    <MapPin size={18} />
                                </div>

                                <div>
                                    <p className="text-xs text-zinc-400">
                                        Location
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        Nigeria · Open to remote opportunities
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* WhatsApp CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
                    >
                        <div className="flex h-full flex-col justify-between">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white">
                                    <FaWhatsapp size={24} />
                                </div>

                                <h3 className="mt-7 text-2xl font-semibold">
                                    Chat on WhatsApp
                                </h3>

                                <p className="mt-3 max-w-md leading-7 text-zinc-500">
                                    Have a project, opportunity, or question?
                                    Send me a message directly on WhatsApp and
                                    let's talk.
                                </p>
                            </div>

                            <div className="mt-12">
                                <a
                                    href={`https://wa.me/2347069737424?text=${whatsappMessage}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex w-full items-center justify-between rounded-2xl bg-green-600 px-5 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-1 hover:bg-green-700"
                                >
                                    <span className="flex items-center gap-2">
                                        <MessageCircle size={18} />
                                        Start a WhatsApp chat
                                    </span>

                                    <ArrowUpRight
                                        size={18}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
