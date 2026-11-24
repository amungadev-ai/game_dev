# Mobile art pipeline — proposed validation plan
Target stylized realism: believable materials and proportions, expressive characters, warm Mediterranean-inspired original world. Not photorealism. All names and visual identity original or properly licensed.
## Workflow
Concept sheets -> Blender model -> UV and texture bake -> rig/skin -> animation -> export GLB -> validate on desktop -> import into Expo GL -> physical-device profiling -> review and commit. Store source .blend and exported assets separately; use Git LFS only after confirming quotas. Maintain manifest with asset ID, creator/tool, source URL, license, attribution, generation provenance, version and review. No ripped assets.
## First spike
One Seeker with idle/walk/jump clips and one sandstone arch. Start with uncompressed GLB, embedded PNG/JPEG textures, simple metallic-roughness materials, no Draco/KTX2 until native decoding validated. Test Metro asset resolution, expo-asset URI, binary loading, GLTFLoader from three/examples/jsm/loaders/GLTFLoader.js, texture decode compatibility and AnimationMixer. Browser APIs may be missing in React Native; isolate adapter, keep procedural fallback. Do not assume standard browser loader works unchanged.
## Initial budgets (hypotheses)
Hero 5k–12k triangles, NPC 3k–8k, prop 300–3k, hero texture atlas 1024px, small props 256–512px, limited materials. Start with <=100k visible triangles and <=100 draw calls, tune using actual device measurements. 30 FPS sustained minimum target, 60 stretch. No expensive realtime shadows or postprocessing by default. Bake AO/light detail; use instancing for repeated props, LOD and culling as needed.
## Acceptance
Load asset offline from bundle, no blank scene, correct scale/orientation, animation clips play, textures correct, collision unchanged, solo and LAN work, fallback on load failure, 10-minute device test with FPS/frame-time and heat observations. Compare against procedural baseline. Record exact device and build. If loader fails, test geometry-only asset then texture pipeline; if rendering ceiling persists evaluate WebGL2/native engine without replacing shared game rules.
## Milestones
A: one imported prop and rigged Seeker; B: modular Lantern Quay kit and terrain; C: Waylamp/Pip and effects; D: art polish and cooperative chamber. These are planned, not completed.
