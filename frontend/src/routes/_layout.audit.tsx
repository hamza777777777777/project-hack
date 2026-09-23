import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, Clock, User, FileCode } from 'lucide-react'

export const Route = createFileRoute('/_layout/audit')({
  component: AuditPage,
})

function AuditPage() {
  return (
    <div className="p-6 space-y-6 bg-muted/20 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground">Transparent record of all AI and system decisions.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="mt-1 bg-indigo-100 p-2 rounded-full">
                  <BrainCircuit className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Task Assignment</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    System auto-assigned <span className="font-medium text-foreground">TSK-1021 (AC Not Cooling)</span> to <span className="font-medium text-foreground">Rahul Sharma</span>.
                  </p>
                  
                  <div className="mt-4 p-4 bg-muted rounded-md space-y-2 text-sm">
                    <div className="font-medium mb-2 flex items-center">
                      <FileCode className="h-4 w-4 mr-2" />
                      Reasoning Log
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="text-muted-foreground">Selected Staff:</div>
                      <div>Rahul Sharma</div>
                      
                      <div className="text-muted-foreground">Total Match Score:</div>
                      <div><Badge variant="secondary">92 / 100</Badge></div>
                      
                      <div className="text-muted-foreground">Skill Match (AC Repair):</div>
                      <div>35/35 (Required skill present)</div>
                      
                      <div className="text-muted-foreground">Workload:</div>
                      <div>18/25 (1 open task)</div>
                      
                      <div className="text-muted-foreground">Availability:</div>
                      <div>20/20 (Currently Available)</div>
                      
                      <div className="text-muted-foreground">Rejected Alternatives:</div>
                      <div>Arjun Patil (Score 65 - Lacks Skill), Priya Nair (Score 0 - On Leave)</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Just now
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="mt-1 bg-slate-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Complaint Classified</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Guest in Room 204 submitted a complaint. LLM classified and created TSK-1021.
                  </p>
                  
                  <div className="mt-4 p-4 bg-muted rounded-md space-y-2 text-sm">
                    <div className="font-medium mb-2 flex items-center">
                      <FileCode className="h-4 w-4 mr-2" />
                      LLM Output (Schema Validated)
                    </div>
                    <pre className="text-xs font-mono bg-background p-3 rounded border">
{`{
  "issue_type": "AC",
  "department": "Maintenance",
  "priority": "high",
  "location": "room_204",
  "required_skill": "AC Repair",
  "confidence": 0.98
}`}
                    </pre>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                2 mins ago
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
