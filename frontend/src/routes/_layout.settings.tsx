import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings as SettingsIcon, Save, Info } from 'lucide-react'

export const Route = createFileRoute('/_layout/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Configure resort details and system preferences.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              General Configuration
            </CardTitle>
            <CardDescription>Basic information about your property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Resort Name</label>
              <Input defaultValue="Smart Resort 360" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Language</label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <Select defaultValue="ist">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications & Alerts</CardTitle>
            <CardDescription>Configure how you receive operational alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium text-sm">Critical SLA Breaches</p>
                <p className="text-sm text-muted-foreground">Receive immediate push notifications when a high priority task breaches SLA.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium text-sm">AI Staffing Recommendations</p>
                <p className="text-sm text-muted-foreground">Get notified when AI suggests staffing changes.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Daily Digest</p>
                <p className="text-sm text-muted-foreground">Receive a daily summary of operations and insights.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center text-base">
              <Info className="w-5 h-5 mr-2" /> Hackathon MVP Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-900">
              The application is currently running in <strong>Demo Mode</strong>. Data presented on the dashboard, insights, and pricing pages is seeded for demonstration purposes. Backend integration and live AI models are pending Phase 2.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
