# Contributing

Contributions are welcome. This is a small, focused repo — the goal is to keep it precise and useful, not comprehensive.

---

## What to Contribute

**Good contributions:**
- Corrections to CSS values that improve visual quality
- Additional layout patterns using the existing three tiers
- Bug fixes in the Three.js components
- Improvements to the `PROMPT.md` that produce better AI output
- Additional examples in `examples/`

**Out of scope:**
- New glass tiers (the three-tier system is intentional — adding tiers breaks the depth hierarchy)
- Color additions to the glass system (the grayscale constraint is the point)
- New dependencies beyond the existing stack
- Framework ports (React/Next.js is the reference stack)

---

## How to Report Issues

Open a GitHub issue with:
- What you were trying to build
- What you expected vs. what happened
- Browser and OS if it's a rendering issue

---

## How to Submit Changes

1. Fork the repo
2. Create a branch: `git checkout -b fix/your-change`
3. Make your change
4. Test it in a real Next.js project — visual changes especially
5. Open a pull request with a brief description of what changed and why

---

## Keeping the Skill in Sync

If you change any of the CSS values in `globals.css` or the component patterns in `components/`, update `liquid-glass-ui.md` to match. The skill file is the AI-executable version of this repo — drift between the two is confusing for users.

Same applies to `PROMPT.md` — if the canonical values change, the prompt should reflect them.

---

## No CLA, No Formality

MIT license. No contributor agreement required. Just open a PR.
