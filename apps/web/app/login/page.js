"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function sendMagicLink() {
    setMsg("Sending magic link...");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL
      }
    });

    if (error) setMsg(`Error: ${error.message}`);
    else setMsg("Check your email for login link ✅");
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Login</h1>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        style={{ padding: 10, width: 300 }}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={sendMagicLink} style={{ padding: "10px 14px" }}>
          Send login link
        </button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
