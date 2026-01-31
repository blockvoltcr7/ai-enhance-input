# CopilotKit Quick Start Guide

## Prerequisites

- Node.js 18+
- Next.js 14+ (App Router)
- Copilot Cloud account at https://cloud.copilotkit.ai

---

## Step 1: Install Packages

```bash
npm install @copilotkit/react-core @copilotkit/react-ui
```

---

## Step 2: Get Your API Key

1. Go to https://cloud.copilotkit.ai
2. Navigate to **API Key** section
3. Copy your public API key (starts with `ck_pub_`)

---

## Step 3: Add Environment Variable

Create/update `.env.local`:

```env
NEXT_PUBLIC_COPILOT_CLOUD_API_KEY=ck_pub_xxxxxxxxxxxxx
```

---

## Step 4: Wrap Your App with CopilotKit Provider

**Option A: In a Providers component (recommended)**

```tsx
// src/components/Providers.tsx
'use client';

import { CopilotKit } from '@copilotkit/react-core';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY}>
      {children}
    </CopilotKit>
  );
}
```

```tsx
// src/app/layout.tsx
import { Providers } from '@/components/Providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Option B: Directly in layout**

```tsx
// src/app/layout.tsx
import { CopilotKit } from '@copilotkit/react-core';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY}>
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
```

---

## Step 5: Add Chat UI to a Page

```tsx
// src/app/page.tsx (or any page)
'use client';

import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

export default function Page() {
  return (
    <div>
      <h1>My App</h1>

      {/* Chat popup in bottom-right corner */}
      <CopilotPopup
        labels={{
          title: 'AI Assistant',
          initial: 'How can I help you today?',
        }}
      />
    </div>
  );
}
```

---

## Step 6: Share State with AI (useCopilotReadable)

```tsx
'use client';

import { useState } from 'react';
import { useCopilotReadable } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

export default function Page() {
  const [userName, setUserName] = useState('John');
  const [cartItems, setCartItems] = useState(['Apple', 'Banana']);

  // AI can now "see" these values
  useCopilotReadable({
    description: 'The current user name',
    value: userName,
  });

  useCopilotReadable({
    description: 'Items in the shopping cart',
    value: JSON.stringify(cartItems),
  });

  return (
    <div>
      <p>User: {userName}</p>
      <p>Cart: {cartItems.join(', ')}</p>

      {/* Now ask: "What's in my cart?" or "What's my name?" */}
      <CopilotPopup />
    </div>
  );
}
```

---

## Step 7: Add AI-Triggered Actions (useCopilotAction)

```tsx
'use client';

import { useState } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

export default function Page() {
  const [counter, setCounter] = useState(0);

  useCopilotReadable({
    description: 'Current counter value',
    value: counter.toString(),
  });

  // AI can trigger this action
  useCopilotAction({
    name: 'incrementCounter',
    description: 'Increment the counter by a specified amount',
    parameters: [
      {
        name: 'amount',
        type: 'number',
        description: 'Amount to increment by',
        required: true,
      },
    ],
    handler: async ({ amount }) => {
      setCounter((prev) => prev + amount);
      return `Counter incremented by ${amount}`;
    },
  });

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={() => setCounter((c) => c + 1)}>+1</button>

      {/* Now ask: "Increment the counter by 5" */}
      <CopilotPopup />
    </div>
  );
}
```

---

## Step 8: Add Generative UI (render function)

```tsx
useCopilotAction({
  name: 'incrementCounter',
  description: 'Increment the counter by a specified amount',
  parameters: [
    {
      name: 'amount',
      type: 'number',
      description: 'Amount to increment by',
      required: true,
    },
  ],
  // 🎨 GENERATIVE UI - Custom component renders in chat!
  render: ({ status, args }) => (
    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
      {status === 'executing' ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          <span>Adding {args.amount} to counter...</span>
        </div>
      ) : (
        <div className="text-green-600">
          ✓ Counter incremented by {args.amount}!
        </div>
      )}
    </div>
  ),
  handler: async ({ amount }) => {
    setCounter((prev) => prev + amount);
    return `Done`;
  },
});
```

---

## Complete Minimal Example

```tsx
// src/app/copilot-demo/page.tsx
'use client';

