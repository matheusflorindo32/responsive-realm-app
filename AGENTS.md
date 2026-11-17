# Project Architecture Rules

- Keep public-page sections in normal vertical document flow; do not use pinned full-viewport scroll timelines because touch and trackpad navigation must remain native across devices.
- vite.config.ts injects the public Lovable Cloud URL/publishable key when the build has no .env; keep it, because .env is git-ignored and the publish build otherwise ships without a backend (sign-in breaks).
- MFA enrollment must preserve verified factors and require an aal2 session when one exists; this prevents setup from bypassing an existing second factor. Use the full factor list for pending TOTP cleanup.
- Scope Lenis wheel smoothing to the public home on fine-pointer, hover-capable devices without reduced motion; keep touch, small trackpad gestures, nested scrollers and other routes native, and destroy it on unmount to avoid navigation locks.
