import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';

interface ConceptTooltipProps {
  concept: string;
  children?: React.ReactNode;
  className?: string;
}

// Educational explanations for different concepts
const conceptExplanations: Record<string, { 
  title: string; 
  explanation: string; 
  aiContext: string;
  tips: string[];
  whyItMatters: string;
}> = {
  'decision-log': {
    title: 'Decision Log',
    explanation: 'A decision log tracks important choices made during development, including the reasoning behind each decision.',
    aiContext: 'AI assistants use decision logs to understand why specific approaches were chosen, helping them suggest consistent solutions and avoid recommending already-rejected alternatives.',
    tips: [
      'Include the context that led to the decision',
      'Document alternatives that were considered',
      'Record who was involved in the decision',
      'Note the expected impact and success criteria'
    ],
    whyItMatters: 'Decision logs prevent teams from revisiting settled questions and help AI assistants understand the "why" behind your choices, leading to more contextually appropriate suggestions.'
  },
  'user-stories': {
    title: 'User Stories',
    explanation: 'User stories describe features from the end-user perspective, typically following the format "As a [user], I want [goal] so that [benefit]".',
    aiContext: 'Well-written user stories help AI generate more relevant code, tests, and documentation by providing clear context about user needs and expected behavior.',
    tips: [
      'Use the format: "As a [role], I want [feature] so that [benefit]"',
      'Focus on the user\'s goal, not the implementation',
      'Keep stories small and testable',
      'Include acceptance criteria when possible'
    ],
    whyItMatters: 'User stories bridge the gap between business requirements and technical implementation, giving AI assistants the context needed to generate user-focused solutions.'
  },
  'technical-requirements': {
    title: 'Technical Requirements',
    explanation: 'Technical requirements define the technology stack, architecture patterns, and infrastructure needs for the project.',
    aiContext: 'AI assistants use technical requirements to suggest appropriate libraries, follow architectural patterns, and generate code that fits within the specified technology constraints.',
    tips: [
      'Specify exact versions of major dependencies',
      'Document architectural patterns and principles',
      'Include performance and scalability requirements',
      'Note any compliance or security constraints'
    ],
    whyItMatters: 'Clear technical requirements ensure AI assistants generate code that fits your architecture and constraints, preventing costly refactoring later.'
  },
  'api-endpoints': {
    title: 'API Endpoints',
    explanation: 'API endpoints define the specific URLs, methods, parameters, and responses for your application\'s programming interface.',
    aiContext: 'Documented API endpoints help AI assistants generate consistent client code, write appropriate tests, and suggest proper error handling patterns.',
    tips: [
      'Document all parameters including optional ones',
      'Provide example requests and responses',
      'Specify error codes and their meanings',
      'Include authentication requirements'
    ],
    whyItMatters: 'Well-documented APIs enable AI assistants to generate correct client code and comprehensive tests, reducing integration bugs.'
  },
  'lessons-learned': {
    title: 'Lessons Learned',
    explanation: 'Lessons learned capture insights from challenges, mistakes, and discoveries made during development.',
    aiContext: 'AI assistants can reference lessons learned to avoid repeating past mistakes and apply successful patterns from previous experience.',
    tips: [
      'Record both successes and failures',
      'Include specific context and circumstances',
      'Note what you would do differently',
      'Document the impact and lessons for the team'
    ],
    whyItMatters: 'Lessons learned prevent teams from repeating mistakes and help AI assistants suggest solutions based on your team\'s actual experience.'
  },
  'glossary': {
    title: 'Project Glossary',
    explanation: 'A glossary defines domain-specific terms, technical concepts, and project-specific vocabulary.',
    aiContext: 'A well-maintained glossary ensures AI assistants use consistent terminology and understand the specific context of your project domain.',
    tips: [
      'Define terms as you encounter them',
      'Include both technical and business terms',
      'Provide examples when helpful',
      'Keep definitions concise but complete'
    ],
    whyItMatters: 'A shared vocabulary prevents miscommunication and helps AI assistants use the right terminology for your specific domain and context.'
  },
  'project-memory': {
    title: 'Project Memory',
    explanation: 'Project memory documents capture institutional knowledge, decisions, and context that teams need to maintain over time.',
    aiContext: 'Memory documents provide AI assistants with the historical context needed to make informed suggestions that align with past decisions and team practices.',
    tips: [
      'Update regularly as the project evolves',
      'Include context about why decisions were made',
      'Document team knowledge and tribal wisdom',
      'Make it searchable and accessible'
    ],
    whyItMatters: 'Project memory preserves knowledge as team members change and helps AI assistants understand your project\'s history and context.'
  },
  'specification-document': {
    title: 'Specification Document',
    explanation: 'A specification document outlines what needs to be built, including requirements, features, constraints, and success criteria.',
    aiContext: 'Comprehensive specs enable AI assistants to generate code that meets requirements, write appropriate tests, and suggest improvements that align with project goals.',
    tips: [
      'Be specific about functional requirements',
      'Include non-functional requirements (performance, security)',
      'Define success criteria and acceptance tests',
      'Keep it updated as requirements evolve'
    ],
    whyItMatters: 'Good specifications ensure everyone (including AI assistants) understands what needs to be built and how success will be measured.'
  },
  'meeting-notes': {
    title: 'Meeting Notes',
    explanation: 'Meeting notes capture discussions, decisions, and action items from team meetings, providing a historical record of project evolution.',
    aiContext: 'Well-structured meeting notes help AI assistants understand team dynamics, decision-making processes, and project context when suggesting solutions.',
    tips: [
      'Record key decisions and their rationale',
      'Capture action items with owners and due dates',
      'Note attendees and their roles for context',
      'Include links to relevant documents or resources'
    ],
    whyItMatters: 'Meeting notes preserve institutional knowledge and help AI assistants understand the collaborative decision-making process behind project choices.'
  },
  'lessons-learned-step': {
    title: 'Lessons Learned',
    explanation: 'Lessons learned document insights from both successes and failures, creating a knowledge base for future decision-making.',
    aiContext: 'Lessons learned help AI assistants suggest solutions based on your team\'s actual experience and avoid recommending approaches that have already failed.',
    tips: [
      'Document both what worked and what didn\'t',
      'Include specific context and circumstances',
      'Rate the impact to prioritize important lessons',
      'Make lessons actionable for future situations'
    ],
    whyItMatters: 'Lessons learned prevent repeated mistakes and help AI assistants provide advice based on your team\'s real-world experience rather than generic solutions.'
  },
  'onboarding-notes': {
    title: 'Onboarding Notes',
    explanation: 'Onboarding notes track the process of bringing new team members up to speed, including tasks, resources, and progress.',
    aiContext: 'Onboarding documentation helps AI assistants understand team structure, knowledge gaps, and provide appropriate guidance for different experience levels.',
    tips: [
      'Create standardized onboarding checklists',
      'Document common questions and answers',
      'Track progress and completion status',
      'Include feedback from both mentors and new hires'
    ],
    whyItMatters: 'Good onboarding documentation ensures consistent team integration and helps AI assistants provide appropriate guidance based on team member experience levels.'
  },
  'project-overview': {
    title: 'Project Overview',
    explanation: 'The project overview provides high-level context about what you\'re building, why it\'s needed, and who will use it.',
    aiContext: 'A clear project overview helps AI assistants understand the business context and generate solutions that align with your project goals and constraints.',
    tips: [
      'Start with the problem you\'re solving',
      'Define clear success criteria',
      'Identify all key stakeholders',
      'Include timeline and budget constraints'
    ],
    whyItMatters: 'Project overview provides the foundational context that guides all technical decisions and helps AI assistants understand the bigger picture.'
  },
  'technical-architecture': {
    title: 'Technical Architecture',
    explanation: 'Technical architecture defines the system structure, technology choices, and how components interact with each other.',
    aiContext: 'Architecture documentation helps AI assistants suggest code that follows your patterns, recommend compatible libraries, and maintain consistency across the system.',
    tips: [
      'Document architectural patterns and principles',
      'Specify technology stack and versions',
      'Include deployment and infrastructure details',
      'Note any constraints or compliance requirements'
    ],
    whyItMatters: 'Clear architecture ensures AI assistants generate code that fits your system design and follows established patterns.'
  },
  'non-functional-requirements': {
    title: 'Non-Functional Requirements',
    explanation: 'Non-functional requirements specify quality attributes like performance, security, scalability, and usability standards.',
    aiContext: 'These requirements help AI assistants suggest optimizations, security measures, and implementation approaches that meet your quality standards.',
    tips: [
      'Be specific with measurable criteria',
      'Include performance benchmarks',
      'Document security and compliance needs',
      'Consider scalability and availability requirements'
    ],
    whyItMatters: 'Non-functional requirements ensure AI assistants help you build systems that perform well and meet quality standards, not just functional needs.'
  },
  'roadmap-planning': {
    title: 'Roadmap Planning',
    explanation: 'Roadmap planning breaks down project development into phases, milestones, and deliverables with timelines.',
    aiContext: 'A clear roadmap helps AI assistants prioritize suggestions, recommend incremental approaches, and understand which features to focus on first.',
    tips: [
      'Break work into manageable phases',
      'Define clear milestones and success criteria',
      'Include dependencies between features',
      'Plan for testing and deployment phases'
    ],
    whyItMatters: 'Roadmaps provide temporal context that helps AI assistants suggest solutions appropriate for your current development phase.'
  },
  'api-design': {
    title: 'API Design',
    explanation: 'API design defines how different parts of your application communicate, including endpoints, data formats, authentication, and error handling.',
    aiContext: 'Well-documented APIs enable AI assistants to generate correct integration code, suggest proper error handling, and maintain consistency across your application.',
    tips: [
      'Follow REST conventions or GraphQL standards consistently',
      'Include comprehensive examples for each endpoint',
      'Document error responses and status codes',
      'Specify authentication and rate limiting clearly',
      'Version your APIs to support backward compatibility'
    ],
    whyItMatters: 'Clear API specifications reduce development time, prevent integration issues, and help AI assistants generate better code suggestions.'
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
            
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {conceptData.explanation}
                </p>
              </div>

              <div className="border-t pt-3">
                <p className="font-medium text-green-900 mb-2">💡 Why this matters:</p>
                <p className="text-green-800 leading-relaxed">
                  {conceptData.whyItMatters}
                </p>
              </div>
              
              <div className="border-t pt-3">
                <p className="font-medium text-purple-900 mb-2">✨ Tips for success:</p>
                <ul className="text-purple-800 space-y-1">
                  {conceptData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-600 mr-2 mt-0.5">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t pt-3">
                <p className="font-medium text-blue-900 mb-2">🤖 How this helps AI assistants:</p>
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