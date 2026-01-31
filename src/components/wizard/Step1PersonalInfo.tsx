'use client';

import { useWizard } from './WizardContext';
import EnhanceableInput from '../EnhanceableInput';

export default function Step1PersonalInfo() {
  const { profileData, updateProfileData } = useWizard();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tell us about yourself so we can match you with the right opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => updateProfileData({ fullName: e.target.value })}
            placeholder="John Smith"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => updateProfileData({ email: e.target.value })}
            placeholder="john@example.com"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => updateProfileData({ phone: e.target.value })}
            placeholder="(555) 123-4567"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => updateProfileData({ location: e.target.value })}
            placeholder="City, State"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      <EnhanceableInput
        label="About Me"
        context="This is a personal introduction for a skilled trades profile. It should be professional, highlight the person's personality and work ethic, and show enthusiasm for entering or advancing in the skilled trades industry. Keep it concise but engaging."
        placeholder="Tell us about yourself... e.g., 'im a hard worker who likes working with my hands. been interested in construction since i was a kid helping my dad fix stuff around the house. looking for a chance to learn a real trade'"
        value={profileData.aboutMe}
        onChange={(value) => updateProfileData({ aboutMe: value })}
        multiline
        rows={4}
        required
      />
    </div>
  );
}
