import EnhanceableTextarea from '@/components/EnhanceableTextarea';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI-Enhanced Form Input
          </h1>
          <p className="text-gray-600">
            Write your feedback, then click the sparkle button to enhance it with AI
          </p>
        </div>

        {/* Demo Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Q4 Performance Feedback for Colleague
          </h2>

          <EnhanceableTextarea
            label="Your Feedback"
            context="This is quarterly performance feedback for a colleague. It should be constructive, professional, specific, and balanced between strengths and areas for improvement."
            placeholder="Write your rough feedback here... e.g., 'john did good work this quarter. he helped on the project and was nice to work with. sometimes late to meetings tho. overall pretty good teammate'"
          />

          {/* Submit button (for demo purposes) */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Submit Feedback
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Type your rough, unpolished feedback in the text area</li>
            <li>Click the sparkle icon (✨) to enhance with AI</li>
            <li>Watch the shimmer effect while AI processes</li>
            <li>Your text is automatically replaced with the enhanced version</li>
            <li>Use the undo button to restore your original if needed</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
