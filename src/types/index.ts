// Document Types
export type DocumentType = 'spec' | 'memory';

// Step types for wizard navigation
export type WizardStep = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

// Spec Document Structure
export interface SpecDocumentData {
  projectOverview: {
    name: string;
    description: string;
    purpose: string;
    stakeholders: string[];
    timeline: string;
  };
  functionalRequirements: {
    userStories: string[];
    features: Feature[];
    acceptanceCriteria: string[];
  };
  technicalRequirements: {
    architecture: string;
    technologies: string[];
    infrastructure: string;
    dependencies: string[];
  };
  apis: {
    endpoints: APIEndpoint[];
    authentication: string;
    rateLimit: string;
  };
  nonFunctionalRequirements: {
    performance: string;
    security: string;
    scalability: string;
    availability: string;
  };
  roadmap: {
    phases: RoadmapPhase[];
    milestones: Milestone[];
  };
}

// Memory Document Structure
export interface MemoryDocumentData {
  projectInfo: {
    name: string;
    description: string;
    team: string[];
  };
  decisionLog: DecisionEntry[];
  glossary: GlossaryEntry[];
  meetingNotes: MeetingNote[];
  lessonsLearned: LessonEntry[];
  onboardingNotes: OnboardingNote[];
}

// Supporting interfaces
export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Planned' | 'In Progress' | 'Complete';
}

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters: string[];
  response: string;
}

export interface RoadmapPhase {
  name: string;
  description: string;
  duration: string;
  deliverables: string[];
}

export interface Milestone {
  name: string;
  date: string;
  description: string;
  dependencies: string[];
}

export interface DecisionEntry {
  title: string;
  description: string;
  date: string;
  rationale: string;
  stakeholders: string[];
  impact: string;
  alternatives: string[];
  status: 'decided' | 'pending' | 'revisit';
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  category?: string;
}

export interface MeetingNote {
  title: string;
  date: string;
  attendees: string[];
  agenda: string[];
  notes: string;
  actionItems: ActionItem[];
}

export interface ActionItem {
  description: string;
  assignee: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'complete';
}

export interface LessonEntry {
  title: string;
  date: string;
  category: string;
  situation: string;
  lesson: string;
  application: string;
  impact: 'low' | 'medium' | 'high';
}

export interface OnboardingNote {
  id: string;
  newHireName: string;
  role: string;
  startDate: string;
  mentor: string;
  department: string;
  status: 'in-progress' | 'completed' | 'on-hold';
  onboardingTasks: OnboardingTask[];
  resources: OnboardingResource[];
  feedback: string;
  completionDate: string;
  notes: string;
}

export interface OnboardingTask {
  task: string;
  completed: boolean;
}

export interface OnboardingResource {
  title: string;
  url: string;
  type: string;
}

// Wizard Context
export interface WizardContextType {
  documentType: DocumentType | null;
  currentStep: number;
  steps: WizardStep[];
  specData: SpecDocumentData;
  memoryData: MemoryDocumentData;
  learningMode: boolean;
  setDocumentType: (type: DocumentType) => void;
  setCurrentStep: (step: number) => void;
  updateSpecData: (section: keyof SpecDocumentData, data: any) => void;
  updateMemoryData: (section: keyof MemoryDocumentData, data: any) => void;
  markStepCompleted: (stepIndex: number) => void;
  resetWizard: () => void;
  manualSave: () => void;
  setLearningMode: (enabled: boolean) => void;
}
