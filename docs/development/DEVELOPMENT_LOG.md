# Development log
Historical reconstruction from conversation and repository; not a substitute for test output.
- Sprint 1: Expo workspace, discovery state and tests. Android app and buttons confirmed. PR 1 merged ceab8c65.
- Sprint 2: courtyard, movement/collision, lamp and wall. Initial WebGL1 error with Three >=163. Downgrade alone failed because expo-three 8 installed Three 0.166.1 alongside 0.162.0. Direct renderer and exact pin fixed issue. Commits 6c3627d, 9d93925; lockfile fbec409; PR 2 merged 98820e39. Founder reported smooth 90 FPS.
- Sprint 3: LAN server 0936a0d, client 8c6088b, renderer 19ce6d2, menu 8402f87. PR 3 open. Founder confirmed two devices connected; second 60 FPS, smooth, no noticeable delay. Shared discovery and disconnect checks outstanding.
- Sprint 4: 2b8700f procedural avatars, environment, remote interpolation; f188f3a Pip and solo visual jump; adb4669 session inventory; 35b7fa5 sanctuary room; 29ce41c collection transfer; ea45bda menu and session ownership. Compile/device results outstanding.
- 2026-11-24: handover and art pipeline documented. No new runtime code or device tests in this documentation change.

- GLB spike: 7f72c95 records zero additional spend; e676bfd adds original embedded geometry-only GLB fixture; courtyard integrates async loader, status and disposal. No texture, rig, external file or device validation yet. Run npm test/typecheck and check GLB: loaded on both devices. If failure record exact error; procedural scene remains.

- Device report: GLB TypeError cannot read property indexOf of undefined. Root cause unconfirmed. Normalize parser base path and fixture metadata; log full exception to Metro. Retest; if unresolved obtain stack before changing dependencies. No paid services.

- GLB metadata retry failed on device; Metro only showed expected WebGL1 deprecation warnings. Outer promise rejection now logs stack and opens selectable scrollable diagnostic overlay (v3). Await exact stack; root cause still unconfirmed. No dependency changes.

- Diagnostic v3 captured TypeError indexOf of undefined in GLTFParser constructor on Android Hermes. Leading hypothesis: missing navigator.userAgent in browser detection. Add guarded userAgent compatibility adapter before parse; preserve existing string and Three r162. Removed nonstandard buffer type field. Retest geometry fixture; texture support remains separate. Fix not yet validated.

- Founder confirmed GLB: loaded on Android after 9c660e9 userAgent adapter. Geometry-only binary parsing validated; plaque visibility, FPS, textures, external files and skeletal animation not separately confirmed. Next: bundled modular architecture asset and texture/animation validation. No additional expenditure.

- Architecture spike: original in-memory GLB sandstone arch, shared cube geometry with normals, 27 masonry nodes and three material colors; placed in front of existing wall, collision unchanged. No external file, textures or carved mesh detail yet. Test GLB: arch loaded, visible arch, discovery and FPS. Compile/device validation pending. No expenditure.
