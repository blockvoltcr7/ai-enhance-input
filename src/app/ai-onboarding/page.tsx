'use client';

import { useState } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import Link from 'next/link';
import {
  ArrowLeft,
  Zap,
  Droplets,
  Wind,
  Hammer,
  Flame,
  Wrench,
  Car,
  TreePine,
  HardHat,
  Clock,
  Briefcase,
  GraduationCap,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// ============================================================================
// TYPES
// ============================================================================

interface OnboardingData {
  trade: string | null;
  experienceLevel: string | null;
  goals: string[];
  location: string | null;
  availability: string | null;
}

interface TradeOption {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

interface ExperienceOption {
  id: string;
  label: string;
  years: string;
  icon: React.ElementType;
  description: string;
}

interface GoalOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

// ============================================================================
// DATA
// ============================================================================

const TRADES: TradeOption[] = [
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'yellow', description: 'Wiring, panels, installations' },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, color: 'blue', description: 'Pipes, fixtures, water systems' },
  { id: 'hvac', name: 'HVAC', icon: Wind, color: 'cyan', description: 'Heating, cooling, ventilation' },
  { id: 'carpentry', name: 'Carpentry', icon: Hammer, color: 'amber', description: 'Framing, finishing, cabinetry' },
  { id: 'welding', name: 'Welding', icon: Flame, color: 'orange', description: 'Metal fabrication, joining' },
  { id: 'pipefitting', name: 'Pipefitting', icon: Wrench, color: 'gray', description: 'Industrial pipe systems' },
  { id: 'automotive', name: 'Automotive', icon: Car, color: 'red', description: 'Vehicle repair, diagnostics' },
  { id: 'landscaping', name: 'Landscaping', icon: TreePine, color: 'green', description: 'Outdoor design, maintenance' },
];

const EXPERIENCE_LEVELS: ExperienceOption[] = [
  { id: 'new', label: 'Just Starting', years: '< 1 year', icon: GraduationCap, description: 'New to the trade, eager to learn' },
  { id: 'apprentice', label: 'Apprentice', years: '1-3 years', icon: HardHat, description: 'Building foundational skills' },
  { id: 'journeyman', label: 'Journeyman', years: '4-7 years', icon: Briefcase, description: 'Skilled and independent' },
  { id: 'master', label: 'Master/Expert', years: '8+ years', icon: Target, description: 'Highly experienced, can mentor' },
];

const GOALS: GoalOption[] = [
  { id: 'find-job', label: 'Find a new job', icon: Briefcase },
  { id: 'higher-pay', label: 'Earn higher pay', icon: DollarSign },
  { id: 'learn-skills', label: 'Learn new skills', icon: GraduationCap },
  { id: 'get-certified', label: 'Get certified', icon: CheckCircle },
  { id: 'career-change', label: 'Change specialization', icon: TrendingUp },
  { id: 'start-business', label: 'Start my own business', icon: Users },
  { id: 'relocate', label: 'Relocate to new area', icon: MapPin },
  { id: 'network', label: 'Build my network', icon: Users },
];

// ============================================================================
// GENERATIVE UI COMPONENTS
// ============================================================================

