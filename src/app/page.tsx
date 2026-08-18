import fs from "fs"
import path from "path"
import Link from "next/link"
import { ArrowRight, Map, Droplets, MapPin, Smartphone, FileText, Users, Leaf, Mountain, Sun } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getResortImage, LOCAL_IMAGES } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import HeroBackground from "@/components/HeroBackground"
import ShinyText from "@/components/ShinyText/ShinyText"
import MoltenBackground from "@/components/MoltenMetal/MoltenBackground"

export default async function Home() {
  const supabase = await createClient()

  // Fetch featured resorts
  const { data: featuredResorts } = await supabase
    .from("resorts")
    .select("*, barangays(name, slug)")
    .eq("is_featured", true)
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
            
            // Only try to find a dynamic folder image if this resort is NOT explicitly mapped
            if (!resort.slug || !LOCAL_IMAGES[resort.slug as keyof typeof LOCAL_IMAGES]) {
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

      {/* Seamless Digital Services */}
      <section className="py-24 md:py-32 bg-white dark:bg-zinc-950 relative overflow-hidden border-y border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/5 via-zinc-950/0 to-zinc-950/0 dark:from-emerald-900/10" />
        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground leading-tight">
                Your Municipality, <br />
                <span className="text-emerald-600 dark:text-emerald-400">Completely Digital.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                IrosinHub brings local government services directly to your fingertips. Request documents, apply for permits, and connect with your barangay without ever leaving your home.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: FileText, title: "Online Document Requests", desc: "Get barangay clearances and certificates instantly." },
                  { icon: Smartphone, title: "Mobile-First Access", desc: "Designed to work perfectly on any device." },
                  { icon: Users, title: "Community Forums", desc: "Engage with neighbors and local officials directly." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link href="/services" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 shadow-lg shadow-emerald-900/20")}>
                  Explore Services
                </Link>
              </div>
            </div>
            
            {/* Visual Glass Mockup */}
            <div className="order-1 lg:order-2 relative h-[500px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-zinc-900 dark:to-zinc-900/50 border border-emerald-100 dark:border-zinc-800 shadow-2xl flex items-center justify-center p-8">
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              <div className="w-full max-w-sm space-y-4 relative z-10">
                <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-xl transform transition-transform hover:-translate-y-2">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-2 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Approved</Badge>
                  </div>
                  <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-2"></div>
                  <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                </div>
                
                <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-white/10 shadow-xl transform transition-transform hover:-translate-y-2 translate-x-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-800 border-2 border-white dark:border-zinc-900"></div>
                      <div className="w-8 h-8 rounded-full bg-teal-200 dark:bg-teal-800 border-2 border-white dark:border-zinc-900"></div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Just now</span>
                  </div>
                  <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full mb-2"></div>
                  <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 28 Barangays Section */}
      <section className="py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/20">
        <div className="container mx-auto px-6 max-w-7xl text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            28 Vibrant Barangays
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            One strong community. Every barangay in Irosin has its own unique heritage, from agricultural heartlands to bustling town centers.
          </p>
        </div>
        
        {/* Masonry Grid Mockup */}
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "San Benon", height: "h-64 md:h-80", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop" },
              { name: "Monbon", height: "h-48 md:h-64", image: "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?q=80&w=1000&auto=format&fit=crop" },
              { name: "Buhang", height: "h-56 md:h-72", image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=1000&auto=format&fit=crop" },
              { name: "Patag", height: "h-72 md:h-96", image: "https://images.unsplash.com/photo-1505705694340-019e1e335916?q=80&w=1000&auto=format&fit=crop" },
            ].map((brgy, i) => (
              <div key={i} className={`relative rounded-3xl overflow-hidden group ${brgy.height} ${i % 2 === 0 ? 'mt-0 md:mt-8' : ''}`}>
                <div className="absolute inset-0 bg-zinc-300 dark:bg-zinc-800">
                  <img src={brgy.image} alt={brgy.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/60 mix-blend-multiply group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl md:text-2xl font-bold">{brgy.name}</h3>
                  <div className="w-8 h-1 bg-emerald-500 mt-2 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/barangays" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "text-emerald-600 dark:text-emerald-400 font-semibold")}>
              Explore all 28 Barangays <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Beyond the Hot Springs (Immersive Nature Section) */}
      <section className="relative py-32 md:py-48 overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518182170546-076616fd46bc?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-emerald-950/80 to-zinc-950"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-6 max-w-4xl">
          <Leaf className="h-12 w-12 text-emerald-400 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white leading-tight">
            Beyond the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Hot Springs.</span>
          </h2>
          <p className="text-xl md:text-2xl text-zinc-300 mb-12 leading-relaxed">
            Irosin is the only municipality in Sorsogon completely landlocked and nestled in a caldera. Discover lush eco-parks, cold springs, and the majestic slopes of Mount Bulusan.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { icon: Droplets, title: "Thermal Springs", desc: "Geothermally heated waters renowned for their healing properties." },
              { icon: Mountain, title: "Mt. Bulusan", desc: "Lush hiking trails, hidden waterfalls, and volcanic lakes." },
              { icon: Sun, title: "Eco-Parks", desc: "Pristine nature reserves perfect for family picnics and retreats." }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-colors">
                <item.icon className="h-8 w-8 text-emerald-300 mb-4" />
                <h4 className="text-white font-bold text-xl mb-2">{item.title}</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="min-h-[100svh] relative flex flex-col items-center justify-center overflow-hidden border-t border-border/40 z-0">
        <MoltenBackground />
        <div className="container relative z-10 mx-auto px-6 py-24 max-w-4xl text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-foreground">
            Ready to <br className="hidden md:block" /> Experience Irosin?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you are planning a weekend getaway or a local resident needing barangay services, IrosinHub is your starting point.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-10 py-6 text-lg w-full sm:w-auto shadow-xl shadow-emerald-900/20")}>
              Create an Account
            </Link>
            <Link href="/resorts" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-10 py-6 text-lg w-full sm:w-auto bg-background/80 backdrop-blur-sm")}>
              View All Resorts
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
