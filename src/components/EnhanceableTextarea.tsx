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

  const { complete, isLoading, completion, error } = useCompletion({
    api: '/api/enhance',
    streamProtocol: 'text', // Important: match the toTextStreamResponse() from the API
    onResponse: (response) => {
      console.log('[useCompletion] onResponse:', response.status, response.statusText);
    },
    onFinish: (_prompt: string, completion: string) => {
      console.log('[useCompletion] onFinish - prompt:', _prompt);
      console.log('[useCompletion] onFinish - completion:', completion);
      setValue(completion);
    },
    onError: (err) => {
      console.error('[useCompletion] onError:', err);
    },
  });

  // Log completion changes
  console.log('[render] completion:', completion, '| isLoading:', isLoading, '| error:', error);

  const handleEnhance = async () => {
    console.log('[handleEnhance] Starting enhancement...');
    console.log('[handleEnhance] Current value:', value);

    if (!value.trim() || isLoading) {
      console.log('[handleEnhance] Aborting - empty or already loading');
      return;
    }

    // Store the current value for undo
    setPreviousValue(value);

    // Trigger the enhancement
    console.log('[handleEnhance] Calling complete() with body:', { text: value, context });
    const result = await complete(value, {
      body: {
        text: value,
        context: context,
      },
    });
    console.log('[handleEnhance] complete() returned:', result);
  };

  const handleUndo = () => {
    if (previousValue !== null) {
      setValue(previousValue);
      setPreviousValue(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
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
            border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:cursor-not-allowed
            resize-y text-gray-900 placeholder-gray-400
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
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
              bg-gray-100 text-gray-600
              hover:bg-gray-200 hover:text-gray-800
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
        <p className="mt-2 text-sm text-purple-600 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
          Enhancing your text with AI...
        </p>
      )}

      {/* Helper text */}
      <p className="mt-2 text-xs text-gray-500">
        Click the <Sparkles size={12} className="inline text-purple-500" /> button to enhance your text with AI
        {previousValue !== null && (
          <span> • Click <Undo2 size={12} className="inline text-gray-500" /> to restore original</span>
        )}
      </p>
    </div>
  );
}
