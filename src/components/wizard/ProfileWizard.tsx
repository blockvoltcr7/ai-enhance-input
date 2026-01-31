'use client';

import { useWizard, WizardProvider } from './WizardContext';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2SkillsExperience from './Step2SkillsExperience';
import Step3GoalsPreferences from './Step3GoalsPreferences';
import Step4Review from './Step4Review';
import { ChevronLeft, ChevronRight, Send, User, Briefcase, Target, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

const steps = [
  { number: 1, title: 'Personal Info', icon: User },
  { number: 2, title: 'Skills & Experience', icon: Briefcase },
  { number: 3, title: 'Goals', icon: Target },
  { number: 4, title: 'Review', icon: ClipboardCheck },
];

function WizardContent() {
  const { currentStep, nextStep, prevStep, isFirstStep, isLastStep, profileData } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Submitted profile data:', profileData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Submitted!</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Thank you for completing your profile. Our team will review your information and reach out within 2-3 business days with matching opportunities.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Start New Profile
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-200
                      ${isActive ? 'bg-blue-600 text-white' : ''}
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${!isActive && !isCompleted ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : ''}
                    `}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    className={`
                      text-xs mt-1 font-medium
                      ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}
                      ${isCompleted ? 'text-green-600 dark:text-green-400' : ''}
                      ${!isActive && !isCompleted ? 'text-gray-400 dark:text-gray-500' : ''}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-full h-1 mx-2 rounded
                      ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                    style={{ minWidth: '40px', maxWidth: '100px' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        {currentStep === 1 && <Step1PersonalInfo />}
        {currentStep === 2 && <Step2SkillsExperience />}
        {currentStep === 3 && <Step3GoalsPreferences />}
        {currentStep === 4 && <Step4Review />}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={isFirstStep}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium
            transition-all duration-200
            ${isFirstStep
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer'
            }
          `}
        >
          <ChevronLeft size={20} />
          Back
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Profile
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 cursor-pointer"
          >
            Next
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </>
  );
}

export default function ProfileWizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
