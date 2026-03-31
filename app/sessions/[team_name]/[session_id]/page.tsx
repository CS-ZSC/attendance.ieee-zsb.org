"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import QRCodeDisplay from "@/components/sessions/QRCodeDisplay";
import AttendanceTable from "@/components/sessions/AttendanceTable";
import { SessionDetailsResponse } from "@/types/sessions";

export default function SessionDetailsPage() {
  const params = useParams();
  const teamName = (params?.team_name as string) ?? "media";
  const sessionId = (params?.session_id as string) ?? "";

  const [data, setData] = useState<SessionDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sessions/${teamName}/${sessionId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data:", data);
        setData(data);
      })

      .catch((err) => console.error("Failed to fetch session details:", err))
      .finally(() => setLoading(false));
  }, [teamName, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-brand-subtext">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-brand-subtext">Session not found</p>
      </div>
    );
  }

  const { session, users } = data;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-brand-subtext text-sm tracking-widest mb-1 uppercase">
            {teamName} / Session
          </p>
          <h1 className="text-white text-3xl font-semibold">{session.title}</h1>
          <p className="text-brand-subtext text-sm mt-1">
            {new Date(session.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* QR Code */}
        <QRCodeDisplay sessionId={session.id} qrToken={session.qr_token} />

        {/* Attendance Table */}
        <AttendanceTable
          sessionId={sessionId}
          members={users}
          canEdit={data.canEdit}
        />
      </div>
    </div>
  );
}
