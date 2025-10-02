import React from 'react';
import { ProjectInfoStep } from './ProjectInfoStep';
import { DecisionLogStep } from './DecisionLogStep';
import { GlossaryStep } from './GlossaryStep';
import { MeetingNotesStep } from './MeetingNotesStep';
import { LessonsLearnedStep } from './LessonsLearnedStep';
import { OnboardingNotesStep } from './OnboardingNotesStep';

interface MemoryStepsProps {
  stepId: string;
}

export const MemorySteps: React.FC<MemoryStepsProps> = ({ stepId }) => {
  switch (stepId) {
    case 'project-info':
      return <ProjectInfoStep />;
    case 'decisions':
      return <DecisionLogStep />;
    case 'glossary':
      return <GlossaryStep />;
    case 'meetings':
      return <MeetingNotesStep />;
    case 'lessons':
      return <LessonsLearnedStep />;
    case 'onboarding':
      return <OnboardingNotesStep />;
    default:
      return <div>Step not found</div>;
  }
};
