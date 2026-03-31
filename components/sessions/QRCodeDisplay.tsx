"use client";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  sessionId: string;
  qrToken: string;
};

export default function QRCodeDisplay({ sessionId, qrToken }: Props) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://attendance-iee-zsb.netlify.app";
  const qrValue = `${origin}/scan/${sessionId}?token=${qrToken}`;
  return (
    <div className="bg-brand-card border border-brand-dark rounded-2xl p-8 mb-6 flex flex-col items-center">
      <p className="text-brand-subtext text-sm uppercase tracking-widest mb-6">
        Scan to Attend
      </p>
      <div className="bg-white p-4 rounded-xl">
        <QRCodeCanvas value={qrValue} size={200} />
      </div>
      {/* <p className="text-brand-subtext text-xs mt-4 font-mono">{qrValue}</p> */}
    </div>
  );
}
