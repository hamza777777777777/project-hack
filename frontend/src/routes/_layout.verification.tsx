import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { mockTasks } from '@/data/mock-tasks'
import { CheckCircle2, XCircle, Clock, Camera } from 'lucide-react'

export const Route = createFileRoute('/_layout/verification')({
  component: VerificationPage,
})

function VerificationPage() {
  const pendingTasks = mockTasks.filter(t => t.status === 'Completed')

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verification Queue</h1>
        <p className="text-muted-foreground">Manager review for completed tasks.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pendingTasks.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-lg bg-muted/50 border-dashed">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground font-medium">All caught up! No tasks waiting for verification.</p>
          </div>
        ) : (
          pendingTasks.map((task) => (
            <Card key={task.id} className="border-indigo-100">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Verification Pending</Badge>
                  <span className="text-xs text-muted-foreground">{task.id}</span>
                </div>
                <CardTitle className="text-lg mt-2">{task.title}</CardTitle>
                <CardDescription>Assigned to: {task.assignedTo}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="bg-muted p-3 rounded-md space-y-2">
                  <div className="font-medium border-b pb-1">Completion Notes:</div>
                  <p className="italic text-muted-foreground">"{task.completionNotes || 'No notes provided.'}"</p>
                </div>
                
                <div className="border-2 border-dashed rounded-md h-32 flex flex-col items-center justify-center text-muted-foreground bg-slate-50">
                  <Camera className="h-6 w-6 mb-1 opacity-50" />
                  <span className="text-xs">Photo Evidence Attached</span>
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground pt-2">
                  <Clock className="h-3 w-3 mr-1" /> Completed 5 mins ago
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 border-t pt-4">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Verify
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700">
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Work: {task.id}</DialogTitle>
                      <DialogDescription>
                        Send this task back to {task.assignedTo} for rework.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reason for rejection</label>
                        <Textarea placeholder="Please specify what needs to be fixed..." />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive">Confirm Rejection</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
