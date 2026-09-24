import { AnimatePresence, motion } from "motion/react";
import {
    Activity,
    BarChart3,
    CalendarDays,
    Clock3,
    Eye,
    Gauge,
    Users,
    X
} from "lucide-react";
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
    return new Intl.NumberFormat("en-US").format(value);
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

function getDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}${month}${day}`;
}

function getCalendarDays(start: string, end: string) {
    if (!start || !end) return [];

    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);

    if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
    ) {
        return [];
    }

    const firstDay = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
    );

    const lastDay = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    );

    const calendarStart = new Date(firstDay);
    calendarStart.setDate(
        calendarStart.getDate() - calendarStart.getDay()
    );

    const calendarEnd = new Date(lastDay);
    calendarEnd.setDate(
        calendarEnd.getDate() + (6 - calendarEnd.getDay())
    );

    const days: Date[] = [];
    const cursor = new Date(calendarStart);

    while (cursor <= calendarEnd) {
        days.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return days;
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
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(false);

            const started = performance.now();

            try {
                const [
                    monitorResponse,
                    analyticsResponse,
                    realtimeResponse
                ] = await Promise.all([
                    fetch(
                        "https://tboyarts-api.onrender.com/api/monitor"
                    ),
                    fetch(
                        "https://tboyarts-api.onrender.com/api/monitor/analytics"
                    ),
                    fetch(
                        "https://tboyarts-api.onrender.com/api/monitor/analytics/realtime"
                    )
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

                if (cancelled) return;

                setMonitor(monitorData);
                setAnalytics(analyticsData);
                setRealtime(realtimeData);
                setResponseTime(elapsed);

                if (analyticsData.daily.length > 0) {
                    setSelectedDate(
                        analyticsData.daily[
                            analyticsData.daily.length - 1
                        ].date
                    );
                } else {
                    setSelectedDate(null);
                }
            } catch {
                if (cancelled) return;

                setMonitor(null);
                setAnalytics(null);
                setRealtime(null);
                setResponseTime(null);
                setError(true);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [open]);

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

    const calendarDays = useMemo(
        () =>
            getCalendarDays(
                analytics?.period.start ?? "",
                analytics?.period.end ?? ""
            ),
        [analytics?.period.start, analytics?.period.end]
    );

    const dailyMap = useMemo(() => {
        const map = new Map<string, DailyAnalytics>();

        analytics?.daily.forEach(day => {
            map.set(day.date, day);
        });

        return map;
    }, [analytics?.daily]);

    const selectedAnalytics = selectedDate
        ? dailyMap.get(selectedDate)
        : undefined;

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
                                        {/* System status */}
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

                                        {/* Realtime */}
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

                                        {/* Calendar */}
                                        <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-7">
                                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <CalendarDays
                                                            size={20}
                                                            className="text-violet-500"
                                                        />

                                                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                                                            Activity calendar
                                                        </p>
                                                    </div>

                                                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                        Daily visitors, page
                                                        views and traffic.
                                                    </p>
                                                </div>

                                                {selectedAnalytics && (
                                                    <div className="text-left sm:text-right">
                                                        <p className="text-xs text-zinc-400">
                                                            {formatDateLabel(
                                                                selectedAnalytics.date
                                                            )}
                                                        </p>

                                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                                                            <span>
                                                                Visitors{" "}
                                                                <strong className="text-zinc-950 dark:text-white">
                                                                    {formatNumber(
                                                                        selectedAnalytics.visitors
                                                                    )}
                                                                </strong>
                                                            </span>

                                                            <span>
                                                                Views{" "}
                                                                <strong className="text-zinc-950 dark:text-white">
                                                                    {formatNumber(
                                                                        selectedAnalytics.page_views
                                                                    )}
                                                                </strong>
                                                            </span>

                                                            <span>
                                                                Traffic{" "}
                                                                <strong className="text-zinc-950 dark:text-white">
                                                                    {formatNumber(
                                                                        selectedAnalytics.traffic
                                                                    )}
                                                                </strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-7 grid grid-cols-7 gap-1.5 sm:gap-2">
                                                {[
                                                    "Sun",
                                                    "Mon",
                                                    "Tue",
                                                    "Wed",
                                                    "Thu",
                                                    "Fri",
                                                    "Sat"
                                                ].map(day => (
                                                    <div
                                                        key={day}
                                                        className="pb-2 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-400"
                                                    >
                                                        {day}
                                                    </div>
                                                ))}

                                                {calendarDays.map(day => {
                                                    const key =
                                                        getDateKey(day);

                                                    const item =
                                                        dailyMap.get(key);

                                                    const inPeriod =
                                                        key >=
                                                            (
                                                                analytics?.period
                                                                    .start ??
                                                                ""
                                                            ).replace(
                                                                /-/g,
                                                                ""
                                                            ) &&
                                                        key <=
                                                            (
                                                                analytics?.period
                                                                    .end ??
                                                                ""
                                                            ).replace(
                                                                /-/g,
                                                                ""
                                                            );

                                                    const isSelected =
                                                        selectedDate === key;

                                                    const hasActivity =
                                                        !!item &&
                                                        (item.visitors > 0 ||
                                                            item.page_views >
                                                                0 ||
                                                            item.traffic > 0);

                                                    return (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            disabled={
                                                                !inPeriod
                                                            }
                                                            onClick={() =>
                                                                item &&
                                                                setSelectedDate(
                                                                    key
                                                                )
                                                            }
                                                            className={[
                                                                "min-h-20 rounded-xl border p-2 text-left transition sm:min-h-24",
                                                                inPeriod
                                                                    ? "border-zinc-200 bg-white hover:border-violet-400 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-violet-500"
                                                                    : "border-transparent bg-transparent opacity-30",
                                                                isSelected
                                                                    ? "border-violet-500 ring-1 ring-violet-500"
                                                                    : "",
                                                                hasActivity
                                                                    ? "shadow-sm"
                                                                    : ""
                                                            ].join(" ")}
                                                        >
                                                            <span className="text-[10px] font-medium text-zinc-400">
                                                                {day.getDate()}
                                                            </span>

                                                            {item ? (
                                                                <div className="mt-2 space-y-1 text-[9px] leading-tight">
                                                                    <p className="text-zinc-600 dark:text-zinc-300">
                                                                        V{" "}
                                                                        <strong className="text-zinc-950 dark:text-white">
                                                                            {formatNumber(
                                                                                item.visitors
                                                                            )}
                                                                        </strong>
                                                                    </p>

                                                                    <p className="text-zinc-600 dark:text-zinc-300">
                                                                        P{" "}
                                                                        <strong className="text-zinc-950 dark:text-white">
                                                                            {formatNumber(
                                                                                item.page_views
                                                                            )}
                                                                        </strong>
                                                                    </p>

                                                                    <p className="text-zinc-600 dark:text-zinc-300">
                                                                        T{" "}
                                                                        <strong className="text-zinc-950 dark:text-white">
                                                                            {formatNumber(
                                                                                item.traffic
                                                                            )}
                                                                        </strong>
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <p className="mt-3 text-[9px] text-zinc-400">
                                                                    No data
                                                                </p>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {calendarDays.length === 0 && (
                                                <div className="py-12 text-center">
                                                    <BarChart3
                                                        size={24}
                                                        className="mx-auto text-zinc-300 dark:text-zinc-700"
                                                    />

                                                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                                                        Historical analytics are
                                                        not available yet.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Metric summaries */}
                                        <div className="mt-8">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">
                                                    Analytics summary
                                                </p>

                                                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                                                    TboyArts activity
                                                </h3>
                                            </div>

                                            <div className="mt-5 space-y-4">
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
                                                    icon={
                                                        <BarChart3
                                                            size={20}
                                                        />
                                                    }
                                                    label="Traffic"
                                                    summary={
                                                        analytics?.summary
                                                            .traffic
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {analytics?.period && (
                                            <p className="mt-6 text-xs text-zinc-400">
                                                Analytics period:{" "}
                                                {analytics.period.start} —{" "}
                                                {analytics.period.end}
                                            </p>
                                        )}
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
