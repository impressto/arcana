import React from 'react';
import { Check } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';

export const ProgressIndicator: React.FC = () => {
  const { steps, currentStep } = useWizard();

  return (
    <div id="progress-indicator" className="w-full">
      <div id="progress-steps" className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div id={`step-${step.id}`} className="flex flex-col items-center">
                <div
                  id={`step-${step.id}-circle`}
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors duration-200
                    ${isCompleted 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : isActive 
                        ? 'border-primary-600 text-primary-600 bg-white' 
                        : 'border-gray-300 text-gray-400 bg-white'
                    }
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
                      text-sm font-medium
                      ${isActive ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}
                    `}
                  >
                    {step.title}
                  </div>
                  <div id={`step-${step.id}-description`} className="text-xs text-gray-500 mt-1 max-w-24">
                    {step.description}
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
