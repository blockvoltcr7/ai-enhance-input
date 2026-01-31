'use client';

import { useState, useRef } from 'react';
import { useCompletion } from '@ai-sdk/react';
import { Sparkles, Undo2 } from 'lucide-react';

interface EnhanceableTextareaProps {
  label: string;
  context: string;
  placeholder?: string;
}

export default function EnhanceableTextarea({
  label,
  context,
  placeholder = 'Start typing...',
}: EnhanceableTextareaProps) {
  const [value, setValue] = useState('');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { complete, isLoading } = useCompletion({
    api: '/api/enhance',
    streamProtocol: 'text',
    onFinish: (_prompt: string, completion: string) => {
      setValue(completion);
    },
  });

  const handleEnhance = async () => {
    if (!value.trim() || isLoading) return;

    // Store the current value for undo
    setPreviousValue(value);

    // Trigger the enhancement
    await complete(value, {
      body: {
        text: value,
        context: context,
      },
    });
  };

  const handleUndo = () => {
    if (previousValue !== null) {
      setValue(previousValue);
      setPreviousValue(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className={`
            w-full min-h-[150px] p-4 pr-12
            border border-gray-300 dark:border-gray-600 rounded-lg
            bg-white dark:bg-gray-800
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed
            resize-y text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
            ${isLoading ? 'shimmer-bg' : ''}
          `}
        />

        {/* Sparkle Button */}
        <button
          onClick={handleEnhance}
          disabled={!value.trim() || isLoading}
          title="Enhance with AI"
          className={`
            absolute top-3 right-3
            p-2 rounded-lg
            transition-all duration-200
            ${value.trim() && !isLoading
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg cursor-pointer'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }
            ${isLoading ? 'animate-pulse' : ''}
          `}
        >
          <Sparkles
            size={20}
            className={isLoading ? 'animate-spin' : ''}
          />
        </button>

        {/* Undo Button - only show when there's a previous value */}
        {previousValue !== null && !isLoading && (
          <button
            onClick={handleUndo}
            title="Undo enhancement (restore original)"
            className="
              absolute top-3 right-14
              p-2 rounded-lg
              bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400
              hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200
              transition-all duration-200
              cursor-pointer
            "
          >
            <Undo2 size={20} />
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <p className="mt-2 text-sm text-purple-600 dark:text-purple-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" />
          Enhancing your text with AI...
        </p>
      )}

      {/* Helper text */}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Click the <Sparkles size={12} className="inline text-purple-500" /> button to enhance your text with AI
        {previousValue !== null && (
          <span> • Click <Undo2 size={12} className="inline text-gray-500 dark:text-gray-400" /> to restore original</span>
        )}
      </p>
    </div>
  );
}
