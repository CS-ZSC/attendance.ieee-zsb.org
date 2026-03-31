"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setIsLogged(!!(data && data.user));
      })
      .catch(() => setIsLogged(false))
      .finally(() => setLoadingAuth(false));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-8 md:px-4 overflow-hidden">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-25 items-center animate-fade-in">
        {/* Left - Text */}
        <div className="flex flex-col gap-6 ">
          <div>
            <p className="text-brand-accent text-xs uppercase tracking-[0.3em] mb-3">
              IEEE Zagazig Student Branch
            </p>
            <h1 className="text-white text-4xl font-bold leading-tight">
              Attendance
              <br />
              <span className="text-brand-accent">System</span>
            </h1>
          </div>

          <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
            Track and manage session attendance for IEEE ZSB teams with ease.
          </p>

          {loadingAuth ? (
            <div className="px-8 py-3">
              <div className="w-5 h-5 border-2 border-brand-muted border-t-white rounded-full animate-spin"></div>
            </div>
          ) : isLogged ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-3 max-w-xs rounded-lg text-sm font-semibold tracking-wide transition-colors cursor-pointer flex justify-center"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-3 max-w-xs rounded-lg text-sm font-semibold tracking-wide transition-colors cursor-pointer flex justify-center"
            >
              Login
            </button>
          )}
        </div>

        {/* Right - Logo */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                transform: "scale(2)",
              }}
            />
            <Image
              src="/ieee-logo.png"
              alt="IEEE ZSB Logo"
              width={288}
              height={288}
              className="relative drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
