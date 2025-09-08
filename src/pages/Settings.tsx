import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Mail, Bell, Database, Shield } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-lg text-gray-600 mt-2">
          Configure your RFQ processing system preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
              <Mail className="h-5 w-5 mr-2" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input id="smtp-server" placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Port</Label>
              <Input id="smtp-port" placeholder="587" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-username">Username</Label>
              <Input id="email-username" placeholder="your-email@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-password">Password</Label>
              <Input id="email-password" type="password" placeholder="••••••••" />
            </div>
            <Button>Test Connection</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>RFQ Upload Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when RFQs are uploaded</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Bid Deadline Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders before bid deadlines</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Status Change Alerts</Label>
                <p className="text-sm text-muted-foreground">Alerts for RFQ status changes</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Daily Summary</Label>
                <p className="text-sm text-muted-foreground">Daily summary of RFQ activities</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
              <Database className="h-5 w-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Auto-backup Frequency</Label>
              <select className="w-full p-2 border rounded">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Data Retention Period</Label>
              <select className="w-full p-2 border rounded">
                <option>6 months</option>
                <option>1 year</option>
                <option>2 years</option>
                <option>5 years</option>
              </select>
            </div>
            <Button variant="outline" className="w-full">
              Export All Data
            </Button>
            <Button variant="destructive" className="w-full">
              Clear Old Data
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <select className="w-24 p-1 border rounded text-sm">
                <option>30min</option>
                <option>1hr</option>
                <option>2hr</option>
                <option>4hr</option>
              </select>
            </div>
            <Separator />
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              View Login History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
            <SettingsIcon className="h-5 w-5 mr-2" />
            System Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <select className="w-full p-2 border rounded">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>CAD (C$)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <select className="w-full p-2 border rounded">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <select className="w-full p-2 border rounded">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
                <option>GMT</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <select className="w-full p-2 border rounded">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8">Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}