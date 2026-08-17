import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Phone, Droplets, ArrowRight } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { DocumentRequestForm } from "@/components/document-request-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { getResortImage } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function BarangayHubPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: barangay } = await supabase
    .from("barangays")
    .select("*, resorts(*)")
    .eq("slug", slug)
    .single()

  if (!barangay) {
    notFound()
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <Link href="/barangays" className={cn(buttonVariants({ variant: "ghost" }), "mb-8 -ml-4 text-muted-foreground")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Barangays
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
              Brgy. {barangay.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-emerald-600" />
                <span className="text-lg">Irosin, Sorsogon</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-emerald-600" />
                <span className="text-lg">{barangay.population?.toLocaleString() || "N/A"} Residents</span>
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">About the Barangay</h3>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {barangay.description || `Barangay ${barangay.name} is one of the 28 vibrant communities in the municipality of Irosin. Known for its warm people and natural beauty, it plays a vital role in the eco-tourism and agricultural landscape of Sorsogon.`}
            </p>
          </div>

          {barangay.resorts && barangay.resorts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-6 flex items-center">
                <Droplets className="mr-2 h-6 w-6 text-emerald-500" /> Local Resorts & Springs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {barangay.resorts.map((resort: any) => (
                  <Card key={resort.id} className="border-border/50 overflow-hidden flex flex-col">
                    <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 relative">
                        <img
                          src={getResortImage(resort)}
                          alt={resort.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{resort.name}</CardTitle>
                      <CardDescription>{resort.type || resort.water_type || "Resort"}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Link href={`/resorts/${resort.slug}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}>View Details</Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-24 space-y-6">
            <Card className="border-emerald-500/20 shadow-sm bg-emerald-50/50 dark:bg-emerald-950/10">
              <CardHeader>
                <CardTitle className="text-xl">Citizen Services</CardTitle>
                <CardDescription>
                  Request documents like Barangay Clearance or Indigency certificates online.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentRequestForm barangayId={barangay.id} />
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/track" className={cn(buttonVariants({ variant: "link" }), "px-0 text-muted-foreground")}>Track existing request <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </CardFooter>
            </Card>

            <Card className="border-border/50 shadow-sm bg-zinc-50 dark:bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-lg">Barangay Officials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Punong Barangay (Captain)</p>
                  <p className="font-medium text-lg">{barangay.captain_name}</p>
                </div>
                {barangay.contact_number && (
                  <div className="flex items-start pt-4 border-t border-border/50">
                    <Phone className="mr-3 h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Barangay Hall Contact</p>
                      <p className="text-muted-foreground">{barangay.contact_number}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
