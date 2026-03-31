"use client";
import { useState } from "react";
import { Session } from "@/types/sessions";

type Props = {
  teamName: string;
  managedTracks: string[];
  onClose: () => void;
  onCreated: (session: Session) => void;
};

export default function CreateSessionModal({
  teamName,
  managedTracks,
  onClose,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [track, setTrack] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);

    const res = await fetch(`/api/sessions/${teamName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: title.trim(), track }),
    });

    if (res.ok) {
      const data = await res.json();
      onCreated(data);
    } else {
      const errorData = await res.json().catch(() => ({}));
      console.error("Failed to create session:", res.status, errorData.error || errorData.message || "Unknown error");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0d2137] border border-brand-dark rounded-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-white text-xl font-semibold mb-6">
          Create Session
        </h2>

        <input
          type="text"
          placeholder="Session title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-brand-success border border-brand-dark rounded-lg px-4 py-3 text-brand-muted text-sm outline-none focus:border-brand-accent transition-colors w-full mb-4"
        />

        {managedTracks.length > 0 && (
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="bg-brand-success border border-brand-dark rounded-lg px-4 py-3 text-brand-muted text-sm outline-none focus:border-brand-accent transition-colors w-full mb-4"
          >
            <option value="">Select track</option>
            {managedTracks.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-brand-dark text-brand-muted hover:border-brand-accent hover:text-brand-accent rounded-lg py-2.5 text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? "..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
