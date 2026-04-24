export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Platform Administration</h2>
        <p className="text-nexus-text-secondary">
          Welcome to the NEXUS admin dashboard. Manage users, API keys, and platform settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-medium mb-2">API Keys Vault</h3>
          <p className="text-sm text-nexus-text-tertiary mb-4">
            Manage encrypted API keys for all platform integrations.
          </p>
          <a href="/admin/vault" className="btn btn-primary">Manage Keys</a>
        </div>

        <div className="card">
          <h3 className="font-medium mb-2">User Management</h3>
          <p className="text-sm text-nexus-text-tertiary mb-4">
            View and manage all platform users and organizations.
          </p>
          <a href="/admin/users" className="btn btn-primary">Manage Users</a>
        </div>

        <div className="card">
          <h3 className="font-medium mb-2">Demo Accounts</h3>
          <p className="text-sm text-nexus-text-tertiary mb-4">
            View and manage demo accounts for testing.
          </p>
          <a href="/admin/demo-accounts" className="btn btn-primary">View Accounts</a>
        </div>
      </div>
    </div>
  )
}