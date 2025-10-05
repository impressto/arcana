import React, { useState } from 'react';
import { useWizard } from '../contexts/WizardContext';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { ProgressIndicator } from './ProgressIndicator';
import { StepNavigation } from './StepNavigation';
import { SpecSteps } from './spec-steps';
import { MemorySteps } from './memory-steps';
import { PreviewStep } from './PreviewStep';
import { ImportModal } from './ImportModal';
import { ConfirmationModal } from './ConfirmationModal';
import { TemplatesModal } from './TemplatesModal';
export const DocumentWizard: React.FC = () => {
  const { documentType, currentStep, steps, importDocument, learningMode, setLearningMode, navigateToDocumentSelection } = useWizard();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSampleConfirmModal, setShowSampleConfirmModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);



  const handleLogoNavigation = () => {
    // Navigate back to document selection without losing data
    navigateToDocumentSelection();
  };

  const handleUseSample = () => {
    if (!documentType) return;
    setShowSampleConfirmModal(true);
  };

  const handleConfirmUseSample = async () => {
    setShowSampleConfirmModal(false);
    setIsLoadingSample(true);
    
    try {
      const sampleUrl = documentType === 'spec' 
        ? import.meta.env.VITE_SAMPLE_SPEC_DOCUMENT_PATH || '/sample-spec-document.md'
        : import.meta.env.VITE_SAMPLE_MEMORY_DOCUMENT_PATH || '/sample-memory-document.md';
      
      const response = await fetch(sampleUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch sample document: ${response.statusText}`);
      }

      const content = await response.text();
      
      if (!content || content.trim().length === 0) {
        throw new Error('Sample document is empty or could not be loaded');
      }
      
      // Use the new enhanced import system
      importDocument(content, documentType!);
        
      if ((window as any).showToast) {
        (window as any).showToast(`Sample ${documentType} document loaded successfully with full content preservation!`, 'success');
      }
      
    } catch (error) {
      console.error('Failed to load sample document:', error);
      if ((window as any).showToast) {
        (window as any).showToast(
          `Failed to load sample document: ${error instanceof Error ? error.message : 'Unknown error'}`, 
          'error'
        );
      }
    } finally {
      setIsLoadingSample(false);
    }
  };

  if (!documentType) {
    return <DocumentTypeSelector />;
  }

  const renderCurrentStep = () => {
    const currentStepId = steps[currentStep]?.id;
    
    if (currentStepId === 'preview') {
      return <PreviewStep />;
    }

    if (documentType === 'spec') {
      return <SpecSteps stepId={currentStepId} />;
    } else {
      return <MemorySteps stepId={currentStepId} />;
    }
  };

  return (
    <div id="document-wizard" className="min-h-screen bg-gray-50 py-8">
      <div id="wizard-container" className="max-w-4xl mx-auto px-4">
        <div id="wizard-header" className="mb-8">
          <div id="header-content" className="flex justify-between items-start mb-4">
            <div id="header-title-section" className="flex-1">
              <div 
                id="wizard-title"
                className="flex justify-start mb-2 cursor-pointer"
                onClick={handleLogoNavigation}
                title="Return to document type selection"
              >
                <img 
                  src="https://impressto.ca/images/arcana.png" 
                  alt="Arcana Logo" 
                  className="h-10 w-auto transition-transform duration-200 hover:scale-105"
                />
              </div>
              <p id="wizard-subtitle" className="text-gray-600 text-left">
                Create professional {documentType === 'spec' ? 'specification' : 'memory'} documentation
              </p>
              <div id="learning-mode-toggle" className="mt-3">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={learningMode}
                    onChange={(e) => setLearningMode(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Learning Mode</span>
                  <span className="text-gray-500 text-xs">Show explanations and tips</span>
                </label>
              </div>
            </div>
            <div id="header-actions" className="flex gap-2 ml-4 flex-shrink-0">
              <button
                id="use-sample-button"
                onClick={handleUseSample}
                disabled={isLoadingSample}
                className="bg-purple-100 text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium text-sm px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                title={`Load sample ${documentType} document data`}
              >
                {isLoadingSample ? '⏳ Loading...' : '🎯 Use Sample'}
              </button>
              <button
                id="import-button"
                onClick={() => setShowImportModal(true)}
                className="bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium text-sm px-3 py-1.5"
                title={`Import ${documentType} document from .md file`}
              >
                📁 Import
              </button>
              <button
                id="get-templates-button"
                onClick={() => setShowTemplatesModal(true)}
                className="bg-green-100 text-green-700 border border-green-300 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium text-sm px-3 py-1.5"
                title="Download templates for AI-assisted documentation"
              >
                📋 Get Templates
              </button>
            </div>
          </div>
        </div>

        <ProgressIndicator />
        
        <div id="wizard-content" className="mt-8">
          <div id="step-container" className="card animate-fade-in">
            {renderCurrentStep()}
          </div>
        </div>

        <StepNavigation />
        
        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-gray-200 bg-gray-50 rounded-lg">
          <div className="text-center">
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
        </footer>
      </div>
      
      <ImportModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
      />
      
      <ConfirmationModal
        isOpen={showSampleConfirmModal}
        onClose={() => setShowSampleConfirmModal(false)}
        onConfirm={handleConfirmUseSample}
        title="Load Sample Document?"
        message={`This will replace all current data with the sample ${documentType} document content. Any existing work will be lost. Are you sure you want to continue?`}
        confirmText="Load Sample"
        cancelText="Cancel"
        type="warning"
      />
      
      <TemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
      />
    </div>
  );
};
