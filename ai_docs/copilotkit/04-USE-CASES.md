# CopilotKit Use Cases

## Overview

This document outlines practical use cases for Generative UI, organized by complexity and domain. Each use case includes implementation patterns and code sketches.

---

## Use Case Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                    USE CASE COMPLEXITY MATRIX                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HIGH     │ Smart Dashboards    │ Multi-Agent       │          │
│  VALUE    │ AI Form Builder     │ Workflows         │          │
│           │                     │                   │          │
│           ├─────────────────────┼───────────────────┤          │
│           │ Text Enhancement    │ Data Analysis     │          │
│           │ Search with Preview │ Report Generation │          │
│           │                     │                   │          │
│           ├─────────────────────┼───────────────────┤          │
│  LOW      │ Counter Demo        │ Simple Chat       │          │
│  VALUE    │ Basic Actions       │                   │          │
│           │                     │                   │          │
│           └─────────────────────┴───────────────────┘          │
│                 LOW COMPLEXITY      HIGH COMPLEXITY             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. AI-Assisted Form Filling

### Problem
Users struggle to fill out forms with professional, well-structured content.

### Solution
AI enhances individual fields or auto-fills entire forms based on conversation.

### Implementation

```tsx
// Share entire form state
useCopilotReadable({
  description: 'Current form data for skilled trades profile',
  value: JSON.stringify(formData),
});

// Action to enhance a single field
useCopilotAction({
  name: 'enhanceField',
  description: 'Enhance a specific form field to be more professional',
  parameters: [
    { name: 'fieldName', type: 'string', required: true },
    { name: 'improvedValue', type: 'string', required: true },
  ],
  render: ({ status, args }) => (
    <div className="border rounded p-3">
      {status === 'executing' ? (
        <div className="animate-pulse">Enhancing {args.fieldName}...</div>
      ) : (
        <div>
          <strong>{args.fieldName}</strong>
          <div className="bg-green-50 p-2 mt-1">{args.improvedValue}</div>
        </div>
      )}
    </div>
  ),
  handler: async ({ fieldName, improvedValue }) => {
    updateFormData({ [fieldName]: improvedValue });
    return `Enhanced ${fieldName}`;
  },
});

// Action to auto-fill entire form from description
useCopilotAction({
  name: 'autoFillProfile',
  description: 'Fill out the entire profile based on user description',
  parameters: [
    { name: 'fullName', type: 'string', required: true },
    { name: 'email', type: 'string', required: true },
    { name: 'aboutMe', type: 'string', required: true },
    { name: 'skills', type: 'string', required: true },
    // ... more fields
  ],
  render: ({ status, args }) => (
    <ProfilePreviewCard status={status} data={args} />
  ),
  handler: async (profileData) => {
    setFormData(profileData);
    return 'Profile auto-filled';
  },
});
```

### User Flow

```
User: "I'm a 5-year electrician specializing in residential
       solar panel installations. I'm looking for commercial work."

AI: [Renders ProfilePreviewCard with all fields filled]
    ┌────────────────────────────────────────┐
    │  📋 Profile Preview                    │
    ├────────────────────────────────────────┤
    │  Name: [From context or ask]           │
    │  Trade: Electrical                     │
    │  Experience: 5 years                   │
    │  Specialization: Solar installations   │
    │  Goals: Transition to commercial...    │
    │                                        │
    │  [Apply to Form] [Edit First]          │
    └────────────────────────────────────────┘
```

---

## 2. Dynamic Dashboards

### Problem
Users want to explore data without knowing SQL or chart libraries.

### Solution
Natural language queries generate visualizations as Generative UI.

### Implementation

```tsx
useCopilotAction({
  name: 'showChart',
  description: 'Display a chart based on the data query',
  parameters: [
    { name: 'chartType', type: 'string', required: true },  // bar, line, pie
    { name: 'title', type: 'string', required: true },
    { name: 'data', type: 'object[]', required: true },
    { name: 'xKey', type: 'string', required: true },
    { name: 'yKey', type: 'string', required: true },
  ],
  render: ({ status, args }) => {
    if (status === 'executing') {
      return <ChartSkeleton />;
    }
    return (
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-4">{args.title}</h3>
        <DynamicChart
          type={args.chartType}
          data={args.data}
          xKey={args.xKey}
          yKey={args.yKey}
        />
      </div>
    );
  },
  handler: async ({ chartType, title, data }) => {
    // Store in dashboard state if needed
    return { chartType, title, dataPoints: data.length };
  },
});
```

