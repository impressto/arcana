import React from 'react';
import { Check } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';

export const ProgressIndicator: React.FC = () => {
  const { steps, currentStep, setCurrentStep, specData, memoryData, documentType } = useWizard();

  // Check if wizard has meaningful content to enable direct navigation
  const hasContent = () => {
    if (!documentType) return false;
    
    if (documentType === 'spec') {
      return (
        specData.projectOverview.name.trim() !== '' ||
        specData.projectOverview.description.trim() !== '' ||
        specData.functionalRequirements.userStories.some(story => story.trim() !== '') ||
        specData.functionalRequirements.features.length > 0 ||
        specData.technicalRequirements.architecture.trim() !== '' ||
        specData.technicalRequirements.technologies.some(tech => tech.trim() !== '') ||
        specData.apis.endpoints.length > 0 ||
        specData.nonFunctionalRequirements.performance.trim() !== '' ||
        specData.roadmap.phases.length > 0 ||
        specData.roadmap.milestones.length > 0
      );
    } else {
      return (
        memoryData.projectInfo.name.trim() !== '' ||
        memoryData.projectInfo.description.trim() !== '' ||
        memoryData.decisionLog.length > 0 ||
        memoryData.glossary.length > 0 ||
        memoryData.meetingNotes.length > 0 ||
        memoryData.lessonsLearned.length > 0 ||
        memoryData.onboardingNotes.length > 0
      );
    }
  };

  const canNavigateDirectly = hasContent();

  const handleStepClick = (stepIndex: number) => {
    if (canNavigateDirectly && stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div id="progress-indicator" className="w-full">
      <div id="progress-steps" className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div 
                id={`step-${step.id}`} 
                className={`flex flex-col items-center ${canNavigateDirectly ? 'cursor-pointer' : ''}`}
                onClick={() => handleStepClick(index)}
                title={canNavigateDirectly && !isActive ? `Go to ${step.title}` : undefined}
              >
                <div
                  id={`step-${step.id}-circle`}
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${isCompleted 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : isActive 
                        ? 'border-primary-600 text-primary-600 bg-white' 
                        : 'border-gray-300 text-gray-400 bg-white'
                    }
                    ${canNavigateDirectly && !isActive ? 'hover:border-primary-400 hover:text-primary-400' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check id={`step-${step.id}-check`} className="w-5 h-5" />
                  ) : (
                    <span id={`step-${step.id}-number`}>{index + 1}</span>
                  )}
                </div>
                <div id={`step-${step.id}-text`} className="mt-2 text-center">
                  <div
                    id={`step-${step.id}-title`}
                    className={`
                      text-sm font-medium transition-colors duration-200
                      ${isActive ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}
                      ${canNavigateDirectly && !isActive ? 'hover:text-primary-500' : ''}
                    `}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
              
              {!isLast && (
                <div
                  id={`connector-${step.id}`}
                  className={`
                    flex-1 h-0.5 mx-4 mt-5 transition-colors duration-200
                    ${isCompleted ? 'bg-primary-600' : 'bg-gray-300'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
