"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import SessionCard from "@/components/sessions/SessionCard";
import CreateSessionModal from "@/components/sessions/CreateSessionModal";
import { mockSessions } from "@/mock/sessions";
import { useSession } from "next-auth/react";

const teamSlugs = {
  "T&T": "talent-and-tech",
  Media: "media",
} as const;

export default function SessionsPage() {
  const { data: session, status } = useSession();

  const [sessions, setSessions] = useState(mockSessions);
  const router = useRouter();
  const params = useParams();
  const teamName = (params?.team_name as string) ?? "media";
  const [showModal, setShowModal] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-brand-subtext">Loading...</p>
      </div>
    );
  }
  const userTeams = session?.user?.teams ?? [];

  const hasAccess = userTeams.some(
    (team) => teamSlugs[team as keyof typeof teamSlugs] === teamName,
  );

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-brand-subtext">Access denied</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-8">
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
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onClick={() => router.push(`/sessions/${teamName}/${session.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CreateSessionModal
          teamName={teamName}
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
