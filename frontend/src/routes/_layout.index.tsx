import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckSquare, Clock, AlertTriangle, BrainCircuit, LineChart } from 'lucide-react'
import { api } from '@/lib/api'
import { useState } from 'react'

export const Route = createFileRoute('/_layout/')({
  component: DashboardPage,
})

function DashboardPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await api.downloadOperationsReport();
    } catch (e: any) {
      alert(`Download failed: ${e.message}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-muted/20 min-h-screen">
      <div className="flex flex-col space-y-2 mb-4 p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-md">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
          <strong>STATIC DEMO DATA</strong>
        </div>
        <p className="text-sm">
          This dashboard shows static snapshot data for layout purposes. For live operational intelligence, please visit the <a href="/resort-360" className="underline font-bold text-amber-700">Manager Resort 360</a> page.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownload} disabled={downloading}>
            {downloading ? "Downloading..." : "Download Report"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">-2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Assign</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2m</div>
            <p className="text-xs text-muted-foreground">+0.2m from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Complete</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34m</div>
            <p className="text-xs text-muted-foreground">-5m from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Live Task Table</CardTitle>
            <CardDescription>Real-time view of current operational tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Task ID</th>
                      <th className="p-3 text-left font-medium">Issue</th>
                      <th className="p-3 text-left font-medium">Room</th>
                      <th className="p-3 text-left font-medium">Assigned To</th>
                      <th className="p-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">TSK-1021</td>
                      <td className="p-3">AC Not Cooling</td>
                      <td className="p-3">204</td>
                      <td className="p-3">Rahul Sharma</td>
                      <td className="p-3"><Badge variant="outline" className="bg-yellow-100 text-yellow-800">In Progress</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">TSK-1022</td>
                      <td className="p-3">Plumbing Leak</td>
                      <td className="p-3">112</td>
                      <td className="p-3">Arjun Patil</td>
                      <td className="p-3"><Badge variant="outline" className="bg-blue-100 text-blue-800">Assigned</Badge></td>
                    </tr>
                    <tr>
                      <td className="p-3">TSK-1023</td>
                      <td className="p-3">Extra Towels</td>
                      <td className="p-3">305</td>
                      <td className="p-3">Priya Nair</td>
                      <td className="p-3"><Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <div className="flex-1">
                <CardTitle>AI Assignment Insight</CardTitle>
                <CardDescription>Explainability view for recent assignment.</CardDescription>
              </div>
              <BrainCircuit className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-muted-foreground">Assigned to:</span>
                  <span className="font-bold">Rahul Sharma</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-muted-foreground">Match Score:</span>
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">92/100</Badge>
                </div>
                <div className="pt-2 border-t space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Skill Match</span>
                    <span>35/35</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Availability</span>
                    <span>20/20</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Workload</span>
                    <span>18/25</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Priority</span>
                    <span>15/15</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Recency</span>
                    <span>4/5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <div className="flex-1">
                <CardTitle>Pricing Intelligence</CardTitle>
                <CardDescription>Live competitor analysis</CardDescription>
              </div>
              <LineChart className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Munnar Valley Resort:</span>
                  <span className="font-medium">₹4,200/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Average:</span>
                  <span className="font-medium">₹4,800/night</span>
                </div>
                <div className="mt-2 p-3 bg-emerald-50 text-emerald-900 rounded-md border border-emerald-100">
                  <span className="font-medium block mb-1">AI Suggestion:</span>
                  Consider raising Deluxe AC rates by ₹400 for the upcoming weekend. Competitor availability is low.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Staffing Snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-muted-foreground">Available</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-orange-500">5</div>
                  <div className="text-muted-foreground">Busy</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-slate-400">2</div>
                  <div className="text-muted-foreground">On Leave</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
