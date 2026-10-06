import { Settings, Construction } from 'lucide-react';

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Platform configuration and preferences
        </p>
      </div>

      <div className="p-12 text-center bg-card border border-border rounded-xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-warning/10 flex items-center justify-center mb-4">
          <Construction className="size-8 text-warning" />
        </div>
        <h2 className="text-xl font-heading font-semibold mb-2">
          Coming Soon
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Platform settings, commission rates, and configuration options will
          be available in a future update.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          'Commission Rates',
          'Payment Gateways',
          'Email Templates',
          'Notification Settings',
          'Platform Fees',
          'Maintenance Mode',
        ].map((item) => (
          <div
            key={item}
            className="p-4 bg-card border border-border rounded-xl flex items-center gap-3 opacity-50"
          >
            <Settings className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}