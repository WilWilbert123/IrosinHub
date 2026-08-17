import Link from "next/link"
import { ArrowRight, Map, Droplets, Info } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getResortImage } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()

  // Fetch featured resorts
  const { data: featuredResorts } = await supabase
    .from("resorts")
    .select("*, barangays(name)")
    .eq("is_featured", true)
    .limit(3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 lg:py-40 bg-zinc-50 dark:bg-zinc-950 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-grid-zinc-900/[0.04] dark:bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="container relative z-10 mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-6 py-1 px-3 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            The Spring Capital of Sorsogon
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Discover the Natural Wonders of <span className="text-emerald-600 dark:text-emerald-500">Irosin</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Nestled at the foot of Mt. Bulusan, explore pristine hot and cold thermal springs, eco-parks, and connect with our 28 vibrant barangays.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/resorts" className={cn(buttonVariants({ size: "lg" }), "rounded-full bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto")}>
              Explore Springs <Droplets className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/barangays" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full w-full sm:w-auto")}>
              Citizen Portal <Map className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Analytics Bar */}
      <section className="py-12 bg-zinc-100 dark:bg-zinc-900/50 border-b border-border/40">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="pt-4 md:pt-0">
            <h3 className="text-4xl font-bold text-foreground mb-2">28</h3>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Connected Barangays</p>
          </div>
          <div className="pt-8 md:pt-0">
            <h3 className="text-4xl font-bold text-emerald-600 dark:text-emerald-500 mb-2">15+</h3>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Thermal Springs & Resorts</p>
          </div>
          <div className="pt-8 md:pt-0">
            <h3 className="text-4xl font-bold text-foreground mb-2">100%</h3>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Digital Citizen Services</p>
          </div>
        </div>
      </section>

      {/* Featured Resorts */}
      <section className="py-20 md:py-32 container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Destinations</h2>
            <p className="text-muted-foreground max-w-2xl">
              Experience the best of Irosin. From the healing hot springs of San Benon to the refreshing cool waters of Monbon.
            </p>
          </div>
          <Link href="/resorts" className={cn(buttonVariants({ variant: "ghost" }), "shrink-0 text-emerald-600 dark:text-emerald-400")}>
            View All Resorts <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredResorts?.map((resort) => (
            <Card key={resort.id} className="overflow-hidden border-border/50 hover:border-emerald-500/30 transition-colors">
              <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 relative">
                <img
                  src={getResortImage(resort)}
                  alt={resort.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium border-0 shadow-sm">
                    {resort.type || resort.water_type || "Resort"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{resort.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {resort.barangays?.name || resort.location_address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {resort.description}
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {resort.amenities?.slice(0, 3).map((amenity: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs font-normal">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t border-border/50 pt-4 bg-zinc-50 dark:bg-zinc-900/20">
                <div className="text-sm font-medium">
                  {resort.entrance_fee ? (
                    <>₱{resort.entrance_fee} <span className="text-muted-foreground font-normal">/ entrance</span></>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400">Contact for pricing</span>
                  )}
                </div>
                <Link href={`/resorts/${resort.slug}`} className={buttonVariants({ size: "sm" })}>Details</Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
