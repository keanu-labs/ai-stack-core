"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [status, setStatus] = useState("Loading entries...");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function run() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url) {
        setStatus("Missing NEXT_PUBLIC_SUPABASE_URL ❌");
        return;
      }

      if (!key) {
        setStatus("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY ❌");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("entries")
          .select("id, created_at, title, body, tags")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          setStatus(`Supabase error ❌: ${error.message}`);
          return;
        }

        setEntries(data || []);
        setStatus("");
      } catch (e) {
        setStatus(`Network error ❌: ${e.message}`);
      }
    }

    run();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900 }}>
      <h1>ai-stack-core</h1>

      {status && <p>{status}</p>}

      {entries.map((e) => (
        <article
          key={e.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginTop: 16
          }}
        >
          <h2 style={{ margin: 0 }}>{e.title}</h2>
          <p style={{ opacity: 0.7, marginTop: 6, marginBottom: 12 }}>
            {new Date(e.created_at).toLocaleString()}
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>{e.body}</p>
          {e.tags?.length ? (
            <p style={{ opacity: 0.8, marginTop: 12 }}>
              Tags: {e.tags.join(", ")}
            </p>
          ) : null}
        </article>
      ))}
    </main>
  );
}
