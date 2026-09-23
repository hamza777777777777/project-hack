import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockComplaints, Complaint, ComplaintStatus, Priority } from '@/data/mock-complaints'
import { BrainCircuit, Filter } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_layout/complaints')({
  component: ComplaintsPage,
})

function ComplaintsPage() {
  const [complaints] = useState<Complaint[]>(mockComplaints)

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'high': return 'bg-orange-100 text-orange-800 hover:bg-orange-100'
      case 'medium': return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'low': return 'bg-slate-100 text-slate-800 hover:bg-slate-100'
      default: return 'bg-slate-100 text-slate-800 hover:bg-slate-100'
    }
  }

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'in_progress': return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'resolved': return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'closed': return 'bg-slate-100 text-slate-800 hover:bg-slate-100'
      default: return 'bg-slate-100 text-slate-800 hover:bg-slate-100'
    }
  }

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Complaints Management</h1>
        <p className="text-muted-foreground">Submit, track, and manage guest complaints.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Complaint</CardTitle>
              <CardDescription>Enter details manually or via voice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Complaint Text</label>
                <Textarea placeholder="Describe the issue..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="hinglish">Hinglish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room (Optional)</label>
                  <Input placeholder="e.g. 204" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guest (Optional)</label>
                  <Input placeholder="Name" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Submit Complaint</Button>
            </CardFooter>
          </Card>

          <Card className="border-indigo-100 bg-indigo-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-indigo-900 text-base">
                <BrainCircuit className="w-4 h-4 mr-2" />
                AI Classification &mdash; Demo
              </CardTitle>
              <CardDescription>Live preview of LLM output for the last submission.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-muted-foreground text-xs font-medium">Category</div>
                  <div className="font-medium">Maintenance</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-medium">Subcategory</div>
                  <div className="font-medium">Plumbing</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-medium">Priority</div>
                  <div><Badge variant="outline" className={getPriorityColor('medium')}>Medium</Badge></div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-medium">Sentiment</div>
                  <div><Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Negative</Badge></div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-medium">Required Skill</div>
                  <div className="font-medium">Plumbing</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-medium">Confidence</div>
                  <div className="font-medium">95%</div>
                </div>
              </div>
              <div className="pt-2 border-t border-indigo-100">
                <div className="text-muted-foreground text-xs font-medium mb-1">Explanation</div>
                <p className="text-xs text-indigo-900/80">
                  User mentioned "pani tapak raha hai" which translates to water leaking. This falls under Maintenance &gt; Plumbing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Complaint List</CardTitle>
                <CardDescription>All recorded complaints</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">ID</th>
                      <th className="p-3 text-left font-medium">Guest/Room</th>
                      <th className="p-3 text-left font-medium">Complaint</th>
                      <th className="p-3 text-left font-medium">Category</th>
                      <th className="p-3 text-left font-medium">Priority</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Assigned</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-3 font-medium">{c.id}</td>
                        <td className="p-3">
                          <div className="font-medium">{c.guestName || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">Rm {c.roomNumber || 'N/A'}</div>
                        </td>
                        <td className="p-3 max-w-[200px]">
                          <div className="truncate" title={c.text}>{c.text}</div>
                          <div className="text-xs text-muted-foreground">{c.language}</div>
                        </td>
                        <td className="p-3">
                          <div>{c.category}</div>
                          <div className="text-xs text-muted-foreground">{c.subcategory}</div>
                        </td>
                        <td className="p-3">
                          <Badge className={getPriorityColor(c.priority)}>{c.priority}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(c.status)}>{c.status.replace('_', ' ')}</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{c.assignedTo || 'Unassigned'}</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