### User Flow

```
User: "Show me sales by region as a bar chart"

AI: [Fetches data, renders chart component in chat]
    ┌────────────────────────────────────────┐
    │  📊 Sales by Region                    │
    │  ┌────────────────────────────────┐   │
    │  │  ████████████  North: $45K     │   │
    │  │  ██████████    South: $38K     │   │
    │  │  ██████        East: $22K      │   │
    │  │  ████████████████ West: $52K   │   │
    │  └────────────────────────────────┘   │
    │  [Add to Dashboard] [Export]          │
    └────────────────────────────────────────┘
```

---

## 3. E-Commerce Product Search

### Problem
Text search results are boring. Users want visual product browsing.

### Solution
AI search returns product cards with images, prices, and actions.

### Implementation

```tsx
useCopilotAction({
  name: 'searchProducts',
  description: 'Search products and display results as cards',
  parameters: [
    {
      name: 'products',
      type: 'object[]',
      attributes: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'image', type: 'string' },
        { name: 'rating', type: 'number' },
      ],
    },
  ],
  render: ({ status, args }) => (
    <div className="space-y-2">
      {status === 'executing' ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {args.products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  ),
  handler: async ({ products }) => {
    return { count: products.length };
  },
});
```

---

## 4. Scheduling & Calendar

### Problem
Scheduling involves back-and-forth about availability.

### Solution
AI shows available time slots as clickable buttons.

### Implementation

```tsx
useCopilotAction({
  name: 'showAvailableSlots',
  description: 'Display available meeting time slots',
  parameters: [
    {
      name: 'slots',
      type: 'object[]',
      attributes: [
        { name: 'datetime', type: 'string' },
        { name: 'duration', type: 'number' },
        { name: 'available', type: 'boolean' },
      ],
    },
  ],
  render: ({ status, args }) => (
    <div className="space-y-2">
      <h4 className="font-medium">Available Times:</h4>
      <div className="flex flex-wrap gap-2">
        {args.slots.map(slot => (
          <button
            key={slot.datetime}
            onClick={() => bookSlot(slot)}
            className={`px-3 py-2 rounded ${
              slot.available
                ? 'bg-green-100 hover:bg-green-200'
                : 'bg-gray-100 opacity-50'
            }`}
            disabled={!slot.available}
          >
            {formatTime(slot.datetime)}
          </button>
        ))}
      </div>
    </div>
  ),
  handler: async ({ slots }) => {
    return { availableCount: slots.filter(s => s.available).length };
  },
});
```

### User Flow

```
User: "Book a meeting with John next Tuesday"

AI: "I found these available slots for Tuesday:"
    ┌────────────────────────────────────────┐
    │  Available Times:                      │
    │  ┌────────┐ ┌────────┐ ┌────────┐     │
    │  │ 9:00am │ │10:00am │ │ 2:00pm │     │
    │  └────────┘ └────────┘ └────────┘     │
    │  ┌────────┐ ┌────────┐                │
    │  │ 3:00pm │ │ 4:30pm │                │
    │  └────────┘ └────────┘                │
    └────────────────────────────────────────┘

User: [Clicks "2:00pm"]

AI: "Meeting booked for Tuesday at 2:00pm!"
```

---

## 5. Customer Support with Troubleshooting

### Problem
Support articles are walls of text. Hard to follow steps.

### Solution
AI renders interactive troubleshooting checklists.

### Implementation

```tsx
useCopilotAction({
  name: 'showTroubleshootingSteps',
  description: 'Display troubleshooting steps with checkboxes',
  parameters: [
    { name: 'issue', type: 'string', required: true },
    {
      name: 'steps',
      type: 'object[]',
      attributes: [
        { name: 'id', type: 'string' },
        { name: 'instruction', type: 'string' },
        { name: 'tip', type: 'string' },
      ],
    },
  ],
  render: ({ args }) => (
    <TroubleshootingChecklist
      issue={args.issue}
      steps={args.steps}
      onStepComplete={(stepId) => markStepComplete(stepId)}
      onIssueResolved={() => closeTicket()}
    />
  ),
  handler: async ({ issue, steps }) => {
    logSupportInteraction(issue);
    return { stepsCount: steps.length };
  },
});
```

---

## 6. Document Analysis & Report Generation

