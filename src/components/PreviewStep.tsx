import React, { useState } from 'react';
import { Download, FileText, Eye } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';
import { WizardAIAssistant } from './WizardAIAssistant';

export const PreviewStep: React.FC = () => {
  const { documentType, specData, memoryData } = useWizard();
  const [previewMode, setPreviewMode] = useState<'formatted' | 'markdown'>('formatted');

  const generateMarkdown = () => {
    if (documentType === 'spec') {
      return generateSpecMarkdown(specData);
    } else {
      return generateMemoryMarkdown(memoryData);
    }
  };

  const downloadMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentType}-document.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if ((window as any).showToast) {
      (window as any).showToast(`${documentType}-document.md downloaded successfully!`, 'success');
    }
  };

  const copyToClipboard = async () => {
    const markdown = generateMarkdown();
    try {
      await navigator.clipboard.writeText(markdown);
      if ((window as any).showToast) {
        (window as any).showToast('Markdown copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      if ((window as any).showToast) {
        (window as any).showToast('Failed to copy to clipboard', 'error');
      }
    }
  };

  return (
    <div id="preview-step" className="space-y-6">
      <div id="preview-header">
        <h2 id="preview-title" className="text-2xl font-bold text-gray-900 mb-2">Preview & Export</h2>
        <p id="preview-description" className="text-gray-600">
          Review your document and export it as Markdown.
        </p>
      </div>

      <div id="preview-controls" className="flex items-center justify-between">
        <div id="view-mode-toggles" className="flex items-center space-x-4">
          <button
            id="formatted-view-button"
            onClick={() => setPreviewMode('formatted')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewMode === 'formatted'
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Eye id="formatted-view-icon" className="w-4 h-4" />
            <span>Formatted View</span>
          </button>
          <button
            id="markdown-view-button"
            onClick={() => setPreviewMode('markdown')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewMode === 'markdown'
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FileText id="markdown-view-icon" className="w-4 h-4" />
            <span>Markdown Source</span>
          </button>
        </div>

        <div id="export-actions" className="flex items-center space-x-3">
          <button
            id="copy-markdown-button"
            onClick={copyToClipboard}
            className="btn-secondary flex items-center space-x-2"
          >
            <FileText id="copy-markdown-icon" className="w-4 h-4" />
            <span>Copy Markdown</span>
          </button>
          <button
            id="download-markdown-button"
            onClick={downloadMarkdown}
            className="btn-primary flex items-center space-x-2"
          >
            <Download id="download-markdown-icon" className="w-4 h-4" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      <div id="preview-content" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {previewMode === 'formatted' ? (
          <div id="formatted-preview" className="bg-white p-8 max-w-none">
            {documentType === 'spec' ? (
              <FormattedSpecPreview data={specData} />
            ) : (
              <FormattedMemoryPreview data={memoryData} />
            )}
          </div>
        ) : (
          <div id="markdown-preview" className="bg-gray-900">
            <div id="markdown-header" className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div id="markdown-header-content" className="flex items-center space-x-2">
                <div id="traffic-light-red" className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div id="traffic-light-yellow" className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div id="traffic-light-green" className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span id="filename-display" className="ml-4 text-gray-400 text-sm font-medium">
                  {documentType}-document.md
                </span>
              </div>
            </div>
            <pre id="markdown-source" className="p-6 text-sm text-green-400 whitespace-pre-wrap font-mono overflow-x-auto bg-gray-900 leading-relaxed">
              {generateMarkdown()}
            </pre>
          </div>
        )}
      </div>

      {/* AI Assistant for generating prompts based on current wizard data */}
      {documentType && (
        <WizardAIAssistant 
          documentType={documentType}
          specData={documentType === 'spec' ? specData : undefined}
          memoryData={documentType === 'memory' ? memoryData : undefined}
        />
      )}
    </div>
  );
};

// Formatted Spec Preview Component
const FormattedSpecPreview: React.FC<{ data: any }> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="max-w-none">
      {/* Document Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.projectOverview.name || 'Project Specification'}
        </h1>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Technical Specification Document</span>
          <span>Generated on {currentDate}</span>
        </div>
      </div>

      {/* Project Overview Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          📋 Project Overview
        </h2>
        
        {data.projectOverview.description ? (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-gray-800 leading-relaxed">{data.projectOverview.description}</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-gray-500 italic">
            Project description not provided
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.projectOverview.purpose && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">🎯 Purpose</h4>
              <p className="text-gray-700">{data.projectOverview.purpose}</p>
            </div>
          )}
          
          {data.projectOverview.timeline && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">⏰ Timeline</h4>
              <p className="text-gray-700">{data.projectOverview.timeline}</p>
            </div>
          )}
        </div>

        {data.projectOverview.stakeholders && data.projectOverview.stakeholders.length > 0 && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">👥 Stakeholders</h4>
            <div className="flex flex-wrap gap-2">
              {data.projectOverview.stakeholders.map((stakeholder: string, index: number) => (
                stakeholder && (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {stakeholder}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Functional Requirements */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          ⚙️ Functional Requirements
        </h2>

        {data.functionalRequirements.userStories && data.functionalRequirements.userStories.length > 0 && data.functionalRequirements.userStories.some((story: string) => story.trim()) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">User Stories</h3>
            <div className="space-y-3">
              {data.functionalRequirements.userStories.map((story: string, index: number) => 
                story.trim() && (
                  <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <p className="text-gray-800">📖 {story}</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {data.functionalRequirements.features && data.functionalRequirements.features.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
            <div className="grid gap-4">
              {data.functionalRequirements.features.map((feature: any, index: number) => (
                feature.name && (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          feature.priority === 'high' ? 'bg-red-100 text-red-700' :
                          feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {feature.priority || 'medium'}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                          {feature.status || 'planned'}
                        </span>
                      </div>
                    </div>
                    {feature.description && (
                      <p className="text-gray-700 text-sm">{feature.description}</p>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Technical Requirements */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          🔧 Technical Requirements
        </h2>

        {data.technicalRequirements.architecture && (
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Architecture Overview</h3>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{data.technicalRequirements.architecture}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.technicalRequirements.technologies && data.technicalRequirements.technologies.length > 0 && data.technicalRequirements.technologies.some((tech: string) => tech.trim()) && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">💻 Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {data.technicalRequirements.technologies.map((tech: string, index: number) => 
                  tech.trim() && (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {data.technicalRequirements.dependencies && data.technicalRequirements.dependencies.length > 0 && data.technicalRequirements.dependencies.some((dep: string) => dep.trim()) && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">📦 Dependencies</h4>
              <ul className="space-y-1">
                {data.technicalRequirements.dependencies.map((dep: string, index: number) => 
                  dep.trim() && (
                    <li key={index} className="text-gray-700 text-sm">• {dep}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        {data.technicalRequirements.infrastructure && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🏗️ Infrastructure</h4>
            <p className="text-gray-700 whitespace-pre-line">{data.technicalRequirements.infrastructure}</p>
          </div>
        )}
      </section>

      {/* API Documentation */}
      {data.apis && data.apis.endpoints && data.apis.endpoints.length > 0 && data.apis.endpoints.some((ep: any) => ep.path) && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            🔌 API Documentation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {data.apis.authentication && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">🔐 Authentication</h4>
                <p className="text-yellow-800 text-sm">{data.apis.authentication}</p>
              </div>
            )}
            {data.apis.rateLimit && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">⚡ Rate Limiting</h4>
                <p className="text-orange-800 text-sm">{data.apis.rateLimit}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {data.apis.endpoints.map((endpoint: any, index: number) => 
              endpoint.path && (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.method || 'GET'}
                    </span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{endpoint.path}</code>
                  </div>
                  {endpoint.description && (
                    <p className="text-gray-700 mb-3">{endpoint.description}</p>
                  )}
                  {endpoint.parameters && endpoint.parameters.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs font-semibold text-gray-600 mb-1">PARAMETERS</p>
                      <p className="text-sm text-gray-700">{endpoint.parameters.join(', ')}</p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Non-Functional Requirements */}
      {(data.nonFunctionalRequirements.performance || data.nonFunctionalRequirements.security || data.nonFunctionalRequirements.scalability) && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            📊 Non-Functional Requirements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.nonFunctionalRequirements.performance && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">⚡ Performance</h4>
                <p className="text-gray-700 text-sm">{data.nonFunctionalRequirements.performance}</p>
              </div>
            )}
            {data.nonFunctionalRequirements.security && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">🔒 Security</h4>
                <p className="text-gray-700 text-sm">{data.nonFunctionalRequirements.security}</p>
              </div>
            )}
            {data.nonFunctionalRequirements.scalability && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">📈 Scalability</h4>
                <p className="text-gray-700 text-sm">{data.nonFunctionalRequirements.scalability}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Roadmap */}
      {data.roadmap && data.roadmap.phases && data.roadmap.phases.length > 0 && data.roadmap.phases.some((phase: any) => phase.name) && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            🗺️ Project Roadmap
          </h2>
          
          <div className="space-y-6">
            {data.roadmap.phases.map((phase: any, index: number) => 
              phase.name && (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Phase {index + 1}: {phase.name}</h3>
                    {phase.timeline && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {phase.timeline}
                      </span>
                    )}
                  </div>
                  {phase.deliverables && phase.deliverables.length > 0 && phase.deliverables.some((d: string) => d.trim()) && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Deliverables:</h4>
                      <ul className="space-y-1">
                        {phase.deliverables.map((deliverable: string, dIndex: number) => 
                          deliverable.trim() && (
                            <li key={dIndex} className="text-gray-700 text-sm">✓ {deliverable}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Document generated by Arcana • {currentDate}</p>
      </div>
    </div>
  );
};

// Formatted Memory Preview Component
const FormattedMemoryPreview: React.FC<{ data: any }> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="max-w-none">
      {/* Document Header */}
      <div className="border-b-2 border-purple-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.projectInfo.name || 'Project Memory Document'}
        </h1>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Knowledge Management Document</span>
          <span>Generated on {currentDate}</span>
        </div>
      </div>

      {/* Project Information Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          📝 Project Information
        </h2>
        
        {data.projectInfo.description ? (
          <div className="bg-purple-50 p-6 rounded-lg mb-6">
            <p className="text-gray-800 leading-relaxed">{data.projectInfo.description}</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-gray-500 italic">
            Project description not provided
          </div>
        )}

        {data.projectInfo.team && data.projectInfo.team.length > 0 && data.projectInfo.team.some((member: string) => member.trim()) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Team Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.projectInfo.team.map((member: string, index: number) => 
                member.trim() && (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-800 font-medium">{member}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </section>

      {/* Decision Log Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          🧭 Decision Log
        </h2>
        
        {data.decisionLog && data.decisionLog.length > 0 && data.decisionLog.some((decision: any) => decision.title) ? (
          <div className="space-y-6">
            {data.decisionLog.map((decision: any, index: number) => 
              decision.title && (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{decision.title}</h3>
                    {decision.date && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {decision.date}
                      </span>
                    )}
                  </div>
                  {decision.description && (
                    <p className="text-gray-700 mb-3">{decision.description}</p>
                  )}
                  {decision.rationale && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
                      <p className="text-sm text-gray-800"><strong>Rationale:</strong> {decision.rationale}</p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No decisions recorded yet</h3>
            <p className="text-gray-500">Important project decisions will be documented here as they are made.</p>
          </div>
        )}
      </section>

      {/* Glossary Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          📖 Glossary
        </h2>
        
        {data.glossary && data.glossary.length > 0 && data.glossary.some((term: any) => term.term) ? (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            {data.glossary.map((item: any, index: number) => 
              item.term && (
                <div key={index} className="p-4">
                  <dt className="font-semibold text-gray-900 mb-1">{item.term}</dt>
                  <dd className="text-gray-700 text-sm">{item.definition || 'Definition not provided'}</dd>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 6h4v2h-4V8zm-4 0h2v2H8V8zm4 4h4v2h-4v-2zm-4 0h2v2H8v-2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No terms defined yet</h3>
            <p className="text-gray-500">Technical terms and definitions will be documented here.</p>
          </div>
        )}
      </section>

      {/* Meeting Notes Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          🗣️ Meeting Notes
        </h2>
        
        {data.meetingNotes && data.meetingNotes.length > 0 && data.meetingNotes.some((meeting: any) => meeting.title) ? (
          <div className="space-y-4">
            {data.meetingNotes.map((meeting: any, index: number) => 
              meeting.title && (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-green-900">{meeting.title}</h3>
                    {meeting.date && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {meeting.date}
                      </span>
                    )}
                  </div>
                  {meeting.notes && (
                    <p className="text-green-800 whitespace-pre-line">{meeting.notes}</p>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meeting notes yet</h3>
            <p className="text-gray-500">Meeting records and action items will be documented here.</p>
          </div>
        )}
      </section>

      {/* Lessons Learned Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          💡 Lessons Learned
        </h2>
        
        {data.lessonsLearned && data.lessonsLearned.length > 0 && data.lessonsLearned.some((lesson: any) => lesson.title) ? (
          <div className="space-y-4">
            {data.lessonsLearned.map((lesson: any, index: number) => 
              lesson.title && (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">{lesson.title}</h3>
                  {lesson.description && (
                    <p className="text-yellow-800">{lesson.description}</p>
                  )}
                  {lesson.category && (
                    <div className="mt-3">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        {lesson.category}
                      </span>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zM4 5v2h16V5H4zm0 16h16v-2H4v2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons recorded yet</h3>
            <p className="text-gray-500">Key insights and learnings will be documented here as the project progresses.</p>
          </div>
        )}
      </section>

      {/* Onboarding Notes Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          🚀 Onboarding Notes
        </h2>
        
        {data.onboardingNotes && data.onboardingNotes.length > 0 && data.onboardingNotes.some((note: any) => note.newHireName) ? (
          <div className="space-y-6">
            {data.onboardingNotes.map((note: any, index: number) => 
              note.newHireName && (
                <div key={index} className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-indigo-900">{note.newHireName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      note.status === 'completed' ? 'bg-green-100 text-green-800' :
                      note.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {note.status?.replace('-', ' ') || 'In Progress'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-indigo-800">
                    <div><strong>Role:</strong> {note.role}</div>
                    <div><strong>Department:</strong> {note.department || 'N/A'}</div>
                    <div><strong>Start Date:</strong> {note.startDate || 'TBD'}</div>
                    <div><strong>Mentor:</strong> {note.mentor || 'Not assigned'}</div>
                  </div>

                  {note.onboardingTasks && note.onboardingTasks.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-indigo-900 mb-2">Tasks ({note.onboardingTasks.filter((t: any) => t.completed).length}/{note.onboardingTasks.length} completed)</h4>
                      <div className="space-y-1">
                        {note.onboardingTasks.map((task: any, taskIndex: number) => (
                          <div key={taskIndex} className="flex items-center gap-2 text-sm">
                            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-indigo-300'
                            }`}>
                              {task.completed && '✓'}
                            </span>
                            <span className={task.completed ? 'line-through text-indigo-600' : 'text-indigo-800'}>
                              {task.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {note.resources && note.resources.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-indigo-900 mb-2">Resources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {note.resources.map((resource: any, resourceIndex: number) => (
                          <div key={resourceIndex} className="text-sm text-indigo-800">
                            📚 {resource.title} ({resource.type})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {note.notes && (
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <h4 className="font-medium text-indigo-900 mb-1">Notes</h4>
                      <p className="text-sm text-indigo-800 whitespace-pre-line">{note.notes}</p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No onboarding notes yet</h3>
            <p className="text-gray-500">New team member guidance and setup instructions will be documented here.</p>
          </div>
        )}
      </section>

      {/* Document Summary Card */}
      <section className="mb-10">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Document Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">
                {data.decisionLog ? data.decisionLog.filter((d: any) => d.title).length : 0}
              </div>
              <div className="text-sm text-gray-600">Decisions</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {data.glossary ? data.glossary.filter((g: any) => g.term).length : 0}
              </div>
              <div className="text-sm text-gray-600">Terms</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {data.meetingNotes ? data.meetingNotes.filter((m: any) => m.title).length : 0}
              </div>
              <div className="text-sm text-gray-600">Meetings</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-600">
                {data.lessonsLearned ? data.lessonsLearned.filter((l: any) => l.title).length : 0}
              </div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Document generated by Arcana • {currentDate}</p>
      </div>
    </div>
  );
};

// Markdown generation functions
const generateSpecMarkdown = (data: any): string => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let markdown = `# ${data.projectOverview.name || 'Project Specification'}\n\n`;
  markdown += `*Technical Specification Document*\n`;
  markdown += `*Generated on ${currentDate}*\n\n`;
  markdown += `---\n\n`;
  
  // Project Overview
  markdown += `## 📋 Project Overview\n\n`;
  if (data.projectOverview.description) {
    markdown += `${data.projectOverview.description}\n\n`;
  }

  if (data.projectOverview.purpose || data.projectOverview.timeline || (data.projectOverview.stakeholders && data.projectOverview.stakeholders.length > 0)) {
    markdown += `### Key Details\n\n`;
    if (data.projectOverview.purpose) {
      markdown += `**🎯 Purpose:** ${data.projectOverview.purpose}\n\n`;
    }
    if (data.projectOverview.timeline) {
      markdown += `**⏰ Timeline:** ${data.projectOverview.timeline}\n\n`;
    }
    if (data.projectOverview.stakeholders && data.projectOverview.stakeholders.length > 0 && data.projectOverview.stakeholders.some((s: string) => s.trim())) {
      markdown += `**👥 Stakeholders:** ${data.projectOverview.stakeholders.filter((s: string) => s.trim()).join(', ')}\n\n`;
    }
  }

  // Functional Requirements
  markdown += `## ⚙️ Functional Requirements\n\n`;
  
  if (data.functionalRequirements.userStories && data.functionalRequirements.userStories.length > 0 && data.functionalRequirements.userStories.some((story: string) => story.trim())) {
    markdown += `### User Stories\n\n`;
    data.functionalRequirements.userStories.forEach((story: string) => {
      if (story.trim()) {
        markdown += `- 📖 ${story}\n`;
      }
    });
    markdown += '\n';
  }

  if (data.functionalRequirements.features && data.functionalRequirements.features.length > 0 && data.functionalRequirements.features.some((f: any) => f.name)) {
    markdown += `### Features\n\n`;
    data.functionalRequirements.features.forEach((feature: any) => {
      if (feature.name) {
        markdown += `#### ${feature.name}\n\n`;
        if (feature.description) {
          markdown += `${feature.description}\n\n`;
        }
        markdown += `- **Priority:** ${feature.priority || 'medium'}\n`;
        markdown += `- **Status:** ${feature.status || 'planned'}\n\n`;
      }
    });
  }

  // Technical Requirements
  if (data.technicalRequirements.architecture || (data.technicalRequirements.technologies && data.technicalRequirements.technologies.length > 0) || data.technicalRequirements.infrastructure) {
    markdown += `## 🔧 Technical Requirements\n\n`;
    
    if (data.technicalRequirements.architecture) {
      markdown += `### Architecture Overview\n\n`;
      markdown += `${data.technicalRequirements.architecture}\n\n`;
    }
    
    if (data.technicalRequirements.technologies && data.technicalRequirements.technologies.length > 0 && data.technicalRequirements.technologies.some((tech: string) => tech.trim())) {
      markdown += `### 💻 Technologies\n\n`;
      data.technicalRequirements.technologies.forEach((tech: string) => {
        if (tech.trim()) {
          markdown += `- ${tech}\n`;
        }
      });
      markdown += '\n';
    }

    if (data.technicalRequirements.infrastructure) {
      markdown += `### 🏗️ Infrastructure\n\n`;
      markdown += `${data.technicalRequirements.infrastructure}\n\n`;
    }

    if (data.technicalRequirements.dependencies && data.technicalRequirements.dependencies.length > 0 && data.technicalRequirements.dependencies.some((dep: string) => dep.trim())) {
      markdown += `### 📦 Dependencies\n\n`;
      data.technicalRequirements.dependencies.forEach((dep: string) => {
        if (dep.trim()) {
          markdown += `- ${dep}\n`;
        }
      });
      markdown += '\n';
    }
  }

  // API Documentation
  if (data.apis && data.apis.endpoints && data.apis.endpoints.length > 0 && data.apis.endpoints.some((ep: any) => ep.path)) {
    markdown += `## 🔌 API Documentation\n\n`;
    
    if (data.apis.authentication || data.apis.rateLimit) {
      if (data.apis.authentication) {
        markdown += `**🔐 Authentication:** ${data.apis.authentication}\n\n`;
      }
      if (data.apis.rateLimit) {
        markdown += `**⚡ Rate Limiting:** ${data.apis.rateLimit}\n\n`;
      }
    }
    
    markdown += `### Endpoints\n\n`;
    data.apis.endpoints.forEach((endpoint: any) => {
      if (endpoint.path) {
        markdown += `#### \`${endpoint.method || 'GET'}\` ${endpoint.path}\n\n`;
        if (endpoint.description) {
          markdown += `${endpoint.description}\n\n`;
        }
        if (endpoint.parameters && endpoint.parameters.length > 0) {
          markdown += `**Parameters:** ${endpoint.parameters.join(', ')}\n\n`;
        }
        if (endpoint.response) {
          markdown += `**Response:**\n\`\`\`json\n${endpoint.response}\n\`\`\`\n\n`;
        }
      }
    });
  }

  // Non-Functional Requirements
  if (data.nonFunctionalRequirements.performance || data.nonFunctionalRequirements.security || data.nonFunctionalRequirements.scalability) {
    markdown += `## 📊 Non-Functional Requirements\n\n`;
    
    if (data.nonFunctionalRequirements.performance) {
      markdown += `### ⚡ Performance\n\n${data.nonFunctionalRequirements.performance}\n\n`;
    }
    if (data.nonFunctionalRequirements.security) {
      markdown += `### 🔒 Security\n\n${data.nonFunctionalRequirements.security}\n\n`;
    }
    if (data.nonFunctionalRequirements.scalability) {
      markdown += `### 📈 Scalability\n\n${data.nonFunctionalRequirements.scalability}\n\n`;
    }
  }

  // Roadmap
  if (data.roadmap && data.roadmap.phases && data.roadmap.phases.length > 0 && data.roadmap.phases.some((phase: any) => phase.name)) {
    markdown += `## 🗺️ Project Roadmap\n\n`;
    
    data.roadmap.phases.forEach((phase: any, index: number) => {
      if (phase.name) {
        markdown += `### Phase ${index + 1}: ${phase.name}\n\n`;
        if (phase.timeline) {
          markdown += `**Timeline:** ${phase.timeline}\n\n`;
        }
        if (phase.deliverables && phase.deliverables.length > 0 && phase.deliverables.some((d: string) => d.trim())) {
          markdown += `**Deliverables:**\n`;
          phase.deliverables.forEach((deliverable: string) => {
            if (deliverable.trim()) {
              markdown += `- ✓ ${deliverable}\n`;
            }
          });
          markdown += '\n';
        }
      }
    });
  }

  markdown += `---\n\n`;
  markdown += `*Document generated by Arcana • ${currentDate}*\n`;
  
  return markdown;
};

const generateMemoryMarkdown = (data: any): string => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let markdown = `# ${data.projectInfo.name || 'Project Memory Document'}\n\n`;
  markdown += `*Knowledge Management Document*\n`;
  markdown += `*Generated on ${currentDate}*\n\n`;
  markdown += `---\n\n`;
  
  // Project Information
  markdown += `## 📝 Project Information\n\n`;
  if (data.projectInfo.description) {
    markdown += `${data.projectInfo.description}\n\n`;
  }
  
  if (data.projectInfo.team && data.projectInfo.team.length > 0 && data.projectInfo.team.some((member: string) => member.trim())) {
    markdown += `### 👥 Team Members\n\n`;
    data.projectInfo.team.forEach((member: string) => {
      if (member.trim()) {
        markdown += `- ${member}\n`;
      }
    });
    markdown += '\n';
  }

  // Decision Log
  markdown += `## 🧭 Decision Log\n\n`;
  if (data.decisionLog && data.decisionLog.length > 0 && data.decisionLog.some((decision: any) => decision.title)) {
    data.decisionLog.forEach((decision: any) => {
      if (decision.title) {
        markdown += `### ${decision.title}\n\n`;
        if (decision.date) {
          markdown += `**Date:** ${decision.date}\n\n`;
        }
        if (decision.description) {
          markdown += `${decision.description}\n\n`;
        }
        if (decision.rationale) {
          markdown += `**Rationale:** ${decision.rationale}\n\n`;
        }
        markdown += `---\n\n`;
      }
    });
  } else {
    markdown += `*Important project decisions will be documented here as they are made.*\n\n`;
  }

  // Glossary
  markdown += `## 📖 Glossary\n\n`;
  if (data.glossary && data.glossary.length > 0 && data.glossary.some((term: any) => term.term)) {
    data.glossary.forEach((item: any) => {
      if (item.term) {
        markdown += `**${item.term}**\n`;
        markdown += `${item.definition || 'Definition not provided'}\n\n`;
      }
    });
  } else {
    markdown += `*Technical terms and definitions will be documented here.*\n\n`;
  }

  // Meeting Notes
  markdown += `## 🗣️ Meeting Notes\n\n`;
  if (data.meetingNotes && data.meetingNotes.length > 0 && data.meetingNotes.some((meeting: any) => meeting.title)) {
    data.meetingNotes.forEach((meeting: any) => {
      if (meeting.title) {
        markdown += `### ${meeting.title}\n\n`;
        if (meeting.date) {
          markdown += `**Date:** ${meeting.date}\n\n`;
        }
        if (meeting.notes) {
          markdown += `${meeting.notes}\n\n`;
        }
        markdown += `---\n\n`;
      }
    });
  } else {
    markdown += `*Meeting records and action items will be documented here.*\n\n`;
  }

  // Lessons Learned
  markdown += `## 💡 Lessons Learned\n\n`;
  if (data.lessonsLearned && data.lessonsLearned.length > 0 && data.lessonsLearned.some((lesson: any) => lesson.title)) {
    data.lessonsLearned.forEach((lesson: any) => {
      if (lesson.title) {
        markdown += `### ${lesson.title}\n\n`;
        if (lesson.description) {
          markdown += `${lesson.description}\n\n`;
        }
        if (lesson.category) {
          markdown += `**Category:** ${lesson.category}\n\n`;
        }
        markdown += `---\n\n`;
      }
    });
  } else {
    markdown += `*Key insights and learnings will be documented here as the project progresses.*\n\n`;
  }

  // Onboarding Notes
  markdown += `## 🚀 Onboarding Notes\n\n`;
  if (data.onboardingNotes && data.onboardingNotes.length > 0 && data.onboardingNotes.some((note: any) => note.newHireName)) {
    data.onboardingNotes.forEach((note: any) => {
      if (note.newHireName) {
        markdown += `### ${note.newHireName} - ${note.role}\n\n`;
        markdown += `**Status:** ${note.status?.replace('-', ' ') || 'In Progress'}\n`;
        markdown += `**Department:** ${note.department || 'N/A'}\n`;
        markdown += `**Start Date:** ${note.startDate || 'TBD'}\n`;
        markdown += `**Mentor:** ${note.mentor || 'Not assigned'}\n\n`;

        if (note.onboardingTasks && note.onboardingTasks.length > 0) {
          const completedTasks = note.onboardingTasks.filter((t: any) => t.completed).length;
          markdown += `**Onboarding Tasks (${completedTasks}/${note.onboardingTasks.length} completed):**\n\n`;
          note.onboardingTasks.forEach((task: any) => {
            markdown += `- [${task.completed ? 'x' : ' '}] ${task.task}\n`;
          });
          markdown += `\n`;
        }

        if (note.resources && note.resources.length > 0) {
          markdown += `**Resources:**\n\n`;
          note.resources.forEach((resource: any) => {
            markdown += `- 📚 ${resource.title} (${resource.type})\n`;
          });
          markdown += `\n`;
        }

        if (note.notes) {
          markdown += `**Notes:**\n${note.notes}\n\n`;
        }

        markdown += `---\n\n`;
      }
    });
  } else {
    markdown += `*New team member guidance and setup instructions will be documented here.*\n\n`;
  }

  // Document Summary
  const decisionsCount = data.decisionLog ? data.decisionLog.filter((d: any) => d.title).length : 0;
  const termsCount = data.glossary ? data.glossary.filter((g: any) => g.term).length : 0;
  const meetingsCount = data.meetingNotes ? data.meetingNotes.filter((m: any) => m.title).length : 0;
  const lessonsCount = data.lessonsLearned ? data.lessonsLearned.filter((l: any) => l.title).length : 0;

  markdown += `## 📊 Document Summary\n\n`;
  markdown += `- **Decisions Recorded:** ${decisionsCount}\n`;
  markdown += `- **Terms Defined:** ${termsCount}\n`;
  markdown += `- **Meetings Documented:** ${meetingsCount}\n`;
  markdown += `- **Lessons Captured:** ${lessonsCount}\n\n`;

  markdown += `---\n\n`;
  markdown += `*Document generated by Arcana • ${currentDate}*\n`;
  
  return markdown;
};
