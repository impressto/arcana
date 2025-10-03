import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';

interface ConceptTooltipProps {
  concept: string;
  children?: React.ReactNode;
  className?: string;
}

// Educational explanations for different concepts
const conceptExplanations: Record<string, { title: string; explanation: string; aiContext: string }> = {
  'decision-log': {
    title: 'Decision Log',
    explanation: 'A decision log tracks important choices made during development, including the reasoning behind each decision.',
    aiContext: 'AI assistants use decision logs to understand why specific approaches were chosen, helping them suggest consistent solutions and avoid recommending already-rejected alternatives.'
  },
  'user-stories': {
    title: 'User Stories',
    explanation: 'User stories describe features from the end-user perspective, typically following the format "As a [user], I want [goal] so that [benefit]".',
    aiContext: 'Well-written user stories help AI generate more relevant code, tests, and documentation by providing clear context about user needs and expected behavior.'
  },
  'technical-requirements': {
    title: 'Technical Requirements',
    explanation: 'Technical requirements define the technology stack, architecture patterns, and infrastructure needs for the project.',
    aiContext: 'AI assistants use technical requirements to suggest appropriate libraries, follow architectural patterns, and generate code that fits within the specified technology constraints.'
  },
  'api-endpoints': {
    title: 'API Endpoints',
    explanation: 'API endpoints define the specific URLs, methods, parameters, and responses for your application\'s programming interface.',
    aiContext: 'Documented API endpoints help AI assistants generate consistent client code, write appropriate tests, and suggest proper error handling patterns.'
  },
  'lessons-learned': {
    title: 'Lessons Learned',
    explanation: 'Lessons learned capture insights from challenges, mistakes, and discoveries made during development.',
    aiContext: 'AI assistants can reference lessons learned to avoid repeating past mistakes and apply successful patterns from previous experience.'
  },
  'glossary': {
    title: 'Project Glossary',
    explanation: 'A glossary defines domain-specific terms, technical concepts, and project-specific vocabulary.',
    aiContext: 'A well-maintained glossary ensures AI assistants use consistent terminology and understand the specific context of your project domain.'
  },
  'project-memory': {
    title: 'Project Memory',
    explanation: 'Project memory documents capture institutional knowledge, decisions, and context that teams need to maintain over time.',
    aiContext: 'Memory documents provide AI assistants with the historical context needed to make informed suggestions that align with past decisions and team practices.'
  },
  'specification-document': {
    title: 'Specification Document',
    explanation: 'A specification document outlines what needs to be built, including requirements, features, constraints, and success criteria.',
    aiContext: 'Comprehensive specs enable AI assistants to generate code that meets requirements, write appropriate tests, and suggest improvements that align with project goals.'
  }
};

export const ConceptTooltip: React.FC<ConceptTooltipProps> = ({ 
  concept, 
  children, 
  className = "" 
}) => {
  const { learningMode } = useWizard();
  const [isOpen, setIsOpen] = useState(false);
  
  // Don't render anything if learning mode is disabled or concept doesn't exist
  if (!learningMode || !conceptExplanations[concept]) {
    return <>{children}</>;
  }

  const conceptData = conceptExplanations[concept];

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-500 hover:text-blue-700 transition-colors duration-200"
        title="Learn more about this concept"
        type="button"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Tooltip */}
          <div className="absolute z-50 w-80 p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg left-0 top-full">
            <div className="mb-2">
              <h4 className="font-semibold text-gray-900">{conceptData.title}</h4>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {conceptData.explanation}
                </p>
              </div>
              
              <div className="border-t pt-3">
                <p className="font-medium text-blue-900 mb-1">🤖 How this helps AI assistants:</p>
                <p className="text-blue-800 leading-relaxed">
                  {conceptData.aiContext}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="mt-3 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};