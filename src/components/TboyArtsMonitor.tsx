import { AnimatePresence, motion } from "motion/react";
import {
    Activity,
    BarChart3,
    Clock3,
    Eye,
    Gauge,
    Users,
    X
} from "lucide-react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { useEffect, useMemo, useState } from "react";

interface TboyArtsMonitorProps {
    open: boolean;
    onClose: () => void;
}

interface MonitorResponse {
    success: boolean;
    status: string;
    started_at: string;
    server_time: string;
}

interface DailyAnalytics {
    date: string;
    visitors: number;
    page_views: number;
    traffic: number;
}

interface AnalyticsMetricSummary {
    monthly_average: number;
    daily_average: number;
    total: number;
}

interface AnalyticsResponse {
    success: boolean;
    period: {
        start: string;
        end: string;
    };
    daily: DailyAnalytics[];
    summary: {
        visitors: AnalyticsMetricSummary;
        page_views: AnalyticsMetricSummary;
        traffic: AnalyticsMetricSummary;
    };
}

interface RealtimeResponse {
    success: boolean;
    active_users: number;
    page_views: number;
}

type MetricKey = "visitors" | "page_views" | "traffic";

const API_BASE = "https://tboyarts-api.onrender.com/api/monitor";
const MONITOR_TOKEN =
    import.meta.env.VITE_TBOYARTS_MONITOR_TOKEN ?? "";

function getDefaultStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().slice(0, 10);
}

function getDefaultEndDate() {
    return new Date().toISOString().slice(0, 10);
}

function formatUptime(startedAt: string) {
    const start = new Date(startedAt).getTime();

    if (!Number.isFinite(start)) {
        return "—";
    }

    let seconds = Math.max(
        0,
        Math.floor((Date.now() - start) / 1000)
    );

    const years = Math.floor(seconds / (365 * 24 * 60 * 60));
    seconds %= 365 * 24 * 60 * 60;

    const months = Math.floor(seconds / (30 * 24 * 60 * 60));
    seconds %= 30 * 24 * 60 * 60;

    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= 24 * 60 * 60;

    const hours = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return [years, months, days, hours, minutes, seconds]
        .map(value => String(value).padStart(2, "0"))
        .join(":");
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
    }).format(value);
}

function formatDateLabel(dateString: string) {
    const year = Number(dateString.slice(0, 4));
    const month = Number(dateString.slice(4, 6)) - 1;
    const day = Number(dateString.slice(6, 8));

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(year, month, day));
}

function formatInputDate(dateString: string) {
    if (!dateString) return "—";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(`${dateString}T00:00:00`));
}

