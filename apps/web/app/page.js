"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [status, setStatus] = useState("Loading...");
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data?.user ?? null);
    return data?.user ?? null;
  }

  async function loadEntries(currentUser) {
    if (!currentUser) {
      setEntries([]);
      setStatus("Login required. Go to /login");
      return;
    }

    setStatus("Loading entries...");
    const { data, error } = await supabase
      .from("entries")
      .select("id, created_at, title, body, tags, user_id")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      setStatus(`Supabase error ❌: ${error.message}`);
      return;
    }

    setEntries(data || []);
    setStatus("");
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setEntries([]);
    setStatus("Logged out.");
  }

  useEffect(() => {
    let alive = true;

    async function boot() {
      const u = await loadUser();
      if (!alive) return;
      await loadEntries(u);
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const u = await loadUser();
      if (!alive) return;
      await loadEntries(u);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900 }}>
      <h1>ai-stack-core</h1>

      <div style={{ marginBottom: 16, opacity: 0.85 }}>
        {user?.email ? (
          <>
            Logged in as: <b>{user.email}</b>{" "}
            <button onClick={logout} style={{ marginLeft: 12 }}>
              Log out
            </button>{" "}
            <a href="/new" style={{ marginLeft: 12 }}>
              New entry
            </a>
          </>
        ) : (
          <>
            Not logged in.{" "}
            <a href="/login" style={{ marginLeft: 8 }}>
              Go to login
            </a>
          </>
        )}
      </div>

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
