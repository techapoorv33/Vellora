"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#121826] p-8 rounded-2xl shadow-lg space-y-6">
          {/* Branding */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-[0.4em]">VELORA</h1>
            <p className="text-[#00F5A0] text-xs mt-2 tracking-widest">
              ACCESS CONTROL
            </p>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:opacity-90 transition"
          >
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-xs text-gray-400 tracking-widest">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Email Login */}
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 rounded-xl bg-[#1E2536] outline-none focus:ring-2 focus:ring-[#00F5A0]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-3 rounded-xl bg-[#1E2536] outline-none focus:ring-2 focus:ring-[#00F5A0]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00F5A0] text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-[#00F5A0] hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
