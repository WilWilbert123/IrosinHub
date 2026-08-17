import { notFound } from "next/navigation"
import Link from "next/link"
import fs from "fs"
import path from "path"
import { ArrowLeft, MapPin, Phone, Globe, Facebook, CheckCircle2, Clock, MapIcon, Info } from "lucide-react"
import { getResortImage } from "@/lib/utils"
import { ImageCarousel } from "@/components/ImageCarousel"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function ResortDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: resort } = await supabase
    .from("resorts")
    .select("*, barangays(name, slug)")
    .eq("slug", slug)
    .single()

  if (!resort) {
    notFound()
  }

  let galleryImages: string[] = []
  try {
    const imagesFolder = path.join(process.cwd(), 'public', 'resorts', resort.slug)
    if (fs.existsSync(imagesFolder)) {
      const files = fs.readdirSync(imagesFolder)
      galleryImages = files
        .filter(file => file.match(/\.(jpg|jpeg|png|webp)$/i))
        .map(file => `/resorts/${resort.slug}/${file}`)
    }
  } catch (e) {
    console.error("Error reading images directory", e)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Hero Carousel Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] bg-zinc-900 overflow-hidden group">
        <ImageCarousel images={galleryImages} fallbackImage={getResortImage(resort) ?? undefined} />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        
        <div className="absolute top-6 left-6 z-10">
          <Link href="/resorts" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 container mx-auto flex flex-col justify-end pointer-events-none">
          <div className="flex gap-2 mb-4">
            <Badge className="bg-emerald-500/90 text-white backdrop-blur-md border-none px-3 py-1 shadow-lg shadow-black/20 text-sm">
              {resort.type || resort.water_type || "Resort"}
            </Badge>
            {resort.is_featured && <Badge variant="secondary" className="bg-amber-500/90 text-white backdrop-blur-md border-none px-3 py-1 shadow-lg shadow-black/20 text-sm">Featured</Badge>}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 text-white drop-shadow-xl leading-tight">
            {resort.name}
          </h1>
          <div className="flex items-center text-zinc-200 mt-2 font-medium">
            <MapPin className="mr-2 h-5 w-5 text-emerald-400" />
            <span className="text-lg drop-shadow-md">{resort.location_address || "Irosin, Sorsogon"}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Stats Bar */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Status</p>
                  <p className="font-semibold">Open Now</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Hours</p>
                  <p className="font-semibold">8:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Water Type</p>
                  <p className="font-semibold capitalize">{resort.water_type || "Spring"}</p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">About this place</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p>
                  {resort.description || "Escape to the tranquil beauty of Irosin, Sorsogon. Nestled amidst lush greenery and natural wonders, this destination offers the perfect retreat from the hustle and bustle of city life. Whether you're looking for a relaxing dip in natural spring waters or a quiet place to unwind with family and friends, you'll find everything you need here for a memorable stay."}
                </p>
                {!resort.description && (
                  <p className="mt-4">
                    Enjoy our well-maintained facilities and let the soothing sounds of nature wash your stress away. We pride ourselves on offering a clean, safe, and welcoming environment for guests of all ages.
                  </p>
                )}
              </div>
            </div>

            {/* Amenities Section */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">What this place offers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {resort.amenities && resort.amenities.length > 0 ? (
                  resort.amenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-foreground font-medium bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border/50">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-foreground font-medium bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border/50">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>Natural Spring Pools</span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground font-medium bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border/50">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>Picnic Cottages</span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground font-medium bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border/50">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>Restrooms & Showers</span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground font-medium bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border/50">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>Parking Area</span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground font-medium bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border/50">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>Sari-sari Store</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Location Map Section */}
            <div className="pt-8 border-t border-border/60">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Where you'll be</h2>
              <p className="text-muted-foreground mb-6 text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" /> {resort.location_address || "Irosin, Sorsogon"}
              </p>
              <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-800 shadow-xl bg-zinc-100 dark:bg-zinc-900">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(resort.name + ', ' + (resort.location_address || 'Irosin Sorsogon'))}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column (Booking Widget) */}
          <div className="hidden lg:block relative">
            <div className="sticky top-28 bg-white dark:bg-zinc-900 rounded-3xl border border-border/80 p-8 shadow-2xl shadow-emerald-900/5">
              
              {/* Fake Rating & Pricing Header */}
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-border/60">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Entrance starting at</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold">₱{resort.entrance_fee || "100"}</span>
                    <span className="text-muted-foreground">/ person</span>
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">4.8</span>
                  <span className="text-amber-500 text-lg leading-none">★</span>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="space-y-4 mb-8 bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-medium">Entrance Fee</span>
                  <span className="font-bold">
                    {resort.entrance_fee ? `₱${resort.entrance_fee}` : "Contact Us"}
                  </span>
                </div>
                {resort.overnight_fee && (
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">Overnight Fee</span>
                    <span className="font-bold">₱{resort.overnight_fee}</span>
                  </div>
                )}
                {resort.cottage_fee && (
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">Cottage Rental</span>
                    <span className="font-bold">₱{resort.cottage_fee}</span>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 flex items-center gap-4">
                  <div className="bg-white dark:bg-zinc-800 p-2.5 rounded-xl shadow-sm">
                    <Phone className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Call for Reservations</p>
                    <p className="font-bold text-foreground">{resort.phone || "+63 (912) 345-6789"}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 text-lg font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-0.5">
                Inquire Now
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-6 flex items-center justify-center font-medium">
                <Info className="h-3.5 w-3.5 mr-1.5" /> You won't be charged yet
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
