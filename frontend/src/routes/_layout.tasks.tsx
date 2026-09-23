import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { mockTasks, TaskStatus } from '@/data/mock-tasks'
import { Filter, UserCircle2 } from 'lucide-react'

export const Route = createFileRoute('/_layout/tasks')({
  component: TasksPage,
})

function TasksPage() {
  const tasks = mockTasks

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Created': return 'bg-slate-100 text-slate-800'
      case 'Assigned': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Verified': return 'bg-emerald-100 text-emerald-800'
      case 'Closed': return 'bg-zinc-100 text-zinc-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-slate-100 text-slate-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getSLAIndicator = (sla: string) => {
    switch (sla) {
      case 'on_track': return <span className="flex items-center text-green-600 text-xs"><div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div> On Track</span>
      case 'at_risk': return <span className="flex items-center text-orange-600 text-xs"><div className="h-2 w-2 rounded-full bg-orange-500 mr-1"></div> At Risk</span>
      case 'breached': return <span className="flex items-center text-red-600 text-xs"><div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div> Breached</span>
      default: return null
    }
  }

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operational Tasks</h1>
        <p className="text-muted-foreground">Task queue with AI-powered assignment and SLAs.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Task Queue</CardTitle>
            <CardDescription>Live operations</CardDescription>
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
                  <th className="p-3 text-left font-medium">Task ID</th>
                  <th className="p-3 text-left font-medium">Title / Complaint</th>
                  <th className="p-3 text-left font-medium">Assigned To</th>
                  <th className="p-3 text-left font-medium">Priority</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">SLA</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-3 font-medium">{task.id}</td>
                    <td className="p-3">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground">Ref: {task.complaintId || 'N/A'}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <UserCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        {task.assignedTo}
                      </div>
                      <div className="text-xs text-muted-foreground ml-6">Skill: {task.skill}</div>
                    </td>
                    <td className="p-3">
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusBadge(task.status)}>{task.status}</Badge>
                    </td>
                    <td className="p-3">{getSLAIndicator(task.slaStatus)}</td>
                    <td className="p-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Details</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{task.id} - {task.title}</DialogTitle>
                            <DialogDescription>
                              Created on {new Date(task.createdAt).toLocaleString()}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-4">
                              <div className="border rounded-md p-3 space-y-2">
                                <h4 className="font-semibold text-sm border-b pb-2 mb-2">Complaint Info</h4>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Ref:</span> {task.complaintId}
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Skill Required:</span> {task.skill}
                                </div>
                              </div>
                              
                              <div className="border rounded-md p-3 space-y-2">
                                <h4 className="font-semibold text-sm border-b pb-2 mb-2">Assignment Details</h4>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Staff:</span> {task.assignedTo}
                                </div>
                                <div className="text-sm flex items-center">
                                  <span className="text-muted-foreground mr-2">AI Match Score:</span> 
                                  <Badge variant="secondary">{task.assignmentScore}/100</Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="border rounded-md p-3 space-y-2">
                                <h4 className="font-semibold text-sm border-b pb-2 mb-2">Status & SLA</h4>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Current Status:</span> <Badge className={getStatusBadge(task.status)}>{task.status}</Badge>
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Due At:</span> {new Date(task.dueAt).toLocaleTimeString()}
                                </div>
                                <div className="mt-1">
                                  {getSLAIndicator(task.slaStatus)}
                                </div>
                              </div>

                              <div className="border rounded-md p-3 space-y-2">
                                <h4 className="font-semibold text-sm border-b pb-2 mb-2">Completion / Verification</h4>
                                {task.completionNotes ? (
                                  <div className="text-sm">
                                    <p className="italic">"{task.completionNotes}"</p>
                                    <div className="mt-2 h-20 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs border-dashed border-2">
                                      Photo Proof Placeholder
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-muted-foreground italic">Not completed yet.</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
