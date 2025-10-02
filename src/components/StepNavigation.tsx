import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';
import { ConfirmationModal } from './ConfirmationModal';

export const StepNavigation: React.FC = () => {
  const { currentStep, steps, setCurrentStep, resetWizard } = useWizard();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStartOver = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmStartOver = () => {
    resetWizard();
  };

  return (
    <div id="step-navigation" className="mt-8 flex items-center justify-between">
      <div id="navigation-left" className="flex items-center space-x-4">
        <button
          id="start-over-button"
          onClick={handleStartOver}
          className="btn-secondary flex items-center space-x-2"
        >
          <RotateCcw id="start-over-icon" className="w-4 h-4" />
          <span>Start Over</span>
        </button>
      </div>

      <div id="navigation-right" className="flex items-center space-x-4">
        <button
          id="previous-button"
          onClick={handlePrevious}
          disabled={isFirstStep}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
            ${isFirstStep 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'btn-secondary hover:bg-gray-300'
            }
          `}
        >
          <ChevronLeft id="previous-icon" className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div id="step-counter" className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>

        {!isLastStep && (
          <button
            id="next-button"
            onClick={handleNext}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 btn-primary"
          >
            <span>Next</span>
            <ChevronRight id="next-icon" className="w-4 h-4" />
          </button>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmStartOver}
        title="Start Over?"
        message="Are you sure you want to start over? This will clear all your progress and return to document type selection. This action cannot be undone."
        confirmText="Start Over"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};
