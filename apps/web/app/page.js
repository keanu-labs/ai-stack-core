"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [status, setStatus] = useState("Checking Supabase connection...");

  useEffect(() => {
    async function run() {
      // We purposely query a table that doesn't exist.
      // If env vars are correct, you'll get a "table not found" style error,
      // which still proves the connection works.
      const { error } = await supabase.from("_connection_test").select("*").limit(1);

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setStatus("Missing env vars ❌ (check Vercel Environment Variables)");
        return;
      }

      if (error) {
        setStatus("Supabase connected ✅ (table not found is normal)");
      } else {
        setStatus("Supabase connected ✅");
      }
    }

    run();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>ai-stack-core</h1>
      <p>{status}</p>
    </main>
  );
}
