# CopilotKit Experiment Ideas

> Future prototypes to explore Generative UI capabilities

---

## 1. Generative UI with Real Data Fetching

**Status:** 🔲 Not Started

**Concept:** Connect CopilotKit actions to real APIs instead of static data.

**Implementation Ideas:**
- Job matching API → AI shows actual job cards with apply buttons
- Training programs API → AI recommends real courses based on skills gap
- Skills database → AI validates skills and suggests related ones
- Salary data API → AI shows compensation ranges for trades

**Code Sketch:**
```tsx
useCopilotAction({
  name: 'searchJobs',
  description: 'Search for jobs matching user profile',
  parameters: [
    { name: 'trade', type: 'string' },
    { name: 'location', type: 'string' },
    { name: 'experienceLevel', type: 'string' },
  ],
  render: ({ status, result }) => (
    status === 'executing'
      ? <JobCardsSkeleton />
      : <JobCardsGrid jobs={result.jobs} onApply={handleApply} />
  ),
  handler: async ({ trade, location, experienceLevel }) => {
    const jobs = await fetch(`/api/jobs?trade=${trade}&location=${location}`);
    return { jobs: await jobs.json() };
  },
});
```

**Complexity:** Medium
**Value:** High - Makes demos feel real

---

## 2. CoAgents: Multi-Step Agent Workflows

**Status:** 🔲 Not Started

**Concept:** Build complex agents that perform multiple steps with real-time progress streaming.

**Use Case Example:**
```
User: "Help me prepare for a job interview at ABC Plumbing"

Agent Progress:
├── [✓] Researching ABC Plumbing company...
├── [✓] Analyzing your profile strengths...
├── [→] Generating likely interview questions...
├── [ ] Creating preparation checklist...
└── [ ] Building practice flashcards...
```

**Code Sketch:**
```tsx
const { state, run } = useCoAgent<InterviewPrepState>({
  name: 'interview_prep_agent',
  initialState: {
    step: 'idle',
    progress: 0,
    companyInfo: null,
    questions: [],
    checklist: [],
  },
});

useCoAgentStateRender({
  name: 'interview_prep_agent',
  render: ({ state }) => (
    <InterviewPrepProgress
      currentStep={state.step}
      progress={state.progress}
      companyInfo={state.companyInfo}
      questions={state.questions}
    />
  ),
});
```

**Complexity:** High
**Value:** Very High - Shows advanced agentic capabilities

---

## 3. Hybrid Sparkle + CopilotKit

**Status:** ✅ Completed

**Implementation:** `/hybrid-demo` page

**Concept:** Combine both enhancement patterns on the same form for optimal UX.

**UX Pattern:**
- **Sparkle button (✨)** → Quick single-field enhancement, instant, no chat needed
- **Chat assistant** → Complex operations, multi-field, questions, guidance

**Implementation:**
```tsx
// Each field has both:
<div className="relative">
  <input value={skills} onChange={...} />

  {/* Sparkle for quick enhance (existing Vercel AI SDK pattern) */}
  <SparkleButton
    onEnhance={() => enhanceWithVercelAI(skills, 'skills')}
  />
</div>

// Plus CopilotKit chat for complex operations
<CopilotPopup />

// CopilotKit can also enhance, but via conversation
useCopilotAction({
  name: 'enhanceField',
  // ... allows chat-based enhancement with preview
});
```

**Why Both?**
| Scenario | Best Tool |
|----------|-----------|
| Quick fix to one field | Sparkle ✨ |
| "Make everything more professional" | Chat |
| "What should I write for skills?" | Chat |
| Polish final draft of goals | Sparkle ✨ |

**Complexity:** Low
**Value:** High - Best of both worlds UX

---

## 4. Voice Input + Generative UI

**Status:** 🔲 Not Started

**Concept:** Add speech-to-text so users can speak their profile naturally.

**Why It Matters:**
- More natural for skilled trades workers
- Hands-free form filling
- Accessibility improvement
- "Talk like you're telling a friend about your work"

**Implementation:**
```tsx
import { useSpeechRecognition } from 'react-speech-recognition';

function VoiceInput() {
  const { transcript, listening, startListening } = useSpeechRecognition();

  // When user stops talking, send to CopilotKit
  useEffect(() => {
    if (!listening && transcript) {
      // CopilotKit will parse and fill form
      sendToCopilot(transcript);
    }
  }, [listening, transcript]);

  return (
    <button onClick={startListening}>
      {listening ? '🔴 Recording...' : '🎤 Speak your profile'}
    </button>
  );
}
```

**Generative UI:** Show real-time transcription + parsed fields preview

**Complexity:** Medium
**Value:** High - Great for demos, accessibility

---

## 5. Document Upload + AI Analysis

**Status:** 🔲 Not Started

**Concept:** User uploads resume or certification → AI extracts data and fills form.

**User Flow:**
```
1. User drags resume.pdf to upload zone
2. AI analyzes document (shows progress)
3. Generative UI shows extracted data:
   ┌─────────────────────────────────────────┐
   │ 📄 Resume Analysis                      │
   ├─────────────────────────────────────────┤
   │ Found:                                  │
   │ • Name: John Smith                      │
   │ • 3 work experiences                    │
   │ • 5 skills: welding, fabrication...    │
   │ • 2 certifications: AWS D1.1...        │
   │                                         │
   │ [Apply All] [Select Fields] [Discard]  │
   └─────────────────────────────────────────┘
4. User clicks Apply → Form populated
```

