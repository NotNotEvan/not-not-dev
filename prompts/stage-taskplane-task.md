---
description: Stage implementation-ready work into a Taskplane task packet
argument-hint: "<request>"
---
Do not implement this inline yet.

Instead, use the `create-taskplane-task` skill and stage this as Taskplane work:

$@

Requirements:
- make the packet implementation-ready, not vague
- include exact scope, owned files, constraints, risks, and validation
- call out docs/bootstrap/package updates when they are part of the acceptance criteria
- mention which repo packages or extensions matter, if any (`pi-subagents`, Taskplane, `context-mode`, `guardrails`, `context-radar`, `openrouter`)
- if clarification is still needed, gather context first and ask the focused questions before writing the task packet

The final result should be a Taskplane-ready prompt/status packet suitable for later `/orch` execution.
