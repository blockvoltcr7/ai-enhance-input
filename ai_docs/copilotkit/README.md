# CopilotKit Documentation

> Knowledge transfer documentation for implementing Generative UI with CopilotKit

## Quick Links

| Document | Description |
|----------|-------------|
| [01-OVERVIEW.md](./01-OVERVIEW.md) | What is CopilotKit? What is Generative UI? Key concepts. |
| [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) | System architecture, data flow, component hierarchy |
| [03-HOOKS-REFERENCE.md](./03-HOOKS-REFERENCE.md) | Complete API reference for all hooks with examples |
| [04-USE-CASES.md](./04-USE-CASES.md) | Practical use cases with implementation patterns |
| [05-QUICKSTART.md](./05-QUICKSTART.md) | Step-by-step setup guide for developers |
| [06-DIAGRAMS.md](./06-DIAGRAMS.md) | Visual diagrams (Mermaid) for presentations |

## TL;DR

**CopilotKit** lets you build AI-powered apps where the AI can:
1. **See** your app state (`useCopilotReadable`)
2. **Do** things in your app (`useCopilotAction`)
3. **Show** custom UI in the chat (`render` function = Generative UI)

## Our Implementation

We have a working prototype at `/copilot-test` that demonstrates:

```tsx
// AI can see the counter value
useCopilotReadable({
  description: 'Current counter value',
  value: counter.toString(),
});

// AI can increment the counter with custom UI
useCopilotAction({
  name: 'incrementCounter',
  description: 'Increment the counter',
  parameters: [{ name: 'amount', type: 'number', required: true }],
  render: ({ status, args }) => (
    <div className="custom-ui">
      {status === 'executing' ? 'Loading...' : `Added ${args.amount}!`}
    </div>
  ),
  handler: async ({ amount }) => {
    setCounter(prev => prev + amount);
  },
});
```

## Comparison: Our Approaches

| Feature | Vercel AI SDK (Sparkle) | CopilotKit |
|---------|------------------------|------------|
| Text streaming | ✅ | ✅ |
| Custom trigger (sparkle button) | ✅ | ❌ (chat-based) |
| App state awareness | ❌ Manual | ✅ Automatic |
| Generative UI | ❌ | ✅ |
| Pre-built chat UI | ❌ | ✅ |
| Multi-action support | ❌ | ✅ |

**Verdict:** Use Vercel AI SDK for targeted enhancements (sparkle button). Use CopilotKit for conversational AI with complex interactions.

## Reading Order for New Developers

1. **[01-OVERVIEW.md](./01-OVERVIEW.md)** - Understand the concepts (10 min)
2. **[05-QUICKSTART.md](./05-QUICKSTART.md)** - Get hands-on (15 min)
3. **[03-HOOKS-REFERENCE.md](./03-HOOKS-REFERENCE.md)** - Deep dive on APIs (20 min)
4. **[04-USE-CASES.md](./04-USE-CASES.md)** - Implementation ideas (15 min)
5. **[06-DIAGRAMS.md](./06-DIAGRAMS.md)** - Visual reference (5 min)

## Test It Yourself

```bash
# 1. Add your Copilot Cloud API key to .env.local
NEXT_PUBLIC_COPILOT_CLOUD_API_KEY=ck_pub_xxxxx

# 2. Run the dev server
npm run dev

# 3. Open the test page
open http://localhost:3001/copilot-test

# 4. Try these prompts:
#    - "What is the current counter value?"
#    - "Increment the counter by 5"
#    - Type some text, then: "Enhance my text"
```

## Key Files in This Project

```
src/
├── components/
│   └── Providers.tsx          # CopilotKit provider setup
└── app/
    └── copilot-test/
        └── page.tsx           # Working demo with all hooks
```

## Resources

- [CopilotKit Docs](https://docs.copilotkit.ai/)
- [CopilotKit GitHub](https://github.com/CopilotKit/CopilotKit)
- [Copilot Cloud Dashboard](https://cloud.copilotkit.ai)
- [AG-UI Protocol](https://docs.copilotkit.ai/ag-ui-protocol)

---

*Last updated: January 2026*
