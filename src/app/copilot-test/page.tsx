'use client';

import { useState } from 'react';
import { CopilotPopup } from '@copilotkit/react-ui';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function CopilotTestPage() {
  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState('');
  const [enhancedText, setEnhancedText] = useState('');

  // Share state with the AI - it can "see" this
  useCopilotReadable({
    description: 'The current counter value',
    value: counter.toString(),
  });

  useCopilotReadable({
    description: 'The user message input',
    value: message,
  });

  // Define an action the AI can trigger with Generative UI
  useCopilotAction({
    name: 'incrementCounter',
    description: 'Increment the counter by a specified amount',
    parameters: [
      {
        name: 'amount',
        type: 'number',
        description: 'The amount to increment by',
        required: true,
      },
    ],
    // This is the Generative UI part - custom render during execution
    render: ({ status, args }) => (
      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
        {status === 'executing' ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-blue-700 dark:text-blue-300">
              Incrementing counter by {args.amount}...
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Sparkles className="w-4 h-4" />
            <span>Counter incremented by {args.amount}!</span>
          </div>
        )}
      </div>
    ),
    handler: async ({ amount }) => {
      // Simulate a small delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCounter((prev) => prev + amount);
      return `Counter incremented by ${amount}. New value: ${counter + amount}`;
    },
  });

  // Another action - text enhancement (similar to our sparkle feature)
  useCopilotAction({
    name: 'enhanceText',
    description: 'Enhance and improve the user message text to be more professional',
    parameters: [
      {
        name: 'improvedText',
        type: 'string',
        description: 'The improved version of the text',
        required: true,
      },
    ],
    render: ({ status, args }) => (
      <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
        {status === 'executing' ? (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-purple-700 dark:text-purple-300">Enhancing text...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Text Enhanced!</span>
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 p-2 rounded">
              {args.improvedText}
            </div>
          </div>
        )}
      </div>
    ),
    handler: async ({ improvedText }) => {
      setEnhancedText(improvedText);
      return `Text has been enhanced: ${improvedText}`;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            CopilotKit Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing Generative UI with CopilotKit. Try the chat popup in the bottom-right corner!
          </p>
        </div>

        {/* Counter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Counter Demo
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{counter}</div>
            <button
              onClick={() => setCounter((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              +1
            </button>
            <button
              onClick={() => setCounter(0)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Ask the AI: &quot;Increment the counter by 5&quot; or &quot;Add 10 to the counter&quot;
          </p>
        </div>

        {/* Text Enhancement Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Text Enhancement Demo
          </h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type something here... then ask the AI to enhance it"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Ask the AI: &quot;Enhance my text&quot; or &quot;Make my message more professional&quot;
          </p>

          {enhancedText && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                Enhanced Result:
              </h3>
              <p className="text-green-700 dark:text-green-400">{enhancedText}</p>
              <button
                onClick={() => setMessage(enhancedText)}
                className="mt-2 text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                Use this text
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
            How to Test
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700 dark:text-yellow-400 text-sm">
            <li>Click the chat icon in the bottom-right corner</li>
            <li>
              Try: &quot;What is the current counter value?&quot; (tests useCopilotReadable)
            </li>
            <li>Try: &quot;Increment the counter by 7&quot; (tests useCopilotAction with Generative UI)</li>
            <li>Type some text above, then ask: &quot;Enhance my text&quot;</li>
            <li>Watch the custom UI render in the chat as actions execute!</li>
          </ol>
        </div>
      </div>

      {/* CopilotKit Chat Popup */}
      <CopilotPopup
        labels={{
          title: 'AI Assistant',
          initial: "Hi! I can see and interact with this page. Try asking me to increment the counter or enhance your text!",
        }}
      />
    </div>
  );
}
