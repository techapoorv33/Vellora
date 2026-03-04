"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TerritoryMap from "@/components/TerritoryMap";

type Profile = {
  id: string;
  username: string;
  territory_area: number;
  title: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      //checking if user is logged in
      // 1️⃣ Check session
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
        return; // ❗ STOP execution
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.session?.user.id)
        .single();
      if (!profile?.username) {
        router.replace("/onboarding");
      }

      // Fetching all users for the leaderboard
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, username, territory_area, title")
        .order("territory_area", { ascending: false });
      if (profiles) {
        setUsers(profiles as Profile[]);

        const userIndex = profiles.findIndex(
          (u) => u.id === data.session.user.id,
        );

        if (userIndex !== -1) {
          setCurrentUser(profiles[userIndex]);
          setRank(userIndex + 1);
        }
      }

      if (error) {
        console.error("Error fetching profiles:", error);
      } else {
        setUsers(profiles as Profile[]);
      }
      setLoading(false);
    };
    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#0B0F1A] text-white flex justify-center">
    <div className="w-full max-w-md px-6 py-10 space-y-8">

      {/* Header */}
      <h1 className="text-3xl font-bold tracking-[0.35em] text-center">
        VELORA
      </h1>
      <TerritoryMap />
      {/* Your Stats */}
      {currentUser && (
        <div className="bg-[#121826] p-6 rounded-2xl shadow-[0_0_40px_rgba(0,245,160,0.12)]">

          <p className="text-xs text-[#00F5A0] tracking-widest mb-4">
            YOUR STATS
          </p>

          <div className="space-y-2">
            <p className="text-lg font-semibold">
              {currentUser.username}
            </p>

            <p className="text-sm text-gray-300">
              Territory: {currentUser.territory_area.toFixed(2)} km²
            </p>

            <p className="text-sm text-gray-300">
              Rank: #{rank}
            </p>

            <p className="text-sm text-gray-300">
              Title: {currentUser.title}
            </p>
          </div>

        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-[#121826] p-6 rounded-2xl shadow-[0_0_40px_rgba(0,245,160,0.08)]">

        <p className="text-xs text-[#00F5A0] tracking-widest mb-6">
          LEADERBOARD
        </p>

        <div className="space-y-4">
          {users.map((user, index) => (

            <div
              key={user.id}
              className={`flex justify-between items-center p-4 rounded-xl ${
                index === 0
                  ? "bg-[#1A2236] border border-[#00F5A0] shadow-[0_0_20px_rgba(0,245,160,0.5)]"
                  : "bg-[#1A2236]"
              }`}
            >

              <div className="flex items-center gap-4">

                <span className="text-[#00F5A0] font-bold">
                  #{index + 1}
                </span>

                <div>
                  <p className="font-semibold">
                    {user.username}
                  </p>

                  <p className="text-xs text-gray-400">
                    {user.title}
                  </p>
                </div>

              </div>

              <p className="text-sm text-gray-300">
                {user.territory_area.toFixed(2)} km²
              </p>

            </div>

          ))}
        </div>

      </div>

    </div>
  </div>
);
}
