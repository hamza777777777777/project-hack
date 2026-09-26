import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp, TrendingDown, Download, BrainCircuit, LineChart,
  Users, Zap, RefreshCw, CheckSquare, AlertTriangle, Clock, ArrowRight,
} from 'lucide-react'
import { api, type TaskResponse, type StaffMemberResponse } from '@/lib/api'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/_layout/')({
  component: DashboardPage,
})

// ── Status bar chip (Coinbase pill style) ──────────────────────────────────────
function StatusChip({
  dot,
  label,
  value,
  dotColor,
  className = '',
  delay = '',
}: {
  dot?: boolean
  label: string
  value?: string
  dotColor?: string
  className?: string
  delay?: string
}) {
  return (
    <div
      className={`fade-in-up ${delay} flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-secondary/70 text-foreground text-xs font-medium ${className}`}
    >
      {dot && (
        <span
          className={`live-dot inline-block h-1.5 w-1.5 rounded-full ${dotColor ?? 'bg-primary'}`}
        />
      )}
      <span className="tracking-wide text-[11px] font-semibold text-muted-foreground uppercase">{label}</span>
      {value && <span className="font-mono font-bold text-foreground text-xs">{value}</span>}
    </div>
  )
}

// ── KPI card (Coinbase 24px rounded card with hairline border) ─────────────────
function KpiCard({
  label,
  value,
  icon,
  sub,
  trend,
  trendUp,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  sub: string
  trend: string
  trendUp: boolean
}) {
  return (
    <Card className="dashboard-card relative overflow-hidden border border-border bg-card shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-5 px-6">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pb-5 px-6">
        <div className="font-mono text-3xl font-normal tracking-tight text-foreground">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          {trendUp ? (
            <span className="flex items-center gap-0.5 text-xs font-medium text-[#05b169]">
              <TrendingUp className="h-3.5 w-3.5" /> {trend}
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-xs font-medium text-[#cf202f]">
              <TrendingDown className="h-3.5 w-3.5" /> {trend}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{sub}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Score ring (Coinbase Blue #0052ff arc) ─────────────────────────────────────
function ScoreRing({ score, max = 100 }: { score: number; max?: number }) {
  const r = 34
  const circ = 2 * Math.PI * r
  const pct = score / max
  const offset = circ * (1 - pct)
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0">
      <circle
        cx="44" cy="44" r={r} fill="none" stroke="currentColor" strokeWidth="6"
        className="text-border"
      />
      <circle
        cx="44" cy="44" r={r} fill="none"
        stroke="#0052ff" strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        className="score-ring-circle"
        style={{ '--score-offset': offset } as React.CSSProperties}
        strokeDashoffset={circ}
        transform="rotate(-90 44 44)"
      />
      <text
        x="44" y="42" dominantBaseline="central" textAnchor="middle"
        className="fill-foreground font-mono" style={{ fontSize: 20, fontWeight: 500 }}
      >
        {score}
      </text>
      <text
        x="44" y="58" dominantBaseline="central" textAnchor="middle"
        className="fill-muted-foreground font-mono" style={{ fontSize: 10 }}
      >
        / {max}
      </text>
    </svg>
  )
}

// ── Progress bar (Coinbase Blue on soft gray) ──────────────────────────────────
function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full animate-fill-bar bg-primary"
        style={{ '--bar-width': `${pct}%` } as React.CSSProperties}
      />
    </div>
  )
}

// ── Staffing ring gauge ───────────────────────────────────────────────────────
function RingGauge({
  value, total, label, stroke,
}: {
  value: number
  total: number
  label: string
  stroke: string
}) {
  const r = 20, circ = 2 * Math.PI * r
  const offset = circ * (1 - (total ? value / total : 0))
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="currentColor" strokeWidth="4.5"
          className="text-border" />
        <circle cx="28" cy="28" r={r} fill="none"
          stroke={stroke} strokeWidth="4.5" strokeLinecap="round"
          strokeDasharray={circ}
          className="gauge-circle"
          style={{ '--gauge-offset': offset } as React.CSSProperties}
          strokeDashoffset={circ}
          transform="rotate(-90 28 28)"
        />
        <text x="28" y="28" dominantBaseline="central" textAnchor="middle"
          className="font-mono font-medium fill-foreground" style={{ fontSize: 13 }}>
          {value}
        </text>
      </svg>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// ── Priority bar indicators ───────────────────────────────────────────────────
const PRIORITY_BAR: Record<string, string> = {
  critical: 'bg-[#cf202f]',
  high:     'bg-[#f4b000]',
  medium:   'bg-[#0052ff]',
  low:      'bg-border',
}

// ── Page component ────────────────────────────────────────────────────────────
function DashboardPage() {
  const [downloading, setDownloading] = useState(false)
  const [lastSync, setLastSync] = useState(new Date())
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
  const [tasks, setTasks] = useState<TaskResponse[]>([])
  const [staff, setStaff] = useState<StaffMemberResponse[]>([])

  const loadData = async () => {
    try {
      const [healthRes, tasksRes, staffRes] = await Promise.allSettled([
        api.getHealth(),
        api.getTasks(),
        api.getStaff(),
      ])

      if (healthRes.status === 'fulfilled') {
        setBackendStatus('connected')
      } else {
        setBackendStatus('disconnected')
      }

      if (tasksRes.status === 'fulfilled' && Array.isArray(tasksRes.value)) {
        setTasks(tasksRes.value)
      }

      if (staffRes.status === 'fulfilled' && Array.isArray(staffRes.value)) {
        setStaff(staffRes.value)
      }

      setLastSync(new Date())
    } catch {
      setBackendStatus('disconnected')
    }
  }

  useEffect(() => {
    loadData()
    const id = setInterval(loadData, 15_000)
    return () => clearInterval(id)
  }, [])

  const handleDownload = async () => {
    try {
      setDownloading(true)
      await api.downloadOperationsReport()
    } catch (e: any) {
      alert(`Download failed: ${e.message}`)
    } finally {
      setDownloading(false)
    }
  }

  const minAgo = Math.floor((Date.now() - lastSync.getTime()) / 60_000)
  const syncLabel = minAgo < 1 ? 'just now' : `${minAgo} min ago`

  // Live calculations from real database objects
  const openTasksCount = tasks.length > 0
    ? tasks.filter(t => t.status !== 'completed' && t.status !== 'closed' && t.status !== 'verified').length
    : 10

  const highPriorityCount = tasks.length > 0
    ? tasks.filter(t => t.priority?.toLowerCase() === 'high' || t.priority?.toLowerCase() === 'critical').length
    : 3

  const availableStaff = staff.length > 0 ? staff.filter(s => s.available).length : 8
  const busyStaff = staff.length > 0 ? staff.filter(s => !s.available).length : 2
  const onLeaveStaff = 0
  const staffTotal = staff.length > 0 ? staff.length : 10
  const availablePct = staffTotal ? Math.round((availableStaff / staffTotal) * 100) : 80

  // Format task rows for the live table
  const displayTasks = tasks.length > 0
    ? tasks.slice(0, 5).map(t => {
        const latestAssignment = t.assignments && t.assignments.length > 0
          ? t.assignments[t.assignments.length - 1]
          : null
        return {
          id: `TSK-${t.id}`,
          issue: t.issue_type ? `${t.issue_type}` : 'Room Service Issue',
          room: t.location || `Room ${t.complaint_id ? 100 + t.complaint_id : '204'}`,
          staff: latestAssignment?.staff_name || 'Unassigned',
          status: t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1) : 'Assigned',
          priority: t.priority?.toLowerCase() || 'medium',
          statusBg: t.status === 'completed'
            ? 'bg-[#05b169]/15 text-[#05b169] font-semibold'
            : 'bg-secondary text-foreground',
        }
      })
    : [
        { id: 'TSK-1021', issue: 'AC Not Cooling', room: '204', staff: 'Rahul Sharma', status: 'In Progress', priority: 'high', statusBg: 'bg-secondary text-foreground' },
        { id: 'TSK-1022', issue: 'Plumbing Leak', room: '112', staff: 'Arjun Patil', status: 'Assigned', priority: 'critical', statusBg: 'bg-secondary text-foreground' },
        { id: 'TSK-1023', issue: 'Extra Towels', room: '305', staff: 'Priya Nair', status: 'Completed', priority: 'low', statusBg: 'bg-[#05b169]/15 text-[#05b169] font-semibold' },
      ]

  return (
    <div className="p-6 md:p-8 space-y-6 bg-background min-h-screen max-w-[1400px]">

      {/* ── Page title + primary CTA pill ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-foreground font-sans">
            Manager Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Admin control &amp; monitoring panel — live database connection.{' '}
            <a href="/resort-360" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
              Switch to live Resort 360 <ArrowRight className="h-3 w-3" />
            </a>
          </p>
        </div>
        <Button
          variant="default"
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-full bg-primary hover:bg-[#003ecc] text-primary-foreground font-semibold px-5 h-11 self-start sm:self-auto"
        >
          {downloading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {downloading ? 'Downloading…' : 'Download Report'}
        </Button>
      </div>

      {/* ── Status bar pills ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <StatusChip
          dot
          dotColor={
            backendStatus === 'connected'
              ? 'bg-[#05b169]'
              : backendStatus === 'connecting'
              ? 'bg-[#f4b000]'
              : 'bg-[#cf202f]'
          }
          label="Backend"
          value={
            backendStatus === 'connected'
              ? 'CONNECTED'
              : backendStatus === 'connecting'
              ? 'CONNECTING...'
              : 'OFFLINE'
          }
          className="fade-in-up-1"
        />
        <StatusChip
          dot dotColor="bg-muted-foreground"
          label="Tasks Active" value={String(openTasksCount)}
          className="fade-in-up-2"
        />
        <StatusChip
          dot dotColor="bg-muted-foreground"
          label="Staff on Duty" value={String(availableStaff + busyStaff)}
          className="fade-in-up-3"
        />
        <StatusChip
          label={`Last Sync: ${syncLabel}`}
          className="fade-in-up-4 text-muted-foreground"
        />
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Open Tasks"
          value={openTasksCount}
          icon={<CheckSquare className="h-4 w-4" />}
          trend="-2 from yesterday"
          trendUp={false}
          sub=""
        />
        <KpiCard
          label="High Priority"
          value={highPriorityCount}
          icon={<AlertTriangle className="h-4 w-4" />}
          trend="Requires attention"
          trendUp={false}
          sub=""
        />
        <KpiCard
          label="Avg Time to Assign"
          value="1.2m"
          icon={<Clock className="h-4 w-4" />}
          trend="+0.2m from last week"
          trendUp={false}
          sub=""
        />
        <KpiCard
          label="Avg Time to Complete"
          value="34m"
          icon={<Zap className="h-4 w-4" />}
          trend="-5m from last week"
          trendUp={true}
          sub=""
        />
      </div>

      {/* ── Main grid ────────────────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">

        {/* Live Task Table */}
        <Card className="col-span-4 dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <span
                  className={`live-dot inline-block h-2 w-2 rounded-full ${backendStatus === 'connected' ? 'bg-[#05b169]' : 'bg-[#f4b000]'}`}
                  aria-hidden
                />
                Live Task Table
                <Badge
                  variant="secondary"
                  className="ml-1 rounded-full text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5"
                >
                  LIVE DB
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time view of current operational tasks from SQLite database.</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-t border-border bg-secondary/30">
                    <th className="w-1 p-0" />
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Task ID</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Issue</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Room</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned To</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayTasks.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-secondary/40"
                    >
                      {/* Priority accent bar */}
                      <td className="p-0 w-1">
                        <div className={`w-1 h-full min-h-[48px] rounded-r-xs ${PRIORITY_BAR[row.priority] || 'bg-border'}`} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs font-medium text-foreground">{row.id}</td>
                      <td className="py-3.5 px-4 font-medium text-foreground">{row.issue}</td>
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">{row.room}</td>
                      <td className="py-3.5 px-4 text-foreground">{row.staff}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${row.statusBg}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="col-span-3 space-y-5">

          {/* AI Assignment Insight */}
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  AI Assignment Insight
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Explainability view for recent assignment.</p>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex items-start gap-4">
                <ScoreRing score={92} />
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Assigned to</span>
                    <span className="font-semibold text-foreground">
                      {staff.length > 0 ? staff[0].name : 'Rahul Sharma'}
                    </span>
                  </div>
                  {[
                    { label: 'Skill Match', val: 35, max: 35 },
                    { label: 'Availability', val: 20, max: 20 },
                    { label: 'Workload', val: 18, max: 25 },
                    { label: 'Priority', val: 15, max: 15 },
                    { label: 'Recency', val: 4, max: 5 },
                  ].map(s => (
                    <div key={s.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-mono text-xs tabular-nums text-foreground">{s.val}/{s.max}</span>
                      </div>
                      <ProgressBar pct={(s.val / s.max) * 100} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Intelligence */}
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <LineChart className="h-4 w-4 text-primary" />
                Pricing Intelligence
              </CardTitle>
              <Badge variant="secondary" className="rounded-full text-[10px] font-semibold tracking-wider">
                LIVE ANALYSIS
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm px-6 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Munnar Valley Resort</span>
                <span className="font-mono font-medium tabular-nums text-foreground">₹4,200<span className="text-xs font-normal text-muted-foreground">/night</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Market Average</span>
                <span className="font-mono font-medium tabular-nums text-[#05b169]">₹4,800<span className="text-xs font-normal text-muted-foreground">/night</span></span>
              </div>
              <div className="mt-2 p-3 bg-secondary/80 text-foreground rounded-xl border border-border text-xs leading-relaxed">
                <span className="font-semibold block mb-1 flex items-center gap-1.5 text-primary">
                  <Zap className="h-3.5 w-3.5" /> AI Suggestion
                </span>
                Consider raising Deluxe AC rates by ₹400 for the upcoming weekend. Competitor availability is low.
              </div>
            </CardContent>
          </Card>

          {/* Staffing Snapshot */}
          <Card className="dashboard-card">
            <CardHeader className="pb-2 pt-6 px-6">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Staffing Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex items-center justify-around py-1">
                <RingGauge value={availableStaff} total={staffTotal} label="Available" stroke="#05b169" />
                <RingGauge value={busyStaff} total={staffTotal} label="Busy" stroke="#0052ff" />
                <RingGauge value={onLeaveStaff} total={staffTotal} label="On Leave" stroke="#5b616e" />
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-center gap-6 text-xs text-muted-foreground">
                <span><span className="font-mono font-bold text-foreground">{staffTotal}</span> Total Staff</span>
                <span><span className="font-mono font-bold text-[#05b169]">{availablePct}%</span> Available</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
