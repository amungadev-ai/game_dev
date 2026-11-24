# Treasure Hunt — Game Development

An original, mobile-first, adventure-game franchise in development. **Treasure Hunt** is a working product title.

## Product direction

- Entertainment-first exploration, mystery, discovery, ownership, and cooperative play.
- Children-first experience with thoughtful family participation.
- Christian-inspired worldview expressed through original adventures, with respectful and accurate treatment of biblical content.
- Accessible to players from different backgrounds.
- Ethical monetization; no pay-to-win or manipulative mechanics.
- Solo and multiplayer designed together, with real-time co-op tested early.

## Development approach

We are validating **Expo / React Native / TypeScript** as our initial client technology, including a practical 3D performance spike on an entry-to-midrange Android device. We will change the renderer or use a dedicated game engine if testing shows Expo-based 3D cannot meet gameplay needs. Network design will remain independent of the renderer.

The Contabo VPS is **deferred**. No cloud deployment or credentials are required for the initial phase.

## Next milestones

1. Establish reproducible client/tooling baseline and CI.
2. Run a simple Android app on a physical Samsung Galaxy A16 4G.
3. Validate 3D rendering, movement, camera, and device performance.
4. Build the first Living Treasure interaction (a lamp revealing a hidden route).
5. Validate authoritative multiplayer on a local development server with two clients.
6. Build the Forgotten Wall, Chamber of Two, and Living Sanctuary prototypes.

## Collaboration

- `main` should remain a stable baseline.
- Implement features on short-lived branches and open pull requests for review.
- Use `AGENTS.md` for repo-wide guidance and `docs/` for architecture decisions.
- Never commit credentials, private contact information, child playtest data, or proprietary unpublished research.
- Run tests and describe what was actually executed; never claim a physical-device test unless it happened.

## Local checkout

```powershell
cd C:\Development
git clone https://github.com/amungadev-ai/game_dev.git treasure-hunt
cd treasure-hunt
code .
```

This repository currently contains the initial project foundation, **not a runnable game**. Expo setup will follow in a separate change.
