# ADR 0001 — Expo-first, evidence-driven game client

Status: **Provisional / accepted for prototype evaluation**

## Context

The founding workstation is a Windows 10 Toshiba Tecra A50-A laptop with 12 GB RAM, Intel i5-4300M, and Intel HD Graphics 4600. The test handset is a Samsung Galaxy A16 4G. The founder favors React Native with Expo and has an Ubuntu VPS available for later use.

## Decision

- Begin with a TypeScript-based Expo app.
- Test renderer options, including Expo-compatible 3D, using a **real Android device** rather than treating desktop performance as representative.
- Separate game rules and network protocol from rendering.
- Plan an authoritative real-time multiplayer experiment from the beginning, using a local server before cloud deployment.
- Defer the Contabo VPS and production persistence.
- Do not commit to a renderer until performance, controls, platform compatibility, and game feel are demonstrated.

## Re-evaluation conditions

- Unacceptable frame pacing, heat, battery drain, loading, or input responsiveness.
- Unsupported required 3D features or impractical native integration.
- Excessive iteration friction compared with established mobile game-engine alternatives.

If needed, retain reusable TypeScript services and reassess a dedicated game engine or hybrid client. This is a design guardrail, not an assertion that React Native cannot make compelling games.

## Follow-up

Confirm current Expo SDK compatibility and select a supported Node LTS before scaffolding. Add measurable acceptance criteria to the first 3D PR.
