"use client";
import { Session } from "@/types/sessions";

type Props = {
  session: Session;
  onClick: () => void;
};

export default function SessionCard({ session, onClick }: Props) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      onClick={onClick}
      className="bg-brand-card border border-brand-dark hover:border-brand-accent rounded-xl px-6 py-5 cursor-pointer transition-all group"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-base font-medium group-hover:text-brand-accent transition-colors">
            {session.title}
          </h2>
          <p className="text-brand-subtext text-sm mt-1">
            {formatDate(session.created_at)}
          </p>
        </div>
        <span className="text-brand-subtext group-hover:text-brand-accent transition-colors text-lg">
          →
        </span>
      </div>
    </div>
  );
}
