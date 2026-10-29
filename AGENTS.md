# Project Architecture Rules

- Keep public-page sections in normal vertical document flow; do not use pinned full-viewport scroll timelines because touch and trackpad navigation must remain native across devices.
- vite.config.ts injects the public Lovable Cloud URL/publishable key when the build has no .env; keep it, because .env is git-ignored and the publish build otherwise ships without a backend (sign-in breaks).
