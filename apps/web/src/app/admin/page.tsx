export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Platform Administration</h2>
        <p className="text-gray-600">
          Welcome to the NEXUS admin dashboard. Manage users, API keys, and platform settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="font-medium mb-2">API Keys Vault</h3>
          <p className="text-sm text-gray-500 mb-4">
            Manage encrypted API keys for all platform integrations.
          </p>
          <a href="/admin/vault" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Manage Keys</a>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="font-medium mb-2">User Management</h3>
          <p className="text-sm text-gray-500 mb-4">
            View and manage all platform users and organizations.
          </p>
          <a href="/admin/users" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Manage Users</a>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="font-medium mb-2">Demo Accounts</h3>
          <p className="text-sm text-gray-500 mb-4">
            View and manage demo accounts for testing.
          </p>
          <a href="/admin/demo-accounts" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">View Accounts</a>
        </div>
      </div>
    </div>
  )
}