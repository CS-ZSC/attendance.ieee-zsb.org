"use client";

type Member = {
  id: string;
  name: string;
  email: string;
  attended: boolean;
};

type Props = {
  members: Member[];
};

export default function AttendanceTable({ members }: Props) {
  const attendedCount = members.filter((m) => m.attended).length;

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
              key={member.id}
              className={`border-b  border-brand-dark last:border-0 ${i % 2 === 0 ? "bg-[#0d1d2c]" : ""}`}
            >
              <td className="text-white text-sm px-6 py-4">{member.name}</td>
              <td className="text-brand-subtext text-sm px-6 py-4">
                {member.email}
              </td>
              <td className="text-center px-6 py-4">
                {member.attended ? (
                  <span className="text-green-400 text-lg">✅</span>
                ) : (
                  <span className="text-red-400 text-lg">❌</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
