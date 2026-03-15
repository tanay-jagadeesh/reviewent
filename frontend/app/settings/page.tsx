"use client";

import { useState, useEffect } from "react";
import { api, Settings } from "@/lib/api";

const SEVERITY_OPTIONS = ["critical", "warning", "suggestion", "nitpick"];

const SEVERITY_COLORS: Record<string, string> = {
  critical: "peer-checked:bg-red-500 peer-checked:border-red-500",
  warning: "peer-checked:bg-amber-500 peer-checked:border-amber-500",
  suggestion: "peer-checked:bg-accent-500 peer-checked:border-accent-500",
  nitpick: "peer-checked:bg-neutral-500 peer-checked:border-neutral-500",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-400 py-16 justify-center">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-1">Settings</h1>
        <p className="text-sm text-neutral-400">Configure your review agent preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Model selection */}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">Model</span>
          <select
            value={settings.model}
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            className="w-full bg-surface-0 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-400"
          >
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="claude-sonnet-4-20250514">claude-sonnet-4-20250514</option>
            <option value="claude-opus-4-20250514">claude-opus-4-20250514</option>
          </select>
        </label>

        {/* Custom rules */}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">Custom rules</span>
          <textarea
            value={settings.custom_rules || ""}
            onChange={(e) =>
              setSettings({ ...settings, custom_rules: e.target.value || null })
            }
            rows={4}
            placeholder="e.g. Always flag SQL queries that don't use parameterized inputs"
            className="w-full bg-surface-0 border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-mono placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-400"
          />
        </label>

        {/* Severity filter */}
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Severity filter</legend>
          <div className="flex gap-3">
            {SEVERITY_OPTIONS.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm cursor-pointer group">
                <input
                  type="checkbox"
                  checked={settings.severity_filter.includes(s)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...settings.severity_filter, s]
                      : settings.severity_filter.filter((x) => x !== s);
                    setSettings({ ...settings, severity_filter: next });
                  }}
                  className="peer sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 border-neutral-300 flex items-center justify-center ${SEVERITY_COLORS[s]}`}>
                  <svg className="w-2.5 h-2.5 text-white hidden peer-checked:group-[]:block" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-neutral-600 group-hover:text-neutral-900">{s}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-neutral-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-accent-700 disabled:opacity-50 shadow-sm"
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
        {saved && (
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
