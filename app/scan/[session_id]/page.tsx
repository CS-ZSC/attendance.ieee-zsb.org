"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function ScanPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const sessionId = params?.session_id as string | undefined;
    const token = searchParams?.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [message, setMessage] = useState("Recording your attendance...");

    useEffect(() => {
        if (!sessionId || !token) {
            setStatus("error");
            setMessage("Invalid scanning link. Missing session ID or token.");
            return;
        }

        const recordAttendance = async () => {
            try {
                const res = await fetch(
                    `/api/attendance/scan/${sessionId}?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                const data = await res.json();
                if (res.ok && data.success) {
                    setStatus("success");
                    setMessage("Attendance recorded successfully!");
                } else if (res.status === 409) {
                    // Already attended
                    setStatus("success");
                    setMessage("You have already recorded your attendance for this session.");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Failed to record attendance.");
                }
            } catch (err) {
                console.error("Scan error:", err);
                setStatus("error");
                setMessage("An unexpected error occurred. Please try again.");
            }
        };

        recordAttendance();
    }, [sessionId, token]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="bg-brand-card border border-brand-dark rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-muted border-t-brand-accent rounded-full animate-spin"></div>
                        <p className="text-white text-lg font-medium">Please wait...</p>
                        <p className="text-brand-subtext text-sm">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-brand-success/20 text-brand-success rounded-full flex items-center justify-center mb-2">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="text-white text-2xl font-bold">Success!</h2>
                        <p className="text-brand-subtext mb-6">{message}</p>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-brand-primary hover:bg-brand-primary-hover w-full text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-2">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        <h2 className="text-white text-2xl font-bold">Scan Failed</h2>
                        <p className="text-brand-subtext mb-6">{message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-brand-dark hover:bg-brand-muted/20 w-full text-white py-3 border border-brand-muted/30 rounded-lg text-sm font-semibold transition-colors mb-3"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="text-brand-accent hover:text-brand-primary text-sm font-medium transition-colors"
                        >
                            Return Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
