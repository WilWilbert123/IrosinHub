"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import DarkVeil from "./DarkVeil/DarkVail";

export default function HeroBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="absolute inset-0 bg-emerald-900/10 dark:bg-emerald-950/20" />;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          opacity: isDark ? 0.85 : 1,
          filter: isDark ? "none" : "invert(1) hue-rotate(180deg)",
          mixBlendMode: isDark ? "lighten" : "multiply"
        }}
      >
        <DarkVeil
          hueShift={190} // Shifts the default color to a pristine Crystal Teal/Cyan
          noiseIntensity={0.05}
          scanlineIntensity={0.1}
          speed={0.3}
          scanlineFrequency={2}
          warpAmount={0.6}
        />
      </div>
      {/* Soft gradient overlays to blend it perfectly into the page and ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-50 dark:to-zinc-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-50/10 dark:from-zinc-950/50 via-transparent to-zinc-50/10 dark:to-zinc-950/50" />
    </div>
  );
}
