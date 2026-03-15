import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Review Agent",
  description: "AI-powered code review dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        <nav className="border-b border-neutral-200 px-6 py-3 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold tracking-tight">
            Code Review Agent
          </a>
          <div className="flex gap-4 text-sm text-neutral-500">
            <a href="/" className="hover:text-neutral-900">
              Dashboard
            </a>
            <a href="/settings" className="hover:text-neutral-900">
              Settings
            </a>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
