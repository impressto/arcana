/**
 * AI Context Builder - Leverages spec and memory documents for AI assistance
 * This utility helps extract and format document content for AI prompts
 */

import type { SpecDocumentData, MemoryDocumentData } from '../types';

export interface AIContextOptions {
  includeSpecs?: boolean;
  includeMemory?: boolean;
  includeDecisions?: boolean;
  includeLessonsLearned?: boolean;
  includeArchitecture?: boolean;
  includeGlossary?: boolean;
  sections?: string[];
}

export class AIContextBuilder {
  constructor() {
    // Constructor simplified since we no longer load document content
  }

  /**
   * Documents are assumed to exist - no loading needed
   */
  async loadSampleDocuments(): Promise<void> {
    // No-op: Documents are referenced, not loaded
    return Promise.resolve();
  }

  /**
   * Generate project overview reference for AI context
   */
  extractProjectOverview(): string {
    return 'Project overview details are available in the "Project Overview" section of the technical specification document. Please reference this document for comprehensive project information including goals, stakeholders, timeline, and scope.';
  }

  /**
   * Generate architecture decisions reference for AI context
   */
  extractArchitectureDecisions(): string {
    return 'Architecture decisions and their rationale are documented in the "Decision Log" section of the memory document. Please reference this section for detailed information about past architectural choices, alternatives considered, and implementation decisions.';
  }

  /**
   * Generate lessons learned reference for AI guidance
   */
  extractLessonsLearned(): string {
    return 'Lessons learned from past development experiences are documented in the "Lessons Learned" section of the memory document. Please reference this section for insights on what worked well, challenges encountered, and recommendations for future development.';
  }

  /**
   * Generate technical requirements reference and constraints
   */
  extractTechnicalRequirements(): string {
    return 'Technical requirements including architecture, technologies, infrastructure, and dependencies are detailed in the "Technical Requirements" section of the specification document. Please reference this section for comprehensive technical constraints and implementation guidelines.';
  }

  /**
   * Generate glossary reference for domain understanding
   */
  extractGlossary(): string {
    return 'Project-specific terminology and definitions are available in the "Glossary" section of the memory document. Please reference this section for clarification of domain-specific terms, acronyms, and technical concepts used throughout the project.';
  }

  /**
   * Build comprehensive AI context based on options
   */
  buildAIContext(options: AIContextOptions = {}): string {
    const {
      includeSpecs = true,
      includeDecisions = true,
      includeLessonsLearned = true,
      includeArchitecture = true,
      includeGlossary = false
    } = options;

    let context = '# Project Context for AI Assistant\n\n';
    context += '## Document Availability\n\n';
    context += 'This project has comprehensive documentation available:\n';
    context += '- **Technical Specification Document**: Full project requirements, architecture, and specifications\n';
    context += '- **Memory Document**: Decisions, lessons learned, glossary, and institutional knowledge\n\n';
    context += '**Important**: Instead of including document content in this context, you should guide the user to reference specific sections of these documents when detailed information is needed.\n\n';

    if (includeSpecs) {
      context += '## Project Overview Reference\n';
      context += this.extractProjectOverview() + '\n\n';
    }

    if (includeArchitecture) {
      context += '## Technical Requirements Reference\n';
      context += this.extractTechnicalRequirements() + '\n\n';
    }

    if (includeDecisions) {
      context += '## Architecture Decisions Reference\n';
      context += this.extractArchitectureDecisions() + '\n\n';
    }

    if (includeLessonsLearned) {
      context += '## Lessons Learned Reference\n';
      context += this.extractLessonsLearned() + '\n\n';
    }

    if (includeGlossary) {
      context += '## Domain Glossary Reference\n';
      context += this.extractGlossary() + '\n\n';
    }

    return context;
  }

  /**
   * Generate context for specific development tasks
   */
  generateTaskContext(taskType: 'feature' | 'bug' | 'refactor' | 'architecture'): string {
    const baseContext = {
      feature: {
        includeSpecs: true,
        includeArchitecture: true,
        includeDecisions: true,
        includeLessonsLearned: true
      },
      bug: {
        includeDecisions: true,
        includeLessonsLearned: true,
        includeArchitecture: true
      },
      refactor: {
        includeArchitecture: true,
        includeDecisions: true,
        includeLessonsLearned: true
      },
      architecture: {
        includeSpecs: true,
        includeArchitecture: true,
        includeDecisions: true
      }
    };

    return this.buildAIContext(baseContext[taskType]);
  }
}

/**
 * Helper function to quickly get AI context for common scenarios
 */
