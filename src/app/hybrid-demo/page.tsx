'use client';

import { useState } from 'react';
import { useCompletion } from '@ai-sdk/react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Undo2,
  MessageSquare,
  Zap,
  CheckCircle,
  RefreshCw,
  Wand2,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// ============================================================================
// TYPES
// ============================================================================

interface FormData {
  jobTitle: string;
  skills: string;
  experience: string;
  goals: string;
}

// ============================================================================
// SPARKLE BUTTON COMPONENT (Vercel AI SDK)
// ============================================================================

function SparkleEnhanceButton({
  value,
  onEnhance,
  context,
  isLoading,
}: {
  value: string;
  onEnhance: (enhanced: string) => void;
  context: string;
  isLoading: boolean;
}) {
  const [previousValue, setPreviousValue] = useState<string | null>(null);

  const { complete, isLoading: isEnhancing } = useCompletion({
    api: '/api/enhance',
    streamProtocol: 'text',
    onFinish: (_prompt: string, completion: string) => {
      setPreviousValue(value);
      onEnhance(completion);
    },
  });

  const handleEnhance = () => {
    if (!value.trim() || isEnhancing) return;
    // The complete() function sends the first arg as 'prompt', but we need 'text'
    // So we pass an empty prompt and include 'text' in the body
    complete('', { body: { text: value, context } });
  };

  const handleUndo = () => {
    if (previousValue !== null) {
      onEnhance(previousValue);
      setPreviousValue(null);
    }
  };

  const loading = isLoading || isEnhancing;

  return (
    <div className="flex items-center gap-1">
      {previousValue !== null && (
        <button
          type="button"
          onClick={handleUndo}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Undo enhancement"
        >
          <Undo2 className="w-4 h-4" />
        </button>
      )}
      <button
        type="button"
        onClick={handleEnhance}
        disabled={!value.trim() || loading}
        className={`p-1.5 rounded-md transition-all ${
          loading
            ? 'text-purple-400 cursor-wait'
            : value.trim()
              ? 'text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer'
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
        }`}
        title="Enhance with AI (quick)"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

// ============================================================================
// GENERATIVE UI COMPONENTS (CopilotKit)
// ============================================================================

function BulkEnhancePreview({
  original,
  enhanced,
  status,
  onApply,
}: {
  original: FormData;
  enhanced: Partial<FormData>;
  status: string;
  onApply: () => void;
}) {
  const fields = [
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'skills', label: 'Skills' },
    { key: 'experience', label: 'Experience' },
    { key: 'goals', label: 'Goals' },
  ] as const;

  const changedFields = fields.filter(
    (f) => enhanced[f.key] && enhanced[f.key] !== original[f.key]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Wand2 className="w-5 h-5" />
          <span className="font-semibold">
            {status === 'executing' ? 'Enhancing all fields...' : 'Bulk Enhancement Preview'}
          </span>
        </div>
      </div>

      <div className="p-4">
        {status === 'executing' ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {changedFields.map((field) => (
                <div key={field.key} className="text-sm">
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}:
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-green-800 dark:text-green-300">
                    {enhanced[field.key]}
                  </div>
                </div>
              ))}
              {changedFields.length === 0 && (
                <p className="text-gray-500 text-center py-4">No changes to preview</p>
              )}
            </div>

            {changedFields.length > 0 && (
              <button
                onClick={onApply}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Apply All Enhancements
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FieldSuggestionCard({
  fieldName,
  suggestion,
  status,
  onApply,
}: {
  fieldName: string;
  suggestion: string;
  status: string;
  onApply: () => void;
}) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      {status === 'executing' ? (
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Thinking of suggestions...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">Suggestion for {fieldName}:</span>
          </div>
          <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">{suggestion}</p>
          <button
            onClick={onApply}
            className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Use this suggestion
          </button>
        </>
      )}
    </div>
  );
}

function ResetConfirmCard({
  status,
}: {
  status: string;
}) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
      {status === 'executing' ? (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Resetting form...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2 text-red-700 dark:text-red-300">
            <RefreshCw className="w-4 h-4" />
            <span className="font-medium">Form Reset</span>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm">All fields have been cleared.</p>
        </>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HybridDemoPage() {
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    skills: '',
    experience: '',
    goals: '',
  });
  const [isEnhancing] = useState<string | null>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Share state with AI
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotReadable({
    description: 'Current job application form data with job title, skills, experience, and career goals',
    value: JSON.stringify(formData),
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Bulk enhance all fields
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'enhanceAllFields',
    description: 'Enhance ALL form fields at once to be more professional. Use when user says "make everything better" or "enhance all fields".',
    parameters: [
      { name: 'jobTitle', type: 'string', description: 'Enhanced job title', required: false },
      { name: 'skills', type: 'string', description: 'Enhanced skills description', required: false },
      { name: 'experience', type: 'string', description: 'Enhanced experience description', required: false },
      { name: 'goals', type: 'string', description: 'Enhanced career goals', required: false },
    ],
    render: ({ status, args }) => (
      <BulkEnhancePreview
        original={formData}
        enhanced={args as Partial<FormData>}
        status={status}
        onApply={() => {
          const newData = { ...formData };
          if (args.jobTitle) newData.jobTitle = args.jobTitle;
          if (args.skills) newData.skills = args.skills;
          if (args.experience) newData.experience = args.experience;
          if (args.goals) newData.goals = args.goals;
          setFormData(newData);
        }}
      />
    ),
    handler: async (args) => {
      const newData = { ...formData };
      if (args.jobTitle) newData.jobTitle = args.jobTitle;
      if (args.skills) newData.skills = args.skills;
      if (args.experience) newData.experience = args.experience;
      if (args.goals) newData.goals = args.goals;
      setFormData(newData);
      return 'All fields enhanced. Click "Apply All Enhancements" to update the form.';
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Suggest content for a field
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'suggestFieldContent',
    description: 'Suggest what to write for a specific field. Use when user asks "what should I write for..." or "help me with..."',
    parameters: [
      { name: 'fieldName', type: 'string', description: 'Field name: jobTitle, skills, experience, or goals', required: true },
      { name: 'suggestion', type: 'string', description: 'The suggested content for the field', required: true },
    ],
    render: ({ status, args }) => (
      <FieldSuggestionCard
        fieldName={args.fieldName || ''}
        suggestion={args.suggestion || ''}
        status={status}
        onApply={() => {
          if (args.fieldName && args.suggestion) {
            updateField(args.fieldName as keyof FormData, args.suggestion);
          }
        }}
      />
    ),
    handler: async ({ fieldName, suggestion }) => {
      if (fieldName && suggestion) {
        updateField(fieldName as keyof FormData, suggestion);
      }
      return `Suggestion provided for ${fieldName}. Click "Use this suggestion" to apply.`;
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Auto-fill from description
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'autoFillFromDescription',
    description: 'Fill the form based on a natural language description of the user. Use when user describes themselves.',
    parameters: [
      { name: 'jobTitle', type: 'string', required: false },
      { name: 'skills', type: 'string', required: false },
      { name: 'experience', type: 'string', required: false },
      { name: 'goals', type: 'string', required: false },
    ],
    render: ({ status, args }) => (
      <BulkEnhancePreview
        original={formData}
        enhanced={args as Partial<FormData>}
        status={status}
        onApply={() => {
          const newData = { ...formData };
          if (args.jobTitle) newData.jobTitle = args.jobTitle;
          if (args.skills) newData.skills = args.skills;
          if (args.experience) newData.experience = args.experience;
          if (args.goals) newData.goals = args.goals;
          setFormData(newData);
        }}
      />
    ),
    handler: async (args) => {
      const newData = { ...formData };
      if (args.jobTitle) newData.jobTitle = args.jobTitle;
      if (args.skills) newData.skills = args.skills;
      if (args.experience) newData.experience = args.experience;
      if (args.goals) newData.goals = args.goals;
      setFormData(newData);
      return 'Form auto-filled based on your description.';
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Reset form
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'resetForm',
    description: 'Clear all form fields. Use when user wants to start over.',
    parameters: [],
    render: ({ status }) => (
      <ResetConfirmCard status={status} />
    ),
    handler: async () => {
      setFormData({ jobTitle: '', skills: '', experience: '', goals: '' });
      return 'Form has been reset.';
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Demos
          </Link>
          <ThemeToggle />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>+</span>
            <MessageSquare className="w-4 h-4" />
            Hybrid Pattern
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sparkle + CopilotKit
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Best of both worlds: Quick sparkle buttons + powerful chat assistant
          </p>
        </div>

        {/* When to Use Each */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-purple-800 dark:text-purple-300">Sparkle ✨</span>
            </div>
            <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
              <li>• Quick single-field polish</li>
              <li>• No chat needed</li>
              <li>• Instant enhancement</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-800 dark:text-blue-300">Chat 💬</span>
            </div>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• &quot;Enhance everything&quot;</li>
              <li>• &quot;What should I write?&quot;</li>
              <li>• Complex operations</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Job Application Form
          </h2>

          <div className="space-y-5">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title
              </label>
              <div className={`relative ${isEnhancing === 'jobTitle' ? 'shimmer-bg' : ''}`}>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                  placeholder="e.g., Senior Electrician"
                  className="w-full px-4 py-2.5 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <SparkleEnhanceButton
                    value={formData.jobTitle}
                    onEnhance={(v) => updateField('jobTitle', v)}
                    context="Job title for a skilled trades position. Make it professional and specific."
                    isLoading={isEnhancing === 'jobTitle'}
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skills
              </label>
              <div className={`relative ${isEnhancing === 'skills' ? 'shimmer-bg' : ''}`}>
                <textarea
                  value={formData.skills}
                  onChange={(e) => updateField('skills', e.target.value)}
                  placeholder="e.g., wiring, panel installation, troubleshooting..."
                  rows={3}
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                />
                <div className="absolute right-2 top-2">
                  <SparkleEnhanceButton
                    value={formData.skills}
                    onEnhance={(v) => updateField('skills', v)}
                    context="Technical skills for a skilled trades job application. Format as a professional list."
                    isLoading={isEnhancing === 'skills'}
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience
              </label>
              <div className={`relative ${isEnhancing === 'experience' ? 'shimmer-bg' : ''}`}>
                <textarea
                  value={formData.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                  placeholder="e.g., 5 years residential, some commercial..."
                  rows={3}
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                />
                <div className="absolute right-2 top-2">
                  <SparkleEnhanceButton
                    value={formData.experience}
                    onEnhance={(v) => updateField('experience', v)}
                    context="Work experience summary for a job application. Make it compelling and professional."
                    isLoading={isEnhancing === 'experience'}
                  />
                </div>
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Career Goals
              </label>
              <div className={`relative ${isEnhancing === 'goals' ? 'shimmer-bg' : ''}`}>
                <textarea
                  value={formData.goals}
                  onChange={(e) => updateField('goals', e.target.value)}
                  placeholder="e.g., want to move into commercial work, get more certs..."
                  rows={3}
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                />
                <div className="absolute right-2 top-2">
                  <SparkleEnhanceButton
                    value={formData.goals}
                    onEnhance={(v) => updateField('goals', v)}
                    context="Career goals and aspirations for a skilled trades professional. Make it ambitious yet realistic."
                    isLoading={isEnhancing === 'goals'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Submit Application
            </button>
          </div>
        </div>

        {/* Try These */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Try These Interactions
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                Sparkle ✨ (click the button)
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>1. Type &quot;electrician&quot; in Job Title</li>
                <li>2. Click ✨ to enhance</li>
                <li>3. See instant improvement</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                Chat 💬 (use the popup)
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• &quot;I&apos;m a plumber with 5 years exp&quot;</li>
                <li>• &quot;Enhance all my fields&quot;</li>
                <li>• &quot;What should I write for goals?&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CopilotKit Chat */}
      <CopilotPopup
        labels={{
          title: 'Form Assistant',
          initial:
            "Hi! I can help with your application. Try:\n• Describe yourself and I'll fill the form\n• Ask me to enhance all fields at once\n• Ask what to write for any field",
        }}
      />
    </div>
  );
}
