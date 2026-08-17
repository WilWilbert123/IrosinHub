"use client"

import * as React from "react"
import { Search, FileText, CheckCircle2, Clock, Printer } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const steps = ["Pending", "Processing", "Ready for Pickup", "Completed"]

export default function DocumentTrackerPage() {
  const [trackingCode, setTrackingCode] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [request, setRequest] = React.useState<any>(null)
  const [error, setError] = React.useState("")

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!trackingCode.trim()) return

    setIsSearching(true)
    setError("")
    setRequest(null)

    const supabase = createClient()
    const { data, error } = await supabase
      .from("document_requests")
      .select("*, barangays(name)")
      .eq("tracking_code", trackingCode.toUpperCase())
      .single()

    setIsSearching(false)

    if (error || !data) {
      setError("No request found with this tracking code. Please check and try again.")
    } else {
      setRequest(data)
    }
  }

  const getStepIndex = (status: string) => {
    return steps.indexOf(status)
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">
          Document Tracker
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Enter your 8-character tracking code to check the status of your barangay document request.
        </p>
      </div>

      <Card className="mb-12 border-border/50 shadow-sm max-w-2xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="e.g. A1B2C3D4"
                className="pl-10 h-12 text-lg uppercase font-mono tracking-wider"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700" disabled={isSearching}>
              {isSearching ? "Searching..." : "Track"}
            </Button>
          </form>
          {error && <p className="text-destructive text-sm mt-4 font-medium">{error}</p>}
        </CardContent>
      </Card>

      {request && (
        <Card className="border-emerald-500/20 shadow-md">
          <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-border/50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-1 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-emerald-600" />
                  {request.document_type}
                </CardTitle>
                <CardDescription className="text-base">
                  Requested by <strong className="text-foreground">{request.full_name}</strong> in Brgy. {request.barangays?.name}
                </CardDescription>
              </div>
              <Badge className="text-sm px-3 py-1 uppercase tracking-wider font-semibold" variant={request.status === 'Completed' ? 'default' : 'secondary'}>
                {request.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative">
              {/* Stepper Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border -z-10" />
              
              <div className="space-y-8">
                {steps.map((step, index) => {
                  const currentStepIndex = getStepIndex(request.status)
                  const isCompleted = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex

                  return (
                    <div key={step} className="flex items-start">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-background
                        ${isCompleted ? 'border-emerald-500 text-emerald-500' : 'border-muted-foreground/30 text-muted-foreground/30'}
                        ${isCurrent ? 'ring-4 ring-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/30' : ''}
                      `}>
                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                      </div>
                      <div className="ml-4 mt-1">
                        <h4 className={`text-lg font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step}
                        </h4>
                        {isCurrent && step === "Pending" && (
                          <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <Clock className="mr-1.5 h-3.5 w-3.5" /> Your request has been received and is waiting in queue.
                          </p>
                        )}
                        {isCurrent && step === "Processing" && (
                          <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <Clock className="mr-1.5 h-3.5 w-3.5" /> The barangay is currently verifying and preparing your document.
                          </p>
                        )}
                        {isCurrent && step === "Ready for Pickup" && (
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                            <Printer className="mr-1.5 h-3.5 w-3.5" /> Your document is printed and signed! You can now claim it at the Barangay Hall.
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-12 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 text-sm text-amber-800 dark:text-amber-200">
              <strong className="block mb-1">Important Note:</strong>
              Please bring a valid ID and any necessary payment/fees when claiming your document at the barangay hall.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
