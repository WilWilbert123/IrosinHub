import Link from "next/link"
import { ArrowRight, Users, MapPin } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default async function BarangaysPage() {
  const supabase = await createClient()

  const { data: barangays } = await supabase
    .from("barangays")
    .select("*, resorts(count)")
    .order("name")

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">
          28 Barangays of Irosin
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Connect with local offices, request civil documents online, and discover the community features of each barangay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barangays?.map((brgy) => (
          <Card key={brgy.id} className="hover:shadow-md transition-shadow border-border/50">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">Brgy. {brgy.name}</CardTitle>
                <Badge variant={brgy.resorts[0]?.count > 0 ? "default" : "outline"} className={brgy.resorts[0]?.count > 0 ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                  {brgy.resorts[0]?.count} {brgy.resorts[0]?.count === 1 ? 'Resort' : 'Resorts'}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Irosin, Sorsogon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Users className="h-4 w-4 mr-2" />
                <span>Population: <strong className="text-foreground">{brgy.population?.toLocaleString() || "N/A"}</strong></span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Captain:</span> {brgy.captain_name}
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-border/30 bg-zinc-50 dark:bg-zinc-900/10">
              <Link href={`/barangays/${brgy.slug}`} className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-between text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50")}>
                Visit Barangay Hub <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
