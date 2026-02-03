'use client';

import { useState } from 'react';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageCircle,
  X,
  Save,
  ChevronRight,
  Building2,
  Target,
  Lightbulb,
  FileText,
  Sparkles,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// ============================================================================
// TYPES
// ============================================================================

interface FormData {
  companyName: string;
  vision: string;
  goals: string[];
  initiatives: string[];
  metrics: string[];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AISidePanelPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    vision: '',
    goals: ['', '', ''],
    initiatives: ['', '', ''],
    metrics: ['', '', ''],
  });

  // Share form state with CopilotKit
  useCopilotReadable({
    description: 'The current business document form data',
    value: JSON.stringify(formData),
  });

  // Action to update company name
  useCopilotAction({
    name: 'updateCompanyName',
    description: 'Update the company name field',
    parameters: [
      { name: 'companyName', type: 'string', description: 'The company name' },
    ],
    handler: async ({ companyName }) => {
      setFormData(prev => ({ ...prev, companyName }));
      return `Updated company name to: ${companyName}`;
    },
  });

  // Action to update vision
  useCopilotAction({
    name: 'updateVision',
    description: 'Update the company vision statement',
    parameters: [
      { name: 'vision', type: 'string', description: 'The vision statement' },
    ],
    handler: async ({ vision }) => {
      setFormData(prev => ({ ...prev, vision }));
      return `Updated vision statement.`;
    },
  });

  // Action to update goals
  useCopilotAction({
    name: 'updateGoals',
    description: 'Update the strategic goals list',
    parameters: [
      { name: 'goals', type: 'string[]', description: 'Array of strategic goals' },
    ],
    handler: async ({ goals }) => {
      setFormData(prev => ({ ...prev, goals }));
      return `Updated ${goals.length} strategic goals.`;
    },
  });

  // Action to update initiatives
  useCopilotAction({
    name: 'updateInitiatives',
    description: 'Update the key initiatives list',
    parameters: [
      { name: 'initiatives', type: 'string[]', description: 'Array of key initiatives' },
    ],
    handler: async ({ initiatives }) => {
      setFormData(prev => ({ ...prev, initiatives }));
      return `Updated ${initiatives.length} initiatives.`;
    },
  });

  // Action to update metrics
  useCopilotAction({
    name: 'updateMetrics',
    description: 'Update the success metrics list',
    parameters: [
      { name: 'metrics', type: 'string[]', description: 'Array of success metrics' },
    ],
    handler: async ({ metrics }) => {
      setFormData(prev => ({ ...prev, metrics }));
      return `Updated ${metrics.length} success metrics.`;
    },
  });

  // Action to fill entire form
  useCopilotAction({
    name: 'fillEntireDocument',
    description: 'Fill all fields of the business document at once based on company context',
    parameters: [
      { name: 'companyName', type: 'string', description: 'The company name' },
      { name: 'vision', type: 'string', description: 'The vision statement' },
      { name: 'goals', type: 'string[]', description: 'Array of 3-5 strategic goals' },
      { name: 'initiatives', type: 'string[]', description: 'Array of 3-5 key initiatives' },
      { name: 'metrics', type: 'string[]', description: 'Array of 3-5 success metrics' },
    ],
    handler: async ({ companyName, vision, goals, initiatives, metrics }) => {
      setFormData({ companyName, vision, goals, initiatives, metrics });
      return `Successfully filled all document fields for ${companyName}.`;
    },
  });

  const updateArrayField = (field: 'goals' | 'initiatives' | 'metrics', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const addArrayItem = (field: 'goals' | 'initiatives' | 'metrics') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isChatOpen ? 'mr-[400px]' : ''}`}>
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h1 className="text-white font-semibold">Business Document</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="p-8 max-w-4xl mx-auto">
          {/* Company Name */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Company Name</h2>
            </div>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Enter your company name..."
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
            />
          </section>

          {/* Vision */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Vision</h2>
            </div>
            <p className="text-gray-400 text-sm mb-3">Company Vision Statement</p>
            <textarea
              value={formData.vision}
              onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
              placeholder="Describe your company's vision..."
              rows={4}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none"
            />
          </section>

          {/* Goals */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Goals</h2>
            </div>
            <p className="text-gray-400 text-sm mb-3">Strategic Goals & OKRs</p>
            <div className="space-y-3">
              {formData.goals.map((goal, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-gray-500 mt-3 w-6">{index + 1}.</span>
                  <textarea
                    value={goal}
                    onChange={(e) => updateArrayField('goals', index, e.target.value)}
                    placeholder={`Strategic goal ${index + 1}...`}
                    rows={2}
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none"
                  />
                </div>
              ))}
              <button
                onClick={() => addArrayItem('goals')}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                + Add another goal
              </button>
            </div>
          </section>

          {/* Initiatives */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-semibold text-white">Initiatives</h2>
            </div>
            <p className="text-gray-400 text-sm mb-3">Key Initiatives & Projects</p>
            <div className="space-y-3">
              {formData.initiatives.map((initiative, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-gray-500 mt-3 w-6">{index + 1}.</span>
                  <textarea
                    value={initiative}
                    onChange={(e) => updateArrayField('initiatives', index, e.target.value)}
                    placeholder={`Initiative ${index + 1}...`}
                    rows={2}
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none"
                  />
                </div>
              ))}
              <button
                onClick={() => addArrayItem('initiatives')}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                + Add another initiative
              </button>
            </div>
          </section>

          {/* Metrics */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <h2 className="text-xl font-semibold text-white">Success Metrics</h2>
            </div>
            <p className="text-gray-400 text-sm mb-3">Key Performance Indicators</p>
            <div className="space-y-3">
              {formData.metrics.map((metric, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-gray-500 mt-3 w-6">{index + 1}.</span>
                  <textarea
                    value={metric}
                    onChange={(e) => updateArrayField('metrics', index, e.target.value)}
                    placeholder={`Success metric ${index + 1}...`}
                    rows={2}
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none"
                  />
                </div>
              ))}
              <button
                onClick={() => addArrayItem('metrics')}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                + Add another metric
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Sliding Chat Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-gray-800 border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Chat Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
              <p className="text-gray-400 text-xs">Powered by CopilotKit</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Content */}
        <div className="h-[calc(100%-60px)]">
          <CopilotChat
            className="h-full"
            labels={{
              title: '',
              initial: "Hi! I'm your AI assistant. I can help you fill out this business document. Try asking me to:\n\n• Fill in details for a specific company\n• Generate strategic goals\n• Suggest initiatives\n• Create success metrics",
            }}
            instructions="You are a helpful business document assistant. Help the user fill out their business document by updating fields when asked. You can update the company name, vision, goals, initiatives, and metrics. Be concise and professional. When the user describes their company, use the fillEntireDocument action to populate all fields at once."
          />
        </div>
      </div>

      {/* Overlay when chat is open (optional - for mobile) */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
