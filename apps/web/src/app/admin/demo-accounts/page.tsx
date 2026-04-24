const DEMO_ACCOUNTS = [
  {
    email: "admin@nexus.demo",
    password: "NexusAdmin2025!",
    name: "Platform Admin",
    role: "admin",
    url: "https://nexus.app/admin",
    description: "Full platform admin — API Vault, all users, billing, system settings"
  },
  {
    email: "owner@nexus.demo",
    password: "NexusOwner2025!",
    name: "Agency Owner",
    role: "owner",
    plan: "agency",
    url: "https://nexus.app/dashboard",
    description: "Agency plan — 20 workspaces, white-label, all features"
  },
  {
    email: "pro@nexus.demo",
    password: "NexusPro2025!",
    name: "Pro User",
    role: "owner",
    plan: "pro",
    url: "https://nexus.app/dashboard",
    description: "Pro plan — all marketing, ads, creative, CRM features"
  },
  {
    email: "starter@nexus.demo",
    password: "NexusStarter2025!",
    name: "Starter User",
    role: "owner",
    plan: "starter",
    url: "https://nexus.app/dashboard",
    description: "Starter plan — basic CRM, email, 50 AI pieces/mo"
  },
  {
    email: "staff@nexus.demo",
    password: "NexusStaff2025!",
    name: "Team Member",
    role: "staff",
    plan: "pro",
    url: "https://nexus.app/dashboard",
    description: "Staff role under pro org — limited permissions"
  }
]

export default function DemoAccountsPage() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Demo Accounts</h2>
        <p className="text-nexus-text-secondary mb-6">
          These accounts are automatically created and can be used for testing different user roles and plans.
        </p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-nexus-border">
                <th className="text-left py-3 px-4 font-medium">Role</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Password</th>
                <th className="text-left py-3 px-4 font-medium">URL</th>
                <th className="text-left py-3 px-4 font-medium">Plan</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ACCOUNTS.map((account) => (
                <tr key={account.email} className="border-b border-nexus-border">
                  <td className="py-3 px-4">{account.role}</td>
                  <td className="py-3 px-4 font-mono text-sm">{account.email}</td>
                  <td className="py-3 px-4 font-mono text-sm">{account.password}</td>
                  <td className="py-3 px-4">
                    <a
                      href={account.url}
                      className="text-nexus-blue hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {account.url}
                    </a>
                  </td>
                  <td className="py-3 px-4">{account.plan || 'N/A'}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="btn btn-secondary text-xs"
                      onClick={() => navigator.clipboard.writeText(`${account.email}:${account.password}`)}
                    >
                      Copy Credentials
                    </button>
                    <a
                      href={account.url}
                      className="btn btn-primary text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open URL
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}