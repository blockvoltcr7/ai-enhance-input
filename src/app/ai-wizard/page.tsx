'use client';

import { useState } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  Target,
  CheckCircle,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// ============================================================================
// TYPES
// ============================================================================

interface ProfileData {
  // Step 1: Personal Info
  fullName: string;
  email: string;
  phone: string;
  location: string;
  // Step 2: Skills & Experience
  trade: string;
  yearsExperience: string;
  skills: string;
  certifications: string;
  // Step 3: Goals
  careerGoals: string;
  preferredWorkType: string;
  availability: string;
}

const INITIAL_DATA: ProfileData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  trade: '',
  yearsExperience: '',
  skills: '',
  certifications: '',
  careerGoals: '',
  preferredWorkType: '',
  availability: '',
};

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Skills & Experience', icon: Briefcase },
  { id: 3, title: 'Goals', icon: Target },
  { id: 4, title: 'Review', icon: CheckCircle },
];

// ============================================================================
// GENERATIVE UI COMPONENTS
// ============================================================================

function ProfilePreviewCard({
  data,
  status,
  onApply,
  onApplyAndReview,
}: {
  data: Partial<ProfileData>;
  status: string;
  onApply: () => void;
  onApplyAndReview: () => void;
}) {
  const filledFields = Object.entries(data).filter(([, v]) => v && v.length > 0);
  const isExecuting = status === 'executing';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">
            {isExecuting ? 'Analyzing your profile...' : 'Profile Preview'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isExecuting ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Step indicators */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map((step) => {
                const stepFields =
                  step === 1
                    ? ['fullName', 'email', 'phone', 'location']
                    : step === 2
                      ? ['trade', 'yearsExperience', 'skills', 'certifications']
                      : ['careerGoals', 'preferredWorkType', 'availability'];
                const filled = stepFields.filter(
                  (f) => data[f as keyof ProfileData]
                ).length;
                const hasData = filled > 0;

                return (
                  <div
                    key={step}
                    className={`flex-1 text-center py-1 px-2 rounded text-xs ${
                      hasData
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    Step {step}: {filled} fields
                  </div>
                );
              })}
            </div>

            {/* Fields */}
            <div className="space-y-2 text-sm">
              {filledFields.map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">
                    {formatFieldName(key)}:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 truncate">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {filledFields.length === 0 && (
              <p className="text-gray-500 text-center py-4">No fields parsed</p>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onApply}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply to Form
              </button>
              <button
                onClick={onApplyAndReview}
                className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Apply & Review
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FieldEnhancementCard({
  fieldName,
  originalValue,
  enhancedValue,
  status,
  onApply,
}: {
  fieldName: string;
  originalValue: string;
  enhancedValue: string;
  status: string;
  onApply: () => void;
}) {
  const isExecuting = status === 'executing';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
      <div className="bg-purple-50 dark:bg-purple-900/30 px-4 py-2 border-b border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium text-sm">
            {isExecuting ? 'Enhancing...' : `Enhanced: ${formatFieldName(fieldName)}`}
          </span>
        </div>
      </div>

      <div className="p-4">
        {isExecuting ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {originalValue && (
              <div className="mb-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Original:
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 line-through">
                  {originalValue}
                </div>
              </div>
            )}

            <div className="mb-3">
              <div className="text-xs text-green-600 dark:text-green-400 mb-1">
                Enhanced:
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                {enhancedValue}
              </div>
            </div>

            <button
              onClick={onApply}
              className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Use Enhanced Version
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function NavigationCard({
  stepNumber,
  stepTitle,
  status,
}: {
  stepNumber: number;
  stepTitle: string;
  status: string;
}) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
        {status === 'executing' ? (
          <>
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Navigating...</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>
              Navigated to Step {stepNumber}: {stepTitle}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function MissingFieldsCard({ missingFields }: { missingFields: string[] }) {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
        <div>
          <div className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
            Missing Fields ({missingFields.length})
          </div>
          <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
            {missingFields.map((field) => (
              <li key={field}>• {formatFieldName(field)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function getStepFields(step: number): (keyof ProfileData)[] {
  switch (step) {
    case 1:
      return ['fullName', 'email', 'phone', 'location'];
    case 2:
      return ['trade', 'yearsExperience', 'skills', 'certifications'];
    case 3:
      return ['careerGoals', 'preferredWorkType', 'availability'];
    default:
      return [];
  }
}

function getMissingFields(data: ProfileData): string[] {
  const required: (keyof ProfileData)[] = [
    'fullName',
    'email',
    'trade',
    'yearsExperience',
    'skills',
    'careerGoals',
  ];
  return required.filter((field) => !data[field] || data[field].trim() === '');
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfileData>(INITIAL_DATA);
  const [lastEnhancedField, setLastEnhancedField] = useState<{
    field: string;
    original: string;
  } | null>(null);

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Share state with AI
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotReadable({
    description:
      'Current wizard form data for skilled trades profile. This includes personal info, skills/experience, and career goals.',
    value: JSON.stringify({
      currentStep,
      stepTitle: STEPS[currentStep - 1]?.title,
      formData,
      missingFields: getMissingFields(formData),
      completionPercentage: Math.round(
        ((Object.values(formData).filter((v) => v.trim() !== '').length) /
          Object.keys(formData).length) *
          100
      ),
    }),
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Auto-fill entire profile
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'autoFillProfile',
    description:
      'Fill out the skilled trades profile form based on user description. Extract as many fields as possible from what the user tells you about themselves.',
    parameters: [
      { name: 'fullName', type: 'string', description: 'Full name', required: false },
      { name: 'email', type: 'string', description: 'Email address', required: false },
      { name: 'phone', type: 'string', description: 'Phone number', required: false },
      { name: 'location', type: 'string', description: 'City, State', required: false },
      {
        name: 'trade',
        type: 'string',
        description: 'Primary trade (e.g., Plumbing, Electrical, Carpentry, HVAC)',
        required: false,
      },
      {
        name: 'yearsExperience',
        type: 'string',
        description: 'Years of experience',
        required: false,
      },
      {
        name: 'skills',
        type: 'string',
        description: 'Key skills and specializations',
        required: false,
      },
      {
        name: 'certifications',
        type: 'string',
        description: 'Certifications and licenses',
        required: false,
      },
      {
        name: 'careerGoals',
        type: 'string',
        description: 'Career goals and aspirations',
        required: false,
      },
      {
        name: 'preferredWorkType',
        type: 'string',
        description: 'Preferred work type (residential, commercial, industrial)',
        required: false,
      },
      {
        name: 'availability',
        type: 'string',
        description: 'Availability (full-time, part-time, contract)',
        required: false,
      },
    ],
    render: ({ status, args }) => (
      <ProfilePreviewCard
        data={args as Partial<ProfileData>}
        status={status}
        onApply={() => {
          const newData = { ...formData };
          Object.entries(args).forEach(([key, value]) => {
            if (value && key in newData) {
              newData[key as keyof ProfileData] = value as string;
            }
          });
          setFormData(newData);
        }}
        onApplyAndReview={() => {
          const newData = { ...formData };
          Object.entries(args).forEach(([key, value]) => {
            if (value && key in newData) {
              newData[key as keyof ProfileData] = value as string;
            }
          });
          setFormData(newData);
          setCurrentStep(4);
        }}
      />
    ),
    handler: async (args) => {
      const newData = { ...formData };
      let fieldsUpdated = 0;
      Object.entries(args).forEach(([key, value]) => {
        if (value && key in newData) {
          newData[key as keyof ProfileData] = value as string;
          fieldsUpdated++;
        }
      });
      setFormData(newData);
      return `Profile updated with ${fieldsUpdated} fields. User can click "Apply to Form" or "Apply & Review" in the preview card.`;
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Enhance a specific field
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'enhanceField',
    description:
      'Enhance and improve a specific form field to be more professional and compelling. Use this when the user asks to improve or enhance a particular field.',
    parameters: [
      {
        name: 'fieldName',
        type: 'string',
        description:
          'The field to enhance (fullName, email, phone, location, trade, yearsExperience, skills, certifications, careerGoals, preferredWorkType, availability)',
        required: true,
      },
      {
        name: 'enhancedValue',
        type: 'string',
        description: 'The improved, professional version of the field content',
        required: true,
      },
    ],
    render: ({ status, args }) => (
      <FieldEnhancementCard
        fieldName={args.fieldName || ''}
        originalValue={lastEnhancedField?.original || formData[args.fieldName as keyof ProfileData] || ''}
        enhancedValue={args.enhancedValue || ''}
        status={status}
        onApply={() => {
          if (args.fieldName && args.enhancedValue) {
            setFormData((prev) => ({
              ...prev,
              [args.fieldName as keyof ProfileData]: args.enhancedValue,
            }));
          }
        }}
      />
    ),
    handler: async ({ fieldName, enhancedValue }) => {
      if (fieldName && enhancedValue) {
        setLastEnhancedField({
          field: fieldName,
          original: formData[fieldName as keyof ProfileData] || '',
        });
        setFormData((prev) => ({
          ...prev,
          [fieldName as keyof ProfileData]: enhancedValue,
        }));
      }
      return `Enhanced ${formatFieldName(fieldName)}. User can click "Use Enhanced Version" to apply.`;
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Navigate to a step
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'goToStep',
    description:
      'Navigate to a specific wizard step. Step 1 is Personal Info, Step 2 is Skills & Experience, Step 3 is Goals, Step 4 is Review.',
    parameters: [
      {
        name: 'stepNumber',
        type: 'number',
        description: 'The step number to navigate to (1-4)',
        required: true,
      },
    ],
    render: ({ status, args }) => (
      <NavigationCard
        stepNumber={args.stepNumber || 1}
        stepTitle={STEPS[(args.stepNumber || 1) - 1]?.title || ''}
        status={status}
      />
    ),
    handler: async ({ stepNumber }) => {
      const step = Math.max(1, Math.min(4, stepNumber));
      setCurrentStep(step);
      return `Navigated to Step ${step}: ${STEPS[step - 1].title}`;
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Check what's missing
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'checkMissingFields',
    description: 'Check which required fields are still empty in the profile',
    parameters: [],
    render: () => {
      const missing = getMissingFields(formData);
      if (missing.length === 0) {
        return (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Check className="w-5 h-5" />
              <span className="font-medium">All required fields are filled!</span>
            </div>
          </div>
        );
      }
      return <MissingFieldsCard missingFields={missing} />;
    },
    handler: async () => {
      const missing = getMissingFields(formData);
      if (missing.length === 0) {
        return 'All required fields are filled! The profile is ready for submission.';
      }
      return `Missing ${missing.length} required fields: ${missing.map(formatFieldName).join(', ')}`;
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // FORM HANDLERS
  // ──────────────────────────────────────────────────────────────────────────

  const updateField = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(4, prev + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI-Powered Profile Wizard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill out the form manually, or chat with the AI assistant to auto-fill your profile.
            Try saying: &quot;I&apos;m a plumber with 5 years experience looking for commercial work.&quot;
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const stepFields = getStepFields(step.id);
              const filledCount = stepFields.filter(
                (f) => formData[f]?.trim() !== ''
              ).length;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center cursor-pointer transition-all ${
                      isActive
                        ? 'scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                    {step.id !== 4 && (
                      <span className="text-xs text-gray-400">
                        {filledCount}/{stepFields.length} fields
                      </span>
                    )}
                  </button>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded ${
                        currentStep > step.id
                          ? 'bg-green-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(v) => updateField('fullName', v)}
                  placeholder="John Smith"
                />
                <FormField
                  label="Email"
                  value={formData.email}
                  onChange={(v) => updateField('email', v)}
                  placeholder="john@example.com"
                  type="email"
                />
                <FormField
                  label="Phone"
                  value={formData.phone}
                  onChange={(v) => updateField('phone', v)}
                  placeholder="(555) 123-4567"
                />
                <FormField
                  label="Location"
                  value={formData.location}
                  onChange={(v) => updateField('location', v)}
                  placeholder="Austin, TX"
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills & Experience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Skills & Experience
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Primary Trade"
                  value={formData.trade}
                  onChange={(v) => updateField('trade', v)}
                  placeholder="e.g., Plumbing, Electrical, HVAC"
                />
                <FormField
                  label="Years of Experience"
                  value={formData.yearsExperience}
                  onChange={(v) => updateField('yearsExperience', v)}
                  placeholder="e.g., 5 years"
                />
              </div>

              <FormTextarea
                label="Key Skills"
                value={formData.skills}
                onChange={(v) => updateField('skills', v)}
                placeholder="List your key skills and specializations..."
                rows={3}
              />

              <FormTextarea
                label="Certifications & Licenses"
                value={formData.certifications}
                onChange={(v) => updateField('certifications', v)}
                placeholder="List any certifications, licenses, or training..."
                rows={2}
              />
            </div>
          )}

          {/* Step 3: Goals */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Career Goals
              </h2>

              <FormTextarea
                label="Career Goals"
                value={formData.careerGoals}
                onChange={(v) => updateField('careerGoals', v)}
                placeholder="Describe your career aspirations and what you're looking for..."
                rows={4}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Preferred Work Type"
                  value={formData.preferredWorkType}
                  onChange={(v) => updateField('preferredWorkType', v)}
                  placeholder="e.g., Commercial, Residential"
                />
                <FormField
                  label="Availability"
                  value={formData.availability}
                  onChange={(v) => updateField('availability', v)}
                  placeholder="e.g., Full-time, Immediately"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Review Your Profile
              </h2>

              <ReviewSection title="Personal Information" icon={User}>
                <ReviewField label="Full Name" value={formData.fullName} />
                <ReviewField label="Email" value={formData.email} />
                <ReviewField label="Phone" value={formData.phone} />
                <ReviewField label="Location" value={formData.location} />
              </ReviewSection>

              <ReviewSection title="Skills & Experience" icon={Briefcase}>
                <ReviewField label="Trade" value={formData.trade} />
                <ReviewField label="Experience" value={formData.yearsExperience} />
                <ReviewField label="Skills" value={formData.skills} isLong />
                <ReviewField label="Certifications" value={formData.certifications} isLong />
              </ReviewSection>

              <ReviewSection title="Goals" icon={Target}>
                <ReviewField label="Career Goals" value={formData.careerGoals} isLong />
                <ReviewField label="Work Type" value={formData.preferredWorkType} />
                <ReviewField label="Availability" value={formData.availability} />
              </ReviewSection>

              {getMissingFields(formData).length === 0 ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300">
                      Ready to Submit!
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Your profile is complete. Click Submit to finish.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                      Missing Required Fields
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Please fill in: {getMissingFields(formData).map(formatFieldName).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={getMissingFields(formData).length > 0}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  getMissingFields(formData).length > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Submit Profile
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
            Try These AI Commands
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
            <li>
              <strong>&quot;I&apos;m Mike, a carpenter with 10 years experience in residential framing&quot;</strong>
              <span className="text-blue-600 dark:text-blue-500"> → Auto-fills multiple fields</span>
            </li>
            <li>
              <strong>&quot;Enhance my skills section&quot;</strong>
              <span className="text-blue-600 dark:text-blue-500"> → Improves that specific field</span>
            </li>
            <li>
              <strong>&quot;What&apos;s missing from my profile?&quot;</strong>
              <span className="text-blue-600 dark:text-blue-500"> → Shows unfilled required fields</span>
            </li>
            <li>
              <strong>&quot;Take me to the review page&quot;</strong>
              <span className="text-blue-600 dark:text-blue-500"> → Navigates to Step 4</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CopilotKit Chat */}
      <CopilotPopup
        labels={{
          title: 'Profile Assistant',
          initial:
            "Hi! I can help fill out your profile. Tell me about yourself - your trade, experience, skills, and goals. Or ask me to enhance any field!",
        }}
      />
    </div>
  );
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}

function ReviewSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewField({
  label,
  value,
  isLong = false,
}: {
  label: string;
  value: string;
  isLong?: boolean;
}) {
  return (
    <div className={isLong ? '' : 'flex'}>
      <span className="text-sm text-gray-500 dark:text-gray-400 w-28 flex-shrink-0">
        {label}:
      </span>
      {value ? (
        <span
          className={`text-sm text-gray-900 dark:text-gray-100 ${isLong ? 'block mt-1 bg-white dark:bg-gray-800 p-2 rounded' : ''}`}
        >
          {value}
        </span>
      ) : (
        <span className="text-sm text-gray-400 dark:text-gray-500 italic">Not provided</span>
      )}
    </div>
  );
}
