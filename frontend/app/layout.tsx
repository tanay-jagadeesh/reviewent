import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Review Agent",
  description: "AI-powered code review dashboard",
};

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { href: "/drift", label: "Drift", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { href: "/patterns", label: "Patterns", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { href: "/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" className="shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface-50 text-neutral-900 antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-56 bg-sidebar flex flex-col fixed inset-y-0 left-0 z-10">
            <div className="px-5 py-5">
              <a href="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-accent-500 rounded-lg flex items-center justify-center shrink-0">
                  <svg width="16" height="16" className="text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-sidebar-text-active tracking-tight">
                  Code Review
                </span>
              </a>
            </div>

            <nav className="flex-1 px-3 space-y-0.5 mt-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover"
                >
                  <NavIcon d={item.icon} />
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="px-5 py-4 border-t border-white/5">
              <p className="text-[11px] text-sidebar-text/50">AI-Powered Reviews</p>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 ml-56">
            <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
