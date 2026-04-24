'use client'

import { Bell, Search, Settings } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-nexus-surface border-b border-nexus-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-nexus-text-tertiary" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-nexus-border rounded-md leading-5 bg-nexus-surface placeholder-nexus-text-tertiary focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:border-nexus-blue text-sm text-nexus-text-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-nexus-text-secondary hover:text-nexus-text-primary relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-nexus-red ring-2 ring-nexus-surface"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-nexus-text-secondary hover:text-nexus-text-primary">
            <Settings className="h-6 w-6" />
          </button>

          {/* Profile */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-nexus-bg-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-nexus-text-primary">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}