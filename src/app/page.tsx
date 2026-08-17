import fs from "fs"
import path from "path"
import Link from "next/link"
import { ArrowRight, Map, Droplets, MapPin } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getResortImage } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import HeroBackground from "@/components/HeroBackground"
import ShinyText from "@/components/ShinyText/ShinyText"

export default async function Home() {
  const supabase = await createClient()

  // Fetch featured resorts
  const { data: featuredResorts } = await supabase
    .from("resorts")
    .select("*, barangays(name, slug)")
    .eq("is_featured", true)
    .limit(3)

    .limit(3)

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
        <HeroBackground />

        <div className="container relative z-10 mx-auto px-6 max-w-5xl text-center mt-6 md:mt-0">
          <h1 className="mt-4 md:mt-8 text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Discover the <br className="hidden md:block" />
            <ShinyText 
              text="Natural Wonders" 
              color="#ffffff" 
              shineColor="#000000" 
              lightColor="#000000"
              lightShineColor="#ffffff"
              speed={7} 
            />
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Nestled at the foot of Mt. Bulusan, explore pristine thermal springs, eco-parks, and connect with our 28 vibrant barangays.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/resorts" className={cn(buttonVariants({ size: "lg" }), "rounded-full bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto h-14 px-8 text-lg")}>
              Explore Springs <Droplets className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/barangays" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full w-full sm:w-auto h-14 px-8 text-lg")}>
              Citizen Portal <Map className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Simple Analytics */}
          <div className="mt-16 sm:mt-24 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-foreground">28</span>
              <span className="text-xs md:text-sm font-semibold text-foreground mt-1 uppercase tracking-widest">Connected Barangays</span>
            </div>
            <div className="w-px h-12 bg-border/40 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-foreground">15+</span>
              <span className="text-xs md:text-sm font-semibold text-foreground mt-1 uppercase tracking-widest">Thermal Springs</span>
            </div>
            <div className="w-px h-12 bg-border/40 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-foreground">100%</span>
              <span className="text-xs md:text-sm font-semibold text-foreground mt-1 uppercase tracking-widest">Digital Services</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resorts */}
      <section className="py-24 md:py-32 container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Featured Destinations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Experience the best of Irosin. From the healing hot springs of San Benon to the refreshing cool waters of Monbon.
            </p>
          </div>
          <Link href="/resorts" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full shrink-0 group")}>
            View All Resorts <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredResorts?.map((resort) => {
            let thumbnail = getResortImage(resort);
            try {
              const imagesFolder = path.join(process.cwd(), 'public', 'resorts', resort.slug)
              if (fs.existsSync(imagesFolder)) {
                const files = fs.readdirSync(imagesFolder)
                const validFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|webp)$/i))
                if (validFiles.length > 0) {
                  thumbnail = `/resorts/${resort.slug}/${validFiles[0]}`;
                }
              }
            } catch (e) {
              // ignore
            }

            return (
              <Card key={resort.id} className="overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/20 hover:-translate-y-2 group pt-0 bg-white dark:bg-zinc-900/40 border-border/50 rounded-2xl">
                {/* Image & Overlay Section */}
                <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
                  <img
                    src={thumbnail}
                    alt={resort.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500" />
                  
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <Badge className="bg-emerald-500/90 hover:bg-emerald-600 backdrop-blur-sm text-white border-none shadow-sm shadow-black/20 font-semibold px-3 py-1">
                      {resort.type || resort.water_type || "Resort"}
                    </Badge>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 flex flex-col justify-end">
                    <h3 className="text-white text-2xl font-bold tracking-tight leading-tight drop-shadow-md mb-2 group-hover:text-emerald-300 transition-colors">
                      {resort.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-zinc-300 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-emerald-400" />
                      {resort.barangays?.name || resort.location_address || "Irosin, Sorsogon"}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <CardContent className="flex-1 pt-6 px-6">
                  <p className="text-muted-foreground mb-5 line-clamp-2 leading-relaxed text-sm">
                    {resort.description || "Discover the natural beauty and relaxing atmosphere of this destination in Irosin, Sorsogon. A perfect getaway to unwind and connect with nature."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {resort.amenities && resort.amenities.length > 0 ? (
                      resort.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                        <Badge variant="outline" key={idx} className="font-medium text-xs bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                          {amenity}
                        </Badge>
                      ))
                    ) : (
                      <>
                        <Badge variant="outline" className="font-medium text-xs bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">Nature Retreat</Badge>
                        <Badge variant="outline" className="font-medium text-xs bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">Family Friendly</Badge>
                      </>
                    )}
                    {resort.amenities && resort.amenities.length > 3 && (
                      <Badge variant="outline" className="font-medium text-xs bg-transparent border-none text-emerald-600 dark:text-emerald-400">
                        +{resort.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/50 p-6 bg-zinc-50 dark:bg-zinc-900/20 flex justify-between items-center mt-auto">
                  <div>
                    {resort.entrance_fee ? (
                      <p className="text-sm font-bold text-foreground">₱{resort.entrance_fee} <span className="font-normal text-muted-foreground">/ head</span></p>
                    ) : (
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Contact for pricing</span>
                    )}
                  </div>
                  <Link href={`/resorts/${resort.slug}`} className={cn(buttonVariants({ size: "sm" }), "rounded-full px-6")}>Explore</Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
