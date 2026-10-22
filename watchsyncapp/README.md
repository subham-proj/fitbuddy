# FitBuddy Watch Sync (Amazfit GTS 4 Mini → FitBuddy backend)

A Zepp OS **1.0** mini-app that reads health sensors on an Amazfit GTS 4 Mini and
pushes them to the FitBuddy backend over the phone's data connection.

```
Watch (device app, reads hmSensor) --BLE--> Zepp phone app (side service) --HTTPS--> FitBuddy server --> MongoDB (fitbuddy) --> web app
```

Metrics synced: **steps, calories, heart rate, sleep, stress, SpO2**.

This folder contains **only** the watch app. Storing and serving data is the job
of the existing `../server` (Express + Mongoose), which reads and writes the same
`fitbuddy` MongoDB the rest of the app uses.

## Layout

```
watchsyncapp/
├── app.json              # app id, six health permissions, GTS 4 Mini target (336×384)
├── app.js                # creates the BLE MessageBuilder
├── pages/index.js        # device page: collect sensors → send SYNC → show status
├── app-side/
│   ├── index.js          # phone service: read settings → POST to backend
│   └── config.js         # fallback defaults only (leave blank in production)
├── setting/index.js      # Zepp app settings screen: enter backend URL + API key
└── shared/               # official Zepp messaging helpers (do not hand-edit)
```

## Configuration (no secrets in source)

The backend URL and API key are entered in the **Zepp phone app → FitBuddy Sync →
Settings**, and read at runtime via `settings.settingsStorage`. Nothing secret is
committed. `app-side/config.js` holds only blank fallbacks for the simulator.

- **Backend URL** — your server's HTTPS origin, e.g. `https://api.yourdomain.com`
  (plain HTTP is rejected by the companion `fetch`).
- **API key** — must equal `WATCH_KEY` in `server/.env`.

If either is missing, the watch shows **"Set up in Zepp app"** instead of failing silently.

## Zepp OS 1.0 constraints

- API_LEVEL **1.0** only — no `@zos/*` imports or 2.0 APIs; they won't run on this watch.
- **No background service.** Sync happens only while the app is open and the phone is
  connected. The backend upserts, so re-opening never creates duplicates.
- Sensors expose **today's** data only (plus last night's sleep). No history backfill.
- Fields confirmed against the v1.0 docs: HEART `today` is a **property** (per-minute
  bpm array), SPO2 `hourAvgofDay` is 24 hourly averages, STRESS (only `current`/`time`)
  may be unavailable on this model — every read is guarded, so a missing sensor can't
  break the sync.

## Backend (wired into ../server)

Shares the server's single Mongoose connection → same `fitbuddy` database.

| Route | Auth | Limit | Purpose |
|-------|------|-------|---------|
| `POST /api/watch/sync`        | `x-api-key` | 10/min | Upsert one `daily_metrics` doc per user per day |
| `GET  /api/metrics?from=&to=` | same-origin | 300/15min | Lean list for the dashboard (per-minute arrays omitted) |
| `GET  /api/metrics/:date`     | same-origin | 300/15min | Full single day incl. per-minute HR for charts |

Production hardening applied to the server:

- **helmet** security headers; **1 MB** body cap (→ 413 on oversized payloads).
- Rate limiting: tight on the public write endpoint, general safety-net elsewhere.
- **Payload validation/sanitization**: bad `date` → 400; arrays hard-capped
  (`heartRate.today` ≤ 1440, `spo2.hourAvgofDay` ≤ 24, sleep arrays bounded);
  values coerced to numbers; unknown keys dropped — a hostile payload can't bloat Mongo.
- **Fail-fast config check** at startup: refuses to boot in production with a missing,
  short, or placeholder `WATCH_KEY`.
- `trust proxy` enabled in production so client IPs (for rate limiting) are correct
  behind a reverse proxy.

Environment (`server/.env`, see `server/.env.example`):

```
WATCH_KEY=<32-byte random hex; must match the API key entered in the Zepp app>
OWNER_USER_ID=owner   # single-user: all syncs attributed to this id
```

Generate a strong key with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### A note on read auth

`/api/metrics` is served same-origin and unauthenticated, matching the rest of this
single-user, no-login app (e.g. `/api/workouts`). It exposes personal health data, so
if you ever put it on the public internet or go multi-user:

- Short term: put the whole site behind reverse-proxy HTTP basic auth (covers `/metrics`
  too) — a one-line nginx/Caddy directive.
- Long term: add real user auth (session/JWT) and scope `/metrics` to the logged-in user.

## Install on the watch (needs your hardware + Zepp account)

1. Install the CLI: `npm i -g @zeppos/zeus-cli`
2. The app id is already set in `app.json` (`app.appId`). If you re-register at
   <https://console.zepp.com>, update it there.
3. Enable Developer Mode in the Zepp app: Profile → Settings → About → tap the Zepp
   logo 7 times.
4. From this folder: `zeus dev` (simulator, mock sensors) then `zeus preview` (QR code →
   scan in the Zepp app → installs on the watch).
5. On the phone: Zepp app → FitBuddy Sync → Settings → enter **Backend URL** + **API key**.
6. Open the app on the watch → it should show **"Synced ✓"**.

## Verify

- Backend (automated checks already pass): sync is idempotent (two syncs → one doc);
  wrong/no key → 401; bad `date` → 400; oversized body → 413; >10 syncs/min → 429;
  arrays are clamped; `/api/metrics` returns the day with an avg/min/max HR summary.
- Simulator: page shows **"Synced ✓"** and the backend receives the payload.
- Real watch: open app → "Synced ✓" → metrics present in MongoDB (sleep may be empty
  before the first night).
- Turn off phone Bluetooth → page shows **"Phone not connected"** without crashing.

## Pitfalls

- Using 2.0+ docs/imports on a 1.0 device → app won't install.
- Missing permission in `app.json` → sensor returns undefined.
- Forgetting `sleep.updateInfo()` → stale sleep data (the page calls it before reading).
- Non-HTTPS backend URL → `fetch` fails on the phone.
- Expecting background sync → not possible on Zepp OS 1.0.
