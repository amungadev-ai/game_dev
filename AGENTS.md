# AI Engineering Instructions — Treasure Hunt

## Mission and authority

Build a globally ambitious, original, family-trusted, entertainment-first adventure franchise. The founder makes final product, creative, ethical, and release decisions. Do not substitute AI output for gameplay testing or human review.

## Game invariants

1. Signature player verb: **UNCOVER**. Primary loop: explore → investigate → challenge → discover → develop → unlock.
2. **Living Treasure** changes the world and creates possibilities; it must not be reduced to collectibles in an inventory.
3. The home world is a meaningful explorable setting, alongside biblically grounded realms and original value-inspired realms. Working world terms may change.
4. Support solo play and multiplayer from the architecture stage. Co-op should give participants meaningful contributions; solo equivalents must exist for main progression.
5. Never make divine figures controllable, purchasable, collectible, or combat units. Clearly distinguish Scripture, history, and fiction; review any depictions and translation rights.
6. Child safety by design: avoid unrestricted stranger chat/voice, unreviewed child-facing AI, unnecessary personal data, or unsafe social defaults.
7. Monetization must not include pay-to-win, paid random loot boxes, child-targeted advertising, punitive streaks, or pressure selling.
8. Mobile usability and performance are first-class; design with low/mid-range Android devices and variable connectivity in mind.

## Engineering

- Prefer **TypeScript** shared between mobile and server.
- Begin with Expo/React Native, but treat 3D rendering feasibility as an explicit hypothesis; test before expanding architectural dependencies.
- Keep gameplay rules, network protocol, content and renderer modular.
- Use authoritative state and server validation for multiplayer; do not trust mobile clients with shared rewards or persistent multiplayer progression.
- Local multiplayer experiments are permitted; public matchmaking, social features, cloud accounts, and VPS deployment are out of scope until reviewed.
- Favor incremental vertical slices and hand-authored test interactions before building abstract content engines.
- Add focused automated tests and useful error handling. Target readable, documented code over cleverness.
- Never invent performance numbers, approvals, security guarantees, or successful test runs.

## AI working practices

- Before implementation: describe goal, acceptance criteria, dependencies and risks in the PR.
- Keep changes small and reviewable. Do not silently change locked game principles.
- Security: no secrets, personal tokens, server IPs requiring confidentiality, or child data in code/docs/logs.
- Do not commit generated build products, large model assets, node_modules, or local environment files.
- Document architecture decisions in `docs/decisions/`.
- Note work not tested and limitations explicitly.
- Do not deploy to Contabo without founder approval.

## First experiments

- A — Forgotten Wall: a newly acquired Waylamp retroactively reveals a secret in a familiar space.
- B — Chamber of Two: two clients complement each other in a shared puzzle, with a solo equivalent.
- C — Living Sanctuary: display discoveries and nurture a seed; verify that players care about ownership.

Theoretical targets are provisional. Test with appropriate consent/assent and do not overinterpret small samples.
