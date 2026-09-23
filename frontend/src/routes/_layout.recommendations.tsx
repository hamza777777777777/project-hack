import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Search, MapPin, Camera } from 'lucide-react'

export const Route = createFileRoute('/_layout/recommendations')({
  component: RecommendationsPage,
})

function RecommendationsPage() {
  return (
    <div className="p-6 space-y-6 bg-muted/20 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Guest Recommendations</h1>
        <p className="text-muted-foreground">Find the perfect room with AI-powered matching.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Trip</CardTitle>
              <CardDescription>Tell us what you're looking for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Natural Language Request</label>
                <Textarea 
                  placeholder="e.g. I'm visiting with my family for 3 days in December, budget ₹3,000-5,000 per night, we're vegetarian, kids would love a pool."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-muted"></div>
                <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">OR USE FILTERS</span>
                <div className="flex-grow border-t border-muted"></div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Check-in</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Check-out</label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Budget (Max ₹/night)</label>
                  <Input type="number" placeholder="5000" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Dietary Requirements</label>
                  <Input type="text" placeholder="e.g. Pure Veg, Jain" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" /> Find Matches
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-8 space-y-4">
          <h2 className="text-xl font-semibold">Recommended Properties</h2>
          
          <Card>
            <CardContent className="p-0 sm:flex">
              <div className="sm:w-1/3 bg-muted aspect-video sm:aspect-auto flex items-center justify-center">
                <Camera className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div className="sm:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">Goa Palm Retreat</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> South Goa
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">₹4,200</div>
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">AC Deluxe</Badge>
                    <Badge variant="outline">Pool</Badge>
                    <Badge variant="outline">WiFi</Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pure Veg</Badge>
                  </div>

                  <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md text-sm text-indigo-900">
                    <span className="font-semibold">Why recommended:</span> Matches your ₹5,000 max budget. Has all 2 requested amenities (Pool, WiFi) and features a certified Pure Veg kitchen.
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline">
                    <Camera className="mr-2 h-4 w-4" /> View 360° Room
                  </Button>
                  <Button>Book Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0 sm:flex">
              <div className="sm:w-1/3 bg-muted aspect-video sm:aspect-auto flex items-center justify-center">
                <Camera className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div className="sm:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">Munnar Valley Resort</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> Kerala
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">₹3,800</div>
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">Family Suite</Badge>
                    <Badge variant="outline">WiFi</Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Jain Options</Badge>
                  </div>

                  <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md text-sm text-indigo-900">
                    <span className="font-semibold">Why recommended:</span> Excellent price match. Lacks a pool, but offers Jain dietary options and spacious family accommodation.
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline">
                    <Camera className="mr-2 h-4 w-4" /> View 360° Room
                  </Button>
                  <Button>Book Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
