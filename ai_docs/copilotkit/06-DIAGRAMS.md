# CopilotKit Visual Diagrams

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph Browser["Browser (Client)"]
        subgraph NextApp["Next.js App"]
            CK["<CopilotKit>"]
            RC["React Components"]
            CP["CopilotPopup"]
            Hooks["useCopilotReadable\nuseCopilotAction"]
        end
    end

    subgraph Cloud["Copilot Cloud"]
        Router["Request Router"]
        LLM["LLM APIs\n(GPT-4, Claude)"]
        Analytics["Analytics"]
    end

    CK --> RC
    CK --> CP
    RC --> Hooks
    Hooks --> CK

    CK <-->|"AG-UI Protocol\n(WebSocket/SSE)"| Router
    Router --> LLM
    Router --> Analytics
```

## 2. Data Flow: useCopilotReadable

```mermaid
sequenceDiagram
    participant App as React App
    participant CK as CopilotKit
    participant AI as AI Agent

    App->>CK: useCopilotReadable({<br/>description: "Counter value",<br/>value: "42"})

    Note over CK: State registered

    App->>CK: User asks: "What's the counter?"
    CK->>AI: Message + Context:<br/>"Counter value: 42"
    AI->>CK: "The counter is currently 42"
    CK->>App: Display response
```

## 3. Data Flow: useCopilotAction with Generative UI

```mermaid
sequenceDiagram
    participant User
    participant App as React App
    participant CK as CopilotKit
    participant AI as AI Agent

    App->>CK: useCopilotAction({<br/>name: "addItem",<br/>render: ...,<br/>handler: ...})

    User->>CK: "Add milk to my list"
    CK->>AI: Message + Available Tools
    AI->>CK: Tool Call: addItem("milk")

    CK->>App: render({ status: "executing" })
    Note over App: Shows loading UI in chat

    App->>App: handler({ item: "milk" })
    App->>CK: Action complete

    CK->>App: render({ status: "complete" })
    Note over App: Shows success UI in chat

    AI->>CK: "I've added milk to your list!"
    CK->>User: Display final response
```

## 4. Generative UI Types Comparison

```mermaid
flowchart LR
    subgraph Static["Static GenUI"]
        S1["Developer defines UI"]
        S2["AI triggers action"]
        S3["Fixed component renders"]
        S1 --> S2 --> S3
    end

    subgraph Declarative["Declarative GenUI"]
        D1["AI returns JSON spec"]
        D2["Frontend interprets"]
        D3["Dynamic component renders"]
        D1 --> D2 --> D3
    end

    subgraph OpenEnded["Open-Ended GenUI"]
        O1["AI generates UI code"]
        O2["Sandbox executes"]
        O3["Arbitrary UI renders"]
        O1 --> O2 --> O3
    end
```

## 5. Action Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Action registered

    Idle --> Executing: AI calls action
    Executing --> Complete: handler() succeeds
    Executing --> Error: handler() throws

    Complete --> Idle: Ready for next call
    Error --> Idle: Ready for retry

    note right of Executing
        render({ status: "executing" })
        Shows loading UI
    end note

    note right of Complete
        render({ status: "complete" })
        Shows success UI
    end note

    note right of Error
        render({ status: "error" })
        Shows error UI
    end note
```

## 6. Component Hierarchy

```mermaid
flowchart TB
    subgraph Root["Root Layout"]
        CK["<CopilotKit>"]

        subgraph Providers["Other Providers"]
            Theme["<ThemeProvider>"]
        end

        subgraph Pages["Pages"]
            Home["Home Page"]
            Profile["Profile Page"]
            Test["CopilotTest Page"]
        end

        subgraph SharedComponents["Shared Components"]
            Popup["<CopilotPopup>"]
        end
    end

    CK --> Theme
    Theme --> Pages
    Pages --> SharedComponents

    Test --> Hooks["useCopilotReadable\nuseCopilotAction"]
```

