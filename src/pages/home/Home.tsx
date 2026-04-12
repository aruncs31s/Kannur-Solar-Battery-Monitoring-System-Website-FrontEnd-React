import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Building2, Check, Code2, Copy, Cpu, Gauge, LayoutDashboard, LogIn, MapPin, ShieldCheck, Sparkles, SunMedium, Terminal } from 'lucide-react';
import { devicesAPI } from '../../api/devices';
import { StatusBadge } from '../../components/Cards';
import { DeviceResponseDTO } from '../../domain/entities/Device';
import { useAuthStore } from '../../store/authStore';

type IntegrationSnippet = {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
};

type LanguageSnippet = {
  id: string;
  label: string;
  iconLabel: string;
  language: string;
  description: string;
  code: string;
};

const integrationSnippets: IntegrationSnippet[] = [
  {
    id: 'platformio',
    title: 'platformio.ini',
    description: 'Configure board, framework, and dependencies for ESP32 telemetry firmware.',
    language: 'ini',
    code: `[env:esp32dev]\nplatform = espressif32\nboard = esp32dev\nframework = arduino\nmonitor_speed = 115200\nlib_deps =\n  bblanchon/ArduinoJson @ ^7.1.0\n  knolleary/PubSubClient @ ^2.8`,
  },
  {
    id: 'firmware',
    title: 'src/main.cpp',
    description: 'Collect battery metrics and post authenticated JSON payloads to the backend API.',
    language: 'cpp',
    code: `StaticJsonDocument<256> payload;\npayload["voltage"] = readVoltage();\npayload["current"] = readCurrent();\npayload["temperature"] = readTemperature();\n\nString body;\nserializeJson(payload, body);\n\nhttp.begin(String(apiHost) + "/api/readings");\nhttp.addHeader("Content-Type", "application/json");\nhttp.addHeader("Authorization", "Bearer " + deviceToken);\nint status = http.POST(body);`,
  },
];

const languageSnippets: LanguageSnippet[] = [
  {
    id: 'c',
    label: 'C',
    iconLabel: 'C',
    language: 'c',
    description: 'C client example using libcurl for posting telemetry payloads.',
    code: `#include <curl/curl.h>

CURL *curl = curl_easy_init();
if (curl) {
  curl_easy_setopt(curl, CURLOPT_URL, "https://api.example.com/api/readings");
  curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "{\\"voltage\\":12.7,\\"current\\":4.1}");

  struct curl_slist *headers = NULL;
  headers = curl_slist_append(headers, "Content-Type: application/json");
  headers = curl_slist_append(headers, "Authorization: Bearer <token>");
  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
  curl_easy_perform(curl);
  curl_easy_cleanup(curl);
}`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    iconLabel: 'JS',
    language: 'js',
    description: 'Browser or Node.js example using fetch.',
    code: `const payload = { voltage: 12.7, current: 4.1, temperature: 32.4 };

const res = await fetch("/api/readings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <token>"
  },
  body: JSON.stringify(payload)
});

console.log(await res.json());`,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    iconLabel: 'TS',
    language: 'ts',
    description: 'Typed TypeScript helper for pushing telemetry.',
    code: `type ReadingPayload = {
  voltage: number;
  current: number;
  temperature: number;
};

async function pushReading(payload: ReadingPayload, token: string) {
  const res = await fetch("/api/readings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer <token>"
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}`,
  },
  {
    id: 'python',
    label: 'Python',
    iconLabel: 'PY',
    language: 'py',
    description: 'Python requests example for backend ingestion.',
    code: `import requests

payload = {
    "voltage": 12.7,
    "current": 4.1,
    "temperature": 32.4
}

headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

resp = requests.post("https://api.example.com/api/readings", json=payload, headers=headers, timeout=10)
print(resp.json())`,
  },
  {
    id: 'go',
    label: 'Go',
    iconLabel: 'GO',
    language: 'go',
    description: 'Go net/http example with bearer auth.',
    code: `payload := strings.NewReader("{\\"voltage\\":12.7,\\"current\\":4.1,\\"temperature\\":32.4}")

req, _ := http.NewRequest("POST", "https://api.example.com/api/readings", payload)
req.Header.Set("Authorization", "Bearer <token>")
req.Header.Set("Content-Type", "application/json")

client := &http.Client{Timeout: 10 * time.Second}
res, _ := client.Do(req)
defer res.Body.Close()`,
  },
  {
    id: 'rust',
    label: 'Rust',
    iconLabel: 'RS',
    language: 'rs',
    description: 'Rust reqwest example for posting readings.',
    code: `let client = reqwest::blocking::Client::new();
let body = serde_json::json!({
    "voltage": 12.7,
    "current": 4.1,
    "temperature": 32.4
});

let response = client
    .post("https://api.example.com/api/readings")
    .bearer_auth("<token>")
    .json(&body)
    .send()?;`,
  },
];

