# AI-Enhanced Input Field - Solution Architecture

## Overview

This document describes the architecture of the AI-Enhanced Input Field prototype, which allows users to improve their text input with a single click using AI assistance.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER (Client)                                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        EnhanceableTextarea.tsx                         │  │
│  │  ┌─────────────┐    ┌──────────────────┐    ┌───────────────────────┐ │  │
│  │  │  Textarea   │    │  Sparkle Button  │    │   useCompletion()     │ │  │
│  │  │             │    │       ✨          │    │   (Vercel AI SDK)     │ │  │
│  │  │  [value]    │◄───│   onClick ───────┼───►│                       │ │  │
│  │  │             │    │                  │    │  • complete()         │ │  │
│  │  └─────────────┘    └──────────────────┘    │  • isLoading          │ │  │
│  │        ▲                                     │  • completion         │ │  │
│  │        │                                     │  • onFinish callback  │ │  │
│  │        │                                     └───────────┬───────────┘ │  │
│  │        │                                                 │             │  │
│  │        └─────────────── setValue(completion) ────────────┘             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     │ HTTP POST (streaming)                  │
│                                     ▼                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ /api/enhance
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            NEXT.JS SERVER                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      /api/enhance/route.ts                             │  │
│  │                                                                        │  │
│  │   1. Receive { text, context }                                         │  │
│  │   2. Call streamText() with OpenAI model                               │  │
│  │   3. Return toTextStreamResponse()                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     │ API Request                            │
│                                     ▼                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            OPENAI API                                        │
│                                                                              │
│                         Model: gpt-4o-mini                                   │
│                                                                              │
│   • Receives system prompt (context about the task)                          │
│   • Receives user text to enhance                                            │
│   • Streams back enhanced text token by token                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Sequence

```
┌──────┐          ┌─────────────┐          ┌─────────────┐          ┌────────┐
│ User │          │  Component  │          │  API Route  │          │ OpenAI │
└──┬───┘          └──────┬──────┘          └──────┬──────┘          └───┬────┘
   │                     │                        │                     │
   │  1. Types text      │                        │                     │
   │────────────────────►│                        │                     │
   │                     │                        │                     │
   │  2. Clicks ✨        │                        │                     │
   │────────────────────►│                        │                     │
   │                     │                        │                     │
   │                     │  3. POST /api/enhance  │                     │
   │                     │  { text, context }     │                     │
   │                     │───────────────────────►│                     │
   │                     │                        │                     │
   │                     │                        │  4. streamText()    │
   │                     │                        │────────────────────►│
   │                     │                        │                     │
   │                     │                        │  5. Token stream    │
   │                     │                        │◄────────────────────│
   │                     │                        │     (streaming)     │
   │                     │                        │                     │
   │                     │  6. Text stream        │                     │
   │                     │◄───────────────────────│                     │
   │                     │     (streaming)        │                     │
   │                     │                        │                     │
   │                     │  7. onFinish()         │                     │
   │                     │  setValue(completion)  │                     │
   │                     │                        │                     │
   │  8. See enhanced    │                        │                     │
   │     text in input   │                        │                     │
   │◄────────────────────│                        │                     │
   │                     │                        │                     │
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              page.tsx                                    │
│                         (Server Component)                               │
│                                                                          │
│   • Renders the demo form layout                                         │
│   • Passes props to EnhanceableTextarea                                  │
│     - label: "Your Feedback"                                             │
│     - context: "This is quarterly performance feedback..."               │
│     - placeholder: "Write your rough feedback here..."                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Props
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      EnhanceableTextarea.tsx                             │
│                        (Client Component)                                │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                         State                                    │   │
│   │                                                                  │   │
│   │   • value: string           - Current textarea content           │   │
│   │   • previousValue: string   - Stored for undo functionality      │   │
│   │   • completion: string      - From useCompletion hook            │   │
│   │   • isLoading: boolean      - Loading state from hook            │   │
│   │   • error: Error | undefined                                     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     useCompletion Hook                           │   │
│   │                    (@ai-sdk/react)                               │   │
│   │                                                                  │   │
│   │   Config:                                                        │   │
│   │   • api: '/api/enhance'                                          │   │
│   │   • streamProtocol: 'text'  ◄── CRITICAL: Must match API         │   │
│   │                                                                  │   │
│   │   Returns:                                                       │   │
│   │   • complete(prompt, options) - Trigger API call                 │   │
│   │   • isLoading - Loading state                                    │   │
│   │   • completion - Streamed result                                 │   │
│   │   • error - Any errors                                           │   │
│   │                                                                  │   │
│   │   Callbacks:                                                     │   │
│   │   • onResponse(res) - When API responds                          │   │
│   │   • onFinish(prompt, completion) - When streaming completes      │   │
│   │   • onError(err) - On error                                      │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                        UI Elements                               │   │
│   │                                                                  │   │
│   │   ┌──────────────────────────────────────────────────────────┐  │   │
│   │   │  <textarea>                                               │  │   │
│   │   │    • value={value}                                        │  │   │
│   │   │    • disabled={isLoading}                                 │  │   │
│   │   │    • className includes shimmer-bg when loading           │  │   │
│   │   └──────────────────────────────────────────────────────────┘  │   │
│   │                                                                  │   │
│   │   ┌──────────────────┐    ┌──────────────────┐                  │   │
│   │   │  Sparkle Button  │    │   Undo Button    │                  │   │
│   │   │       ✨          │    │       ↶          │                  │   │
│   │   │                  │    │                  │                  │   │
│   │   │ onClick:         │    │ onClick:         │                  │   │
│   │   │ handleEnhance()  │    │ handleUndo()     │                  │   │
│   │   │                  │    │                  │                  │   │
│   │   │ Visible when:    │    │ Visible when:    │                  │   │
│   │   │ Always           │    │ previousValue    │                  │   │
│   │   │                  │    │ !== null         │                  │   │
│   │   └──────────────────┘    └──────────────────┘                  │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## API Route Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     /api/enhance/route.ts                                │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      Request Processing                          │   │
│   │                                                                  │   │
│   │   1. Extract { text, context } from request body                 │   │
│   │                                                                  │   │
│   │   Request Body Example:                                          │   │
│   │   {                                                              │   │
│   │     "prompt": "john did good work...",                           │   │
│   │     "text": "john did good work...",                             │   │
│   │     "context": "This is quarterly performance feedback..."       │   │
│   │   }                                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      streamText() Call                           │   │
│   │                     (Vercel AI SDK Core)                         │   │
│   │                                                                  │   │
│   │   streamText({                                                   │   │
│   │     model: openai('gpt-4o-mini'),                                │   │
│   │     system: `You are an expert writing assistant...`,            │   │
│   │     prompt: `Please enhance: ${text}`,                           │   │
│   │   })                                                             │   │
│   │                                                                  │   │
│   │   System Prompt includes:                                        │   │
│   │   • Role definition (writing assistant)                          │   │
│   │   • Context about the text type                                  │   │
│   │   • Guidelines (maintain intent, improve clarity, etc.)          │   │
│   │   • Instruction to return ONLY enhanced text                     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      Response Streaming                          │   │
│   │                                                                  │   │
│   │   return result.toTextStreamResponse()                           │   │
│   │                                                                  │   │
│   │   • Returns a streaming HTTP response                            │   │
│   │   • Content-Type: text/plain                                     │   │
│   │   • Tokens streamed as they're generated                         │   │
│   │                                                                  │   │
│   │   ⚠️  IMPORTANT: Must use toTextStreamResponse()                 │   │
│   │      to match streamProtocol: 'text' on client                   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
ai-enhance-input/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── enhance/
│   │   │       └── route.ts      ◄── API endpoint (Server)
│   │   ├── globals.css           ◄── Shimmer animation styles
│   │   ├── layout.tsx            ◄── Root layout
│   │   └── page.tsx              ◄── Demo page
│   │
│   └── components/
│       └── EnhanceableTextarea.tsx  ◄── Reusable component (Client)
│
├── ai_docs/                      ◄── This documentation
│   └── ARCHITECTURE.md
│
├── .env.local                    ◄── OpenAI API key (not committed)
├── .env.local.example            ◄── Template for env vars
├── package.json
└── tsconfig.json
```