### Problem
Users upload documents and need structured insights.

### Solution
AI analyzes documents and renders summary cards, tables, highlights.

### Implementation

```tsx
useCopilotAction({
  name: 'analyzeDocument',
  description: 'Analyze uploaded document and show summary',
  parameters: [
    { name: 'title', type: 'string', required: true },
    { name: 'summary', type: 'string', required: true },
    { name: 'keyPoints', type: 'string[]', required: true },
    { name: 'sentiment', type: 'string', required: true },
    { name: 'wordCount', type: 'number', required: true },
  ],
  render: ({ status, args }) => (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-3 border-b">
        <h3 className="font-bold">{args.title}</h3>
        <span className={`badge badge-${args.sentiment}`}>
          {args.sentiment}
        </span>
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-4">{args.summary}</p>
        <h4 className="font-medium mb-2">Key Points:</h4>
        <ul className="list-disc pl-5">
          {args.keyPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 p-3 border-t text-sm text-gray-500">
        {args.wordCount} words analyzed
      </div>
    </div>
  ),
  handler: async (analysis) => {
    saveAnalysis(analysis);
    return analysis;
  },
});
```

---

## Skilled Trades App - Specific Use Cases

### Use Case A: Smart Profile Builder

```
User: "I've been doing plumbing for 8 years, mostly residential.
       I have my journeyman license and want to get into commercial."

AI renders:
┌─────────────────────────────────────────────────────────┐
│  🔧 Profile Auto-Fill Preview                          │
├─────────────────────────────────────────────────────────┤
│  Trade: Plumbing                                        │
│  Experience: 8 years                                    │
│  Sector: Residential → Commercial (transitioning)       │
│  Certifications: Journeyman License                    │
│                                                         │
│  Generated "About Me":                                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Experienced plumber with 8 years in residential   │ │
│  │ sector, holding a journeyman license. Seeking     │ │
│  │ opportunities to expand into commercial projects. │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [✓ Apply All]  [Edit Individual Fields]               │
└─────────────────────────────────────────────────────────┘
```

### Use Case B: Job Matching

```
User: "What jobs match my profile?"

AI renders:
┌─────────────────────────────────────────────────────────┐
│  💼 Matching Jobs (3 found)                            │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ Commercial Plumber - ABC Construction           │   │
│  │ ⭐ 95% Match  |  $35-45/hr  |  Full-time       │   │
│  │ [View Details] [Quick Apply]                    │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Plumbing Technician - City Hospital             │   │
│  │ ⭐ 87% Match  |  $32-40/hr  |  Full-time       │   │
│  │ [View Details] [Quick Apply]                    │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Service Plumber - Quick Fix LLC                 │   │
│  │ ⭐ 82% Match  |  $28-35/hr  |  Contract        │   │
│  │ [View Details] [Quick Apply]                    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Use Case C: Skills Gap Analysis

```
User: "What skills do I need for commercial plumbing?"

AI renders:
┌─────────────────────────────────────────────────────────┐
│  📊 Skills Gap Analysis                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Your Skills          Commercial Requirements           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ✅ Pipe Fitting      ████████████████████ Required    │
│  ✅ Soldering         ████████████████████ Required    │
│  ✅ Code Compliance   ████████████████████ Required    │
│  ⚠️ Backflow Cert     ████████░░░░░░░░░░░░ You: None   │
│  ❌ Med Gas Cert      ████████████████░░░░ You: None   │
│  ❌ Blueprint Reading ████████████░░░░░░░░ You: Basic  │
│                                                         │
│  Recommended Training:                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 1. Backflow Prevention Certification (2 weeks)  │   │
│  │ 2. Medical Gas Installation Course (4 weeks)    │   │
│  │ 3. Commercial Blueprint Reading (1 week)        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Find Training Programs]  [Save Analysis]              │
└─────────────────────────────────────────────────────────┘
```

---

## Summary: When to Use Generative UI

| Scenario | Use Generative UI? | Why |
|----------|-------------------|-----|
| Simple Q&A | No | Text is fine |
| Data display | **Yes** | Cards/charts better than text |
| Multi-step workflows | **Yes** | Visual progress, clickable steps |
| Search results | **Yes** | Preview cards, actions |
| Form filling | **Yes** | Live preview, validation UI |
| Scheduling | **Yes** | Clickable time slots |
| File analysis | **Yes** | Structured summaries |
