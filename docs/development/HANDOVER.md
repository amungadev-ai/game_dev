# Treasure Hunt — Agent handover
Updated 2026-11-24. Read AGENTS.md, ROADMAP.md and docs/decisions before editing.
## Repository and workflow
Main contains validated Expo foundation and primitive solo courtyard (PR 2 merged at 98820e39). Active branch feature/local-multiplayer, PR 3. Do not merge until integrated checks pass. Founder pulls and tests on physical Android; agents commit focused changes and document evidence. Never claim tests passed without output. Preserve lockfile and local changes. VPS deferred; trusted LAN only.
## Product
Christian adventure franchise, children first, entertainment first, UNCOVER signature verb. Meridian Isles, Lantern Quay, Waylamp, Meridian Fragment, Pip, Living Sanctuary. Solo equivalent progression, co-op foundational. No public stranger chat, paid advantages or manipulative monetization. Working names pending clearance.
## Stack
npm workspaces; Expo SDK 58, RN 0.88.1, React 19.3, TS, expo-gl 58.0.4, Three 0.162.0 exact. Direct WebGL renderer canvas adapter. Do not reinstall expo-three 8: it requires Three ^0.166 and caused duplicate Three instances and WebGL1 rejection. r163+ removed WebGL1. This pin is a prototype constraint, not final architecture.
## Run
From repository root: npm install; npm test; npm run typecheck; npm start. Separate terminal: node servers/multiplayer/server.mjs. Both phones on trusted Wi-Fi; enter laptop IPv4, port 2567. No public exposure. Windows private firewall only. Laptop Toshiba Windows 10, 12 GB RAM; Samsung A16 physical test, no emulator required.
## Code map
apps/mobile/App.tsx menu and session collection; Courtyard.tsx renderer, movement, joystick, treasure, procedural avatar/Pip, solo visual jump; lan.ts polling client; Sanctuary.tsx static 3D display; packages/game-core/courtyard.mjs shared movement/collision/discovery; servers/multiplayer/server.mjs authoritative LAN spike.
## Evidence and gaps
Founder confirmed initial solo render smooth, reported 90 FPS; two devices connected, second reported 60 FPS, smooth movement and no noticeable delay. No instrumented latency or sustained load evidence. Shared reveal, remote visibility and disconnect not explicitly confirmed. Later avatar, interpolation, jump, Pip, inventory and sanctuary commits not explicitly device-tested. Jump visual only, solo only; collection session-only, saved on courtyard back button. LAN HTTP polling 50ms plus RTT, no auth/TLS/reconnect, no durable rewards. Shared reveal currently also drives fragment display; entitlement policy needs review. Do not deploy publicly.
## Next gate
Run tests/typecheck and integrated two-device acceptance before further merge. Then imported GLB asset spike with one rigged character and one modular prop; measure loading, memory, frame time, heat and fallback. Persistent local collection and cooperative chamber remain pending. Production networking evaluation (Colyseus or equivalent) remains open.
## Handover rule
Every change updates development log with commit, files, rationale, commands, actual results, known issues and next action. Record decisions separately. Keep credentials and child data out of repository.

## Latest asset spike
apps/mobile/assetSpike.ts constructs an original geometry-only GLB in memory and parses via GLTFLoader. Courtyard displays a triangular plaque and loader status. This tests binary parsing only, not bundled files, texture decoding or rigged animation. No paid tools approved. Device validation pending; next gate is GLB: loaded and visible plaque, then actual modular arch and rigged model.

## GLB validation update
Founder confirmed GLB: loaded after commit 9c660e9. GLTFParser constructor previously threw indexOf of undefined on Hermes; guarded navigator.userAgent adapter resolved reported failure. Keep Three r162 and adapter. Geometry-only loading validated; actual bundled assets, textures, rigging and performance remain unvalidated.

- Architecture spike: original in-memory GLB sandstone arch, shared cube geometry with normals, 27 masonry nodes and three material colors; placed in front of existing wall, collision unchanged. No external file, textures or carved mesh detail yet. Test GLB: arch loaded, visible arch, discovery and FPS. Compile/device validation pending. No expenditure.
