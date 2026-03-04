"use client";

import { useRouter } from "next/navigation";

// export const metadata = {
//   title: "Velora",
//   description: "Own the ground beneath you.",
//   viewport: "width=device-width, initial-scale=1, maximum-scale=1",
// };


export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex justify-center">
      <div className="w-full max-w-md min-h-screen px-6 py-10 flex flex-col justify-between">

        {/* Top Branding */}
        <div>
          <h1 className="text-4xl font-bold tracking-[0.4em]">
            VELORA
          </h1>
          <p className="text-[#00F5A0] mt-3 tracking-widest text-sm">
            Own the ground beneath you.
          </p>
        </div>

        {/* Hero Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold leading-snug">
            Run.
            <br />
            Claim.
            <br />
            Conquer.
          </h2>

          <p className="mt-6 text-gray-400 text-sm leading-relaxed">
            Velora transforms every run into territory.
            Compete with others. Expand your zone.
            Become the ruler of your campus.
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-4 mt-16">

          <button
            onClick={() => router.replace("/dashboard")}
            className="w-full bg-[#00F5A0] text-black font-bold py-4 rounded-xl tracking-widest hover:opacity-90 transition"
          >
            BEGIN RUN
          </button>

          <button
            onClick={() => router.push("/login")}
            className="w-full border border-[#00F5A0] text-[#00F5A0] py-4 rounded-xl tracking-widest hover:bg-[#00F5A0] hover:text-black transition"
          >
            ACCESS ACCOUNT
          </button>

        </div>

        {/* Footer */}
        <div className="mt-16 text-xs text-gray-500 text-center">
          9Labs Athletic Tech • Beta
        </div>

      </div>
    </div>
  );
}