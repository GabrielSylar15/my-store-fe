---
name: feedback-read-memory-first
description: Always read relevant memory files before starting a task, not just MEMORY.md index
metadata:
  type: feedback
---

Before implementing any feature, read the specific memory files that are relevant to the task — don't stop at the MEMORY.md index.

**Why:** User caught me skipping `feedback-vn-ecommerce-ux.md` when building the review modal. CLAUDE.md explicitly says "read any files relevant to the current task before proceeding."

**How to apply:** After reading MEMORY.md, scan the index and open any file whose description touches the current task domain (UX, colors, project context, etc.). For UI work this means always reading `design-color-system.md` and `feedback-vn-ecommerce-ux.md`.
