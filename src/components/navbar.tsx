import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { MapPin } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-6 lg:px-8 flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
          <span className="font-bold sm:inline-block">IrosinHub</span>
        </Link>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium mr-4">
            <Link
              href="/resorts"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Resorts & Springs
            </Link>
            <Link
              href="/barangays"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              28 Barangays
            </Link>
            <Link
              href="/track"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Document Tracker
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
