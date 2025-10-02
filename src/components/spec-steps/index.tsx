import React from 'react';
import { ProjectOverviewStep } from './ProjectOverviewStep';
import { FunctionalRequirementsStep } from './FunctionalRequirementsStep';
import { TechnicalRequirementsStep } from './TechnicalRequirementsStep';
import { ApiStep } from './ApiStep';
import { NonFunctionalRequirementsStep } from './NonFunctionalRequirementsStep';
import { RoadmapStep } from './RoadmapStep';

interface SpecStepsProps {
  stepId: string;
}

export const SpecSteps: React.FC<SpecStepsProps> = ({ stepId }) => {
  switch (stepId) {
    case 'overview':
      return <ProjectOverviewStep />;
    case 'functional':
      return <FunctionalRequirementsStep />;
    case 'technical':
      return <TechnicalRequirementsStep />;
    case 'apis':
      return <ApiStep />;
    case 'nonfunctional':
      return <NonFunctionalRequirementsStep />;
    case 'roadmap':
      return <RoadmapStep />;
    default:
      return <div>Step not found</div>;
  }
};
