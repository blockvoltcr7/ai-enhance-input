'use client';

import { useState } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  HelpCircle,
  Loader2,
  ArrowRight,
  Zap,
  Target,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts';
import ThemeToggle from '@/components/ThemeToggle';

// ============================================================================
// SAMPLE DATA - SaaS Metrics Dashboard
// ============================================================================

const revenueData = [
  { month: 'Aug', revenue: 42000, target: 40000 },
  { month: 'Sep', revenue: 48000, target: 45000 },
  { month: 'Oct', revenue: 51000, target: 50000 },
  { month: 'Nov', revenue: 47000, target: 52000 },
  { month: 'Dec', revenue: 58000, target: 55000 },
  { month: 'Jan', revenue: 62000, target: 58000 },
];

const userActivityData = [
  { day: 'Mon', active: 1240, new: 89 },
  { day: 'Tue', active: 1180, new: 72 },
  { day: 'Wed', active: 1350, new: 95 },
  { day: 'Thu', active: 1420, new: 118 },
  { day: 'Fri', active: 1280, new: 86 },
  { day: 'Sat', active: 890, new: 45 },
  { day: 'Sun', active: 760, new: 38 },
];

const customerSegments = [
  { name: 'Enterprise', value: 35, color: '#8b5cf6' },
  { name: 'SMB', value: 45, color: '#3b82f6' },
  { name: 'Startup', value: 20, color: '#10b981' },
];

const churnByReason = [
  { reason: 'Price', count: 23 },
  { reason: 'Features', count: 18 },
  { reason: 'Support', count: 12 },
  { reason: 'Competitor', count: 15 },
  { reason: 'Other', count: 8 },
];

const metrics = {
  mrr: { value: 62000, change: 6.9, trend: 'up' as const },
  activeUsers: { value: 8420, change: 12.3, trend: 'up' as const },
  churnRate: { value: 2.8, change: 0.4, trend: 'down' as const },
  conversionRate: { value: 3.2, change: -0.3, trend: 'down' as const },
  avgTicketTime: { value: 4.2, change: -1.1, trend: 'up' as const },
  nps: { value: 72, change: 5, trend: 'up' as const },
};

const recentAnomalies = [
  { id: 1, type: 'warning', message: 'Signup rate dropped 23% yesterday', time: '2 hours ago' },
  { id: 2, type: 'info', message: 'Enterprise segment grew 15% this week', time: '5 hours ago' },
  { id: 3, type: 'alert', message: 'Support tickets up 34% from last week', time: '1 day ago' },
];

// ============================================================================
// METRIC CARD COMPONENT
// ============================================================================

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  format?: 'currency' | 'percent' | 'number' | 'hours';
  onClick?: () => void;
  isSelected?: boolean;
}

function MetricCard({ title, value, change, trend, icon, format, onClick, isSelected }: MetricCardProps) {
  const isPositive = trend === 'up' ? change > 0 : change < 0;

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    switch (format) {
      case 'currency': return `$${val.toLocaleString()}`;
      case 'percent': return `${val}%`;
      case 'hours': return `${val}h`;
      default: return val.toLocaleString();
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</span>
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatValue(value)}
        </span>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-blue-500">
        <HelpCircle className="w-3 h-3" />
        <span>Click to explore</span>
      </div>
    </div>
  );
}

// ============================================================================
// AI SUMMARY COMPONENT
// ============================================================================

