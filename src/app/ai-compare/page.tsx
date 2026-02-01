'use client';

import { useState } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import Link from 'next/link';
import {
  ArrowLeft,
  Scale,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Star,
  CheckCircle,
  XCircle,
  Lightbulb,
  Zap,
  TrendingUp,
  Code,
  Briefcase,
  GraduationCap,
  DollarSign,
  Users,
  Clock,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// ============================================================================
// GENERATIVE UI COMPONENTS
// ============================================================================

interface ComparisonItem {
  name: string;
  attributes: Record<string, string>;
}

function ComparisonTableCard({
  title,
  items,
  attributes,
  winner,
  status,
}: {
  title: string;
  items: ComparisonItem[];
  attributes: string[];
  winner?: string;
  status: string;
}) {
  if (status === 'executing') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-gray-600 dark:text-gray-400">Building comparison...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Scale className="w-5 h-5" />
          <span className="font-semibold">{title}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th key="attribute-header" className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">
                  Attribute
                </th>
                {items.map((item) => (
                  <th
                    key={`header-${item.name}`}
                    className={`text-left py-2 px-3 font-semibold ${
                      winner === item.name
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {item.name}
                    {winner === item.name && (
                      <Star className="w-4 h-4 inline ml-1 text-yellow-500" />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td key={`label-${attr}`} className="py-2 px-3 text-gray-600 dark:text-gray-400">{attr}</td>
                  {items.map((item) => (
                    <td key={`${item.name}-${attr}`} className="py-2 px-3 text-gray-900 dark:text-white">
                      {item.attributes[attr] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {winner && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300 font-medium">
              Recommended: {winner}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProsConsCard({
  title,
  pros,
  cons,
  status,
}: {
  title: string;
  pros: string[];
  cons: string[];
  status: string;
}) {
  if (status === 'executing') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          <span className="text-gray-600 dark:text-gray-400">Analyzing pros and cons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Scale className="w-5 h-5" />
          <span className="font-semibold">{title}</span>
        </div>
      </div>

      <div className="p-4 grid md:grid-cols-2 gap-4">
        {/* Pros */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-green-800 dark:text-green-300">Pros</span>
          </div>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="font-semibold text-red-800 dark:text-red-300">Cons</span>
          </div>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({
  question,
  recommendation,
  reasoning,
  confidence,
  alternatives,
  status,
}: {
  question: string;
  recommendation: string;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
  alternatives?: string[];
  status: string;
}) {
  const confidenceColors = {
    high: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  if (status === 'executing') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-amber-200 dark:border-amber-800 p-6">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          <span className="text-gray-600 dark:text-gray-400">Thinking through your question...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-amber-200 dark:border-amber-800 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Lightbulb className="w-5 h-5" />
          <span className="font-semibold">Recommendation</span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">You asked:</p>
        <p className="text-gray-900 dark:text-white font-medium mb-4">&quot;{question}&quot;</p>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-amber-900 dark:text-amber-200 text-lg">
              {recommendation}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${confidenceColors[confidence]}`}>
              {confidence} confidence
            </span>
          </div>
          <p className="text-amber-800 dark:text-amber-300 text-sm">{reasoning}</p>
        </div>

        {alternatives && alternatives.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
              Also consider
            </p>
            <div className="flex flex-wrap gap-2">
              {alternatives.map((alt, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DecisionMatrixCard({
  title,
  options,
  criteria,
  scores,
  winner,
  status,
}: {
  title: string;
  options: string[];
  criteria: string[];
  scores: Record<string, Record<string, number>>;
  winner?: string;
  status: string;
}) {
  if (status === 'executing') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-indigo-200 dark:border-indigo-800 p-6">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          <span className="text-gray-600 dark:text-gray-400">Building decision matrix...</span>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTotalScore = (option: string) => {
    return criteria.reduce((sum, c) => sum + (scores[option]?.[c] || 0), 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-indigo-200 dark:border-indigo-800 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">{title}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th key="criteria-header" className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">
                  Criteria
                </th>
                {options.map((option) => (
                  <th
                    key={`header-${option}`}
                    className={`text-center py-2 px-3 font-semibold ${
                      winner === option
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {option}
                    {winner === option && <Star className="w-4 h-4 inline ml-1 text-yellow-500" />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion) => (
                <tr key={criterion} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td key={`label-${criterion}`} className="py-2 px-3 text-gray-600 dark:text-gray-400">{criterion}</td>
                  {options.map((option) => {
                    const score = scores[option]?.[criterion] || 0;
                    return (
                      <td key={`${option}-${criterion}`} className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getScoreColor(score)}`} />
                          <span className="text-gray-900 dark:text-white font-medium">{score}/10</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr key="totals-row" className="bg-gray-50 dark:bg-gray-700/50 font-semibold">
                <td key="total-label" className="py-2 px-3 text-gray-900 dark:text-white">Total Score</td>
                {options.map((option) => (
                  <td
                    key={`total-${option}`}
                    className={`py-2 px-3 text-center ${
                      winner === option
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {getTotalScore(option)}/{criteria.length * 10}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {winner && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-indigo-800 dark:text-indigo-300 font-medium">
              Winner: {winner} (highest total score)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE PROMPT BUTTON
// ============================================================================

function ExamplePrompt({ icon: Icon, label, prompt }: { icon: React.ElementType; label: string; prompt: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-3 w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all text-left group"
    >
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-white text-sm">{label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{prompt}</div>
      </div>
      <div className="text-gray-400">
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 group-hover:text-blue-500" />
        )}
      </div>
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIComparePage() {
  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Compare two or more options
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'compareOptions',
    description: 'Create a comparison table for two or more options. Use when user asks to compare things like "React vs Vue", "AWS vs Azure", etc. IMPORTANT: After calling this action, do NOT repeat the comparison data in text - the UI card already shows it. Just add a brief concluding sentence if needed.',
    parameters: [
      { name: 'title', type: 'string', description: 'Title for the comparison', required: true },
      { name: 'items', type: 'object[]', description: 'Array of items to compare, each with name and attributes object', required: true },
      { name: 'attributes', type: 'string[]', description: 'List of attribute names to compare', required: true },
      { name: 'winner', type: 'string', description: 'The recommended option (optional)', required: false },
    ],
    render: ({ status, args }) => (
      <ComparisonTableCard
        title={args.title || 'Comparison'}
        items={(args.items as ComparisonItem[]) || []}
        attributes={(args.attributes as string[]) || []}
        winner={args.winner}
        status={status}
      />
    ),
    handler: async () => {
      return 'Comparison table displayed above. Do not repeat the table contents in text.';
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Pros and Cons list
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'listProsAndCons',
    description: 'Create a pros and cons list for a single option. Use when user asks "what are the pros and cons of X" or "should I do X". IMPORTANT: After calling this action, do NOT repeat the pros/cons in text - the UI card already shows them. Just add a brief summary or recommendation if needed.',
    parameters: [
      { name: 'title', type: 'string', description: 'What we are evaluating', required: true },
      { name: 'pros', type: 'string[]', description: 'List of advantages/pros', required: true },
      { name: 'cons', type: 'string[]', description: 'List of disadvantages/cons', required: true },
    ],
    render: ({ status, args }) => (
      <ProsConsCard
        title={args.title || ''}
        pros={(args.pros as string[]) || []}
        cons={(args.cons as string[]) || []}
        status={status}
      />
    ),
    handler: async () => {
      return 'Pros and cons displayed above. Do not repeat the list in text.';
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Make a recommendation
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'makeRecommendation',
    description: 'Give a recommendation with reasoning. Use when user asks "should I...", "what should I choose", "which is better for me". IMPORTANT: After calling this action, do NOT repeat the recommendation in text - the UI card already shows it.',
    parameters: [
      { name: 'question', type: 'string', description: 'The user question', required: true },
      { name: 'recommendation', type: 'string', description: 'The recommended choice', required: true },
      { name: 'reasoning', type: 'string', description: 'Why this is recommended', required: true },
      { name: 'confidence', type: 'string', description: 'Confidence level: high, medium, or low', required: true },
      { name: 'alternatives', type: 'string[]', description: 'Other options to consider', required: false },
    ],
    render: ({ status, args }) => (
      <RecommendationCard
        question={args.question || ''}
        recommendation={args.recommendation || ''}
        reasoning={args.reasoning || ''}
        confidence={(args.confidence as 'high' | 'medium' | 'low') || 'medium'}
        alternatives={args.alternatives as string[]}
        status={status}
      />
    ),
    handler: async () => {
      return 'Recommendation displayed above. Do not repeat it in text.';
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Decision matrix with scores
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'createDecisionMatrix',
    description: 'Create a scored decision matrix. Use when user wants to evaluate options against multiple criteria with scores. IMPORTANT: After calling this action, do NOT repeat the scores or matrix in text - the UI card already shows it. Just add a brief conclusion if needed.',
    parameters: [
      { name: 'title', type: 'string', description: 'Title for the decision matrix', required: true },
      { name: 'options', type: 'string[]', description: 'Options to evaluate', required: true },
      { name: 'criteria', type: 'string[]', description: 'Criteria to score against', required: true },
      { name: 'scores', type: 'object', description: 'Scores object: { optionName: { criteriaName: score } }', required: true },
      { name: 'winner', type: 'string', description: 'The winning option', required: false },
    ],
    render: ({ status, args }) => (
      <DecisionMatrixCard
        title={args.title || 'Decision Matrix'}
        options={(args.options as string[]) || []}
        criteria={(args.criteria as string[]) || []}
        scores={(args.scores as Record<string, Record<string, number>>) || {}}
        winner={args.winner}
        status={status}
      />
    ),
    handler: async () => {
      return 'Decision matrix displayed above. Do not repeat the scores in text.';
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER - Split Screen Layout
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Side - Info Panel */}
      <div className="w-1/2 p-8 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <ThemeToggle />
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm mb-4">
            <Scale className="w-4 h-4" />
            AI Decision Helper
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Compare & Decide
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ask the AI to compare options, analyze trade-offs, or help you make decisions.
            Get visual comparison tables, pros/cons lists, and scored matrices.
          </p>
        </div>

        {/* What It Can Do */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            What Can This Do?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">Comparison Tables</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-gray-700 dark:text-gray-300">Pros & Cons Lists</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-gray-700 dark:text-gray-300">Recommendations</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-gray-700 dark:text-gray-300">Decision Matrices</span>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Try These (click to copy)
          </h2>
          <div className="space-y-2">
            <ExamplePrompt
              icon={Code}
              label="Tech Comparison"
              prompt="Compare React vs Vue vs Svelte for building a web app"
            />
            <ExamplePrompt
              icon={Briefcase}
              label="Career Decision"
              prompt="What are the pros and cons of switching from a corporate job to a startup?"
            />
            <ExamplePrompt
              icon={GraduationCap}
              label="Education Choice"
              prompt="Should I get a CS degree or do a coding bootcamp? I have 2 years and $30k."
            />
            <ExamplePrompt
              icon={DollarSign}
              label="Investment Analysis"
              prompt="Compare stocks vs real estate vs index funds for a beginner investor"
            />
            <ExamplePrompt
              icon={Users}
              label="Hiring Decision"
              prompt="Create a decision matrix to evaluate job candidates on skills, experience, and culture fit"
            />
            <ExamplePrompt
              icon={Clock}
              label="Work Style"
              prompt="Pros and cons of working remotely vs going to an office"
            />
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Tips for Better Results
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Be specific about your context (budget, timeline, experience)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Ask for a decision matrix when you have multiple criteria</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Use &quot;pros and cons&quot; for single option evaluation</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Chat */}
      <div className="w-1/2 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <CopilotChat
          labels={{
            title: 'Decision Helper',
            initial: "Hi! I can help you compare options and make decisions.\n\nTry asking me to:\n• Compare two or more options\n• List pros and cons of something\n• Help you decide between choices\n• Create a decision matrix\n\nWhat would you like to analyze?",
          }}
          className="h-full"
        />
      </div>
    </div>
  );
}
