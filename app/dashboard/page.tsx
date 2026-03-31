"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

type DashboardData = {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        position: string | null;
        teams: { id: string; name: string }[];
        managedTracks: { id: string; name: string }[];
    };
    attendance: {
        totalSessions: number;
        attendedSessions: number;
        attendanceRate: number;
    };
    sessions: {
        id: string;
        title: string;
        team: string;
        team_slug: string | null;
        created_by: string;
        created_at: string;
        attended: boolean;
        scanned_at: string | null;
    }[];
};

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/user/me", { credentials: "include" })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        router.push("/login");
                    }
                    throw new Error("Failed to fetch user data");
                }
                return res.json();
            })
            .then((data) => setData(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-muted border-t-brand-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-brand-subtext">Unable to load dashboard data.</p>
            </div>
        );
    }

    const { user, attendance, sessions } = data;
    const isBoardMember = /board|internal board/i.test(user.position || "");

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header & Navigation */}
                <div className="mb-4">
                    <h1 className="text-white text-4xl font-bold tracking-tight">Welcome, {user.name}</h1>
                    <p className="text-brand-subtext text-sm font-medium">{user.email}</p>
                </div>

                {/* Stats and Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Stats Card */}
                    <div className="bg-brand-card border border-brand-dark rounded-2xl p-6">
                        <h2 className="text-brand-subtext text-xs uppercase tracking-widest mb-4">
                            Attendance Overview
                        </h2>
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-white text-4xl font-bold">{attendance.attendanceRate}%</span>
                            <span className="text-brand-subtext mb-1">Rate</span>
                        </div>
                        <p className="text-brand-subtext text-sm mb-4">
                            {attendance.attendedSessions} of {attendance.totalSessions} sessions attended
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full bg-brand-dark rounded-full h-2.5">
                            <div
                                className="bg-brand-accent h-2.5 rounded-full"
                                style={{ width: `${attendance.attendanceRate}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-brand-card border border-brand-dark rounded-2xl p-6 md:col-span-2">
                        <h2 className="text-brand-subtext text-xs uppercase tracking-widest mb-4">
                            Profile Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-brand-subtext text-sm">Position</p>
                                <p className="text-white font-medium capitalize">{user.position ?? "Member"}</p>
                            </div>
                            <div>
                                <p className="text-brand-subtext text-sm">Phone</p>
                                <p className="text-white font-medium">{user.phone ?? "Not provided"}</p>
                            </div>
                            <div>
                                <p className="text-brand-subtext text-sm">My Teams</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {user.teams.length > 0 ? (
                                        user.teams.map((t) => (
                                            <span key={t.id} className="bg-brand-primary/20 text-brand-primary px-2 py-1 rounded text-xs">
                                                {t.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-brand-subtext text-sm">No teams assigned</span>
                                    )}
                                </div>
                            </div>
                            {(user.managedTracks.length > 0 || user.position === "head") && (
                                <div>
                                    <p className="text-brand-subtext text-sm">Management</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {user.managedTracks.map((t) => (
                                            <span key={t.id} className="bg-brand-accent/20 text-brand-accent px-2 py-1 rounded text-xs">
                                                Manage: {t.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sessions List */}
                <div>
                    <h2 className="text-white text-xl font-semibold mb-4">Recent Sessions</h2>
                    {sessions.length === 0 ? (
                        <p className="text-brand-subtext">No upcoming or past sessions found for your teams.</p>
                    ) : (
                        <div className="bg-brand-card border border-brand-dark rounded-2xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-brand-dark bg-brand-dark/30">
                                        <th className="py-4 px-6 text-brand-subtext text-sm font-medium">Session Title</th>
                                        <th className="py-4 px-6 text-brand-subtext text-sm font-medium hidden md:table-cell">Team</th>
                                        <th className="py-4 px-6 text-brand-subtext text-sm font-medium hidden sm:table-cell">Date</th>
                                        {!isBoardMember && <th className="py-4 px-6 text-brand-subtext text-sm font-medium">Status</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((session) => (
                                        <tr key={session.id} className="border-b border-brand-dark last:border-0 hover:bg-brand-dark/20 transition-colors">
                                            <td className="py-4 px-6">
                                                <Link
                                                    href={`/sessions/${session.team_slug || 'unknown'}/${session.id}`}
                                                    className="text-white font-medium hover:text-brand-accent transition-colors"
                                                >
                                                    {session.title}
                                                </Link>
                                                <p className="text-brand-subtext text-xs md:hidden mt-1">{session.team}</p>
                                            </td>
                                            <td className="py-4 px-6 text-brand-subtext text-sm hidden md:table-cell">
                                                {session.team}
                                            </td>
                                            <td className="py-4 px-6 text-brand-subtext text-sm hidden sm:table-cell">
                                                {session.created_at}
                                            </td>
                                            {!isBoardMember && (
                                                <td className="py-4 px-6">
                                                    {session.attended ? (
                                                        <span className="inline-flex items-center gap-1.5 text-brand-success bg-brand-success/10 px-3 py-1 rounded-full text-xs font-semibold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-success"></span>
                                                            Attended
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-xs font-semibold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                            Absent
                                                        </span>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