export async function getAIContextForTask(
  taskType: 'feature' | 'bug' | 'refactor' | 'architecture',
  customOptions?: AIContextOptions
): Promise<string> {
  const builder = new AIContextBuilder();
  await builder.loadSampleDocuments();
  
  if (customOptions) {
    return builder.buildAIContext(customOptions);
  }
  
  return builder.generateTaskContext(taskType);
}

/**
 * Build AI context with document references (no actual content included)
 */
export function buildWizardAIContext(
  documentType: 'spec' | 'memory',
  _specData?: SpecDocumentData,
  _memoryData?: MemoryDocumentData,
  taskType: 'feature' | 'bug' | 'refactor' | 'architecture' = 'feature'
): string {
  let context = '# Project Context for AI Assistant\n\n';
  context += `*This context is generated from your current ${documentType} document wizard data.*\n\n`;
  
  // Document availability notice
  context += '## Document Availability\n\n';
  context += 'This project has comprehensive documentation that you can reference:\n';
  context += '- **Technical Specification Document**: Contains detailed project overview, functional requirements, technical requirements, API specifications, non-functional requirements, and roadmap\n';
  context += '- **Memory Document**: Contains project information, decision log, glossary, meeting notes, lessons learned, and onboarding notes\n\n';
  context += '**Important**: When you need specific details not provided in this context, please ask the user to reference the relevant section of these documents rather than asking for extensive details to be typed out.\n\n';

  if (documentType === 'spec') {
    // Reference spec document sections
    context += '## Specification Document References\n\n';
    context += 'The following information is available in your specification document:\n';
    context += '- **Project Overview**: Project name, description, purpose, stakeholders, and timeline\n';
    context += '- **Functional Requirements**: User stories, features, and acceptance criteria\n';
    context += '- **Technical Requirements**: Architecture, technologies, infrastructure, and dependencies\n';
    context += '- **API Specifications**: Endpoints, authentication, and rate limiting\n';
    context += '- **Non-Functional Requirements**: Performance, security, scalability, and availability\n';
    context += '- **Roadmap**: Development phases and milestones\n\n';
    context += 'Please reference the relevant sections of your spec document when you need specific details.\n\n';

  }

  if (documentType === 'memory') {
    // Reference memory document sections
    context += '## Memory Document References\n\n';
    context += 'The following information is available in your memory document:\n';
    context += '- **Project Information**: Project name, description, and team members\n';
    context += '- **Decision Log**: Architectural and implementation decisions with rationale\n';
    context += '- **Glossary**: Project-specific terminology and definitions\n';
    context += '- **Meeting Notes**: Important discussions and action items\n';
    context += '- **Lessons Learned**: Insights from development experiences\n';
    context += '- **Onboarding Notes**: Team member onboarding information\n\n';
    context += 'Please reference the relevant sections of your memory document when you need specific details.\n\n';
  }

  // Add contextual guidance based on task type
  context += '## Context Notes\n\n';
  const taskGuidance = {
    feature: 'This context includes key project requirements and technical architecture to help implement new features. For detailed specifications, reference the project\'s spec document.',
    bug: 'This context focuses on technical requirements and architecture. For detailed troubleshooting history and past decisions, reference the project\'s memory document.',
    refactor: 'This context emphasizes technical architecture and constraints. For comprehensive past decisions and lessons learned, reference the project\'s memory document.',
    architecture: 'This context includes project overview and technical requirements. For detailed architectural decisions and constraints, reference both the spec and memory documents.'
  };
  
  context += taskGuidance[taskType] + '\n\n';
  context += '**Working with Project Documents**: Instead of requesting large amounts of detailed information to be typed out, ask the user to reference specific sections of the existing project documents (e.g., "Please check the Technical Requirements section of your spec document" or "Refer to the Decision Log in your memory document").\n\n';
  context += '**Document Location**: The project documents are located in the `docs/` folder of the project root. The spec document is typically named something like `spec.md` and the memory document is typically named something like `memory.md`.\n\n';

  return context;
}

/**
 * Example usage functions
 */
export const AIContextExamples = {
  // For implementing a new feature
  async forNewFeature(): Promise<string> {
    return getAIContextForTask('feature');
  },

  // For debugging issues
  async forDebugging(): Promise<string> {
    return getAIContextForTask('bug');
  },

  // For architectural decisions
  async forArchitecture(): Promise<string> {
    return getAIContextForTask('architecture');
  },

  // Custom context with specific sections
  async customContext(options: AIContextOptions): Promise<string> {
    return getAIContextForTask('feature', options);
  }
};