"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NewEntry() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("Saving...");
   const { data: userData } = await supabase.auth.getUser();
const user = userData?.user;

if (!user) {
  setMsg("You must be logged in ❌");
  return;
}

const { error } = await supabase.from("entries").insert([
  {
    title: title.trim(),
    body: body.trim(),
    tags: [],
    user_id: user.id
  }
]);

    if (error) setMsg(`Error ❌: ${error.message}`);
    else {
      setMsg("Saved ✅");
      window.location.href = "/";
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 700 }}>
      <h1>New Chronicle Entry</h1>

      <p style={{ opacity: 0.8 }}>
        Only logged-in users can create entries.
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
