---
name: Gemini model availability
description: Direct Gemini API keys may have model availability that differs from general model catalogs.
---

Verify a model with a live request before treating it as configured. A direct API key can reject a generally known model as retired for new users, while the provider error identifies the replacement; transient 503 responses should remain client-safe and retryable.

**Why:** The API key rejected an older flash model with a provider-directed 404, then returned a transient high-demand 503 for the replacement.

**How to apply:** Keep model selection server-side, avoid exposing provider details, and distinguish configuration, temporary availability, and permanent request failures in routes.