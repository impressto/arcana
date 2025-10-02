import React from 'react';
import { Check } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';

export const ProgressIndicator: React.FC = () => {
  const { steps, currentStep } = useWizard();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
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
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`
                      text-sm font-medium
                      ${isActive ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}
                    `}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 max-w-24">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {!isLast && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-colors duration-200
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