function TradeSelectionCards({
  onSelect,
  selectedTrade,
}: {
  onSelect: (tradeId: string) => void;
  selectedTrade: string | null;
}) {
  const colorClasses: Record<string, string> = {
    yellow: 'hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
    blue: 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    cyan: 'hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20',
    amber: 'hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20',
    orange: 'hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20',
    gray: 'hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
    red: 'hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
    green: 'hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20',
  };

  const selectedClasses: Record<string, string> = {
    yellow: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    blue: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20',
    cyan: 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20',
    amber: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20',
    orange: 'border-orange-400 bg-orange-50 dark:bg-orange-900/20',
    gray: 'border-gray-400 bg-gray-100 dark:bg-gray-700',
    red: 'border-red-400 bg-red-50 dark:bg-red-900/20',
    green: 'border-green-400 bg-green-50 dark:bg-green-900/20',
  };

  const iconClasses: Record<string, string> = {
    yellow: 'text-yellow-500',
    blue: 'text-blue-500',
    cyan: 'text-cyan-500',
    amber: 'text-amber-500',
    orange: 'text-orange-500',
    gray: 'text-gray-500',
    red: 'text-red-500',
    green: 'text-green-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <span className="font-medium text-gray-900 dark:text-white">Select your trade:</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TRADES.map((trade) => {
          const Icon = trade.icon;
          const isSelected = selectedTrade === trade.id;
          return (
            <button
              key={trade.id}
              onClick={() => onSelect(trade.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${
                isSelected
                  ? selectedClasses[trade.color]
                  : `border-gray-200 dark:border-gray-600 ${colorClasses[trade.color]}`
              }`}
            >
              <div className={`p-2 rounded-lg bg-white dark:bg-gray-900 ${iconClasses[trade.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {trade.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {trade.description}
                </div>
              </div>
              {isSelected && (
                <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExperienceLevelCards({
  onSelect,
  selectedLevel,
}: {
  onSelect: (levelId: string) => void;
  selectedLevel: string | null;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-500" />
        <span className="font-medium text-gray-900 dark:text-white">Your experience level:</span>
      </div>
      <div className="space-y-2">
        {EXPERIENCE_LEVELS.map((level) => {
          const Icon = level.icon;
          const isSelected = selectedLevel === level.id;
          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer text-left ${
                isSelected
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {level.label}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {level.years}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {level.description}
                </div>
              </div>
              {isSelected && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GoalsSelectionCards({
  onToggle,
  selectedGoals,
}: {
  onToggle: (goalId: string) => void;
  selectedGoals: string[];
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-green-500" />
        <span className="font-medium text-gray-900 dark:text-white">
          What are your goals? <span className="text-sm font-normal text-gray-500">(select all that apply)</span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {GOALS.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoals.includes(goal.id);
          return (
            <button
              key={goal.id}
              onClick={() => onToggle(goal.id)}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${
                isSelected
                  ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-900/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
              <span className={`text-sm ${isSelected ? 'text-green-700 dark:text-green-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                {goal.label}
              </span>
              {isSelected && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LocationInput({
  onSubmit,
  currentValue,
}: {
  onSubmit: (location: string) => void;
  currentValue: string | null;
}) {
  const [inputValue, setInputValue] = useState(currentValue || '');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-red-500" />
        <span className="font-medium text-gray-900 dark:text-white">Where are you located?</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g., Austin, TX"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              onSubmit(inputValue.trim());
            }
          }}
        />
        <button
          onClick={() => inputValue.trim() && onSubmit(inputValue.trim())}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

function OnboardingSummary({
  data,
  onComplete,
}: {
  data: OnboardingData;
  onComplete: () => void;
}) {
  const trade = TRADES.find((t) => t.id === data.trade);
  const experience = EXPERIENCE_LEVELS.find((e) => e.id === data.experienceLevel);
  const goals = GOALS.filter((g) => data.goals.includes(g.id));

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <span className="font-semibold text-green-800 dark:text-green-300 text-lg">
          Profile Summary
        </span>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-3">
          {trade && <trade.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
          <span className="text-gray-900 dark:text-white">
            <strong>{trade?.name}</strong> professional
          </span>
        </div>

        <div className="flex items-center gap-3">
          {experience && <experience.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
          <span className="text-gray-900 dark:text-white">
            <strong>{experience?.label}</strong> ({experience?.years})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-900 dark:text-white">
            Based in <strong>{data.location}</strong>
          </span>
        </div>

        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div>
            <span className="text-gray-700 dark:text-gray-300">Goals: </span>
            <span className="text-gray-900 dark:text-white">
              {goals.map((g) => g.label).join(', ')}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        Create My Profile
      </button>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIOnboardingPage() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    trade: null,
    experienceLevel: null,
    goals: [],
    location: null,
    availability: null,
  });
  const [isComplete, setIsComplete] = useState(false);

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT ACTIONS
  // ──────────────────────────────────────────────────────────────────────────

  // Action: Show trade selection
  useCopilotAction({
    name: 'showTradeSelection',
    description: 'Display trade selection cards for the user to choose their profession. Use this at the start of onboarding or when the user wants to select/change their trade.',
    parameters: [],
    render: () => (
      <TradeSelectionCards
        onSelect={(tradeId) => {
          setOnboardingData((prev) => ({ ...prev, trade: tradeId }));
        }}
        selectedTrade={onboardingData.trade}
      />
    ),
    handler: async () => {
      return 'Trade selection displayed. User can click on their trade.';
    },
  });

  // Action: Show experience level selection
  useCopilotAction({
    name: 'showExperienceSelection',
    description: 'Display experience level options for the user to indicate their skill level. Use this after trade selection.',
    parameters: [],
    render: () => (
      <ExperienceLevelCards
        onSelect={(levelId) => {
          setOnboardingData((prev) => ({ ...prev, experienceLevel: levelId }));
        }}
        selectedLevel={onboardingData.experienceLevel}
      />
    ),
    handler: async () => {
      return 'Experience level selection displayed. User can click their level.';
    },
  });

  // Action: Show goals selection
  useCopilotAction({
    name: 'showGoalsSelection',
    description: 'Display goals selection cards for the user to pick what they want to achieve. Use this after experience selection.',
    parameters: [],
    render: () => (
      <GoalsSelectionCards
        onToggle={(goalId) => {
          setOnboardingData((prev) => ({
            ...prev,
            goals: prev.goals.includes(goalId)
              ? prev.goals.filter((g) => g !== goalId)
              : [...prev.goals, goalId],
          }));
        }}
        selectedGoals={onboardingData.goals}
      />
    ),
    handler: async () => {
      return 'Goals selection displayed. User can select multiple goals.';
    },
  });

  // Action: Show location input
  useCopilotAction({
    name: 'showLocationInput',
    description: 'Display location input field for the user to enter their city/region. Use this after goals selection.',
    parameters: [],
    render: () => (
      <LocationInput
        onSubmit={(location) => {
          setOnboardingData((prev) => ({ ...prev, location }));
        }}
        currentValue={onboardingData.location}
      />
    ),
    handler: async () => {
      return 'Location input displayed. User can type their location.';
    },
  });

  // Action: Show summary
  useCopilotAction({
    name: 'showOnboardingSummary',
    description: 'Display the complete onboarding summary with all collected information. Use this when all fields are filled.',
    parameters: [],
    render: () => (
      <OnboardingSummary
        data={onboardingData}
        onComplete={() => setIsComplete(true)}
      />
    ),
    handler: async () => {
      return 'Summary displayed. User can review and confirm their profile.';
    },
  });

  // Action: Set trade directly (from conversation)
  useCopilotAction({
    name: 'setTrade',
    description: 'Set the user trade directly from conversation. Use when user mentions their trade.',
    parameters: [
      {
        name: 'tradeId',
        type: 'string',
        description: 'Trade ID: electrical, plumbing, hvac, carpentry, welding, pipefitting, automotive, landscaping',
        required: true,
      },
    ],
    render: ({ args }) => {
      const trade = TRADES.find((t) => t.id === args.tradeId);
      if (!trade) {
        return (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
            <span className="text-yellow-700 dark:text-yellow-300">Setting trade...</span>
          </div>
        );
      }
      const Icon = trade.icon;
      return (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800 flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
            <Icon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-green-800 dark:text-green-300 font-medium">
              Trade set: {trade.name}
            </div>
            <div className="text-green-600 dark:text-green-400 text-sm">
              {trade.description}
            </div>
          </div>
        </div>
      );
    },
    handler: async ({ tradeId }) => {
      if (TRADES.find((t) => t.id === tradeId)) {
        setOnboardingData((prev) => ({ ...prev, trade: tradeId }));
        return `Trade set to ${tradeId}`;
      }
      return 'Invalid trade ID';
    },
  });

  // Action: Set experience directly
  useCopilotAction({
    name: 'setExperience',
    description: 'Set experience level directly from conversation.',
    parameters: [
      {
        name: 'levelId',
        type: 'string',
        description: 'Experience ID: new, apprentice, journeyman, master',
        required: true,
      },
    ],
    render: ({ args }) => {
      const level = EXPERIENCE_LEVELS.find((l) => l.id === args.levelId);
      if (!level) {
        return (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
            <span className="text-yellow-700 dark:text-yellow-300">Setting experience level...</span>
          </div>
        );
      }
      const Icon = level.icon;
      return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-blue-800 dark:text-blue-300 font-medium">
              Experience: {level.label}
            </div>
            <div className="text-blue-600 dark:text-blue-400 text-sm">
              {level.years} - {level.description}
            </div>
          </div>
        </div>
      );
    },
    handler: async ({ levelId }) => {
      if (EXPERIENCE_LEVELS.find((l) => l.id === levelId)) {
        setOnboardingData((prev) => ({ ...prev, experienceLevel: levelId }));
        return `Experience set to ${levelId}`;
      }
      return 'Invalid experience level';
    },
  });

  // Action: Set location directly
  useCopilotAction({
    name: 'setLocation',
    description: 'Set location directly from conversation.',
    parameters: [
      { name: 'location', type: 'string', description: 'City, State', required: true },
    ],
    render: ({ args }) => (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 flex items-center gap-3">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
          <MapPin className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <div className="text-red-800 dark:text-red-300 font-medium">
            Location set: {args.location}
          </div>
        </div>
      </div>
    ),
    handler: async ({ location }) => {
      setOnboardingData((prev) => ({ ...prev, location }));
      return `Location set to ${location}`;
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome aboard!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your profile has been created. You&apos;re ready to explore opportunities
            in {TRADES.find((t) => t.id === onboardingData.trade)?.name}.
          </p>
          <div className="space-y-3">
            <Link
              href="/ai-wizard"
              className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Complete Full Profile
            </Link>
            <Link
              href="/"
              className="block w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Side - Info Panel */}
      <div className="w-1/2 p-8 flex flex-col">
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
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Guided Onboarding
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Let&apos;s build your profile together
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Chat with our AI assistant to set up your skilled trades profile.
              It&apos;s like having a conversation - just tell us about yourself!
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-3">
            <ProgressItem
              label="Trade"
              value={TRADES.find((t) => t.id === onboardingData.trade)?.name}
              isComplete={!!onboardingData.trade}
            />
            <ProgressItem
              label="Experience"
              value={EXPERIENCE_LEVELS.find((e) => e.id === onboardingData.experienceLevel)?.label}
              isComplete={!!onboardingData.experienceLevel}
            />
            <ProgressItem
              label="Goals"
              value={onboardingData.goals.length > 0 ? `${onboardingData.goals.length} selected` : undefined}
              isComplete={onboardingData.goals.length > 0}
            />
            <ProgressItem
              label="Location"
              value={onboardingData.location || undefined}
              isComplete={!!onboardingData.location}
            />
          </div>
        </div>
      </div>

      {/* Right Side - Chat */}
      <div className="w-1/2 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <CopilotChat
            labels={{
              title: 'Onboarding Assistant',
              initial: "Hi! I'm here to help you set up your profile. Let's start - what trade do you work in? You can tell me directly, or I can show you some options to choose from.",
            }}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function ProgressItem({
  label,
  value,
  isComplete,
}: {
  label: string;
  value?: string;
  isComplete: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isComplete
            ? 'bg-green-100 dark:bg-green-900/30'
            : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        {isComplete ? (
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500" />
        )}
      </div>
      <div className="flex-1">
        <span className="text-gray-900 dark:text-white font-medium">{label}</span>
        {value && (
          <span className="text-gray-500 dark:text-gray-400 ml-2">· {value}</span>
        )}
      </div>
    </div>
  );
}
