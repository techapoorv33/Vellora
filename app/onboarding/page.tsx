"use client"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Onboarding() {

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(()=>{
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.push("/login");
            }else{
                setChecking(false);
            }
        }
        checkSession();
    },[router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(username.length < 3){
            setError("Username must be at least 3 characters long.");
            return;
        }
        setLoading(true);
        setError("");

        const {data} = await supabase.auth.getSession();

        if(!data.session) return;

        const { error } = await supabase.from("profiles").update({ username }).eq("id", data.session.user.id);
        setLoading(false);
        if(error){
            setError(error.message);
        }else{
            router.push("/dashboard");
        }
    
    }
    if (checking) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }



    return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#121826] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,245,160,0.15)]">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-[0.4em]">
            VELORA
          </h1>
          <p className="text-[#00F5A0] text-xs mt-2 tracking-widest">
            DEFINE YOUR IDENTITY
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            placeholder="Choose a username"
            required
            className="w-full p-3 rounded-xl bg-[#1E2536] outline-none focus:ring-2 focus:ring-[#00F5A0]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00F5A0] text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            {loading ? "Initializing..." : "ENTER VELORA"}
          </button>

        </form>

      </div>
    </div>
  );
}