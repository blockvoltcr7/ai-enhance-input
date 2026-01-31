'use client';

import { useWizard } from './WizardContext';
import EnhanceableInput from '../EnhanceableInput';

export default function Step2SkillsExperience() {
  const { profileData, updateProfileData } = useWizard();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills & Experience</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Share your current skills and any relevant experience you have.
        </p>
      </div>

      <EnhanceableInput
        label="Current Occupation"
        context="This describes the person's current job or situation. It should be clear and professional, mentioning their role and industry if applicable. If unemployed or a student, frame it positively."
        placeholder="e.g., 'warehouse worker at amazon' or 'currently between jobs, was doing retail before'"
        value={profileData.currentOccupation}
        onChange={(value) => updateProfileData({ currentOccupation: value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Years of Work Experience <span className="text-red-500">*</span>
        </label>
        <select
          value={profileData.yearsExperience}
          onChange={(e) => updateProfileData({ yearsExperience: e.target.value })}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select experience level</option>
          <option value="none">No work experience</option>
          <option value="0-1">Less than 1 year</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10+">10+ years</option>
        </select>
      </div>

      <EnhanceableInput
        label="Relevant Skills"
        context="This lists skills relevant to the skilled trades industry (construction, electrical, plumbing, HVAC, welding, carpentry, etc.). Format as a clear list of skills. Include both hard skills (tools, techniques) and soft skills (teamwork, problem-solving). Be specific about proficiency levels where possible."
        placeholder="e.g., 'good with tools, can do basic electrical stuff, helped friend with some plumbing, strong and can lift heavy things, work well with others'"
        value={profileData.relevantSkills}
        onChange={(value) => updateProfileData({ relevantSkills: value })}
        multiline
        rows={3}
        required
      />

      <EnhanceableInput
        label="Previous Training or Certifications"
        context="This describes any formal or informal training related to skilled trades. Include certifications, courses, apprenticeships, vocational training, or self-taught skills. If none, suggest how to phrase interest in obtaining training."
        placeholder="e.g., 'took a welding class in high school, have my forklift license, watched alot of youtube videos on hvac'"
        value={profileData.previousTraining}
        onChange={(value) => updateProfileData({ previousTraining: value })}
        multiline
        rows={3}
      />

      <EnhanceableInput
        label="Tools & Equipment Experience"
        context="This describes familiarity with tools and equipment used in skilled trades. Be specific about types of tools (power tools, hand tools, diagnostic equipment, machinery). Mention safety knowledge and any specialized equipment."
        placeholder="e.g., 'used power drills and saws, know how to use a multimeter kinda, comfortable with ladders and scaffolding'"
        value={profileData.toolsEquipment}
        onChange={(value) => updateProfileData({ toolsEquipment: value })}
        multiline
        rows={3}
      />
    </div>
  );
}