## 7. Sparkle Enhancement: Before & After CopilotKit

```mermaid
flowchart LR
    subgraph Before["Before: Vercel AI SDK"]
        B1["User types text"]
        B2["Click sparkle ✨"]
        B3["API call to /api/enhance"]
        B4["Stream response"]
        B5["Update input field"]
        B1 --> B2 --> B3 --> B4 --> B5
    end

    subgraph After["After: CopilotKit"]
        A1["User types text"]
        A2["AI sees via useCopilotReadable"]
        A3["User: 'Enhance my text'"]
        A4["AI calls enhanceText action"]
        A5["Generative UI shows preview"]
        A6["Update input + chat response"]
        A1 --> A2 --> A3 --> A4 --> A5 --> A6
    end
```

## 8. Skilled Trades App: Ideal Architecture

```mermaid
flowchart TB
    subgraph UserInterface["User Interface"]
        Wizard["Profile Wizard"]
        Chat["AI Chat Popup"]
    end

    subgraph CopilotLayer["CopilotKit Layer"]
        Readable["useCopilotReadable\n(form state, user context)"]
        Actions["useCopilotAction\n(enhanceField, autoFill,\nmatchJobs, analyzeSkills)"]
    end

    subgraph GenerativeUI["Generative UI Components"]
        ProfilePreview["ProfilePreviewCard"]
        JobCards["JobMatchCards"]
        SkillsChart["SkillsGapChart"]
        TrainingList["TrainingRecommendations"]
    end

    subgraph Backend["Backend / APIs"]
        JobAPI["Job Matching API"]
        TrainingAPI["Training Programs API"]
        ProfileAPI["Profile Storage"]
    end

    Wizard --> Readable
    Chat --> Actions
    Actions --> GenerativeUI
    GenerativeUI --> Backend
```

## 9. Multi-Agent Flow (CoAgents)

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Orchestrator as Orchestrator Agent
    participant Research as Research Agent
    participant Writer as Writer Agent

    User->>App: "Write a report on AI trends"

    App->>Orchestrator: Start task
    Orchestrator->>Research: Gather information

    loop Real-time Updates
        Research-->>App: State: { step: "searching", progress: 20% }
        Note over App: useCoAgentStateRender<br/>shows progress UI
    end

    Research->>Orchestrator: Research complete
    Orchestrator->>Writer: Write report

    loop Real-time Updates
        Writer-->>App: State: { step: "writing", sections: [...] }
        Note over App: Shows sections<br/>as they're written
    end

    Writer->>Orchestrator: Report complete
    Orchestrator->>App: Final report
    App->>User: Display report with GenUI
```

## 10. Decision Tree: When to Use What

```mermaid
flowchart TD
    Start["Need AI in your app?"]

    Start -->|"Just chat"| BasicChat["Use CopilotPopup<br/>No hooks needed"]

    Start -->|"AI needs to<br/>see app state"| Readable["Add useCopilotReadable"]

    Start -->|"AI needs to<br/>do things"| Action["Add useCopilotAction"]

    Action -->|"Text response<br/>is enough"| NoRender["handler only"]

    Action -->|"Want custom UI<br/>in chat"| WithRender["Add render()"]

    WithRender -->|"Simple<br/>loading/success"| Static["Static GenUI"]

    WithRender -->|"Complex<br/>multi-step"| CoAgent["Consider CoAgents"]

    style Start fill:#e1f5fe
    style BasicChat fill:#c8e6c9
    style Readable fill:#fff9c4
    style Action fill:#ffccbc
    style WithRender fill:#e1bee7
    style CoAgent fill:#f8bbd9
```

---

## Quick Reference: Mermaid in VS Code

To preview these diagrams:

1. Install "Markdown Preview Mermaid Support" extension
2. Open this file
3. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows)

Or paste diagrams into https://mermaid.live for live editing.
