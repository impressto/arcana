import React, { useState } from 'react';
import { Brain, FileText, Lightbulb, Settings } from 'lucide-react';
import { getAIContextForTask } from '../utils/aiContextBuilder';

interface AIAssistantDemoProps {
  onContextGenerated?: (context: string, prompt: string) => void;
}

/**
 * Demo component showing how to leverage spec and memory documents for AI assistance
 * This component demonstrates practical ways to use your project documentation
 */
export const AIAssistantDemo: React.FC<AIAssistantDemoProps> = ({ onContextGenerated }) => {
  const [selectedTask, setSelectedTask] = useState<'feature' | 'bug' | 'refactor' | 'architecture'>('feature');
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedContext, setGeneratedContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const taskExamples = {
    feature: "Help me implement a new 'Quick Export' button that exports the current document without showing the preview step.",
    bug: "I'm having an issue where the markdown parser isn't correctly handling nested lists in the decision log section.",
    refactor: "I want to refactor the wizard context to use a more efficient state management pattern.",
    architecture: "Should I add a plugin system to allow custom document templates?"
  };

  const handleGenerateContext = async () => {
    setIsLoading(true);
    try {
      const context = await getAIContextForTask(selectedTask);
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
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          AI Assistant Context Generator
        </h2>
        <p className="text-gray-600">
          Generate rich context from your spec and memory documents to get better AI assistance.
        </p>
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
                  : 'border-gray-200 hover:border-gray-300'
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Brain className="w-4 h-4" />
          {isLoading ? 'Generating Context...' : 'Generate AI Context'}
        </button>
      </div>

      {/* Generated Context Preview */}
      {generatedContext && (
        <div className="border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Generated AI Context</h3>
            <button
              onClick={copyContextToClipboard}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Copy Full Prompt
            </button>
          </div>
          <div className="p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto bg-gray-50 p-3 rounded border max-h-96 overflow-y-auto">
              {generatedContext}
            </pre>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Your Request:</h4>
              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                {userPrompt || taskExamples[selectedTask]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">💡 How to Use This</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Copy the generated prompt and paste it into ChatGPT, Claude, or your preferred AI assistant</li>
          <li>• The context includes relevant project details, decisions, and constraints</li>
          <li>• This helps the AI understand your codebase and provide more accurate suggestions</li>
          <li>• Different task types include different sections for optimal relevance</li>
        </ul>
      </div>

      {/* Context Builder Examples */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-2">🛠️ What Gets Included</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Feature Development:</strong>
            <ul className="text-gray-600 mt-1 space-y-1">
              <li>• Project overview & requirements</li>
              <li>• Technical architecture</li>
              <li>• Past decisions & rationale</li>
              <li>• Lessons learned</li>
            </ul>
          </div>
          <div>
            <strong>Bug Fixing:</strong>
            <ul className="text-gray-600 mt-1 space-y-1">
              <li>• Architecture decisions</li>
              <li>• Known issues & solutions</li>
              <li>• Technical constraints</li>
              <li>• Past debugging experiences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};