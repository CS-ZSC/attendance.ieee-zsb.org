"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [nationalId, setNationalId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      nationalId,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or national ID");
    } else {
      const session = await getSession();
      const teams = session?.user?.teams ?? [];

      if (teams.includes("T&T")) {
        router.push("/sessions/talent-and-tech");
      } else if (teams.length > 0) {
        router.push(`/sessions/${teams[0].toLowerCase()}`);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-brand-card rounded-2xl p-10 m-10 w-full max-w-md shadow-2xl">
        <h2 className="text-white text-xl font-normal text-center mb-7 tracking-wide">
          login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-brand-success border border-brand-dark rounded-lg px-4 py-3 text-brand-muted text-sm outline-none focus:border-brand-accent transition-colors w-full"
          />

          <input
            type="password"
            placeholder="National ID"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            required
            className="bg-brand-success border border-brand-dark rounded-lg px-4 py-3 text-brand-muted text-sm outline-none focus:border-brand-accent transition-colors w-full"
          />

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-primary text-white rounded-lg py-3 text-sm font-semibold mt-1 tracking-wide hover:bg-brand-primary-hover transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? "..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
