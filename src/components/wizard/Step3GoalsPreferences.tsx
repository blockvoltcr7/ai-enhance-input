'use client';

import { useWizard } from './WizardContext';
import EnhanceableInput from '../EnhanceableInput';

export default function Step3GoalsPreferences() {
  const { profileData, updateProfileData } = useWizard();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Goals & Preferences</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tell us about your career goals so we can find the best match for you.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Desired Trade <span className="text-red-500">*</span>
        </label>
        <select
          value={profileData.desiredTrade}
          onChange={(e) => updateProfileData({ desiredTrade: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select a trade</option>
          <option value="electrical">Electrical</option>
          <option value="plumbing">Plumbing</option>
          <option value="hvac">HVAC (Heating, Ventilation, Air Conditioning)</option>
          <option value="carpentry">Carpentry</option>
          <option value="welding">Welding</option>
          <option value="masonry">Masonry</option>
          <option value="roofing">Roofing</option>
          <option value="automotive">Automotive Technology</option>
          <option value="heavy-equipment">Heavy Equipment Operation</option>
          <option value="pipefitting">Pipefitting</option>
          <option value="sheet-metal">Sheet Metal Work</option>
          <option value="landscaping">Landscaping & Groundskeeping</option>
          <option value="unsure">Not sure yet - exploring options</option>
          <option value="multiple">Interested in multiple trades</option>
        </select>
      </div>

      <EnhanceableInput
        label="Career Goals"
        context="This describes the person's career aspirations in the skilled trades. Should be specific, ambitious but realistic, and show motivation. Include short-term (1-2 years) and long-term (5+ years) goals if possible. Mention desire for certifications, advancement, or specialization."
        placeholder="e.g., 'want to become an electrician, maybe start my own business someday. want to make good money and have job security'"
        value={profileData.careerGoals}
        onChange={(value) => updateProfileData({ careerGoals: value })}
        multiline
        rows={4}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Preferred Learning Style <span className="text-red-500">*</span>
        </label>
        <select
          value={profileData.preferredLearningStyle}
          onChange={(e) => updateProfileData({ preferredLearningStyle: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select learning preference</option>
          <option value="hands-on">Hands-on / On-the-job training</option>
          <option value="classroom">Classroom / Technical school</option>
          <option value="hybrid">Hybrid (classroom + hands-on)</option>
          <option value="apprenticeship">Formal apprenticeship program</option>
          <option value="self-paced">Self-paced / Online learning</option>
          <option value="flexible">Flexible - open to any approach</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Availability <span className="text-red-500">*</span>
        </label>
        <select
          value={profileData.availability}
          onChange={(e) => updateProfileData({ availability: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select availability</option>
          <option value="immediate">Immediately available</option>
          <option value="2-weeks">Available in 2 weeks</option>
          <option value="1-month">Available in 1 month</option>
          <option value="flexible">Flexible start date</option>
          <option value="part-time-only">Part-time only (evenings/weekends)</option>
          <option value="full-time-only">Full-time only</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Willing to Relocate?
        </label>
        <select
          value={profileData.willingToRelocate}
          onChange={(e) => updateProfileData({ willingToRelocate: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select option</option>
          <option value="yes">Yes, willing to relocate anywhere</option>
          <option value="regional">Yes, within my region/state</option>
          <option value="local">No, local opportunities only</option>
          <option value="remote-option">Open to travel for work</option>
        </select>
      </div>

      <EnhanceableInput
        label="Anything Else We Should Know?"
        context="This is additional information that might help match the candidate with opportunities. Could include: transportation situation, physical abilities/limitations, schedule constraints, veteran status, financial aid needs, specific companies they'd like to work for, or any unique circumstances. Should be professional and relevant."
        placeholder="e.g., 'i have my own truck so transportation isnt a problem. im a veteran. need something that pays while i learn because i got bills'"
        value={profileData.additionalInfo}
        onChange={(value) => updateProfileData({ additionalInfo: value })}
        multiline
        rows={3}
      />
    </div>
  );
}
