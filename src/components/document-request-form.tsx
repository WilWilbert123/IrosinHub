"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  documentType: z.string().min(1, {
    message: "Document type is required.",
  }),
  purpose: z.string().min(1, {
    message: "Purpose is required.",
  }),
  contactNumber: z.string().min(11, {
    message: "Please enter a valid 11-digit mobile number.",
  }),
})

export function DocumentRequestForm({ barangayId }: { barangayId: string }) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [trackingCode, setTrackingCode] = React.useState<string | null>(null)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      documentType: "",
      purpose: "",
      contactNumber: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const supabase = createClient()
    
    // Generate a simple 8-char tracking code
    const generatedCode = Math.random().toString(36).substring(2, 10).toUpperCase()

    const { error } = await supabase
      .from('document_requests')
      .insert({
        barangay_id: barangayId,
        tracking_code: generatedCode,
        full_name: values.fullName,
        document_type: values.documentType,
        purpose: values.purpose,
        contact_number: values.contactNumber,
        status: 'Pending'
      })

    setIsSubmitting(false)

    if (error) {
      console.error(error)
      alert("There was an error submitting your request. Please try again.")
    } else {
      setTrackingCode(generatedCode)
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
            Request Document Online
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Barangay Document</DialogTitle>
          <DialogDescription>
            Fill out the form below to request a clearance, certificate, or other document.
          </DialogDescription>
        </DialogHeader>
        
        {trackingCode ? (
          <div className="py-6 text-center space-y-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-lg">
              <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium mb-1">Your Tracking Code</p>
              <p className="text-3xl font-mono font-bold text-emerald-900 dark:text-emerald-100 tracking-wider">{trackingCode}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Please save this code to track your document status in the Document Tracker.
            </p>
            <Button onClick={() => { setOpen(false); setTrackingCode(null) }} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Dela Cruz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Barangay Clearance, Indigency" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Employment, Scholarship" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="09171234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
