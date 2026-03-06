"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
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
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00101A]">
      <div className="bg-[#002235CC] rounded-2xl p-10 m-10 w-full max-w-md shadow-2xl">
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
            className="bg-[#0286C833] border border-[#005481] rounded-lg px-4 py-3 text-[#a0b8cc] text-sm outline-none focus:border-[#4a9edd] transition-colors w-full"
          />

          <input
            type="password"
            placeholder="National ID"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            required
            className="bg-[#0286C833] border border-[#005481] rounded-lg px-4 py-3 text-[#a0b8cc] text-sm outline-none focus:border-[#4a9edd] transition-colors w-full"
          />

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#006699] text-white rounded-lg py-3 text-sm font-semibold mt-1 tracking-wide hover:bg-[#1a5fa0] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? "..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
