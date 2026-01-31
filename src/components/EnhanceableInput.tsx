'use client';

import { useState } from 'react';
import { useCompletion } from '@ai-sdk/react';
import { Sparkles, Undo2 } from 'lucide-react';

interface EnhanceableInputProps {
  label: string;
  context: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}

export default function EnhanceableInput({
  label,
  context,
  placeholder = 'Start typing...',
  value,
  onChange,
  multiline = false,
  rows = 3,
  required = false,
}: EnhanceableInputProps) {
  const [previousValue, setPreviousValue] = useState<string | null>(null);

  const { complete, isLoading } = useCompletion({
    api: '/api/enhance',
    streamProtocol: 'text',
    onFinish: (_prompt: string, completion: string) => {
      onChange(completion);
    },
  });

  const handleEnhance = async () => {
    if (!value.trim() || isLoading) return;
    setPreviousValue(value);
    await complete(value, {
      body: {
        text: value,
        context: context,
      },
    });
  };

  const handleUndo = () => {
    if (previousValue !== null) {
      onChange(previousValue);
      setPreviousValue(null);
    }
  };

  const inputClasses = `
    w-full p-3 pr-20
    border border-gray-300 dark:border-gray-600 rounded-lg
    bg-white dark:bg-gray-800
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed
    text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
    ${isLoading ? 'shimmer-bg' : ''}
  `;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            rows={rows}
            className={`${inputClasses} resize-y`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className={inputClasses}
          />
        )}

        {/* Button container */}
        <div className="absolute top-2 right-2 flex gap-1">
          {/* Undo Button */}
          {previousValue !== null && !isLoading && (
            <button
              type="button"
              onClick={handleUndo}
              title="Undo enhancement"
              className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer"
            >
              <Undo2 size={16} />
            </button>
          )}

          {/* Sparkle Button */}
          <button
            type="button"
            onClick={handleEnhance}
            disabled={!value.trim() || isLoading}
            title="Enhance with AI"
            className={`
              p-1.5 rounded-md transition-all
              ${value.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-sm cursor-pointer'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }
              ${isLoading ? 'animate-pulse' : ''}
            `}
          >
            <Sparkles size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="mt-1 text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" />
          Enhancing...
        </p>
      )}
    </div>
  );
}
