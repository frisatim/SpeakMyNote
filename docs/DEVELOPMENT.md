# DEVELOPMENT.md — running the project locally

Windows-friendly commands. Everything below also works in WSL2, macOS and
Linux. Run all `npm` commands from the repository root unless stated.

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | **24 LTS** (22.12+ works) | `.nvmrc` says `24`. Node 20 is end-of-life and Vitest 5 refuses it. |
| npm | 11+ (bundled with Node 24) | npm 10.8 has a workspace resolution bug (`Cannot read properties of null (reading 'edgesOut')`). |
| Expo Go | current store version | On the phone, for milestones 1–4. Native modules later require a development build. |
| Git | any recent | |

On Windows, install Node with the official installer or `nvm-windows`
(`nvm install 24`, `nvm use 24`). In WSL2 use `nvm install 24 && nvm use 24`.

## First install

```powershell
git clone https://github.com/frisatim/SpeakMyNote.git
cd SpeakMyNote
npm install
```

One lockfile at the root (`package-lock.json`) covers `apps/mobile`,
`apps/api` and `packages/contracts`. Never run `npm install` inside a
workspace folder with a different package manager.

## Configuration

```powershell
copy apps\api\.env.example apps\api\.env
copy apps\mobile\.env.example apps\mobile\.env
```

- `apps/api/.env` — private. Keep `PROVIDER_MODE=mock` until milestone 3; no
  keys are needed in mock mode. In live mode every key and model ID is
  required and the server refuses to start otherwise.
- `apps/mobile/.env` — public values only. Set `EXPO_PUBLIC_API_URL` to the
  address your phone can reach (see below). Every `EXPO_PUBLIC_*` value ends
  up in the app bundle: never put a provider key there.

Both `.env` files are git-ignored.

## Start the API

```powershell
npm run api
```

This runs `tsx watch` on `apps/api/src/server.ts` and listens on
`http://0.0.0.0:3000` (all interfaces, so a phone on the LAN can connect).
Check it:

```powershell
curl http://localhost:3000/health
```

Expected: `{"status":"ok","service":"speak-my-notes-api","version":"0.1.0","provider_mode":"mock",...}`.
The log prints a warning when mock providers are active.

Useful startup behaviours:

- `NODE_ENV=production` with `PROVIDER_MODE=mock` → refuses to start
  (exit 1) unless `ALLOW_MOCK_PROVIDERS_IN_PRODUCTION=true`.
- `PROVIDER_MODE=live` with a missing key or model ID → refuses to start and
  lists the missing variables (values are never printed).

## Start the mobile app

In a second terminal:

```powershell
npm run mobile
```

Then press `a` for an Android emulator, or scan the QR code with Expo Go on
a physical phone. The home screen shows the configured API URL and calls
`/health`; it says **Connected** with the provider mode, or **Not reachable**
with a structured error.

Other useful commands (from the root):

```powershell
npm run typecheck      # tsc --noEmit in every workspace
npm run lint           # eslint .
npm test               # vitest in apps/api and packages/contracts
npm run check          # all three
npm run export:android --workspace apps/mobile   # bundle without a device
```

## How a physical phone reaches the local API

A phone cannot use `localhost`: that would be the phone itself.

1. Put the phone and the PC on the **same Wi-Fi network**.
2. Find the PC's LAN address: `ipconfig` on Windows (IPv4 address of the
   Wi-Fi adapter, for example `192.168.1.20`); `ip addr` or `hostname -I` on
   Linux/macOS.
3. Set `EXPO_PUBLIC_API_URL=http://192.168.1.20:3000` in
   `apps/mobile/.env` and restart `npm run mobile` (Expo reads `.env` at
   start).
4. Allow Node.js through the Windows firewall for private networks the first
   time Windows asks, or add an inbound rule for TCP 3000.
5. Test from the phone's browser first: open `http://192.168.1.20:3000/health`.

Special cases:

- **WSL2.** The API runs inside WSL2 whose network is separate from Windows.
  Either run the API from a Windows terminal, or use the *mirrored* WSL2
  networking mode (`networkingMode=mirrored` in `.wslconfig`, Windows 11), or
  forward the port: `netsh interface portproxy add v4tov4 listenport=3000
  connectaddress=<WSL IP> connectport=3000` in an elevated PowerShell.
- **Android emulator.** Use `http://10.0.2.2:3000` (the emulator's alias for
  the host).
- **Phone and PC on different networks.** Use an HTTPS tunnel
  (`npx expo start --tunnel` for Metro; for the API a tool such as
  `cloudflared tunnel --url http://localhost:3000` or `ngrok http 3000`) and put
  the tunnel URL in `EXPO_PUBLIC_API_URL`. Never disable TLS verification in
  the app to make a test pass.

The beta build (milestone 9) points to the hosted API; neither this PC nor
Metro needs to stay on for testers.

## Repository layout

```
apps/mobile/            Expo app (Expo Router, TypeScript strict)
  app/                  routes (file-based)
  src/lib/              config (public env), API client
apps/api/               Fastify API
  src/config.ts         environment validation (Zod)
  src/errors.ts         AppError -> { code, message, retryable, request_id }
  src/providers/        extractLesson / generateTutorTurn / evaluateSession / transcribeAudio
  src/routes/           /health (more routes in later milestones)
  test/                 Vitest
packages/contracts/     shared Zod schemas: languages, API error, health, limits
.github/workflows/ci.yml  typecheck, lint, test, API health smoke, Android bundle
```

## Known development quirks

- First API start on a Windows-mounted path under WSL2 (`/mnt/c/...`) can
  take 15–20 s because of slow file access. `C:\dev\...` cloned inside WSL2's
  own file system is much faster.
- `npm install` prints an `install-scripts` warning about `esbuild`'s
  postinstall being blocked by npm 11+. It is harmless: esbuild ships its
  binary as an optional dependency and works without the script.
