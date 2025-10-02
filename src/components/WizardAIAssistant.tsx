import React, { useState } from 'react';
import { Brain, FileText, Lightbulb, Settings, Sparkles } from 'lucide-react';
import { buildWizardAIContext } from '../utils/aiContextBuilder';
import type { SpecDocumentData, MemoryDocumentData } from '../types';

interface WizardAIAssistantProps {
  documentType: 'spec' | 'memory';
  specData?: SpecDocumentData;
  memoryData?: MemoryDocumentData;
  onContextGenerated?: (context: string, prompt: string) => void;
}

/**
 * AI Assistant component specifically for the wizard - uses current wizard data
 * This component helps users generate AI prompts based on their current wizard progress
 */
export const WizardAIAssistant: React.FC<WizardAIAssistantProps> = ({ 
  documentType, 
  specData, 
  memoryData, 
  onContextGenerated 
}) => {
  const [selectedTask, setSelectedTask] = useState<'feature' | 'bug' | 'refactor' | 'architecture'>('feature');
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedContext, setGeneratedContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const taskExamples = {
    feature: `Help me implement a new feature for this ${documentType === 'spec' ? 'specification' : 'project'} that adds user authentication to the system.`,
    bug: `I'm having an issue with the ${documentType === 'spec' ? 'current architecture' : 'project implementation'} where users are experiencing slow response times.`,
    refactor: `I want to refactor the ${documentType === 'spec' ? 'technical architecture' : 'codebase'} to improve maintainability and performance.`,
    architecture: `Should I consider a microservices architecture for this ${documentType === 'spec' ? 'project' : 'system'} based on the current requirements?`
  };

  const handleGenerateContext = () => {
    setIsLoading(true);
    try {
      const context = buildWizardAIContext(documentType, specData, memoryData, selectedTask);
      setGeneratedContext(context);
      
      const fullPrompt = `${context}\n\n## User Request\n${userPrompt || taskExamples[selectedTask]}`;
      
      if (onContextGenerated) {
        onContextGenerated(context, fullPrompt);
      }
    } catch (error) {
      console.error('Failed to generate AI context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyContextToClipboard = async () => {
    const fullPrompt = `${generatedContext}\n\n## User Request\n${userPrompt || taskExamples[selectedTask]}`;
    
    try {
      await navigator.clipboard.writeText(fullPrompt);
      if ((window as any).showToast) {
        (window as any).showToast('AI context copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      if ((window as any).showToast) {
        (window as any).showToast('Failed to copy to clipboard', 'error');
      }
    }
  };

  const hasWizardData = () => {
    if (documentType === 'spec') {
      return specData && (
        specData.projectOverview.name ||
        specData.projectOverview.description ||
        specData.technicalRequirements.architecture ||
        specData.functionalRequirements.userStories.length > 0
      );
    } else {
      return memoryData && (
        memoryData.projectInfo.name ||
        memoryData.projectInfo.description ||
        memoryData.decisionLog.length > 0 ||
        memoryData.lessonsLearned.length > 0
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Assistant for Your {documentType === 'spec' ? 'Specification' : 'Memory Document'}
        </h3>
        <p className="text-gray-600">
          Generate AI prompts using the information you've entered in this wizard to get contextual assistance.
        </p>
        {!hasWizardData() && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              💡 Fill out more wizard steps to get richer AI context with your project details.
            </p>
          </div>
        )}
      </div>

      {/* Task Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What type of help do you need?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries({
            feature: { icon: Lightbulb, label: 'New Feature', color: 'green' },
            bug: { icon: Settings, label: 'Bug Fix', color: 'red' },
            refactor: { icon: FileText, label: 'Refactoring', color: 'blue' },
            architecture: { icon: Brain, label: 'Architecture', color: 'purple' }
          }).map(([key, { icon: Icon, label, color }]) => (
            <button
              key={key}
              onClick={() => setSelectedTask(key as any)}
              className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                selectedTask === key
                  ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* User Prompt */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Question or Request
        </label>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder={taskExamples[selectedTask]}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          rows={3}
        />
        <p className="text-sm text-gray-500 mt-1">
          Leave empty to use the example prompt above
        </p>
      </div>

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={handleGenerateContext}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          <Brain className="w-4 h-4" />
          {isLoading ? 'Generating Context...' : 'Generate AI Context'}
        </button>
      </div>

      {/* Generated Context Preview */}
      {generatedContext && (
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Generated AI Context from Your Wizard Data</h4>
            <button
              onClick={copyContextToClipboard}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto bg-gray-50 p-3 rounded border max-h-80 overflow-y-auto">
              {generatedContext}
            </pre>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">Your Request:</h5>
              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                {userPrompt || taskExamples[selectedTask]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-1">
          💡 How to Use This
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• This context is generated from your current wizard progress</li>
          <li>• Copy the full prompt and paste it into ChatGPT, Claude, or your preferred AI assistant</li>
          <li>• The more wizard steps you complete, the richer your AI context becomes</li>
          <li>• Different task types emphasize different aspects of your {documentType} document</li>
        </ul>
      </div>

      {/* What Gets Included */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
          🛠️ What Gets Included from Your Wizard
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {documentType === 'spec' ? (
            <>
              <div>
                <strong>For Features:</strong>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>• Project overview & purpose</li>
                  <li>• Technical architecture</li>
                  <li>• User stories & requirements</li>
                  <li>• API endpoints</li>
                </ul>
              </div>
              <div>
                <strong>For Architecture:</strong>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>• Technical requirements</li>
                  <li>• Non-functional requirements</li>
                  <li>• Dependencies & infrastructure</li>
                  <li>• Performance constraints</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>From Your Memory Doc:</strong>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>• Project information</li>
                  <li>• Decision log entries</li>
                  <li>• Lessons learned</li>
                  <li>• Key terminology</li>
                </ul>
              </div>
              <div>
                <strong>Contextual Guidance:</strong>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>• Past decisions & rationale</li>
                  <li>• Team insights & learnings</li>
                  <li>• Domain-specific terms</li>
                  <li>• Project constraints</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};