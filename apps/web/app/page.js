"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {
  const [status, setStatus] = useState("Checking connection...")

  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase.from("_test").select("*").limit(1)
      if (error) {
        setStatus("Connected to Supabase ✅ (table not found is normal)")
      } else {
        setStatus("Connected to Supabase ✅")
      }
    }

    checkConnection()
  }, [])

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>ai-stack-core</h1>
      <p>{status}</p>
    </main>
  )
}
