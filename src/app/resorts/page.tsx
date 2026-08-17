import Link from "next/link"
import fs from "fs"
import path from "path"
import { MapPin, ArrowRight } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { getResortImage } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function ResortsPage({
  searchParams,
}: {
  searchParams: Promise<{ water_type?: string; barangay?: string }>
}) {
  const params = await searchParams
  const waterTypeFilter = params.water_type
  const barangayFilter = params.barangay

  const supabase = await createClient()

  let query = supabase.from("resorts").select("*, barangays(name, slug)")

  if (waterTypeFilter) {
    query = query.eq("water_type", waterTypeFilter)
  }
  
  const { data: resorts } = await query

  // Client-side, we would normally filter barangay if not doing complex join filters, 
  // but for simplicity we'll filter the fetched data if barangay is present.
  const filteredResorts = resorts?.filter(r => 
    !barangayFilter || r.barangays?.slug === barangayFilter
  )

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">
          Springs & Resorts
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Discover the natural hot and cold springs that make Irosin a premier eco-tourism destination.
        </p>
      </div>

      {/* Simple Filters via links */}
      <div className="flex gap-2 flex-wrap mb-8">
        <Link href="/resorts" className={cn(buttonVariants({ variant: !waterTypeFilter ? "default" : "outline" }), "rounded-full")}>All Springs</Link>
        <Link href="/resorts?water_type=Hot Spring" className={cn(buttonVariants({ variant: waterTypeFilter === "Hot Spring" ? "default" : "outline" }), "rounded-full")}>Hot Springs</Link>
        <Link href="/resorts?water_type=Cold Spring" className={cn(buttonVariants({ variant: waterTypeFilter === "Cold Spring" ? "default" : "outline" }), "rounded-full")}>Cold Springs</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResorts?.map((resort) => {
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
          <Card key={resort.id} className="overflow-hidden flex flex-col transition-all duration-500 hover:shadow-xl hover:shadow-emerald-900/20 hover:border-emerald-500/50 group pt-0 bg-zinc-50 dark:bg-zinc-900/40 border-border/50">
            {/* Image & Overlay Section */}
            <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
              <img
                src={thumbnail}
                alt={resort.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500" />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <Badge className="bg-emerald-500/90 hover:bg-emerald-600 backdrop-blur-sm text-white border-none shadow-sm shadow-black/20">
                  {resort.type || resort.water_type || "Resort"}
                </Badge>
                {resort.is_featured && (
                  <Badge variant="secondary" className="bg-amber-500/90 text-white border-none backdrop-blur-sm shadow-sm shadow-black/20">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Bottom Title inside Image */}
              <div className="absolute bottom-0 left-0 right-0 p-5 pt-12 flex flex-col justify-end">
                <h3 className="text-white text-2xl font-bold tracking-tight leading-tight drop-shadow-md mb-1.5 group-hover:text-emerald-300 transition-colors">
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
              <p className="text-muted-foreground mb-5 line-clamp-3 leading-relaxed text-sm">
                {resort.description || "Discover the natural beauty and relaxing atmosphere of this destination in Irosin, Sorsogon. A perfect getaway to unwind and connect with nature."}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {resort.amenities && resort.amenities.length > 0 ? (
                  resort.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                    <Badge variant="outline" key={idx} className="font-medium text-xs bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                      {amenity}
                    </Badge>
                  ))
                ) : (
                  <>
                    <Badge variant="outline" className="font-medium text-xs bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">Nature Retreat</Badge>
                    <Badge variant="outline" className="font-medium text-xs bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">Family Friendly</Badge>
                  </>
                )}
                {resort.amenities && resort.amenities.length > 3 && (
                  <Badge variant="outline" className="font-medium text-xs bg-transparent border-none text-emerald-600 dark:text-emerald-400">
                    +{resort.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/50 pt-6 bg-zinc-50 dark:bg-zinc-900/20 flex justify-between items-center">
              <div>
                {resort.entrance_fee ? (
                  <>
                    <p className="text-sm font-medium">Entrance: ₱{resort.entrance_fee}</p>
                    {resort.overnight_fee && <p className="text-sm text-muted-foreground">Night: ₱{resort.overnight_fee}</p>}
                  </>
                ) : (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Contact for pricing</p>
                )}
              </div>
              <Link href={`/resorts/${resort.slug}`} className={buttonVariants()}>
                Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        )})}
      </div>
      
      {(!filteredResorts || filteredResorts.length === 0) && (
        <div className="text-center py-24 text-muted-foreground">
          No resorts found matching your filters.
        </div>
      )}
    </div>
  )
}
