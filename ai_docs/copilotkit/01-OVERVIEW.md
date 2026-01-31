# CopilotKit Overview

## What is CopilotKit?

CopilotKit is an open-source framework for building **agent-native applications** with:
- **Generative UI** - AI generates interactive React components, not just text
- **Shared State** - Bi-directional sync between your app and AI
- **Human-in-the-Loop** - Users can guide, approve, or modify AI actions

## What is Generative UI?

Traditional AI chat returns **text**. Generative UI returns **interactive components**.

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRADITIONAL AI CHAT                          │
├─────────────────────────────────────────────────────────────────┤
│  User: "Show me the weather"                                    │
│  AI:   "The weather in NYC is 72°F and sunny."                 │
│                        ↓                                        │
│              Just text - user reads it                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    GENERATIVE UI                                │
├─────────────────────────────────────────────────────────────────┤
│  User: "Show me the weather"                                    │
│  AI:   ┌──────────────────────────┐                            │
│        │ 🌤️ New York City         │                            │
│        │ 72°F  Sunny              │                            │
│        │ [See Forecast] [Share]   │  ← Interactive component   │
│        └──────────────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

## The Three Types of Generative UI

### 1. Static Generative UI
Developer pre-defines the UI for each action. AI triggers it but doesn't control layout.

```tsx
useCopilotAction({
  name: "showWeather",
  render: ({ args }) => <WeatherCard city={args.city} />  // Fixed component
});
```

### 2. Declarative Generative UI
AI returns structured JSON spec (A2UI, Open-JSON-UI). Frontend interprets and renders.

```json
{
  "type": "card",
  "title": "Weather",
  "content": [
    { "type": "text", "value": "72°F" },
    { "type": "button", "label": "See Forecast" }
  ]
}
```

### 3. Open-Ended Generative UI
AI has full control over UI generation. Maximum flexibility, requires guardrails.

## Key Concepts

### AG-UI Protocol
Open standard for agent-frontend communication. Features:
- Event-driven streaming
- Bi-directional state sync
- Framework agnostic (works with LangGraph, Mastra, etc.)

### CoAgents
Multi-agent orchestration with real-time state streaming. Your frontend sees everything the agent does as it works.

### Copilot Cloud
Hosted infrastructure that handles:
- LLM routing and management
- Rate limiting and caching
- Analytics and monitoring

## Why CopilotKit vs. Raw AI SDK?

| Feature | Raw Vercel AI SDK | CopilotKit |
|---------|-------------------|------------|
| Text streaming | ✅ | ✅ |
| App state awareness | ❌ Manual | ✅ Built-in |
| AI-triggered actions | ❌ Manual | ✅ `useCopilotAction` |
| Generative UI | ❌ | ✅ |
| Multi-agent support | ❌ | ✅ CoAgents |
| Pre-built chat UI | ❌ | ✅ Popup, Sidebar, etc. |

## Our Implementation

We tested CopilotKit at `/copilot-test` with:
1. **useCopilotReadable** - AI can see counter value and user text
2. **useCopilotAction** - AI can increment counter and enhance text
3. **Generative UI** - Custom loading/success components render in chat

See: `src/app/copilot-test/page.tsx`