import { useState } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

export default function CopilotDemo() {
  const [todos, setTodos] = useState<string[]>([]);

  // Share state
  useCopilotReadable({
    description: 'Current todo list items',
    value: JSON.stringify(todos),
  });

  // Action with Generative UI
  useCopilotAction({
    name: 'addTodo',
    description: 'Add a new todo item to the list',
    parameters: [
      { name: 'item', type: 'string', description: 'The todo item', required: true },
    ],
    render: ({ status, args }) => (
      <div className={`p-3 rounded ${status === 'executing' ? 'bg-yellow-50' : 'bg-green-50'}`}>
        {status === 'executing' ? `Adding "${args.item}"...` : `✓ Added "${args.item}"`}
      </div>
    ),
    handler: async ({ item }) => {
      setTodos((prev) => [...prev, item]);
      return `Added: ${item}`;
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <ul className="mb-4">
        {todos.map((todo, i) => (
          <li key={i} className="py-1">• {todo}</li>
        ))}
        {todos.length === 0 && <li className="text-gray-400">No todos yet</li>}
      </ul>

      <CopilotPopup
        labels={{
          title: 'Todo Assistant',
          initial: 'Try: "Add buy groceries to my list" or "What\'s on my todo list?"',
        }}
      />
    </div>
  );
}
```

---

## Alternative Chat UI Components

```tsx
// Popup (bottom-right floating chat)
import { CopilotPopup } from '@copilotkit/react-ui';
<CopilotPopup />

// Sidebar (slide-in panel)
import { CopilotSidebar } from '@copilotkit/react-ui';
<CopilotSidebar />

// Inline chat (embedded in page)
import { CopilotChat } from '@copilotkit/react-ui';
<CopilotChat />
```

---

## Troubleshooting

### "CopilotKit is not defined"
Make sure you're using `'use client'` directive on the page.

### Chat not responding
1. Check API key is set in `.env.local`
2. Restart dev server after adding env vars
3. Check browser console for errors

### Actions not triggering
1. Verify `name` is unique across all actions
2. Make `description` clear so AI knows when to use it
3. Check parameter types match what AI provides

### Readable state not visible to AI
1. Ensure component with `useCopilotReadable` is mounted
2. Stringify objects: `value: JSON.stringify(obj)`

---

## Next Steps

1. **Read the full docs:** Review `03-HOOKS-REFERENCE.md` for all hook options
2. **Explore use cases:** See `04-USE-CASES.md` for implementation patterns
3. **Try our test page:** Run the app and go to `/copilot-test`
4. **Build something:** Start with a simple action, then add Generative UI

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                 COPILOTKIT QUICK REFERENCE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SETUP                                                          │
│  ─────                                                          │
│  npm install @copilotkit/react-core @copilotkit/react-ui       │
│  Add NEXT_PUBLIC_COPILOT_CLOUD_API_KEY to .env.local           │
│  Wrap app with <CopilotKit publicApiKey={...}>                 │
│                                                                 │
│  HOOKS                                                          │
│  ─────                                                          │
│  useCopilotReadable({ description, value })                    │
│    → AI can SEE this state                                     │
│                                                                 │
│  useCopilotAction({ name, description, parameters, handler })  │
│    → AI can DO this action                                     │
│                                                                 │
│  useCopilotAction({ ..., render: ({status, args}) => <UI/> }) │
│    → AI action with CUSTOM UI (Generative UI)                  │
│                                                                 │
│  UI COMPONENTS                                                  │
│  ─────────────                                                  │
│  <CopilotPopup />    → Floating chat bubble                    │
│  <CopilotSidebar />  → Slide-in panel                          │
│  <CopilotChat />     → Inline embedded chat                    │
│                                                                 │
│  RENDER STATUS                                                  │
│  ─────────────                                                  │
│  'executing' → Show loading state                              │
│  'complete'  → Show success/result                             │
│  'error'     → Show error message                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
