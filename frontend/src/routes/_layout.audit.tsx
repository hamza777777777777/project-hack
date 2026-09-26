import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { BrainCircuit, Clock, User, CheckSquare, Activity, AlertTriangle, UserCog } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { api, type AuditLogResponse } from '@/lib/api'

export const Route = createFileRoute('/_layout/audit')({
  component: AuditPage,
})

function getIconForAction(action: string) {
  if (action === 'COMPLAINT_PROCESSED' || action.includes('CLASSIFIED')) return <User className="h-5 w-5 text-muted-foreground" />
  if (action === 'next_best_action_generated' || action.includes('AI') || action.includes('ACTION')) return <BrainCircuit className="h-5 w-5 text-[#0052ff]" />
  if (action === 'TASK_STATUS_CHANGED') return <CheckSquare className="h-5 w-5 text-[#05b169]" />
  if (action === 'TASK_SLA_ESCALATION') return <AlertTriangle className="h-5 w-5 text-[#cf202f]" />
  if (action === 'TASK_REASSIGNED' || action === 'STAFF_AVAILABILITY_CHANGED' || action.includes('ROOM_BOOKING')) return <UserCog className="h-5 w-5 text-[#0052ff]" />
  return <Activity className="h-5 w-5 text-[#0052ff]" />
}

function getBgColorForAction(action: string) {
  if (action === 'COMPLAINT_PROCESSED' || action.includes('CLASSIFIED')) return 'bg-secondary'
  if (action === 'next_best_action_generated' || action.includes('AI') || action.includes('ACTION')) return 'bg-[#0052ff]/10'
  if (action === 'TASK_STATUS_CHANGED') return 'bg-[#05b169]/10'
  if (action === 'TASK_SLA_ESCALATION') return 'bg-[#cf202f]/10'
  if (action === 'TASK_REASSIGNED' || action === 'STAFF_AVAILABILITY_CHANGED' || action.includes('ROOM_BOOKING')) return 'bg-[#0052ff]/10'
  return 'bg-[#0052ff]/10'
}

