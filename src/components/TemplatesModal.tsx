import { useState } from 'react';
import { X, Download, Copy, FileText, BookOpen, Lightbulb } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatesModal({ isOpen, onClose }: TemplatesModalProps) {
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadTemplate = (fileName: string) => {
    const templateUrl = `${import.meta.env.VITE_TEMPLATES_BASE_URL || '/templates'}/${fileName}`;
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = fileName;
    link.click();
  };

  const downloadAllTemplates = () => {
    // Download all template files
    const templates = [
      { name: 'Memory Document Template', file: 'memory-document-template.md' },
      { name: 'Specification Document Template', file: 'spec-document-template.md' },
      { name: 'Quick Reference Guide', file: 'QUICK-REFERENCE.md' },
      { name: 'Usage Guide', file: 'README.md' }
    ];

    templates.forEach(template => {
      setTimeout(() => downloadTemplate(template.file), 100);
    });
  };

  const aiPrompts = [
    {
      title: "Update Memory Document",
      prompt: `Update my project memory document with the following information:

[Describe decisions made, meetings held, lessons learned, etc.]

Follow the format in the existing document and add entries to the appropriate sections. Make sure to:
- Use the exact section headers and field names for Arcana compatibility
- Format action items as: - [x] Task description (Assignee - Date)
- Include proper dates, stakeholders, and rationale for decisions
- Add any new terms to the glossary if needed`
    },
    {
      title: "Update Specification Document", 
      prompt: `Update my project specification document with the following changes:

[Describe new features, requirements changes, API updates, etc.]

Follow the format in the existing document and:
- Add new features to the appropriate functional requirements section
- Use the user story format: "As a [user], I want [action] so that [benefit]"
- Include acceptance criteria as checkboxes: - [ ] Criterion
- Update API specifications with proper JSON examples
- Maintain all field names and formatting for Arcana compatibility`
    },
    {
      title: "Weekly Documentation Update",
      prompt: `It's been a week since our last documentation update. Please review recent:
- Git commits and their messages
- Closed issues and pull requests
- Team meeting notes (if available)
- Any new decisions or changes

Update both documents with:
1. New decisions made this week
2. Lessons learned from completed work
3. Progress on roadmap items
4. Any new features or requirements
5. Updates to technical specifications

Use the established format and maintain Arcana compatibility.`
    }
  ];

  const copyPrompt = (prompt: string, title: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(title);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <div id="templates-modal-overlay" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div id="templates-modal-content" className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div id="templates-modal-header" className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 id="templates-modal-title" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              Documentation Templates
            </h2>
            <p id="templates-modal-subtitle" className="text-gray-600 mt-1">
              AI-friendly templates for professional project documentation
            </p>
          </div>
          <button
            id="templates-modal-close"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div id="templates-modal-body" className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Quick Action Button */}
          <div id="quick-actions-section" className="mb-8">
            <div id="download-all-card" className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 max-w-md mx-auto">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Get All Templates
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                Download complete template pack with usage guides and documentation
              </p>
              <button
                id="download-all-templates-btn"
                onClick={downloadAllTemplates}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Download Template Pack
              </button>
            </div>
          </div>

          {/* Individual Templates */}
          <div id="individual-templates-section" className="mb-8">
            <h3 id="individual-templates-title" className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Individual Templates
            </h3>
            <div id="templates-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div id="memory-template-card" className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">Memory Document Template</h4>
                <p className="text-gray-600 text-sm mb-3">
                  For decisions, meetings, lessons learned, and team knowledge
                </p>
                <button
                  id="download-memory-template-btn"
                  onClick={() => downloadTemplate('memory-document-template.md')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>

              <div id="spec-template-card" className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">Specification Document Template</h4>
                <p className="text-gray-600 text-sm mb-3">
                  For technical requirements, features, and API documentation
                </p>
                <button
                  id="download-spec-template-btn"
                  onClick={() => downloadTemplate('spec-document-template.md')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>

              <div id="quick-reference-card" className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">Quick Reference Guide</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Essential formatting rules and common patterns
                </p>
                <button
                  id="download-quick-reference-btn"
                  onClick={() => downloadTemplate('QUICK-REFERENCE.md')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download Guide
                </button>
              </div>

              <div id="usage-guide-card" className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">Complete Usage Guide</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Comprehensive documentation and AI integration guide
                </p>
                <button
                  id="download-usage-guide-btn"
                  onClick={() => downloadTemplate('README.md')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download Guide
                </button>
              </div>
            </div>
          </div>

          {/* AI Prompts */}
          <div id="ai-prompts-section">
            <h3 id="ai-prompts-title" className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Ready-to-Use AI Prompts
            </h3>
            <div id="ai-prompts-list" className="space-y-4">
              {aiPrompts.map((item, index) => (
                <div key={index} id={`ai-prompt-card-${index}`} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <button
                      id={`copy-prompt-btn-${index}`}
                      onClick={() => copyPrompt(item.prompt, item.title)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        copiedPrompt === item.title
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {copiedPrompt === item.title ? (
                        <>✓ Copied!</>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 inline mr-1" />
                          Copy Prompt
                        </>
                      )}
                    </button>
                  </div>
                  <pre id={`ai-prompt-text-${index}`} className="text-sm text-gray-600 bg-gray-50 p-3 rounded border overflow-x-auto whitespace-pre-wrap">
                    {item.prompt}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div id="benefits-section" className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
            <h3 id="benefits-title" className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Why Use These Templates?
            </h3>
            <div id="benefits-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-purple-800 mb-2">🤖 AI-Optimized</h4>
                <p className="text-purple-700">
                  Designed for seamless AI agent collaboration and updates
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-800 mb-2">🔄 Arcana Compatible</h4>
                <p className="text-purple-700">
                  Perfect import/export compatibility with Arcana platform
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-800 mb-2">📊 Industry Standard</h4>
                <p className="text-purple-700">
                  Professional format suitable for any development team
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-800 mb-2">⚡ Quick Start</h4>
                <p className="text-purple-700">
                  Get started immediately with comprehensive examples
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="templates-modal-footer" className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p id="footer-message" className="text-sm text-gray-600">
              Templates are updated regularly. Check back for new features and improvements.
            </p>
            <button
              id="templates-modal-close-footer"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}