export const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const [devices, setDevices] = useState<DeviceResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState(languageSnippets[0].id);

  useEffect(() => {
    let isActive = true;

    const fetchPublicDevices = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await devicesAPI.getAllDevices();
        if (isActive) {
          setDevices(data);
        }
      } catch {
        if (isActive) {
          setError('Public devices are unavailable right now. Please try again shortly.');
          setDevices([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchPublicDevices();

    return () => {
      isActive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const onlineDevices = devices.filter((device) => device.device_state === 1).length;
    const cities = new Set(devices.map((device) => device.city).filter(Boolean));
    const health = devices.length > 0 ? Math.round((onlineDevices / devices.length) * 100) : 0;

    return {
      total: devices.length,
      online: onlineDevices,
      cities: cities.size,
      health,
    };
  }, [devices]);

  const selectedLanguageSnippet = useMemo(() => {
    return languageSnippets.find((snippet) => snippet.id === activeLanguage) || languageSnippets[0];
  }, [activeLanguage]);

  const handleCopySnippet = async (snippet: { id: string; code: string }) => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopiedSnippet(snippet.id);
      setTimeout(() => setCopiedSnippet(null), 1800);
    } catch {
      setCopiedSnippet(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-primary text-text-primary">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-[var(--solar-bg)] blur-3xl" />
        <div className="absolute top-28 -left-20 h-72 w-72 rounded-full bg-[var(--info-bg)] blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-[var(--mc-bg)] blur-3xl" />
      </div>

      <div className="relative z-10 border-b border-border-primary bg-gradient-to-br from-[var(--surface-primary)] via-[var(--surface-secondary)] to-[var(--bg-secondary)]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-[var(--solar-border)] bg-[var(--solar-bg)] p-2 text-[var(--solar-color)]">
                <SunMedium size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide text-text-secondary">Kannur Smart City</p>
                <h1 className="text-lg font-extrabold">Solar Battery Monitoring</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-lg border border-border-primary bg-surface-primary px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-secondary"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                  >
                    Register
                    <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:items-stretch">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-primary bg-surface-primary/80 px-3 py-1.5 text-xs font-semibold text-text-secondary"
              >
                <Sparkles size={14} className="text-[var(--solar-color)]" />
                Public Energy Intelligence Layer
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-extrabold leading-tight sm:text-5xl"
              >
                Real-time public view of solar infrastructure across Kannur.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg"
              >
                Explore public devices, track operational spread, and understand current system health without signing in.
                Log in for full control workflows, private devices, detailed analytics, and administrative capabilities.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16 }}
                className="mt-6 flex flex-wrap items-center gap-2"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-primary/80 px-3 py-1 text-xs font-semibold text-text-secondary border border-border-primary">
                  <Gauge size={13} className="text-info" />
                  Live Device Health
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-primary/80 px-3 py-1 text-xs font-semibold text-text-secondary border border-border-primary">
                  <Building2 size={13} className="text-primary-500" />
                  Multi-Location Coverage
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-primary/80 px-3 py-1 text-xs font-semibold text-text-secondary border border-border-primary">
                  <ShieldCheck size={13} className="text-success" />
                  Secure Management Layer
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <div className="glass-panel h-full rounded-2xl p-5 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">System Pulse</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border-primary bg-surface-primary/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Public Devices</p>
                    <p className="mt-2 text-2xl font-black">{stats.total}</p>
                  </div>
                  <div className="rounded-xl border border-border-primary bg-surface-primary/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Online</p>
                    <p className="mt-2 text-2xl font-black text-success">{stats.online}</p>
                  </div>
                  <div className="rounded-xl border border-border-primary bg-surface-primary/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Cities</p>
                    <p className="mt-2 text-2xl font-black">{stats.cities}</p>
                  </div>
                  <div className="rounded-xl border border-border-primary bg-surface-primary/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Health</p>
                    <p className="mt-2 text-2xl font-black text-info">{stats.health}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold">Public Devices</h3>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-accent hover:text-primary-600"
            >
              Open full dashboard
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border-primary bg-surface-primary p-8 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-primary-500" />
            <p className="mt-4 font-medium text-text-secondary">Loading public devices...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-error-border bg-error-bg p-6 text-error">
            <p className="font-semibold">{error}</p>
          </div>
        ) : devices.length === 0 ? (
          <div className="rounded-2xl border border-border-primary bg-surface-primary p-10 text-center shadow-sm">
            <p className="text-lg font-semibold">No public devices are available yet.</p>
            <p className="mt-2 text-sm text-text-secondary">Device owners can mark devices as public from device settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {devices.map((device, index) => (
              <motion.article
                key={device.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.24) }}
                whileHover={{ y: -3 }}
                className="group rounded-2xl border border-border-primary bg-surface-primary p-5 shadow-sm transition-all hover:border-primary-500/60 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold group-hover:text-text-accent transition-colors">{device.name}</h4>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-muted">{device.type || 'Unknown Type'}</p>
                  </div>
                  <StatusBadge status={device.status} />
                </div>

                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Cpu size={15} className="text-text-muted" />
                    <span>MAC: {device.mac_address || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-text-muted" />
                    <span>{[device.address, device.city].filter(Boolean).join(', ') || 'Location not available'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={15} className="text-text-muted" />
                    <span>Firmware {device.firmware_version || 'Unknown'}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border-primary bg-surface-primary p-4">
            <div className="mb-2 inline-flex rounded-md bg-solar-bg p-2 text-solar-color">
              <SunMedium size={16} />
            </div>
            <h4 className="font-bold">Solar Monitoring</h4>
            <p className="mt-1 text-sm text-text-secondary">Track charging patterns and battery behavior across distributed installations.</p>
          </div>

          <div className="rounded-xl border border-border-primary bg-surface-primary p-4">
            <div className="mb-2 inline-flex rounded-md bg-info-bg p-2 text-info">
              <Activity size={16} />
            </div>
            <h4 className="font-bold">Live Operations</h4>
            <p className="mt-1 text-sm text-text-secondary">Observe the current status of deployed field devices in near real-time.</p>
          </div>

          <div className="rounded-xl border border-border-primary bg-surface-primary p-4">
            <div className="mb-2 inline-flex rounded-md bg-success-bg p-2 text-success">
              <ShieldCheck size={16} />
            </div>
            <h4 className="font-bold">Secure Management</h4>
            <p className="mt-1 text-sm text-text-secondary">Sign in for secure controls, role-based access, and administrative workflows.</p>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-border-primary bg-surface-primary p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-2xl font-bold">Developer Integration</h4>
              <p className="text-sm text-text-secondary">Quick examples showing how PlatformIO firmware pushes readings to this dashboard stack.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border-primary bg-surface-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
              <Code2 size={14} className="text-text-accent" />
              PlatformIO + REST API
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {integrationSnippets.map((snippet, index) => {
              const lines = snippet.code.split('\n');
              const isCopied = copiedSnippet === snippet.id;

              return (
                <motion.article
                  key={snippet.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.28, delay: index * 0.06 }}
                  className="rounded-xl border border-border-primary bg-surface-secondary p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-error/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm font-bold text-text-primary">
                        {snippet.id === 'platformio' && (
                          <a
                            href="https://platformio.org/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-md bg-info-bg p-1 text-info hover:opacity-85 transition-opacity"
                            title="Open PlatformIO docs"
                          >
                            <Terminal size={14} />
                          </a>
                        )}
                        {snippet.id === 'firmware' && (
                          <a
                            href="https://en.cppreference.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-md bg-success-bg p-1 text-success hover:opacity-85 transition-opacity"
                            title="Open C++ reference"
                          >
                            <Cpu size={14} />
                          </a>
                        )}
                        {snippet.title}
                      </div>
                      <span className="rounded-md border border-border-primary bg-surface-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                        {snippet.language}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopySnippet(snippet)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border-primary bg-surface-primary px-2.5 py-1 text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-tertiary"
                    >
                      {isCopied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <p className="mb-3 text-sm text-text-secondary">{snippet.description}</p>

                  <div className="overflow-hidden rounded-lg border border-[#3d4f69] bg-[#1f2633] shadow-inner">
                    <div className="overflow-x-auto p-0">
                      <pre className="min-w-full p-0 text-xs leading-6 text-[#d7deea] font-mono">
                        <code>
                          {lines.map((line, lineIndex) => (
                            <div key={`${snippet.id}-${lineIndex}`} className="grid grid-cols-[44px_1fr]">
                              <span className="select-none border-r border-[#334260] bg-[#242f42] px-2 py-0.5 text-right text-[10px] text-[#7d8fa6]">
                                {String(lineIndex + 1).padStart(2, '0')}
                              </span>
                              <span className="px-3 py-0.5 whitespace-pre">{line || ' '}</span>
                            </div>
                          ))}
                        </code>
                      </pre>
                    </div>
                  </div>
                </motion.article>
              );
            })}

            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: 0.16 }}
              className="rounded-xl border border-border-primary bg-surface-secondary p-4 shadow-sm lg:col-span-2"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h5 className="text-sm font-bold text-text-primary">Multi-language API Examples</h5>
                  <p className="text-xs text-text-secondary">Choose a language icon to preview the integration snippet.</p>
                </div>
                <button
                  onClick={() => handleCopySnippet(selectedLanguageSnippet)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border-primary bg-surface-primary px-2.5 py-1 text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-tertiary"
                >
                  {copiedSnippet === selectedLanguageSnippet.id ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                  {copiedSnippet === selectedLanguageSnippet.id ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {languageSnippets.map((snippet) => {
                  const isActive = snippet.id === activeLanguage;

                  return (
                    <button
                      key={snippet.id}
                      onClick={() => setActiveLanguage(snippet.id)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? 'border-primary-500 bg-primary-500/10 text-text-primary shadow-sm'
                          : 'border-border-primary bg-surface-primary text-text-secondary hover:bg-surface-tertiary'
                      }`}
                      title={`Show ${snippet.label} example`}
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface-tertiary text-[10px] font-bold">
                        {snippet.iconLabel}
                      </span>
                      {snippet.label}
                    </button>
                  );
                })}
              </div>

              <p className="mb-3 min-h-[2.5rem] text-sm text-text-secondary">{selectedLanguageSnippet.description}</p>

              <div className="overflow-hidden rounded-lg border border-[#3d4f69] bg-[#1f2633] shadow-inner">
                <div className="flex items-center justify-between border-b border-[#334260] bg-[#242f42] px-3 py-2">
                  <span className="text-xs font-semibold text-[#c4d7e8]">client_example.{selectedLanguageSnippet.language}</span>
                  <span className="rounded-md bg-[#1f2633] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#9aacbf]">
                    {selectedLanguageSnippet.language}
                  </span>
                </div>
                <div className="h-80 overflow-x-auto overflow-y-scroll p-0">
                  <pre className="min-w-max p-0 text-xs leading-6 text-[#d7deea] font-mono">
                    <code>
                      {selectedLanguageSnippet.code.split('\n').map((line, lineIndex) => (
                        <div key={`${selectedLanguageSnippet.id}-${lineIndex}`} className="grid grid-cols-[44px_1fr]">
                          <span className="select-none border-r border-[#334260] bg-[#242f42] px-2 py-0.5 text-right text-[10px] text-[#7d8fa6]">
                            {String(lineIndex + 1).padStart(2, '0')}
                          </span>
                          <span className="px-3 py-0.5 whitespace-pre">{line || ' '}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        {!isAuthenticated && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="mt-10 rounded-2xl border border-border-primary bg-gradient-to-r from-surface-primary to-surface-secondary p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-xl font-bold">Access the full operational dashboard</h4>
                <p className="mt-1 text-sm text-text-secondary">Unlock device controls, private assets, alerts, and admin workflows.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-border-primary px-4 py-2 text-sm font-semibold text-text-primary hover:bg-surface-tertiary transition-colors"
                >
                  <LogIn size={15} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  Create account
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
};
