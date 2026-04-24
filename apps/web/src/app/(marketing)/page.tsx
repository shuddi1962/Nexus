export default function HomePage() {
  return (
    <div className="min-h-screen bg-nexus-bg">
      <header className="sticky top-0 z-50 w-full border-b border-nexus-border bg-nexus-bg/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="font-display text-2xl font-bold text-nexus-accent">
            NEXUS
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/features" className="nav-link">Features</a>
            <a href="/pricing" className="nav-link">Pricing</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/login" className="btn btn-ghost">Login</a>
            <a href="/register" className="btn btn-primary">Start Free Trial</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-nexus-blue-light px-3 py-1 text-sm font-medium text-nexus-blue">
                ★ Rated #1 All-in-One Business Platform
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-nexus-text-primary mb-6 leading-tight">
              The Operating System
              <br />
              for Modern Business
            </h1>
            <p className="text-xl text-nexus-text-secondary mb-8 max-w-2xl mx-auto">
              Replace 55+ tools with one platform. CRM, marketing, creative studio, advertising, automation — all connected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="btn btn-primary text-lg px-8 py-4">
                Start Free 14-Day Trial
              </a>
              <button className="btn btn-secondary text-lg px-8 py-4">
                Watch Demo →
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-nexus-border py-8 px-4">
        <div className="container mx-auto text-center text-nexus-text-tertiary">
          © 2026 NEXUS. All rights reserved.
        </div>
      </footer>
    </div>
  )
}