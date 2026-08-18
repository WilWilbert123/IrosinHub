"use client";

import { useTheme } from "next-themes";
import MoltenMetal from "./MoltenMetal";
import { useEffect, useState } from "react";

export default function MoltenBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="absolute inset-0 w-full h-full">
      <MoltenMetal
        color1={isDark ? "#06b6d4" : "#cffafe"} // Cyan 500 / Cyan 100
        color2={isDark ? "#083344" : "#ffffff"} // Cyan 950 / White
        color3={isDark ? "#14b8a6" : "#06b6d4"} // Teal 500 / Cyan 500
        speed={0.35}
        scale={4}
        detail={3}
        glow={1.6}
        coreSize={0.1}
        swirl={1}
        fold={-0.2}
        blackPoint={0.05}
        brightness={1.3}
        colorMode="molten"
        grain
        grainIntensity={0.05}
        mouseInteraction
        mouseStrength={0.3}
        opacity={1}
      />
    </div>
  );
}
