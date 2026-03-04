"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      }
      else{setLoading(false);}
      const {data: profile} = await supabase.from("profiles").select("username").eq("id", data.session?.user.id).single();
      if (!profile?.username) {
        router.push("/onboarding");
      }
    }
    checkSession()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-10">
      <h1 className="text-4xl font-bold tracking-widest mb-6">
        VELORA DASHBOARD
      </h1>

      <div className="bg-[#121826] p-6 rounded-xl max-w-xl">
        <p className="text-lg">Territory: 0.00 km²</p>
        <p className="text-lg">Rank: Unranked</p>
        <p className="text-lg">Title: Civilian</p>
      </div>
    </div>
  );
}