**Implementation:**
```tsx
useCopilotAction({
  name: 'analyzeResume',
  description: 'Extract profile data from uploaded resume',
  parameters: [
    { name: 'extractedName', type: 'string' },
    { name: 'extractedSkills', type: 'string[]' },
    { name: 'extractedExperience', type: 'object[]' },
    { name: 'extractedCertifications', type: 'string[]' },
  ],
  render: ({ status, args }) => (
    <ResumeExtractionCard
      status={status}
      data={args}
      onApply={() => applyToForm(args)}
    />
  ),
  handler: async (extracted) => {
    // Map extracted data to form fields
    setFormData(mapResumeToProfile(extracted));
  },
});
```

**Complexity:** High (needs PDF parsing, possibly vision API)
**Value:** Very High - Impressive demo, real productivity gain

---

## 6. Comparison/Decision Helper

**Status:** 🔲 Not Started

**Concept:** AI helps users make decisions by rendering comparison tables.

**Example Interactions:**

```
User: "Should I go for commercial or residential work?"

AI renders comparison table:
┌─────────────────────────────────────────────────┐
│ 🏢 Commercial vs 🏠 Residential                 │
├────────────────────┬────────────────────────────┤
│ Commercial         │ Residential                │
├────────────────────┼────────────────────────────┤
│ 💰 Higher pay      │ 🕐 Flexible schedule       │
│ 📋 More certs req  │ 🚗 Less travel             │
│ 👥 Team-based      │ 👤 Independent work        │
│ 📈 Career growth   │ 🏠 Work-life balance       │
├────────────────────┴────────────────────────────┤
│ Based on your 5 years residential experience,   │
│ I'd recommend starting with light commercial    │
│ projects to build your portfolio.               │
└─────────────────────────────────────────────────┘
```

```
User: "Compare these three training programs"

AI renders:
┌─────────────────────────────────────────────────┐
│ Training Program Comparison                     │
├─────────┬──────────┬──────────┬─────────────────┤
│         │ Program A│ Program B│ Program C       │
├─────────┼──────────┼──────────┼─────────────────┤
│ Duration│ 6 weeks  │ 12 weeks │ 4 weeks         │
│ Cost    │ $2,500   │ $4,000   │ $1,200          │
│ Cert    │ Yes      │ Yes      │ No              │
│ Online  │ Hybrid   │ In-person│ Fully online    │
├─────────┴──────────┴──────────┴─────────────────┤
│ ⭐ Recommended: Program A (best value for you)  │
└─────────────────────────────────────────────────┘
```

**Complexity:** Medium
**Value:** High - Very useful UX pattern

---

## 7. Interactive Onboarding Tutorial ✅

**Status:** ✅ Completed

**Implementation:** `/ai-onboarding` page

**Concept:** AI guides new users through the app with contextual Generative UI.

---

## 8. A2UI / Declarative Generative UI

**Status:** 🔲 Not Started

**Concept:** Instead of hardcoded React components in `render()`, have AI return JSON specs that the frontend interprets.

**Current Approach (Static):**
```tsx
render: ({ args }) => <JobCard job={args} />  // Fixed component
```

**Declarative Approach:**
```tsx
// AI returns JSON spec
{
  "type": "card",
  "variant": "job-listing",
  "title": "Senior Plumber",
  "fields": [
    { "label": "Company", "value": "ABC Plumbing" },
    { "label": "Salary", "value": "$45/hr" }
  ],
  "actions": [
    { "label": "Apply Now", "action": "applyToJob", "primary": true },
    { "label": "Save", "action": "saveJob" }
  ]
}

// Frontend has a generic renderer
function DynamicCard({ spec }) {
  return (
    <Card variant={spec.variant}>
      <CardTitle>{spec.title}</CardTitle>
      {spec.fields.map(f => <Field key={f.label} {...f} />)}
      {spec.actions.map(a => <Button key={a.label} {...a} />)}
    </Card>
  );
}
```

**Protocols:**
- **A2UI** - Google's declarative GenUI spec (JSONL-based)
- **Open-JSON-UI** - Open standardization of OpenAI's internal spec

**Complexity:** High
**Value:** Very High for scale - One renderer handles infinite UI variations

---

## Priority Matrix

```
                    HIGH VALUE
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    │  5. Doc Upload    │  2. CoAgents      │
    │  7. Onboarding ✅ │  8. A2UI          │
    │                   │                   │
LOW ├───────────────────┼───────────────────┤ HIGH
EFFORT                  │                   EFFORT
    │                   │                   │
    │  3. Hybrid        │  4. Voice         │
    │  6. Comparison    │  1. Real APIs     │
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    LOW VALUE
```

**Recommended Order:**
1. ✅ #7 Interactive Onboarding (completed)
2. ✅ #3 Hybrid Sparkle + CopilotKit (completed)
3. #6 Comparison Helper (useful pattern)
4. #5 Document Upload (impressive demo)
5. #2 CoAgents (advanced)

---

## Notes

- All experiments should be on separate pages (`/ai-*`) for easy comparison
- Keep the existing working examples intact
- Document learnings in this folder
- Consider recording demo videos of each experiment
