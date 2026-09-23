import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { mockStaff } from '@/data/mock-staff'
import { User, Wrench, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/_layout/staff')({
  component: StaffPage,
})

function StaffPage() {
  const staff = mockStaff

  const getAvailabilityColor = (avail: string) => {
    switch (avail) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-orange-100 text-orange-800'
      case 'on_leave': return 'bg-slate-100 text-slate-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground">Monitor availability, workload, and skills for AI assignments.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((s) => (
          <Card key={s.id}>
            <CardHeader className="pb-3 flex flex-row items-start justify-between">
              <div className="flex gap-3">
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">{s.name}</CardTitle>
                  <CardDescription>{s.role}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={getAvailabilityColor(s.availability)}>
                {s.availability.replace('_', ' ')}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center"><Wrench className="h-3 w-3 mr-1" /> Skills</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1 pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Workload</span>
                  <span className="font-medium">{s.currentWorkload}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${s.currentWorkload}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-sm text-center">
                <div className="bg-muted rounded p-2">
                  <div className="text-muted-foreground text-xs">Active Tasks</div>
                  <div className="font-bold text-lg">{s.activeTasks}</div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="text-muted-foreground text-xs flex items-center justify-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Completed
                  </div>
                  <div className="font-bold text-lg">{s.completedTasks}</div>
                </div>
              </div>

              <div className="pt-2 border-t flex justify-between items-center text-sm">
                <span className="font-medium">Force Available</span>
                <Switch checked={s.availability === 'available'} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
