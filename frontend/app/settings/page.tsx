"use client";

import { useState, useEffect } from "react";
import { api, Settings } from "@/lib/api";

const SEVERITY_OPTIONS = ["critical", "warning", "suggestion", "nitpick"];

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
    return <p className="text-sm text-neutral-500">Loading...</p>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-semibold mb-6">Settings</h1>

      {/* Model selection */}
      <label className="block mb-4">
        <span className="text-sm text-neutral-600 block mb-1">Model</span>
        <select
          value={settings.model}
          onChange={(e) => setSettings({ ...settings, model: e.target.value })}
          className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-500"
        >
          <option value="gpt-4o">gpt-4o</option>
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="claude-sonnet-4-20250514">claude-sonnet-4-20250514</option>
          <option value="claude-opus-4-20250514">claude-opus-4-20250514</option>
        </select>
      </label>

      {/* Custom rules */}
      <label className="block mb-4">
        <span className="text-sm text-neutral-600 block mb-1">Custom rules</span>
        <textarea
          value={settings.custom_rules || ""}
          onChange={(e) =>
            setSettings({ ...settings, custom_rules: e.target.value || null })
          }
          rows={4}
          placeholder="e.g. Always flag SQL queries that don't use parameterized inputs"
          className="w-full border border-neutral-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-neutral-500"
        />
      </label>

      {/* Severity filter */}
      <fieldset className="mb-6">
        <legend className="text-sm text-neutral-600 mb-1">Severity filter</legend>
        <div className="flex gap-4">
          {SEVERITY_OPTIONS.map((s) => (
            <label key={s} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={settings.severity_filter.includes(s)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...settings.severity_filter, s]
                    : settings.severity_filter.filter((x) => x !== s);
                  setSettings({ ...settings, severity_filter: next });
                }}
                className="accent-neutral-900"
              />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-neutral-900 text-white px-4 py-2 rounded text-sm hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="text-xs text-green-600">Saved</span>}
      </div>
    </div>
  );
}
