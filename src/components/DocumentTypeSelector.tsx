import React from 'react';
import { FileText, BookOpen, Bot } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';
import { LearningCard } from './LearningCard';
import type { DocumentType } from '../types';

export const DocumentTypeSelector: React.FC = () => {
  const { setDocumentType, resetWizard } = useWizard();
  
  // Check if there's saved progress
  const savedData = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('arcana-state');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

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
          <p id="selector-description" className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the type of documentation you want to create. Arcana will guide you through 
            each step to create professional, comprehensive documentation.
          </p>
          
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
              </div>
            </div>
          </div>
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
