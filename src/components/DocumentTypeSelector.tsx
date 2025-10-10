import React from 'react';
import { FileText, BookOpen, Bot } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';
import { LearningCard } from './LearningCard';
import type { DocumentType } from '../types';

export const DocumentTypeSelector: React.FC = () => {
  const { setDocumentType, resetWizard, documentType } = useWizard();
  
  // Use state to track saved progress
  const [savedData, setSavedData] = React.useState<any>(null);
  
  // Function to check localStorage
  const checkSavedProgress = React.useCallback(() => {
    try {
      const saved = localStorage.getItem('arcana-state');
      const data = saved ? JSON.parse(saved) : null;
      setSavedData(data);
    } catch {
      setSavedData(null);
    }
  }, []);
  
  // Check saved progress on mount and when documentType changes
  React.useEffect(() => {
    checkSavedProgress();
  }, [checkSavedProgress, documentType]);

  const hasSavedProgress = savedData && savedData.documentType;

  const documentTypes = [
    {
      type: 'spec' as DocumentType,
      title: 'Specification Document',
      description: 'Create technical and functional requirements documentation',
      icon: FileText,
      features: [
        'Project Overview',
        'Functional Requirements',
        'Technical Architecture',
        'API Documentation',
        'Non-Functional Requirements',
        'Project Roadmap'
      ]
    },
    {
      type: 'memory' as DocumentType,
      title: 'Memory Document',
      description: 'Create organizational knowledge and decision documentation',
      icon: BookOpen,
      features: [
        'Decision Log',
        'Glossary & Terms',
        'Meeting Notes',
        'Lessons Learned',
        'Onboarding Guide'
      ]
    }
  ];

  return (
    <div id="document-type-selector" className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div id="selector-container" className="max-w-6xl w-full">
        <div id="selector-header" className="text-center mb-12">
          <div id="header-title-section" className="flex items-center justify-center mb-6">
            <img 
              src="https://impressto.ca/images/arcana.png" 
              alt="Arcana Logo" 
              className="h-12 sm:h-14 w-auto transition-transform duration-200 hover:scale-105"
            />
          </div>

                    {/* Explanatory Image Section */}
          <div id="concept-explanation" className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                  Understanding Document Types for AI Agents
                </h3>
                <div className="relative">
                  <img 
                    src={import.meta.env.VITE_CONCEPT_IMAGE_URL || "/spec-mem-docs.jpg"} 
                    alt="Specification vs Memory Documents - A visual guide showing how different document types serve AI agents in project development and knowledge management"
                    className="w-full h-auto rounded-lg shadow-sm"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3 text-center">
                  <strong>Spec Documents</strong> define what to build, while <strong>Memory Documents</strong> capture what was learned. 
                  Both are essential for effective AI-assisted development.
                </p>
                
                {/* Real-world Example Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">
                          Real-World Example: Collabrio Project
                        </h4>
                        <p className="text-xs text-blue-800 mb-2">
                          See how spec and memory documents guided the development of a complete real-time collaboration platform built entirely with AI assistance.
                        </p>
                        <a 
                          href="https://github.com/impressto/collabrio" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-blue-700 hover:text-blue-900 font-medium hover:underline transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                          </svg>
                          View Collabrio Project →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p id="selector-description" className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the type of documentation you want to create. Arcana will guide you through 
            each step to create professional, comprehensive documentation.
          </p>
          

        </div>

        {hasSavedProgress && (
          <div id="saved-progress-section" className="max-w-4xl mx-auto mb-8">
            <div id="saved-progress-card" className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div id="saved-progress-content" className="flex items-center justify-between">
                <div id="saved-progress-info" className="flex items-center">
                  <div id="saved-progress-icon" className="text-blue-600 mr-3">
                    💾
                  </div>
                  <div id="saved-progress-text">
                    <h3 id="saved-progress-title" className="text-blue-900 font-medium">
                      Resume Previous Session
                    </h3>
                    <p id="saved-progress-description" className="text-blue-700 text-sm">
                      You have saved progress for a {savedData.documentType} document. You can continue where you left off.
                    </p>
                  </div>
                </div>
                <div id="saved-progress-actions" className="flex gap-2">
                  <button
                    id="resume-button"
                    onClick={() => setDocumentType(savedData.documentType)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Resume
                  </button>
                  <button
                    id="start-over-button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to start over? This will delete your saved progress.')) {
                        resetWizard();
                        // Force refresh the saved progress state
                        setTimeout(() => checkSavedProgress(), 0);
                      }
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Mode Content */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <LearningCard
            type="why-matters"
            title="Why Documentation Matters for AI Development"
            content="Good documentation is the foundation of effective AI-assisted development. AI tools like GitHub Copilot and ChatGPT work better when they understand your project's context, decisions, and requirements."
          />
          
          <LearningCard
            type="explanation"
            title="Spec vs Memory Documents"
            content="Specification documents define what to build (requirements, features, architecture). Memory documents capture knowledge and context (decisions, lessons learned, team wisdom). Together, they give AI assistants complete project understanding."
          />
        </div>

        <div id="document-types-container" className="max-w-4xl mx-auto">
          {/* Mobile: Stack vertically with robot between */}
          <div className="lg:hidden space-y-8">
            {/* Spec Document Card */}
            {documentTypes.filter(doc => doc.type === 'spec').map((docType) => {
              const IconComponent = docType.icon;
              return (
                <div
                  key={docType.type}
                  id={`${docType.type}-document-card`}
                  className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group flex flex-col"
                  onClick={() => setDocumentType(docType.type)}
                >
                  <div id={`${docType.type}-card-header`} className="text-center mb-6">
                    <div 
                      id={`${docType.type}-icon-container`} 
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 transition-colors duration-200 ${
                        docType.type === 'memory' 
                          ? 'bg-green-100 group-hover:bg-green-200' 
                          : 'bg-primary-100 group-hover:bg-primary-200'
                      }`}
                    >
                      <IconComponent 
                        id={`${docType.type}-icon`} 
                        className={`w-8 h-8 ${
                          docType.type === 'memory' 
                            ? 'text-green-600' 
                            : 'text-primary-600'
                        }`} 
                      />
                    </div>
                    <h3 id={`${docType.type}-title`} className="text-2xl font-semibold text-gray-900 mb-2">
                      {docType.title}
                    </h3>
                    <p id={`${docType.type}-description`} className="text-gray-600">
                      {docType.description}
                    </p>
                  </div>

                  <div id={`${docType.type}-features-section`} className="space-y-3 flex-1">
                    <h4 id={`${docType.type}-features-title`} className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                      Includes:
                    </h4>
                    <ul id={`${docType.type}-features-list`} className="space-y-2">
                      {docType.features.map((feature, index) => (
                        <li key={index} id={`${docType.type}-feature-${index}`} className="flex items-center text-gray-600">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div id={`${docType.type}-action-section`} className="mt-8">
                    <button id={`${docType.type}-start-button`} className="btn-primary w-full group-hover:bg-primary-700">
                      Start {docType.title}
                    </button>
                  </div>
                </div>
              );
            })}
            
            {/* AI Robot Icon */}
            <div id="ai-agent-section" className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg mb-3">
                  <Bot className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600 text-center max-w-32">
                  AI Agent Uses Both
                </p>
              </div>
            </div>
            
            {/* Memory Document Card */}
            {documentTypes.filter(doc => doc.type === 'memory').map((docType) => {
              const IconComponent = docType.icon;
              return (
                <div
                  key={docType.type}
                  id={`${docType.type}-document-card`}
                  className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group flex flex-col"
                  onClick={() => setDocumentType(docType.type)}
                >
                  <div id={`${docType.type}-card-header`} className="text-center mb-6">
                    <div 
                      id={`${docType.type}-icon-container`} 
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 transition-colors duration-200 ${
                        docType.type === 'memory' 
                          ? 'bg-green-100 group-hover:bg-green-200' 
                          : 'bg-primary-100 group-hover:bg-primary-200'
                      }`}
                    >
                      <IconComponent 
                        id={`${docType.type}-icon`} 
                        className={`w-8 h-8 ${
                          docType.type === 'memory' 
                            ? 'text-green-600' 
                            : 'text-primary-600'
                        }`} 
                      />
                    </div>
                    <h3 id={`${docType.type}-title`} className="text-2xl font-semibold text-gray-900 mb-2">
                      {docType.title}
                    </h3>
                    <p id={`${docType.type}-description`} className="text-gray-600">
                      {docType.description}
                    </p>
                  </div>

                  <div id={`${docType.type}-features-section`} className="space-y-3 flex-1">
                    <h4 id={`${docType.type}-features-title`} className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                      Includes:
                    </h4>
                    <ul id={`${docType.type}-features-list`} className="space-y-2">
                      {docType.features.map((feature, index) => (
                        <li key={index} id={`${docType.type}-feature-${index}`} className="flex items-center text-gray-600">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div id={`${docType.type}-action-section`} className="mt-8">
                    <button id={`${docType.type}-start-button`} className="btn-primary w-full group-hover:bg-primary-700">
                      Start {docType.title}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Desktop: 3-column layout */}
          <div className="hidden lg:grid lg:gap-8 lg:items-stretch" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
            {/* Spec Document Card */}
            {documentTypes.filter(doc => doc.type === 'spec').map((docType) => {
            const IconComponent = docType.icon;
            return (
              <div
                key={docType.type}
                id={`${docType.type}-document-card`}
                className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group flex flex-col h-full"
                onClick={() => setDocumentType(docType.type)}
              >
                <div id={`${docType.type}-card-header`} className="text-center mb-6">
                  <div 
                    id={`${docType.type}-icon-container`} 
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 transition-colors duration-200 ${
                      docType.type === 'memory' 
                        ? 'bg-green-100 group-hover:bg-green-200' 
                        : 'bg-primary-100 group-hover:bg-primary-200'
                    }`}
                  >
                    <IconComponent 
                      id={`${docType.type}-icon`} 
                      className={`w-8 h-8 ${
                        docType.type === 'memory' 
                          ? 'text-green-600' 
                          : 'text-primary-600'
                      }`} 
                    />
                  </div>
                  <h3 id={`${docType.type}-title`} className="text-2xl font-semibold text-gray-900 mb-2">
                    {docType.title}
                  </h3>
                  <p id={`${docType.type}-description`} className="text-gray-600">
                    {docType.description}
                  </p>
                </div>

                <div id={`${docType.type}-features-section`} className="space-y-3 flex-1">
                  <h4 id={`${docType.type}-features-title`} className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                    Includes:
                  </h4>
                  <ul id={`${docType.type}-features-list`} className="space-y-2">
                    {docType.features.map((feature, index) => (
                      <li key={index} id={`${docType.type}-feature-${index}`} className="flex items-center text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div id={`${docType.type}-action-section`} className="mt-8">
                  <button id={`${docType.type}-start-button`} className="btn-primary w-full group-hover:bg-primary-700">
                    Start {docType.title}
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* AI Robot Icon - Center Column */}
          <div id="ai-agent-section" className="flex justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl mb-4 shadow-sm">
                <Bot className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">AI Agent</h4>
              <p className="text-sm text-gray-600 text-center max-w-40">
                Uses both document types for complete project understanding
              </p>
            </div>
          </div>
          
          {/* Memory Document Card - Right Column */}
          {documentTypes.filter(doc => doc.type === 'memory').map((docType) => {
            const IconComponent = docType.icon;
            return (
              <div
                key={docType.type}
                id={`${docType.type}-document-card`}
                className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group flex flex-col h-full"
                onClick={() => setDocumentType(docType.type)}
              >
                <div id={`${docType.type}-card-header`} className="text-center mb-6">
                  <div 
                    id={`${docType.type}-icon-container`} 
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 transition-colors duration-200 ${
                      docType.type === 'memory' 
                        ? 'bg-green-100 group-hover:bg-green-200' 
                        : 'bg-primary-100 group-hover:bg-primary-200'
                    }`}
                  >
                    <IconComponent 
                      id={`${docType.type}-icon`} 
                      className={`w-8 h-8 ${
                        docType.type === 'memory' 
                          ? 'text-green-600' 
                          : 'text-primary-600'
                      }`} 
                    />
                  </div>
                  <h3 id={`${docType.type}-title`} className="text-2xl font-semibold text-gray-900 mb-2">
                    {docType.title}
                  </h3>
                  <p id={`${docType.type}-description`} className="text-gray-600">
                    {docType.description}
                  </p>
                </div>

                <div id={`${docType.type}-features-section`} className="space-y-3 flex-1">
                  <h4 id={`${docType.type}-features-title`} className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                    Includes:
                  </h4>
                  <ul id={`${docType.type}-features-list`} className="space-y-2">
                    {docType.features.map((feature, index) => (
                      <li key={index} id={`${docType.type}-feature-${index}`} className="flex items-center text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div id={`${docType.type}-action-section`} className="mt-8">
                  <button id={`${docType.type}-start-button`} className="btn-primary w-full group-hover:bg-primary-700">
                    Start {docType.title}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </div>
        
        <div id="selector-footer" className="text-center mt-12">
          <p id="footer-note" className="text-sm text-gray-500 mb-3">
            Both document types support markdown export and professional formatting
          </p>
          <p className="text-sm text-gray-600">
            Like Arcana? 
            <a 
              href="https://github.com/impressto/arcana" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors duration-200"
            >
              Get the code here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