function AISummary() {
  const insights = [
    { type: 'positive', text: 'MRR exceeded target by 6.9% this month' },
    { type: 'warning', text: 'Conversion rate dropped - check pricing page funnel' },
    { type: 'positive', text: 'Support response time improved significantly' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-6 h-6" />
        <h2 className="text-lg font-semibold">AI Insights - What Matters Today</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-3 flex items-start gap-2">
            {insight.type === 'positive' ? (
              <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm">{insight.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 text-sm text-white/80">
        <Lightbulb className="w-4 h-4 inline mr-2" />
        <strong>Recommendation:</strong> Focus on the conversion funnel today. The pricing page has
        a 45% drop-off rate - consider A/B testing the CTA button.
      </div>
    </div>
  );
}

// ============================================================================
// GENERATIVE UI COMPONENTS
// ============================================================================

function MetricExplanationCard({
  metric,
  status,
}: {
  metric: string;
  status: string;
}) {
  const explanations: Record<string, { title: string; explanation: string; suggestions: string[] }> = {
    mrr: {
      title: 'Monthly Recurring Revenue (MRR)',
      explanation: 'Your predictable monthly revenue from subscriptions. Currently at $62,000, up 6.9% from last month. You exceeded your target of $58,000.',
      suggestions: ['View revenue by plan tier', 'See expansion revenue breakdown', 'Compare to industry benchmarks'],
    },
    activeUsers: {
      title: 'Active Users',
      explanation: '8,420 users were active in the last 30 days. This is up 12.3% and represents strong engagement. Thursday had the highest activity.',
      suggestions: ['View user activity by feature', 'See cohort retention', 'Identify power users'],
    },
    churnRate: {
      title: 'Churn Rate',
      explanation: 'Currently at 2.8%, down 0.4% (good news!). Main reasons: Price (30%), Missing features (24%), Competitor switch (20%).',
      suggestions: ['View churned accounts', 'See churn by segment', 'Analyze exit surveys'],
    },
    conversionRate: {
      title: 'Conversion Rate',
      explanation: 'Trial-to-paid conversion is at 3.2%, down 0.3% from last month. The pricing page has a 45% drop-off rate.',
      suggestions: ['View conversion funnel', 'Compare by traffic source', 'See A/B test results'],
    },
    avgTicketTime: {
      title: 'Average Support Response Time',
      explanation: 'Currently at 4.2 hours, improved by 1.1 hours! This correlates with the improved NPS score.',
      suggestions: ['View tickets by category', 'See agent performance', 'Check SLA compliance'],
    },
    nps: {
      title: 'Net Promoter Score (NPS)',
      explanation: 'NPS is 72, up 5 points. Promoters (9-10): 58%, Passives (7-8): 28%, Detractors (0-6): 14%.',
      suggestions: ['Read recent feedback', 'View NPS by segment', 'See trend over time'],
    },
  };

  const data = explanations[metric] || {
    title: metric,
    explanation: 'Select a metric to see detailed explanation.',
    suggestions: [],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <BarChart3 className="w-5 h-5" />
          <span className="font-semibold">
            {status === 'executing' ? 'Analyzing metric...' : data.title}
          </span>
        </div>
      </div>

      <div className="p-4">
        {status === 'executing' ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{data.explanation}</p>

            {data.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Suggested Actions
                </p>
                {data.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DataInsightCard({
  question,
  answer,
  chartType,
  status,
}: {
  question: string;
  answer: string;
  chartType?: 'line' | 'bar' | 'pie';
  status: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Activity className="w-5 h-5" />
          <span className="font-semibold">
            {status === 'executing' ? 'Analyzing your question...' : 'Data Insight'}
          </span>
        </div>
      </div>

      <div className="p-4">
        {status === 'executing' ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">You asked:</p>
            <p className="text-gray-900 dark:text-white font-medium mb-3">&quot;{question}&quot;</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{answer}</p>

            {chartType && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-xs text-blue-500">
                  {chartType === 'line' && <Activity className="w-4 h-4" />}
                  {chartType === 'bar' && <BarChart3 className="w-4 h-4" />}
                  {chartType === 'pie' && <PieChart className="w-4 h-4" />}
                  <span>Recommended visualization: {chartType} chart</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AnomalyAlertCard({
  anomaly,
  severity,
  recommendation,
  status,
}: {
  anomaly: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  status: string;
}) {
  const severityColors = {
    low: 'from-blue-500 to-cyan-500',
    medium: 'from-yellow-500 to-orange-500',
    high: 'from-red-500 to-pink-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-800 overflow-hidden">
      <div className={`bg-gradient-to-r ${severityColors[severity]} px-4 py-3`}>
        <div className="flex items-center gap-2 text-white">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">
            {status === 'executing' ? 'Detecting anomalies...' : `Anomaly Detected (${severity} severity)`}
          </span>
        </div>
      </div>

      <div className="p-4">
        {status === 'executing' ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-gray-900 dark:text-white font-medium mb-2">{anomaly}</p>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 mt-3">
              <p className="text-xs font-medium text-orange-800 dark:text-orange-300 mb-1">Recommendation:</p>
              <p className="text-sm text-orange-700 dark:text-orange-400">{recommendation}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ReportGeneratorCard({
  reportType,
  status,
}: {
  reportType: string;
  status: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Target className="w-5 h-5" />
          <span className="font-semibold">
            {status === 'executing' ? `Generating ${reportType}...` : `${reportType} Generated`}
          </span>
        </div>
      </div>

      <div className="p-4">
        {status === 'executing' ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
            <span className="text-sm text-gray-500">Analyzing data and writing report...</span>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h4 className="text-gray-900 dark:text-white">Weekly Performance Summary</h4>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Key Wins:</strong><br/>
              • Revenue hit $62K (+6.9% vs target)<br/>
              • Active users grew 12.3% to 8,420<br/>
              • Support response time improved by 1.1 hours
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Areas of Concern:</strong><br/>
              • Conversion rate dropped 0.3%<br/>
              • Support ticket volume up 34%
            </p>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
              Download Full Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIDashboardPage() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Share all dashboard data with CopilotKit
  useCopilotReadable({
    description: 'Current SaaS dashboard metrics and data',
    value: JSON.stringify({
      metrics,
      revenueData,
      userActivityData,
      customerSegments,
      churnByReason,
      recentAnomalies,
    }),
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Explain a metric
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'explainMetric',
    description: 'Explain what a specific metric means and provide insights. Use when user asks about MRR, churn, conversion, users, etc.',
    parameters: [
      { name: 'metricName', type: 'string', description: 'The metric to explain: mrr, activeUsers, churnRate, conversionRate, avgTicketTime, nps', required: true },
    ],
    render: ({ status, args }) => (
      <MetricExplanationCard metric={args.metricName || ''} status={status} />
    ),
    handler: async ({ metricName }) => {
      setSelectedMetric(metricName);
      return `Explained ${metricName} metric with detailed insights.`;
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Answer data questions
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'answerDataQuestion',
    description: 'Answer questions about the dashboard data. Use when user asks "why did X happen", "what caused Y", "compare A to B".',
    parameters: [
      { name: 'question', type: 'string', description: 'The user question', required: true },
      { name: 'answer', type: 'string', description: 'The detailed answer based on the data', required: true },
      { name: 'chartType', type: 'string', description: 'Recommended chart type: line, bar, or pie', required: false },
    ],
    render: ({ status, args }) => (
      <DataInsightCard
        question={args.question || ''}
        answer={args.answer || ''}
        chartType={args.chartType as 'line' | 'bar' | 'pie' | undefined}
        status={status}
      />
    ),
    handler: async () => {
      return 'Question answered with data insight.';
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Detect and explain anomalies
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'detectAnomaly',
    description: 'Detect and explain unusual patterns in the data. Use when user asks "what\'s wrong", "any issues", "anomalies".',
    parameters: [
      { name: 'anomaly', type: 'string', description: 'Description of the anomaly detected', required: true },
      { name: 'severity', type: 'string', description: 'Severity level: low, medium, or high', required: true },
      { name: 'recommendation', type: 'string', description: 'What action to take', required: true },
    ],
    render: ({ status, args }) => (
      <AnomalyAlertCard
        anomaly={args.anomaly || ''}
        severity={(args.severity as 'low' | 'medium' | 'high') || 'medium'}
        recommendation={args.recommendation || ''}
        status={status}
      />
    ),
    handler: async () => {
      return 'Anomaly detected and explained.';
    },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // COPILOTKIT: Generate reports
  // ──────────────────────────────────────────────────────────────────────────

  useCopilotAction({
    name: 'generateReport',
    description: 'Generate a summary report of the dashboard data. Use when user asks for "report", "summary", "executive brief".',
    parameters: [
      { name: 'reportType', type: 'string', description: 'Type of report: Weekly Summary, Monthly Review, Executive Brief', required: true },
    ],
    render: ({ status, args }) => (
      <ReportGeneratorCard reportType={args.reportType || 'Report'} status={status} />
    ),
    handler: async () => {
      return 'Report generated successfully.';
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Dashboard Assistant
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Click any metric or ask the AI about your data
              </p>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <AISummary />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <MetricCard
            title="MRR"
            value={metrics.mrr.value}
            change={metrics.mrr.change}
            trend={metrics.mrr.trend}
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
            format="currency"
            onClick={() => setSelectedMetric('mrr')}
            isSelected={selectedMetric === 'mrr'}
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers.value}
            change={metrics.activeUsers.change}
            trend={metrics.activeUsers.trend}
            icon={<Users className="w-5 h-5 text-blue-600" />}
            format="number"
            onClick={() => setSelectedMetric('activeUsers')}
            isSelected={selectedMetric === 'activeUsers'}
          />
          <MetricCard
            title="Churn Rate"
            value={metrics.churnRate.value}
            change={metrics.churnRate.change}
            trend={metrics.churnRate.trend}
            icon={<TrendingDown className="w-5 h-5 text-red-500" />}
            format="percent"
            onClick={() => setSelectedMetric('churnRate')}
            isSelected={selectedMetric === 'churnRate'}
          />
          <MetricCard
            title="Conversion"
            value={metrics.conversionRate.value}
            change={metrics.conversionRate.change}
            trend={metrics.conversionRate.trend}
            icon={<ShoppingCart className="w-5 h-5 text-purple-600" />}
            format="percent"
            onClick={() => setSelectedMetric('conversionRate')}
            isSelected={selectedMetric === 'conversionRate'}
          />
          <MetricCard
            title="Avg Response"
            value={metrics.avgTicketTime.value}
            change={metrics.avgTicketTime.change}
            trend={metrics.avgTicketTime.trend}
            icon={<Clock className="w-5 h-5 text-orange-500" />}
            format="hours"
            onClick={() => setSelectedMetric('avgTicketTime')}
            isSelected={selectedMetric === 'avgTicketTime'}
          />
          <MetricCard
            title="NPS"
            value={metrics.nps.value}
            change={metrics.nps.change}
            trend={metrics.nps.trend}
            icon={<Target className="w-5 h-5 text-cyan-600" />}
            format="number"
            onClick={() => setSelectedMetric('nps')}
            isSelected={selectedMetric === 'nps'}
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Revenue vs Target
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v: number) => `$${v/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                <Line type="monotone" dataKey="target" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Segments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Customer Segments
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPie>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {customerSegments.map((seg) => (
                <div key={seg.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{seg.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Weekly User Activity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="new" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Anomalies */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {recentAnomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  {anomaly.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                  {anomaly.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                  {anomaly.type === 'alert' && <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">{anomaly.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{anomaly.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Try These */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Try Asking the AI
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Understand Metrics</p>
              <ul className="space-y-1">
                <li>• &quot;What is MRR?&quot;</li>
                <li>• &quot;Explain the churn rate&quot;</li>
              </ul>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Explore Data</p>
              <ul className="space-y-1">
                <li>• &quot;Why did conversion drop?&quot;</li>
                <li>• &quot;What caused the signup spike?&quot;</li>
              </ul>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Get Reports</p>
              <ul className="space-y-1">
                <li>• &quot;Generate a weekly summary&quot;</li>
                <li>• &quot;Any anomalies I should know?&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CopilotKit Chat */}
      <CopilotPopup
        labels={{
          title: 'Dashboard Assistant',
          initial:
            "Hi! I can help you understand your dashboard data. Try:\n• Click any metric card to learn more\n• Ask me why something changed\n• Request a summary report",
        }}
      />
    </div>
  );
}
