import ProfileWizard from '@/components/wizard/ProfileWizard';
import ThemeToggle from '@/components/ThemeToggle';
import { Sparkles } from 'lucide-react';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            AI-Enhanced Profile Builder
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Skilled Trades Career Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Complete your profile to get matched with training centers and internship opportunities.
            Use the <Sparkles size={14} className="inline text-purple-500" /> button to polish your responses with AI.
          </p>
        </div>

        {/* Wizard */}
        <ProfileWizard />

        {/* Footer tip */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 <strong>Tip:</strong> Write your thoughts naturally, then click the sparkle button to
            transform them into professional descriptions.
          </p>
        </div>
      </div>
    </main>
  );
}
