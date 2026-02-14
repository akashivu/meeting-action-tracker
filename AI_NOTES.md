# AI Notes

AI tools were used as development assistants, not as code generators.

Usage included:
- brainstorming API structure
- refining prompt design for structured extraction
- debugging integration issues
- generating UI scaffolding ideas

All core logic decisions were implemented and verified manually:
- database schema design
- CRUD endpoints
- transcript history storage
- status health checks
- LLM response validation and JSON parsing
- frontend state synchronization

The LLM is used only for extracting action items from transcripts.
All task management operations are deterministic backend logic.

LLM Provider:
Groq (Llama-3.1-8b-instant)

Reason:
Fast inference, predictable JSON output, and simple integration for extraction tasks.
