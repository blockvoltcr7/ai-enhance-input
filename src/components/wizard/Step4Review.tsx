'use client';

import { useWizard } from './WizardContext';
import { User, Briefcase, Target, CheckCircle } from 'lucide-react';

const tradeLabels: Record<string, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  hvac: 'HVAC',
  carpentry: 'Carpentry',
  welding: 'Welding',
  masonry: 'Masonry',
  roofing: 'Roofing',
  automotive: 'Automotive Technology',
  'heavy-equipment': 'Heavy Equipment Operation',
  pipefitting: 'Pipefitting',
  'sheet-metal': 'Sheet Metal Work',
  landscaping: 'Landscaping & Groundskeeping',
  unsure: 'Exploring Options',
  multiple: 'Multiple Trades',
};

const learningLabels: Record<string, string> = {
  'hands-on': 'Hands-on / On-the-job',
  classroom: 'Classroom / Technical school',
  hybrid: 'Hybrid',
  apprenticeship: 'Formal apprenticeship',
  'self-paced': 'Self-paced / Online',
  flexible: 'Flexible',
};

const availabilityLabels: Record<string, string> = {
  immediate: 'Immediately available',
  '2-weeks': 'In 2 weeks',
  '1-month': 'In 1 month',
  flexible: 'Flexible',
  'part-time-only': 'Part-time only',
  'full-time-only': 'Full-time only',
};

const relocateLabels: Record<string, string> = {
  yes: 'Yes, anywhere',
  regional: 'Within region/state',
  local: 'Local only',
  'remote-option': 'Open to travel',
};

// Helper components defined outside render
function Section({
  icon: Icon,
  title,
  onEdit,
  children,
}: {
  icon: React.ElementType;
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer"
        >
          Edit
        </button>
      </div>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500 dark:text-gray-400">{label}:</span>{' '}
      <span className="text-gray-900 dark:text-gray-100">{value || <em className="text-gray-400 dark:text-gray-500">Not provided</em>}</span>
    </div>
  );
}

function LongField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-500 dark:text-gray-400 mb-1">{label}:</div>
      <div className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md whitespace-pre-wrap">
        {value || <em className="text-gray-400 dark:text-gray-500">Not provided</em>}
      </div>
    </div>
  );
}

export default function Step4Review() {
  const { profileData, setCurrentStep } = useWizard();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Your Profile</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Please review your information before submitting. Click &quot;Edit&quot; to make changes.
        </p>
      </div>

      {/* Personal Info */}
      <Section icon={User} title="Personal Information" onEdit={() => setCurrentStep(1)}>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Name" value={profileData.fullName} />
          <Field label="Email" value={profileData.email} />
          <Field label="Phone" value={profileData.phone} />
          <Field label="Location" value={profileData.location} />
        </div>
        <LongField label="About Me" value={profileData.aboutMe} />
      </Section>

      {/* Skills & Experience */}
      <Section icon={Briefcase} title="Skills & Experience" onEdit={() => setCurrentStep(2)}>
        <Field label="Current Occupation" value={profileData.currentOccupation} />
        <Field label="Years of Experience" value={profileData.yearsExperience} />
        <LongField label="Relevant Skills" value={profileData.relevantSkills} />
        <LongField label="Previous Training" value={profileData.previousTraining} />
        <LongField label="Tools & Equipment" value={profileData.toolsEquipment} />
      </Section>

      {/* Goals & Preferences */}
      <Section icon={Target} title="Goals & Preferences" onEdit={() => setCurrentStep(3)}>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Desired Trade" value={tradeLabels[profileData.desiredTrade] || profileData.desiredTrade} />
          <Field
            label="Learning Style"
            value={learningLabels[profileData.preferredLearningStyle] || profileData.preferredLearningStyle}
          />
          <Field
            label="Availability"
            value={availabilityLabels[profileData.availability] || profileData.availability}
          />
          <Field
            label="Willing to Relocate"
            value={relocateLabels[profileData.willingToRelocate] || profileData.willingToRelocate}
          />
        </div>
        <LongField label="Career Goals" value={profileData.careerGoals} />
        {profileData.additionalInfo && (
          <LongField label="Additional Information" value={profileData.additionalInfo} />
        )}
      </Section>

      {/* Confirmation */}
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
        <div>
          <h4 className="font-medium text-green-900 dark:text-green-300">Ready to Submit</h4>
          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
            Your profile looks great! Click &quot;Submit Profile&quot; below to complete your registration.
            Our team will review your information and match you with suitable training centers or internship opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
