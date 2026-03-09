"use client";
import { useParams } from "next/navigation";
import QRCodeDisplay from "@/components/sessions/QRCodeDisplay";
import AttendanceTable from "@/components/sessions/AttendanceTable";
import { mockSessionDetails, mockAttendance } from "@/mock/sessions";

export default function SessionDetailsPage() {
  const params = useParams();
  const teamName = (params?.team_name as string) ?? "media";
  const session = mockSessionDetails;

  return (
    <div className="min-h-screen  p-8">
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
        <AttendanceTable members={mockAttendance} />
      </div>
    </div>
  );
}
