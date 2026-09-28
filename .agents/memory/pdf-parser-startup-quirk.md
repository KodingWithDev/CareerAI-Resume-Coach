---
name: PDF parser startup quirk
description: A dependency behavior that can prevent the API server from starting.
---

The `pdf-parse` 1.1.1 package evaluates a bundled test fixture during module import in this workspace. If that package is imported by the API server, startup can fail with an `ENOENT` for `./test/data/05-versions-space.pdf`.

**Why:** A temporary resume-analysis implementation caused the API workflow to fail before serving requests because the dependency loaded its test fixture during module evaluation.

**How to apply:** Do not import this package into the API server without first verifying the exact installed package behavior and startup path; prefer a parser with a safe production import or an explicit isolated parsing process.