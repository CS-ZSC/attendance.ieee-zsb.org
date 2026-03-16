"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SessionCard from "@/components/sessions/SessionCard";
import CreateSessionModal from "@/components/sessions/CreateSessionModal";
import { Session } from "@/types/sessions";

const teamSlugs: Record<string, string> = {
  Ambassadors: "ambassadors",
  "Business Development (BD)": "business-development",
  "CS (Computer Society)": "cs",
  Multimedia: "multimedia",
  Operations: "operations",
  "PES (Power & Energy Society)": "pes",
  "RAS (Robotics & Automation Society)": "ras",
  "Talent & Tech (T&T)": "talent-and-tech",
  "WIE (Women in Engineering)": "wie",
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  teams: string[];
  managedTracks: string[];
};

export default function SessionsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const router = useRouter();
  const params = useParams();
  const teamName = (params?.team_name as string) ?? "ambassadors";
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    fetch(`/api/sessions/${teamName}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch sessions:", err))
      .finally(() => setLoadingSessions(false));
  }, [teamName, authLoading, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-brand-subtext">Loading...</p>
      </div>
    );
  }

  const userTeams = user?.teams ?? [];
  const hasAccess = userTeams.includes("Talent & Tech (T&T)");
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-brand-subtext">Access denied</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-brand-subtext text-sm uppercase tracking-widest mb-1">
              Team
            </p>
            <h1 className="text-white text-3xl font-semibold capitalize">
              {teamName}
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-accent hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            + Create Session
          </button>
        </div>

        {/* Sessions List */}
        {loadingSessions ? (
          <p className="text-brand-subtext text-center">Loading sessions...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() =>
                  router.push(`/sessions/${teamName}/${session.id}`)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateSessionModal
          teamName={teamName}
          managedTracks={user?.managedTracks ?? []}
          onClose={() => setShowModal(false)}
          onCreated={(newSession) => {
            setSessions([...sessions, newSession]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