function MetricSummary({
    icon,
    label,
    summary
}: {
    icon: React.ReactNode;
    label: string;
    summary: AnalyticsMetricSummary | undefined;
}) {
    return (
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
                <div className="text-violet-500">{icon}</div>

                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                    {label}
                </p>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-4">
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                        Monthly average
                    </p>
                    <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
                        {formatNumber(summary?.monthly_average ?? 0)}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                        Daily average
                    </p>
                    <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
                        {formatNumber(summary?.daily_average ?? 0)}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                        Total
                    </p>
                    <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
                        {formatNumber(summary?.total ?? 0)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function TboyArtsMonitor({
    open,
    onClose
}: TboyArtsMonitorProps) {
    const [monitor, setMonitor] = useState<MonitorResponse | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [realtime, setRealtime] = useState<RealtimeResponse | null>(null);
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [uptime, setUptime] = useState("—");

    const [startDate, setStartDate] = useState(getDefaultStartDate);
    const [endDate, setEndDate] = useState(getDefaultEndDate);
    const [appliedStartDate, setAppliedStartDate] =
        useState(getDefaultStartDate);
    const [appliedEndDate, setAppliedEndDate] =
        useState(getDefaultEndDate);

    const [metric, setMetric] = useState<MetricKey>("visitors");

    const load = async (
        selectedStart: string,
        selectedEnd: string
    ) => {
        setLoading(true);
        setError(false);

        const started = performance.now();

        try {
            const analyticsUrl =
                `${API_BASE}/analytics?start_date=${encodeURIComponent(
                    selectedStart
                )}&end_date=${encodeURIComponent(selectedEnd)}`;

            const [
                monitorResponse,
                analyticsResponse,
                realtimeResponse
            ] = await Promise.all([
                fetch(`${API_BASE}`, {
                    headers: {
                        "X-Monitor-Token": MONITOR_TOKEN
                    }
                }),
                fetch(analyticsUrl, {
                    headers: {
                        "X-Monitor-Token": MONITOR_TOKEN
                    }
                }),
                fetch(`${API_BASE}/analytics/realtime`, {
                    headers: {
                        "X-Monitor-Token": MONITOR_TOKEN
                    }
                })
            ]);

            const elapsed = Math.round(
                performance.now() - started
            );

            if (
                !monitorResponse.ok ||
                !analyticsResponse.ok ||
                !realtimeResponse.ok
            ) {
                throw new Error("Monitor request failed");
            }

            const monitorData =
                (await monitorResponse.json()) as MonitorResponse;

            const analyticsData =
                (await analyticsResponse.json()) as AnalyticsResponse;

            const realtimeData =
                (await realtimeResponse.json()) as RealtimeResponse;

            setMonitor(monitorData);
            setAnalytics(analyticsData);
            setRealtime(realtimeData);
            setResponseTime(elapsed);
        } catch {
            setMonitor(null);
            setAnalytics(null);
            setRealtime(null);
            setResponseTime(null);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!open) return;

        void load(appliedStartDate, appliedEndDate);
    }, [open, appliedStartDate, appliedEndDate]);

    useEffect(() => {
        if (!monitor?.started_at) {
            setUptime("—");
            return;
        }

        const update = () => {
            setUptime(formatUptime(monitor.started_at));
        };

        update();

        const interval = window.setInterval(update, 1000);

        return () => window.clearInterval(interval);
    }, [monitor?.started_at]);

    const chartData = useMemo(() => {
        if (!analytics?.daily) return [];

        return analytics.daily.map(day => ({
            date: formatDateLabel(day.date),
            value: day[metric]
        }));
    }, [analytics?.daily, metric]);

    const metricLabel =
        metric === "visitors"
            ? "Visitors"
            : metric === "page_views"
              ? "Page views"
              : "Traffic";

    const selectedSummary = analytics?.summary[metric];

    const applyDateRange = () => {
        if (!startDate || !endDate) return;

        if (startDate > endDate) {
            return;
        }

        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 24
                        }}
                        className="fixed inset-0 z-[201] overflow-y-auto bg-white dark:bg-zinc-950"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tboyarts-monitor-title"
                    >
                        <div className="mx-auto min-h-screen w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-10 lg:px-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                                        Live project monitor
                                    </p>

                                    <h2
                                        id="tboyarts-monitor-title"
                                        className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl"
                                    >
                                        TboyArts
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close TboyArts monitor"
                                    className="rounded-full border border-zinc-200 p-3 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mt-10">
                                {loading ? (
                                    <div className="flex min-h-[50vh] items-center justify-center">
                                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                                            <Activity
                                                size={18}
                                                className="animate-pulse"
                                            />
                                            Checking TboyArts...
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
                                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                            Unable to retrieve TboyArts
                                            monitoring data.
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                                            The monitoring service could not
                                            be reached right now.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                                                <div className="flex items-center justify-between">
                                                    <Activity
                                                        size={20}
                                                        className={
                                                            monitor?.status ===
                                                            "online"
                                                                ? "text-emerald-500"
                                                                : "text-red-500"
                                                        }
                                                    />

                                                    <span
                                                        className={
                                                            monitor?.status ===
                                                            "online"
                                                                ? "text-xs font-medium text-emerald-600 dark:text-emerald-400"
                                                                : "text-xs font-medium text-red-600 dark:text-red-400"
                                                        }
                                                    >
                                                        {monitor?.status ===
                                                        "online"
                                                            ? "Online"
                                                            : "Offline"}
                                                    </span>
                                                </div>

                                                <p className="mt-8 text-xs uppercase tracking-wider text-zinc-400">
                                                    Status
                                                </p>

                                                <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
                                                    {monitor?.status ===
                                                    "online"
                                                        ? "Operational"
                                                        : "Unavailable"}
                                                </p>
                                            </div>

                                            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                                                <Clock3
                                                    size={20}
                                                    className="text-violet-500"
                                                />

                                                <p className="mt-8 text-xs uppercase tracking-wider text-zinc-400">
                                                    Uptime
                                                </p>

                                                <p className="mt-2 font-mono text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                                                    {uptime}
                                                </p>
                                            </div>

                                            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                                                <Gauge
                                                    size={20}
                                                    className="text-blue-500"
                                                />

                                                <p className="mt-8 text-xs uppercase tracking-wider text-zinc-400">
                                                    Response time
                                                </p>

                                                <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
                                                    {responseTime !== null
                                                        ? `${responseTime} ms`
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 rounded-3xl border border-violet-500/20 bg-violet-500/[0.04] p-6 dark:bg-violet-500/[0.06]">
                                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                                                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">
                                                            Realtime
                                                        </p>
                                                    </div>

                                                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                        Activity from the last
                                                        30 minutes.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-8">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                                                            Active users
                                                        </p>

                                                        <p className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">
                                                            {formatNumber(
                                                                realtime?.active_users ??
                                                                    0
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                                                            Page views
                                                        </p>

                                                        <p className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">
                                                            {formatNumber(
                                                                realtime?.page_views ??
                                                                    0
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-7">
                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <BarChart3
                                                            size={20}
                                                            className="text-violet-500"
                                                        />

                                                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                                                            Activity
                                                        </p>
                                                    </div>

                                                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                        {formatInputDate(
                                                            appliedStartDate
                                                        )}{" "}
                                                        —{" "}
                                                        {formatInputDate(
                                                            appliedEndDate
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-3 sm:flex-row">
                                                    <div className="rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950">
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                                <p className="text-[9px] uppercase tracking-wider text-zinc-400">
                                                                    From
                                                                </p>

                                                                <input
                                                                    type="date"
                                                                    value={
                                                                        startDate
                                                                    }
                                                                    max={
                                                                        endDate
                                                                    }
                                                                    onChange={event =>
                                                                        setStartDate(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="mt-1 bg-transparent text-sm font-medium text-zinc-950 outline-none dark:text-white"
                                                                />
                                                            </div>

                                                            <span className="text-zinc-300 dark:text-zinc-700">
                                                                →
                                                            </span>

                                                            <div>
                                                                <p className="text-[9px] uppercase tracking-wider text-zinc-400">
                                                                    To
                                                                </p>

                                                                <input
                                                                    type="date"
                                                                    value={
                                                                        endDate
                                                                    }
                                                                    min={
                                                                        startDate
                                                                    }
                                                                    onChange={event =>
                                                                        setEndDate(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="mt-1 bg-transparent text-sm font-medium text-zinc-950 outline-none dark:text-white"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            applyDateRange
                                                        }
                                                        disabled={
                                                            startDate >
                                                            endDate
                                                        }
                                                        className="rounded-2xl bg-zinc-950 px-5 py-3 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-2">
                                                {(
                                                    [
                                                        [
                                                            "visitors",
                                                            "Visitors"
                                                        ],
                                                        [
                                                            "page_views",
                                                            "Page views"
                                                        ],
                                                        [
                                                            "traffic",
                                                            "Traffic"
                                                        ]
                                                    ] as const
                                                ).map(([key, label]) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() =>
                                                            setMetric(key)
                                                        }
                                                        className={
                                                            metric === key
                                                                ? "rounded-full bg-violet-600 px-4 py-2 text-xs font-medium text-white"
                                                                : "rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
                                                        }
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="mt-7">
                                                {chartData.length > 0 ? (
                                                    <div className="h-[320px] w-full">
                                                        <ResponsiveContainer
                                                            width="100%"
                                                            height="100%"
                                                        >
                                                            <LineChart
                                                                data={
                                                                    chartData
                                                                }
                                                                margin={{
                                                                    top: 10,
                                                                    right: 10,
                                                                    left: -20,
                                                                    bottom: 5
                                                                }}
                                                            >
                                                                <XAxis
                                                                    dataKey="date"
                                                                    tick={{
                                                                        fontSize: 10
                                                                    }}
                                                                    tickLine={
                                                                        false
                                                                    }
                                                                    axisLine={
                                                                        false
                                                                    }
                                                                    minTickGap={
                                                                        35
                                                                    }
                                                                />

                                                                <YAxis
                                                                    allowDecimals={
                                                                        false
                                                                    }
                                                                    tick={{
                                                                        fontSize: 10
                                                                    }}
                                                                    tickLine={
                                                                        false
                                                                    }
                                                                    axisLine={
                                                                        false
                                                                    }
                                                                    width={45}
                                                                />

                                                                <Tooltip
                                                                    contentStyle={{
                                                                        borderRadius:
                                                                            "16px",
                                                                        border:
                                                                            "1px solid rgba(161,161,170,0.25)",
                                                                        background:
                                                                            "rgba(255,255,255,0.96)"
                                                                    }}
                                                                    formatter={(
                                                                        value
                                                                    ) => [
                                                                        formatNumber(
                                                                            Number(
                                                                                value
                                                                            )
                                                                        ),
                                                                        metricLabel
                                                                    ]}
                                                                />

                                                                <Line
                                                                    type="monotone"
                                                                    dataKey="value"
                                                                    stroke="#7c3aed"
                                                                    strokeWidth={
                                                                        2.5
                                                                    }
                                                                    dot={{
                                                                        r: 3
                                                                    }}
                                                                    activeDot={{
                                                                        r: 5
                                                                    }}
                                                                />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                                        <div className="text-center">
                                                            <BarChart3
                                                                size={24}
                                                                className="mx-auto text-zinc-300 dark:text-zinc-700"
                                                            />

                                                            <p className="mt-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                                                No historical
                                                                data yet
                                                            </p>

                                                            <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-400">
                                                                GA4 has not
                                                                processed daily
                                                                analytics for
                                                                this period.
                                                                Realtime data
                                                                remains
                                                                available above.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {selectedSummary && (
                                                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                                                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                                                            Monthly average
                                                        </p>

                                                        <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
                                                            {formatNumber(
                                                                selectedSummary.monthly_average
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                                                            Daily average
                                                        </p>

                                                        <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
                                                            {formatNumber(
                                                                selectedSummary.daily_average
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                                                        <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                                                            Total
                                                        </p>

                                                        <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">
                                                            {formatNumber(
                                                                selectedSummary.total
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8 grid gap-4 lg:grid-cols-3">
                                            <MetricSummary
                                                icon={<Users size={20} />}
                                                label="Visitors"
                                                summary={
                                                    analytics?.summary
                                                        .visitors
                                                }
                                            />

                                            <MetricSummary
                                                icon={<Eye size={20} />}
                                                label="Page views"
                                                summary={
                                                    analytics?.summary
                                                        .page_views
                                                }
                                            />

                                            <MetricSummary
                                                icon={<Activity size={20} />}
                                                label="Traffic"
                                                summary={
                                                    analytics?.summary.traffic
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
