# CopilotKit Hooks Reference

## Overview

CopilotKit provides React hooks that connect your app to AI. These hooks handle:
- Sharing app state with AI (readable)
- Defining actions AI can trigger (actions)
- Rendering custom UI during AI operations (generative UI)

---

## useCopilotReadable

**Purpose:** Share application state with the AI so it can "see" what's happening.

### Basic Usage

```tsx
import { useCopilotReadable } from '@copilotkit/react-core';

function MyComponent() {
  const [counter, setCounter] = useState(0);
  const [user, setUser] = useState({ name: 'John', role: 'admin' });

  // Simple value
  useCopilotReadable({
    description: 'The current counter value',
    value: counter.toString(),
  });

  // Object (stringify it)
  useCopilotReadable({
    description: 'The current logged-in user',
    value: JSON.stringify(user),
  });

  return <div>Counter: {counter}</div>;
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `description` | string | Yes | Human-readable description for the AI |
| `value` | string | Yes | The actual value (must be string) |
| `categories` | string[] | No | Group related data |
| `parentId` | string | No | Create hierarchical data |

### Best Practices

```tsx
// ✅ Good: Descriptive, contextual
useCopilotReadable({
  description: 'User profile form data including name, email, and skills',
  value: JSON.stringify(formData),
});

// ❌ Bad: Vague, no context
useCopilotReadable({
  description: 'data',
  value: JSON.stringify(formData),
});
```

### When to Use

- Form values the AI should know about
- Current page/view state
- User preferences
- Shopping cart contents
- Any state the AI needs to answer questions about

---

## useCopilotAction

**Purpose:** Define actions the AI can trigger, with optional custom UI rendering.

### Basic Usage (No Generative UI)

```tsx
import { useCopilotAction } from '@copilotkit/react-core';

function MyComponent() {
  const [items, setItems] = useState([]);

  useCopilotAction({
    name: 'addItem',
    description: 'Add an item to the shopping list',
    parameters: [
      {
        name: 'itemName',
        type: 'string',
        description: 'Name of the item to add',
        required: true,
      },
    ],
    handler: async ({ itemName }) => {
      setItems(prev => [...prev, itemName]);
      return `Added "${itemName}" to the list`;
    },
  });

  return <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>;
}
```

### With Generative UI (render function)

```tsx
useCopilotAction({
  name: 'searchProducts',
  description: 'Search for products matching a query',
  parameters: [
    {
      name: 'query',
      type: 'string',
      description: 'Search query',
      required: true,
    },
  ],
  // 🎨 This is the Generative UI part!
  render: ({ status, args, result }) => {
    if (status === 'executing') {
      return (
        <div className="p-4 bg-blue-50 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Spinner />
            <span>Searching for "{args.query}"...</span>
          </div>
        </div>
      );
    }

    if (status === 'complete') {
      return (
        <div className="p-4 bg-green-50 rounded-lg">
          <h4>Found {result.count} products:</h4>
          <div className="grid grid-cols-2 gap-2">
            {result.products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      );
    }

    return null;
  },
  handler: async ({ query }) => {
    const products = await searchAPI(query);
    return { count: products.length, products };
  },
});
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Unique action identifier |
| `description` | string | Yes | What this action does (for AI) |
| `parameters` | array | Yes | Input parameters schema |
| `handler` | function | Yes | Async function to execute |
| `render` | function | No | Custom UI component |

### Parameter Types

```tsx
parameters: [
  { name: 'text', type: 'string', description: '...', required: true },
  { name: 'count', type: 'number', description: '...', required: true },
  { name: 'enabled', type: 'boolean', description: '...', required: false },
  {
    name: 'items',
    type: 'object[]',  // Array of objects
    description: '...',
    attributes: [
      { name: 'id', type: 'string' },
      { name: 'quantity', type: 'number' },
    ],
  },
]
```

### Render Status Values

| Status | When | Use For |
|--------|------|---------|
| `'executing'` | Action is running | Loading spinners, progress |
| `'complete'` | Action finished | Success message, results |
| `'error'` | Action failed | Error message |

### Render Props

```tsx
render: ({ status, args, result }) => {
  // status: 'executing' | 'complete' | 'error'
  // args: The parameters passed to the action
  // result: Return value from handler (only when complete)
}
```

---

## useCoAgent / useCoAgentStateRender

**Purpose:** For advanced multi-agent scenarios with real-time state streaming.

### Basic Usage

```tsx
import { useCoAgent, useCoAgentStateRender } from '@copilotkit/react-core';

interface AgentState {
  step: string;
  progress: number;
  results: any[];
}

function MyComponent() {
  const { state, run } = useCoAgent<AgentState>({
    name: 'research_agent',
    initialState: { step: 'idle', progress: 0, results: [] },
  });

  // Render UI based on agent state
  useCoAgentStateRender({
    name: 'research_agent',
    render: ({ state }) => (
      <div className="p-4 border rounded">
        <div>Step: {state.step}</div>
        <ProgressBar value={state.progress} />
        <ResultsList results={state.results} />
      </div>
    ),
  });

  return (
    <button onClick={() => run({ query: 'AI trends' })}>
      Start Research
    </button>
  );
}
```

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                      HOOK DECISION TREE                         │
└─────────────────────────────────────────────────────────────────┘

Need AI to SEE app state?
    └── Yes → useCopilotReadable

Need AI to DO something?
    └── Yes → useCopilotAction
        └── Need custom UI during action?
            └── Yes → Add render() function

Need real-time agent state streaming?
    └── Yes → useCoAgent + useCoAgentStateRender
```

---

## Common Patterns

### Pattern 1: Form Field Enhancement

```tsx
function EnhanceableField({ value, onChange, fieldName }) {
  useCopilotReadable({
    description: `Current ${fieldName} field value`,
    value: value,
  });

  useCopilotAction({
    name: `enhance_${fieldName}`,
    description: `Improve the ${fieldName} text to be more professional`,
    parameters: [
      { name: 'improvedText', type: 'string', required: true },
    ],
    render: ({ status, args }) => (
      <EnhancementPreview status={status} text={args.improvedText} />
    ),
    handler: async ({ improvedText }) => {
      onChange(improvedText);
      return `${fieldName} enhanced`;
    },
  });

  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
```

### Pattern 2: Data Fetching with Preview

```tsx
useCopilotAction({
  name: 'fetchUserData',
  description: 'Fetch and display user profile data',
  parameters: [
    { name: 'userId', type: 'string', required: true },
  ],
  render: ({ status, result }) => {
    if (status === 'executing') {
      return <UserCardSkeleton />;
    }
    return <UserCard user={result} />;
  },
  handler: async ({ userId }) => {
    const user = await api.getUser(userId);
    return user;
  },
});
```

### Pattern 3: Multi-Step Workflow

```tsx
useCopilotAction({
  name: 'processOrder',
  description: 'Process a complete order through validation, payment, and confirmation',
  parameters: [...],
  render: ({ status, args }) => (
    <OrderProgress
      status={status}
      steps={['Validating', 'Processing Payment', 'Confirming']}
      currentStep={args._currentStep}
    />
  ),
  handler: async (args) => {
    args._currentStep = 0;
    await validateOrder(args);

    args._currentStep = 1;
    await processPayment(args);

    args._currentStep = 2;
    await confirmOrder(args);

    return { success: true, orderId: '12345' };
  },
});
```
