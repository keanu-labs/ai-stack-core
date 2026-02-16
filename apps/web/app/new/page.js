"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NewEntry() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("Saving...");

    const payload = {
      title: title.trim(),
      body: body.trim(),
      tags: []
      // user_id omitted on purpose for temporary anon dev inserts
    };

    const { error } = await supabase.from("entries").insert([payload]);

    if (error) setMsg(`Error ❌: ${error.message}`);
    else {
      setMsg("Saved ✅");
      window.location.href = "/";
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 700 }}>
      <h1>New Chronicle Entry</h1>

      <p style={{ opacity: 0.75 }}>
        TEMP DEV MODE: anon inserts enabled (we will remove later).
      </p>

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
