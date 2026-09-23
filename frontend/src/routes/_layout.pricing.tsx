import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, TrendingUp, TrendingDown, Info } from 'lucide-react'

export const Route = createFileRoute('/_layout/pricing')({
  component: PricingPage,
})

function PricingPage() {
  return (
    <div className="p-6 space-y-6 bg-muted/20 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pricing Intelligence</h1>
        <p className="text-muted-foreground flex items-center mt-1">
          <Info className="h-4 w-4 mr-1 text-blue-500" />
          <span className="font-medium">SIMULATED DATA:</span> Rates and occupancy are seeded for demonstration purposes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>AC Deluxe Room</CardTitle>
            <CardDescription>Current vs Market</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end border-b pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Rate</p>
                <div className="text-3xl font-bold">₹3,500</div>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-800">12% below avg</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-3">Competitor Rates (Live)</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Goa Palm Retreat</span>
                  <span className="font-medium">₹4,200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Oceanview Lodge</span>
                  <span className="font-medium">₹3,800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Beach Paradise</span>
                  <span className="font-medium">₹5,200</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm font-semibold">
                <span>Competitor Average:</span>
                <span>₹4,400</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Current Occupancy:</span>
                <span>85% (High)</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Seasonality:</span>
                <span>Pre-Diwali Peak</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-emerald-50 text-emerald-900 rounded-md border border-emerald-100">
              <div className="flex items-center font-bold mb-2">
                <TrendingUp className="h-4 w-4 mr-2" /> AI Recommendation
              </div>
              <p className="text-sm mb-2">
                Consider increasing your rate to <strong>₹3,900 - ₹4,200</strong>.
              </p>
              <p className="text-xs opacity-90">
                <strong>Reasoning:</strong> You are priced 20% below the top competitor while maintaining high (85%) occupancy ahead of a high-demand festival weekend.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Apply Suggested Rate</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Standard Non-AC</CardTitle>
            <CardDescription>Current vs Market</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end border-b pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Rate</p>
                <div className="text-3xl font-bold">₹2,500</div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-800">Optimized</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-3">Competitor Rates (Live)</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Goa Palm Retreat</span>
                  <span className="font-medium">₹2,400</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Oceanview Lodge</span>
                  <span className="font-medium">₹2,600</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Beach Paradise</span>
                  <span className="font-medium">₹2,800</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm font-semibold">
                <span>Competitor Average:</span>
                <span>₹2,600</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Current Occupancy:</span>
                <span>65% (Normal)</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Seasonality:</span>
                <span>Pre-Diwali Peak</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-50 text-slate-800 rounded-md border border-slate-200">
              <div className="flex items-center font-bold mb-2">
                <LineChart className="h-4 w-4 mr-2" /> AI Recommendation
              </div>
              <p className="text-sm mb-2">
                <strong>Hold current rate.</strong>
              </p>
              <p className="text-xs opacity-90">
                <strong>Reasoning:</strong> You are perfectly aligned with the market average. Occupancy is stable.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Rate is Optimal</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Suite</CardTitle>
            <CardDescription>Current vs Market</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end border-b pb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Rate</p>
                <div className="text-3xl font-bold">₹8,500</div>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-800">15% above avg</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-3">Competitor Rates (Live)</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Goa Palm Retreat</span>
                  <span className="font-medium">₹7,200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Oceanview Lodge</span>
                  <span className="font-medium">₹6,800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Beach Paradise</span>
                  <span className="font-medium">₹8,000</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm font-semibold">
                <span>Competitor Average:</span>
                <span>₹7,333</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Current Occupancy:</span>
                <span>40% (Low)</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Seasonality:</span>
                <span>Pre-Diwali Peak</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-red-50 text-red-900 rounded-md border border-red-100">
              <div className="flex items-center font-bold mb-2">
                <TrendingDown className="h-4 w-4 mr-2" /> AI Recommendation
              </div>
              <p className="text-sm mb-2">
                Consider dropping your rate to <strong>₹7,500 - ₹7,800</strong>.
              </p>
              <p className="text-xs opacity-90">
                <strong>Reasoning:</strong> Low occupancy (40%) and pricing above the highest competitor is leading to abandoned bookings.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Apply Suggested Rate</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
