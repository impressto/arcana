import React from 'react';
import { Lightbulb, BookOpen, Target } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';

interface LearningCardProps {
  type: 'tip' | 'explanation' | 'why-matters';
  title: string;
  content: string;
  className?: string;
}

const iconMap = {
  tip: Lightbulb,
  explanation: BookOpen,
  'why-matters': Target,
};

const colorMap = {
  tip: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    content: 'text-yellow-800',
  },
  explanation: {
    bg: 'bg-blue-50',
    border: 'border-blue-200', 
    icon: 'text-blue-600',
    title: 'text-blue-900',
    content: 'text-blue-800',
  },
  'why-matters': {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600', 
    title: 'text-green-900',
    content: 'text-green-800',
  },
};

export const LearningCard: React.FC<LearningCardProps> = ({ 
  type, 
  title, 
  content, 
  className = "" 
}) => {
  const { learningMode } = useWizard();
  
  // Don't render if learning mode is disabled
  if (!learningMode) {
    return null;
  }

  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`${colors.icon} w-5 h-5 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h4 className={`${colors.title} font-medium text-sm mb-1`}>
            {title}
          </h4>
          <p className={`${colors.content} text-sm leading-relaxed`}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};