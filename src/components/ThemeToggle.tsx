"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false); // 👈 prevent SSR mismatch

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 👈 prevent SSR rendering until hydrated

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </Button>
  );
}
