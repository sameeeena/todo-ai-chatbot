---
id: 4
title: ai-todo-chatbot-implement
stage: implement
date_iso: 2026-02-03
surface: agent
model: Claude Sonnet 4.5
feature: ai-todo-chatbot
branch: 1-ai-todo-chatbot
user: default_user
command: /sp.implement Read specification.md, plan.md, and tasks.md. Create a file named implement.md. This file must define STRICT implementation rules, including: 1. Coding principles (statelessness, separation of concerns) 2. What Claude is allowed to do 3. What Claude is NOT allowed to do 4. Rules for modifying files 5. Rules for adding new files 6. Rules for error handling 7. Rules for tool usage (MCP-only task operations) 8. Validation requirements after implementation Examples of constraints to include: - Do not add fields not defined in specification.md - Do not store state in memory - Do not bypass MCP tools - Do not mix frontend and backend logic Rules: - No code - This file acts as enforcement rules for all future coding
labels:
  - implementation
  - rules
  - constraints
  - ai-chatbot
files_yaml:
  - specs/1-ai-todo-chatbot/implement.md
tests_yaml:
  - Implementation rule validation
  - Constraint verification
links:
  spec: specs/1-ai-todo-chatbot/spec.md
  plan: specs/1-ai-todo-chatbot/plan.md
  tasks: specs/1-ai-todo-chatbot/tasks.md
  implement: specs/1-ai-todo-chatbot/implement.md
  ticket: null
  adr: null
  pr: null
outcome: Successfully created comprehensive implementation rules document with strict constraints covering coding principles, allowed/prohibited actions, file modification rules, error handling, MCP tool usage, and validation requirements.
evaluation: The implementation rules document covers all required areas with specific constraints and validation requirements. All examples from the prompt have been incorporated as constraints.
---

# Prompt History Record

## Summary of Work Completed

I successfully created the implementation rules document for the "AI-Powered Todo Chatbot (Phase III)" as requested. The implement.md file includes:

1. Coding principles (statelessness, separation of concerns)
2. What Claude is allowed to do
3. What Claude is NOT allowed to do
4. Rules for modifying files
5. Rules for adding new files
6. Rules for error handling
7. Rules for tool usage (MCP-only task operations)
8. Validation requirements after implementation

## Key Deliverables

- Implementation rules file: `specs/1-ai-todo-chatbot/implement.md`
- Contains comprehensive constraints and guidelines for all development work
- Incorporates all examples from the prompt: no adding undefined fields, no storing state in memory, no bypassing MCP tools, no mixing frontend and backend logic

## Validation

The implementation rules were validated against the requirements:
- All required areas covered (coding principles, allowed/prohibited actions, etc.)
- Specific constraints from the prompt have been incorporated
- No code was added, only rules and constraints
- Document acts as enforcement rules for all future coding

## Next Steps

The implementation rules are ready for use as a constraint document for all future development work on this feature.

PROMPT_TEXT: Read specification.md, plan.md, and tasks.md.

Create a file named implement.md.

This file must define STRICT implementation rules, including:
1. Coding principles (statelessness, separation of concerns)
2. What Claude is allowed to do
3. What Claude is NOT allowed to do
4. Rules for modifying files
5. Rules for adding new files
6. Rules for error handling
7. Rules for tool usage (MCP-only task operations)
8. Validation requirements after implementation

Examples of constraints to include:
- Do not add fields not defined in specification.md
- Do not store state in memory
- Do not bypass MCP tools
- Do not mix frontend and backend logic

Rules:
- No code
- This file acts as enforcement rules for all future coding

RESPONSE_TEXT: Successfully created comprehensive implementation rules document with strict constraints covering coding principles, allowed/prohibited actions, file modification rules, error handling, MCP tool usage, and validation requirements. All examples from the prompt have been incorporated as constraints.