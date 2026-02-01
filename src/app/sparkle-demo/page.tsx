'use client';

import Link from 'next/link';
import EnhanceableTextarea from '@/components/EnhanceableTextarea';
import ThemeToggle from '@/components/ThemeToggle';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function SparkleDemo() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors">
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
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Vercel AI SDK
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI-Enhanced Form Input
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Write your feedback, then click the sparkle button to enhance it with AI
          </p>
        </div>

        {/* Simple Demo Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Simple Demo: Performance Feedback
            </h2>
          </div>

          <EnhanceableTextarea
            label="Your Feedback"
            context="This is quarterly performance feedback for a colleague. It should be constructive, professional, specific, and balanced between strengths and areas for improvement."
            placeholder="Write your rough feedback here... e.g., 'john did good work this quarter. he helped on the project and was nice to work with. sometimes late to meetings tho. overall pretty good teammate'"
          />

          {/* Submit button (for demo purposes) */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Submit Feedback
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How it works:</h3>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Type your rough, unpolished feedback in the text area</li>
            <li>Click the sparkle icon (✨) to enhance with AI</li>
            <li>Watch the shimmer effect while AI processes</li>
            <li>Your text is automatically replaced with the enhanced version</li>
            <li>Use the undo button to restore your original if needed</li>
          </ol>
        </div>

        {/* Tech Stack Info */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Tech Stack:</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• <strong>Vercel AI SDK</strong> - useCompletion hook with streamProtocol: &apos;text&apos;</li>
            <li>• <strong>OpenAI GPT-4o-mini</strong> - Fast, cost-effective text enhancement</li>
            <li>• <strong>Streaming</strong> - Real-time text generation with shimmer effect</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
