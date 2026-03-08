"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const TerritoryMap = dynamic(() => import("@/components/TerritoryMap"), {
  ssr: false,
});

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
  const [isRunning, setIsRunning] = useState(false);

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
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-[0.25em]">VELORA</h1>

        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-gray-400 hover:text-white hover:border-red-700 hover:rounded-2xl"
        >
          Logout
        </button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[85vh]">
        {/* Map */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-[#1A2236]">
          <TerritoryMap isRunning={isRunning} />
          <div className="flex gap-4 items-center justify-center mt-4">
            {!isRunning ? (
              <button
                onClick={() => setIsRunning(true)}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#00F5A0] text-black px-8 py-3 rounded-full font-bold shadow-lg"
              >
                Start
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-8 py-3 rounded-full font-bold shadow-lg"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="flex flex-col gap-6">
          {/* Your Stats */}
          {currentUser && (
            <div className="bg-[#121826] p-5 rounded-xl shadow-md">
              <p className="text-xs text-[#00F5A0] tracking-widest mb-4">
                YOUR STATS
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Username</p>
                  <p className="font-semibold">{currentUser.username}</p>
                </div>

                <div>
                  <p className="text-gray-400">Rank</p>
                  <p className="font-semibold">#{rank}</p>
                </div>

                <div>
                  <p className="text-gray-400">Territory</p>
                  <p className="font-semibold">
                    {currentUser.territory_area.toFixed(2)} km²
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Title</p>
                  <p className="font-semibold">{currentUser.title}</p>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="bg-[#121826] p-5 rounded-xl flex-1 overflow-y-auto">
            <p className="text-xs text-[#00F5A0] tracking-widest mb-4">
              LEADERBOARD
            </p>

            <div className="space-y-3">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    index === 0
                      ? "bg-[#1A2236] border border-[#00F5A0]"
                      : "bg-[#1A2236]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#00F5A0] font-bold">
                      #{index + 1}
                    </span>

                    <div>
                      <p className="text-sm font-semibold">{user.username}</p>

                      <p className="text-xs text-gray-400">{user.title}</p>
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
    </div>
  );
}
