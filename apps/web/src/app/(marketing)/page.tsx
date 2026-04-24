export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold text-gray-900">
            NEXUS
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900">Login</a>
            <a href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start Free Trial</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                ★ Rated #1 All-in-One Business Platform
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The Operating System
              <br />
              for Modern Business
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Replace 55+ tools with one platform. CRM, marketing, creative studio, advertising, automation — all connected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg">
                Start Free 14-Day Trial
              </a>
              <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-lg">
                Watch Demo →
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="container mx-auto text-center text-gray-500">
          © 2026 NEXUS. All rights reserved.
        </div>
      </footer>
    </div>
  )
}