"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function NewEntry() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setLoadingUser(false);
    }
    loadUser();
  }, []);

  async function submit() {
    if (!user) {
      setMsg("You must be logged in ❌");
      return;
    }

    if (!title.trim() || !body.trim()) {
      setMsg("Title and body are required ❌");
      return;
    }

    setMsg("Saving...");

    const payload = {
      title: title.trim(),
      body: body.trim(),
      tags: [],
      user_id: user.id
    };

    const { error } = await supabase.from("entries").insert([payload]);

    if (error) {
      setMsg(`Error ❌: ${error.message}`);
      return;
    }

    window.location.href = "/";
  }

  if (loadingUser) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <p>Checking session...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>New Chronicle Entry</h1>
        <p>You must be logged in to publish.</p>
        <a href="/login">Go to login</a>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 700 }}>
      <h1>New Chronicle Entry</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{ padding: 10, width: "100%", marginTop: 12 }}
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
        rows={8}
        style={{ padding: 10, width: "100%", marginTop: 12 }}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={submit} style={{ padding: "10px 14px" }}>
          Publish
        </button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
