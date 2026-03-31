"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TeamType = {
    id: string;
    name: string;
    slug: string;
};

type TeamsData = {
    chapters: TeamType[];
    committees: TeamType[];
    tracks: TeamType[];
    all: TeamType[];
};

export default function TeamsPage() {
    const [data, setData] = useState<TeamsData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/teams", { credentials: "include" })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        router.push("/login");
                    }
                    throw new Error("Failed to fetch teams");
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
                <p className="text-brand-subtext">Unable to load teams data.</p>
            </div>
        );
    }

    const renderTeamSection = (title: string, teams: TeamType[]) => {
        if (teams.length === 0) return null;
        return (
            <div className="mb-12">
                <h2 className="text-white text-xl font-semibold mb-6 border-b border-brand-dark pb-2">
                    {title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team) => (
                        <Link
                            key={team.id}
                            href={`/sessions/${team.slug}`}
                            className="bg-brand-card border border-brand-dark hover:border-brand-accent hover:-translate-y-1 rounded-xl p-6 transition-all duration-200 block group"
                        >
                            <h3 className="text-white text-lg font-medium group-hover:text-brand-accent transition-colors">
                                {team.name}
                            </h3>
                            <p className="text-brand-subtext text-xs mt-2 uppercase tracking-wide">
                                View Sessions →
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-brand-accent text-sm uppercase tracking-widest mb-1">
                            Directory
                        </p>
                        <h1 className="text-white text-3xl font-bold">ZSB Teams</h1>
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-brand-subtext hover:text-white text-sm font-medium transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {renderTeamSection("Chapters", data.chapters)}
                {renderTeamSection("Committees", data.committees)}
                {renderTeamSection("Tracks", data.tracks)}
            </div>
        </div>
    );
}
