'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ProfileData {
  // Step 1: Personal Info
  fullName: string;
  email: string;
  phone: string;
  location: string;
  aboutMe: string;

  // Step 2: Skills & Experience
  currentOccupation: string;
  yearsExperience: string;
  relevantSkills: string;
  previousTraining: string;
  toolsEquipment: string;

  // Step 3: Goals & Preferences
  desiredTrade: string;
  careerGoals: string;
  preferredLearningStyle: string;
  availability: string;
  willingToRelocate: string;
  additionalInfo: string;
}

const initialProfileData: ProfileData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  aboutMe: '',
  currentOccupation: '',
  yearsExperience: '',
  relevantSkills: '',
  previousTraining: '',
  toolsEquipment: '',
  desiredTrade: '',
  careerGoals: '',
  preferredLearningStyle: '',
  availability: '',
  willingToRelocate: '',
  additionalInfo: '',
};

interface WizardContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  profileData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const totalSteps = 4;

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        profileData,
        updateProfileData,
        nextStep,
        prevStep,
        isFirstStep: currentStep === 1,
        isLastStep: currentStep === totalSteps,
        totalSteps,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
