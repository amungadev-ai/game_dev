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

- Founder confirmed sandstone arch is in place on device after 1927eed / 5fe0f16. Multi-node GLB geometry and visible architecture validated by report. FPS, collision/discovery regression, external files and textures not separately confirmed. Next: texture/material compatibility spike. No additional expenditure.

- Texture spike: stoneTexture.ts creates deterministic 128x128 RGBA DataTexture; courtyard applies tiled floor map and arch face-projected UVs, shared arch map, texture disposal. No external image decoding, normal maps or file imports tested. Status indicates assignment only; visual confirmation and FPS needed. No dependencies or expenditure. Compile/device validation pending.

- Texture run reported EXGL unsupported pixelStorei warnings; visible texture quality and FPS not confirmed. Retain warnings. Extracted arch into standalone bundled JSON model package (glTF metadata + base64 binary), reconstructed GLB in loader; geometry unchanged. This is asset/code separation, not direct .glb file or Blender import validation. GitHub text-file connector used; next add native binary asset import and artist-authored models. Device/typecheck pending; zero expenditure.

- Native GLB batch: committed actual 4932-byte GLB binary (54a8bd3), Metro glb extension, Expo Asset + File arrayBuffer reader with header checks, native-first parser and logged JSON fallback. Requires local SDK-compatible dependency installation: cd apps/mobile; npx expo install expo-asset expo-file-system; commit package manifest and lockfile after testing. No dependency versions guessed. Native source must be confirmed by Metro log; no device or compile validation yet. Geometry only; external textures and animation pending. No additional expenditure.

- Native GLB bundling failed resolving ./assets/lantern-quay-arch.glb. Verified binary exists in remote tree. Added root Metro config registering glb alongside mobile config; root bundle path suggests root configuration may be active. Restart with explicit --clear; verify local binary and native source log. Root cause not yet confirmed.

- Founder confirmed Android bundle success after root Metro config fix e3c9ece: 757 modules, LOG GLB SOURCE: native binary asset, screen GLB: arch + textures assigned. Native binary loading and parser success validated. EXGL pixelStorei warnings remain; visual texture quality and FPS not confirmed. Local Expo dependency manifest/lockfile still need committing; next validate artist-authored models and embedded textures. No additional expenditure.

- Lantern Quay visual batch: quayScenery.ts adds static sea plane, island silhouettes, quay edging, jetty, harbor houses and layered trees beyond walkable bounds using shared geometry/materials. Courtyard integrates warmer light and replaces old boundary trees. nativeModel.ts exposes reusable module-ID GLB reader. No changes to gameplay rules/network. Procedural scenery only; no artist assets, texture decoding, rigging or animated water. Compile/device/FPS validation pending. No expenditure.

- Seeker batch: separate seeker.ts factory, rounded anatomy, face/hair, tunic, belt/buckle, backpack straps, boots and blended procedural gait/idle torso breathing. Local and remote avatars share factory; network and collision rules unchanged. Still procedural rigid parts, not skinned GLB or skeletal animation. Increased mesh count may affect FPS; compile/device and two-device validation pending, as is previous scenery validation. No additional expenditure.

- Rig spike: rigSpike.ts builds original in-memory GLB strip with two joints, inverse bind matrices, skin weights and Bend quaternion animation; validates SkinnedMesh and clip, plays mixer beside forgotten wall. Existing Seeker unchanged. This is a deforming test strip, not a humanoid character or artist-authored rig. Check RIG log and visible bending, FPS, typecheck. Device validation pending; zero expenditure.