---

## Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 16.x |
| **Vercel AI SDK** (`ai`) | Backend streaming utilities | 6.x |
| **@ai-sdk/react** | React hooks for AI | Latest |
| **@ai-sdk/openai** | OpenAI provider | Latest |
| **Tailwind CSS** | Styling | 4.x |
| **Lucide React** | Icons (Sparkles, Undo) | Latest |

---

## Critical Configuration Points

### 1. Stream Protocol Matching

```typescript
// CLIENT (EnhanceableTextarea.tsx)
useCompletion({
  streamProtocol: 'text',  // ◄── Must be 'text'
  ...
})

// SERVER (route.ts)
return result.toTextStreamResponse();  // ◄── Must use Text stream
```

**Why?** The `useCompletion` hook defaults to `streamProtocol: 'data'`, which expects a special JSON-based data stream format. Since we use `toTextStreamResponse()` (plain text), we must set `streamProtocol: 'text'`.

### 2. Body Parameters

```typescript
// When calling complete()
await complete(value, {
  body: {
    text: value,      // The text to enhance
    context: context, // Context about what kind of text this is
  },
});
```

The `useCompletion` hook automatically adds `prompt` to the body. We also pass `text` and `context` for more explicit handling on the server.

### 3. Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-...
```

The `@ai-sdk/openai` package automatically reads this environment variable.

---

## UX Features

### Shimmer Loading Effect

```css
/* globals.css */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.shimmer-bg {
  background: linear-gradient(90deg, #f8f9fa 25%, #e9d5ff 50%, #f8f9fa 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

### Undo Functionality

```typescript
// Store previous value before enhancement
setPreviousValue(value);

// Restore on undo
const handleUndo = () => {
  if (previousValue !== null) {
    setValue(previousValue);
    setPreviousValue(null);
  }
};
```

**Note:** Browser `Ctrl+Z` doesn't work reliably because we update React state programmatically. The manual undo button is the reliable solution.

---

## Error Handling

```typescript
useCompletion({
  onError: (err) => {
    console.error('[useCompletion] onError:', err);
    // Could show toast notification here
  },
})
```

Common errors:
- **401 Unauthorized** - Invalid or missing OpenAI API key
- **429 Too Many Requests** - Rate limited
- **Network errors** - Connection issues

---

## Extending This Pattern

### Adding More Fields

```tsx
<EnhanceableTextarea
  label="Project Description"
  context="This is a project description for a software development proposal. It should be clear, technical, and compelling."
  placeholder="Describe your project..."
/>

<EnhanceableTextarea
  label="Email Draft"
  context="This is a professional email to a client. It should be polite, clear, and action-oriented."
  placeholder="Write your email..."
/>
```

### Customizing the AI Behavior

Modify the system prompt in `/api/enhance/route.ts`:

```typescript
system: `You are an expert at writing ${context}.
Your task is to enhance the user's text while:
- Maintaining their voice and intent
- Fixing grammar and spelling
- Improving clarity and flow
- Adding appropriate formatting if needed
Return ONLY the enhanced text.`
```