function formatTitle(action: string) {
  // e.g. TASK_STATUS_CHANGED -> Task Status Changed
  return action
    .replace(/_/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.round(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
  const diffHours = Math.round(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

function renderDetails(action: string, details: any) {
  if (action === 'TASK_STATUS_CHANGED' || action === 'task_status_changed') {
    return (
      <div className="p-4 bg-muted rounded-md text-sm border flex gap-4">
        <div>
          <span className="text-muted-foreground">Old Status:</span> <span className="font-medium">{details.old_status}</span>
        </div>
        <div>
          <span className="text-muted-foreground">New Status:</span> <span className="font-medium">{details.new_status}</span>
        </div>
      </div>
    );
  }

  if (action === 'TASK_SLA_ESCALATION') {
    return (
      <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden text-sm">
        <div className="flex bg-[#cf202f]/10 p-3 items-center justify-between">
          <div className="flex items-center gap-2">
             <span className="text-[#cf202f] font-bold uppercase tracking-wider text-xs">Escalation: {details.sla_status}</span>
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-xs bg-secondary text-foreground border border-border">Rule-Based</span>
          </div>
        </div>
        <div className="p-3 text-foreground">
           <strong>Reason:</strong> {details.reason}
        </div>
        <div className="p-3 text-xs flex gap-4 text-muted-foreground">
           <span><strong>Priority:</strong> {details.priority}</span>
           {details.staff && <span><strong>Staff:</strong> {details.staff}</span>}
           {details.minutes_remaining !== undefined && <span><strong>Remaining:</strong> {details.minutes_remaining}m</span>}
           {details.overdue_minutes !== undefined && <span><strong>Overdue:</strong> {details.overdue_minutes}m</span>}
           {details.elapsed_minutes !== undefined && <span><strong>Inactive:</strong> {details.elapsed_minutes}m</span>}
        </div>
      </div>
    )
  }

  if (action === 'TASK_REASSIGNED') {
    return (
      <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden text-sm">
        <div className="flex bg-[#0052ff]/10 p-3 items-center justify-between">
          <div className="flex items-center gap-2">
             <span className="text-primary font-bold uppercase tracking-wider text-xs">Manager Reassignment</span>
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-xs bg-secondary text-foreground border border-border">Manager Action</span>
          </div>
        </div>
        <div className="p-3 grid grid-cols-2 gap-2 text-foreground">
          <div><span className="text-muted-foreground">From:</span> <strong>{details.old_staff ?? 'Unknown'}</strong></div>
          <div><span className="text-muted-foreground">To:</span> <strong>{details.new_staff ?? 'Unknown'}</strong></div>
          <div><span className="text-muted-foreground">SLA Status at time:</span> {details.old_sla_status ?? '—'}</div>
          <div><span className="text-muted-foreground">New score:</span> {details.new_assignment_score !== undefined ? `${(details.new_assignment_score * 100).toFixed(1)}/100` : '—'}</div>
        </div>
        <div className="p-3 text-foreground">
          <strong>Manager Reason:</strong> {details.reason}
        </div>
      </div>
    )
  }

  if (action === 'STAFF_AVAILABILITY_CHANGED') {
    return (
      <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden text-sm">
        <div className="flex bg-[#0052ff]/10 p-3 items-center justify-between">
          <div className="flex items-center gap-2">
             <span className="text-primary font-bold uppercase tracking-wider text-xs">Manager Action</span>
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-xs bg-secondary text-foreground border border-border">Manual Override</span>
          </div>
        </div>
        <div className="p-3 grid grid-cols-2 gap-2 text-foreground">
          <div><span className="text-muted-foreground">Staff:</span> <strong>{details.staff_name ?? 'Unknown'}</strong></div>
          <div><span className="text-muted-foreground">Action:</span> Marked as <strong>{details.new_value ? 'Available' : 'Busy'}</strong></div>
        </div>
      </div>
    )
  }

  if (action === 'ROOM_BOOKING_CREATED') {
    return (
      <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden text-sm">
        <div className="flex bg-[#0052ff]/10 p-3 items-center justify-between">
          <div className="flex items-center gap-2">
             <span className="text-primary font-bold uppercase tracking-wider text-xs">Booking Created</span>
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-xs bg-secondary text-foreground border border-border">Manager Action</span>
          </div>
        </div>
        <div className="p-3 grid grid-cols-2 gap-2 text-foreground">
          <div><span className="text-muted-foreground">Guest ID:</span> <strong>{details.guest_id}</strong></div>
          <div><span className="text-muted-foreground">Category:</span> <strong>{details.category}</strong></div>
          <div><span className="text-muted-foreground">Check In:</span> {details.check_in_date}</div>
          <div><span className="text-muted-foreground">Check Out:</span> {details.check_out_date}</div>
          <div><span className="text-muted-foreground">Total Price:</span> ₹{details.total_price}</div>
        </div>
      </div>
    )
  }

  if (action === 'ROOM_BOOKING_CANCELLED') {
    return (
      <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden text-sm">
        <div className="flex bg-[#cf202f]/10 p-3 items-center justify-between">
          <div className="flex items-center gap-2">
             <span className="text-[#cf202f] font-bold uppercase tracking-wider text-xs">Booking Cancelled</span>
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-xs bg-secondary text-foreground border border-border">Manager Action</span>
          </div>
        </div>
        <div className="p-3 text-foreground">
          <span className="text-muted-foreground">Room ID:</span> <strong>{details.room_id}</strong>
        </div>
      </div>
    )
  }

  // Fallback for legacy complaint_processed
  if (action === 'complaint_processed') {
    return (
      <div className="p-4 bg-muted rounded-xl text-sm border border-border overflow-x-auto">
        <pre className="text-xs font-mono bg-background text-foreground p-3 rounded-lg border border-border whitespace-pre-wrap">
          {JSON.stringify(details, null, 2)}
        </pre>
      </div>
    );
  }

  // Structured ML/Data Science rendering
  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'ml': return <span className="px-2 py-0.5 rounded text-xs bg-[#0052ff]/10 text-primary border border-[#0052ff]/20">ML</span>;
      case 'llm': return <span className="px-2 py-0.5 rounded text-xs bg-[#0052ff]/10 text-primary border border-[#0052ff]/20">LLM</span>;
      case 'rule_based': return <span className="px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground border border-border">Rule-Based</span>;
      case 'algorithmic': return <span className="px-2 py-0.5 rounded text-xs bg-[#0052ff]/10 text-primary border border-[#0052ff]/20">Algorithmic</span>;
      case 'statistical': return <span className="px-2 py-0.5 rounded text-xs bg-[#05b169]/10 text-[#05b169] border border-[#05b169]/20">Statistical</span>;
      default: return <span className="px-2 py-0.5 rounded text-xs bg-secondary text-muted-foreground border border-border">{source || 'System'}</span>;
    }
  };

  const confidenceValue = details.confidence ?? details.cancellation_probability;
  const modelValue = details.model ?? details.model_name;
  const algorithmValue = details.algorithm;

  return (
    <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden text-sm">
      <div className="flex bg-secondary/40 p-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Prediction / Decision</span>
          <span className="font-bold text-foreground">
            {Array.isArray(details.prediction) ? details.prediction.join(', ') : details.prediction}
          </span>
          {details.risk_level && (
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
              details.risk_level === 'High' ? 'bg-[#cf202f]/10 text-[#cf202f] border border-[#cf202f]/20' :
              details.risk_level === 'Medium' ? 'bg-[#f4b000]/10 text-[#f4b000] border border-[#f4b000]/20' : 'bg-[#05b169]/10 text-[#05b169] border border-[#05b169]/20'
            }`}>
              {details.risk_level} Risk
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {confidenceValue !== undefined && (
            <span className="px-2 py-0.5 rounded text-xs bg-[#05b169]/10 text-[#05b169] border border-[#05b169]/20 font-medium">
              {details.cancellation_probability !== undefined ? 'Prob' : 'Conf'}: {(confidenceValue * 100).toFixed(1)}%
            </span>
          )}
          {getSourceBadge(details.source)}
        </div>
      </div>
      
      {(modelValue || algorithmValue) && (
        <div className="p-3 flex flex-wrap gap-4 text-xs">
          {modelValue && (
            <div><span className="text-muted-foreground">Model:</span> <span className="font-medium">{modelValue} {details.model_version ? `(${details.model_version})` : ''}</span></div>
          )}
          {algorithmValue && (
            <div><span className="text-muted-foreground">Algorithm:</span> <span className="font-medium">{algorithmValue}</span></div>
          )}
          {details.dataset_source && (
            <div><span className="text-muted-foreground">Dataset:</span> <span className="font-medium">{details.dataset_source}</span></div>
          )}
        </div>
      )}

      {details.evaluation && (
        <div className="p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Evaluation Metrics</div>
          <div className="text-xs flex gap-4 text-slate-700">
            {Object.entries(details.evaluation).map(([k, v]) => (
              <span key={k}><strong className="capitalize">{k}:</strong> {typeof v === 'number' ? v.toFixed(4) : v as any}</span>
            ))}
          </div>
        </div>
      )}

      {details.decision && (
        <div className="p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Operational Decision</div>
          <div className="text-slate-700 font-medium">{details.decision}</div>
        </div>
      )}

      {details.evidence && (
        <div className="p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Input Evidence</div>
          <div className="text-slate-700">{details.evidence}</div>
        </div>
      )}

      {details.reasoning && (
        <div className="p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Reasoning</div>
          <div className="text-slate-700">{details.reasoning}</div>
        </div>
      )}

      {details.features && (
        <div className="p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Features / Signals</div>
          <pre className="text-xs font-mono bg-slate-50 p-2 rounded border border-slate-100 mt-1 whitespace-pre-wrap text-slate-600">
            {JSON.stringify(details.features, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function AuditPage() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAuditLogs(50)
        setLogs(data)
      } catch (e: any) {
        setError(e.message || 'Failed to load audit logs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="p-6 space-y-6 bg-muted/20 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground">Transparent record of all AI and system decisions.</p>
      </div>

      <div className="space-y-4">
        {loading && (
          <>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border rounded-md bg-background">
            No audit events recorded yet.
          </div>
        )}

        {!loading && !error && logs.map(log => (
          <Card key={log.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`mt-1 p-2 rounded-full ${getBgColorForAction(log.action)}`}>
                    {getIconForAction(log.action)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{formatTitle(log.action)}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Resource: <span className="font-medium text-foreground">{log.resource_type}</span> 
                      {log.resource_id !== 0 && ` (ID: ${log.resource_id})`}
                    </p>
                    
                    {log.details_json && (
                      <div className="mt-4 space-y-4">
                        {renderDetails(log.action, log.details_json)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center shrink-0 ml-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatRelativeTime(log.created_at)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
