"use client";
import { useState } from "react";
import { Member } from "@/types/sessions";

type Props = {
  sessionId: string;
  members: Member[];
  canEdit?: boolean;
};

export default function AttendanceTable({ sessionId, members: initialMembers, canEdit }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [toggling, setToggling] = useState<string | null>(null);

  const attendedCount = members.filter((m) => m.attended).length;

  const handleToggle = async (userId: string, currentStatus: boolean) => {
    if (!canEdit || toggling) return;

    setToggling(userId);
    const newStatus = !currentStatus;

    try {
      const res = await fetch(`/api/attendance/${sessionId}/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attended: newStatus }),
      });

      if (res.ok) {
        setMembers(prev => prev.map(m => m.id === userId ? { ...m, attended: newStatus } : m));
      } else {
        console.error("Failed to toggle attendance");
      }
    } catch (err) {
      console.error("Error toggling attendance:", err);
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="bg-brand-card border border-brand-dark rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-brand-primary">
        <h2 className="text-white font-semibold">Attendance</h2>
        <span className="text-brand-subtext text-sm">
          {attendedCount}/{members.length} attended
        </span>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-brand-dark">
            <th className="text-left text-brand-subtext text-xs uppercase tracking-widest px-6 py-3">
              Name
            </th>
            <th className="text-left text-brand-subtext text-xs uppercase tracking-widest px-6 py-3">
              Email
            </th>
            <th className="text-center text-brand-subtext text-xs uppercase tracking-widest px-6 py-3">
              Attended
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, i) => (
            <tr
              key={member.email}
              className={`border-b border-brand-dark last:border-0 ${i % 2 === 0 ? "bg-[#0d1d2c]" : ""}`}
            >
              <td className="text-white text-sm px-6 py-4">{member.name}</td>
              <td className="text-brand-subtext text-sm px-6 py-4">
                {member.email}
              </td>
              <td className="text-center px-6 py-4">
                <button
                  onClick={() => handleToggle(member.id, member.attended)}
                  disabled={!canEdit || !!toggling}
                  className={`text-lg transition-all ${canEdit && toggling !== member.id
                      ? "cursor-pointer hover:scale-120"
                      : "opacity-50 cursor-not-allowed"
                    }`}
                >
                  {toggling === member.id ? (
                    <div className="w-5 h-5 border-2 border-brand-muted border-t-white rounded-full animate-spin"></div>
                  ) : member.attended ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-red-400">❌</span>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
