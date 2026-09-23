import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, TrendingUp, AlertTriangle, Users, Target, Activity } from 'lucide-react'

export const Route = createFileRoute('/_layout/insights')({
  component: InsightsPage,
})

function InsightsPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights Dashboard</h1>
        <p className="text-muted-foreground flex items-center mt-1">
          <BrainCircuit className="h-4 w-4 mr-1 text-indigo-500" />
          <span className="font-medium text-indigo-600 mr-1">SIMULATED DATA:</span>
          AI-generated predictive insights based on mock operations and market data.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* OPERATIONS SECTION */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Operations & Staffing</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">SLA Breach Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12%</div>
                <div className="flex items-center text-xs mt-1 text-red-600">
                  <TrendingUp className="h-3 w-3 mr-1" /> +3% vs yesterday
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Plumbing tasks in South Wing are experiencing delays due to staff shortage.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Workload Imbalance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">Moderate</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Housekeeping is overutilized (85%), Maintenance is underutilized (40%).
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-indigo-50/50 border-indigo-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BrainCircuit className="h-4 w-4 mr-2 text-indigo-500" /> AI Staffing Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Based on historical trends, you will need <strong>2 additional housekeeping staff</strong> between 10:00 AM and 2:00 PM tomorrow due to a high volume of check-outs (15 rooms).
                </p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="secondary" className="bg-white">Confidence: 94%</Badge>
                  <Badge variant="secondary" className="bg-white">Actionable</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* GUEST EXPERIENCE SECTION */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Guest Experience</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sentiment Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">4.2 / 5</div>
                <div className="flex items-center text-xs mt-1 text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" /> Stable
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Emerging Complaint Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-base">AC Cooling Issues in North Wing</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      NLP analysis of the last 48 hours shows a 40% spike in complaints regarding "AC not cooling" specifically in the North Wing (Rooms 200-220).
                    </p>
                    <p className="text-sm font-medium text-indigo-700 mt-2">
                      Recommendation: Schedule preventative maintenance for North Wing HVAC system.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* REVENUE SECTION */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Revenue & Market</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Forecasted Occupancy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">88%</div>
                <div className="flex items-center text-xs mt-1 text-muted-foreground">
                  Next weekend (Diwali)
                </div>
                <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                  Pacing 12% ahead of same time last year. Market average is currently at 82%.
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-50/50 border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BrainCircuit className="h-4 w-4 mr-2 text-emerald-500" /> Pricing Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Competitor "Beach Paradise" has sold out their Family Suites. 
                </p>
                <div className="mt-3 p-3 bg-white border border-emerald-200 rounded-md shadow-sm">
                  <p className="text-sm font-medium text-emerald-800">
                    Increase Family Suite rate by 15% (₹1,200) for the upcoming weekend. Estimated revenue impact: +₹14,400.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
