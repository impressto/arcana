import React, { useState } from 'react';
import { useWizard } from '../contexts/WizardContext';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { ProgressIndicator } from './ProgressIndicator';
import { StepNavigation } from './StepNavigation';
import { SpecSteps } from './spec-steps';
import { MemorySteps } from './memory-steps';
import { PreviewStep } from './PreviewStep';
import { ImportModal } from './ImportModal';

export const DocumentWizard: React.FC = () => {
  const { documentType, currentStep, steps, resetWizard, manualSave } = useWizard();
  const [showImportModal, setShowImportModal] = useState(false);

  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all progress? This action cannot be undone.')) {
      resetWizard();
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
                className="flex justify-center mb-2 cursor-pointer"
                onClick={() => resetWizard()}
                title="Return to document type selection"
              >
                <img 
                  src="https://impressto.ca/images/arcana.png" 
                  alt="Arcana Logo" 
                  className="h-10 w-auto transition-transform duration-200 hover:scale-105"
                />
              </div>
              <p id="wizard-subtitle" className="text-gray-600 text-center">
                Create professional {documentType === 'spec' ? 'specification' : 'memory'} documentation
              </p>
            </div>
            <div id="header-actions" className="flex gap-2 ml-4 flex-shrink-0">
              <button
                id="import-button"
                onClick={() => setShowImportModal(true)}
                className="bg-blue-100 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium text-sm px-3 py-1.5"
                title={`Import ${documentType} document from .md file`}
              >
                📁 Import
              </button>
              <button
                id="save-button"
                onClick={manualSave}
                className="bg-green-100 text-green-700 border border-green-300 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium text-sm px-3 py-1.5"
                title="Save progress manually"
              >
                💾 Save
              </button>
              <button
                id="clear-progress-button"
                onClick={handleClearProgress}
                className="btn-secondary text-sm px-3 py-1.5"
                title="Clear all progress and start over"
              >
                Clear Progress
              </button>
            </div>
          </div>
          <div id="auto-save-notice" className="text-center text-sm text-gray-500">
            💾 Your progress is automatically saved
          </div>
        </div>

        <ProgressIndicator />
        
        <div id="wizard-content" className="mt-8">
          <div id="step-container" className="card animate-fade-in">
            {renderCurrentStep()}
          </div>
        </div>

        <StepNavigation />
      </div>
      
      <ImportModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
      />
    </div>
  );
};
