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
  private specDocument: string = '';
  private memoryDocument: string = '';

  constructor(specDoc?: string, memoryDoc?: string) {
    this.specDocument = specDoc || '';
    this.memoryDocument = memoryDoc || '';
  }

  /**
   * Load documents from the public folder
   */
  async loadSampleDocuments(): Promise<void> {
    try {
      const [specResponse, memoryResponse] = await Promise.all([
        fetch('/sample-spec-document.md'),
        fetch('/sample-memory-document.md')
      ]);
      
      this.specDocument = await specResponse.text();
      this.memoryDocument = await memoryResponse.text();
    } catch (error) {
      console.error('Failed to load sample documents:', error);
    }
  }

  /**
   * Extract project overview for AI context
   */
  extractProjectOverview(): string {
    const specLines = this.specDocument.split('\n');
    let overview = '';
    let inOverview = false;

    for (const line of specLines) {
      if (line.includes('## 📋 Project Overview')) {
        inOverview = true;
        continue;
      }
      if (inOverview && line.startsWith('## ')) {
        break;
      }
      if (inOverview) {
        overview += line + '\n';
      }
    }

    return overview.trim();
  }

  /**
   * Extract technical architecture decisions
   */
  extractArchitectureDecisions(): string {
    const memoryLines = this.memoryDocument.split('\n');
    let decisions = '';
    let inDecisions = false;

    for (const line of memoryLines) {
      if (line.includes('## 📝 Decision Log')) {
        inDecisions = true;
        continue;
      }
      if (inDecisions && line.startsWith('## ')) {
        break;
      }
      if (inDecisions) {
        decisions += line + '\n';
      }
    }

    return decisions.trim();
  }

  /**
   * Extract lessons learned for AI guidance
   */
  extractLessonsLearned(): string {
    const memoryLines = this.memoryDocument.split('\n');
    let lessons = '';
    let inLessons = false;

    for (const line of memoryLines) {
      if (line.includes('## 🎓 Lessons Learned')) {
        inLessons = true;
        continue;
      }
      if (inLessons && line.startsWith('## ')) {
        break;
      }
      if (inLessons) {
        lessons += line + '\n';
      }
    }

    return lessons.trim();
  }

  /**
   * Extract technical requirements and constraints
   */
  extractTechnicalRequirements(): string {
    const specLines = this.specDocument.split('\n');
    let techReqs = '';
    let inTechReqs = false;

    for (const line of specLines) {
      if (line.includes('## ⚙️ Technical Requirements')) {
        inTechReqs = true;
        continue;
      }
      if (inTechReqs && line.startsWith('## ')) {
        break;
      }
      if (inTechReqs) {
        techReqs += line + '\n';
      }
    }

    return techReqs.trim();
  }

  /**
   * Extract glossary for domain understanding
   */
  extractGlossary(): string {
    const memoryLines = this.memoryDocument.split('\n');
    let glossary = '';
    let inGlossary = false;

    for (const line of memoryLines) {
      if (line.includes('## 📚 Glossary')) {
        inGlossary = true;
        continue;
      }
      if (inGlossary && line.startsWith('## ')) {
        break;
      }
      if (inGlossary) {
        glossary += line + '\n';
      }
    }

    return glossary.trim();
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

    if (includeSpecs) {
      context += '## Project Overview\n';
      context += this.extractProjectOverview() + '\n\n';
    }

    if (includeArchitecture) {
      context += '## Technical Requirements\n';
      context += this.extractTechnicalRequirements() + '\n\n';
    }

    if (includeDecisions) {
      context += '## Architecture Decisions\n';
      context += this.extractArchitectureDecisions() + '\n\n';
    }

    if (includeLessonsLearned) {
      context += '## Lessons Learned\n';
      context += this.extractLessonsLearned() + '\n\n';
    }

    if (includeGlossary) {
      context += '## Domain Glossary\n';
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
 * Build AI context from current wizard data instead of sample documents
 */
export function buildWizardAIContext(
  documentType: 'spec' | 'memory',
  specData?: SpecDocumentData,
  memoryData?: MemoryDocumentData,
  taskType: 'feature' | 'bug' | 'refactor' | 'architecture' = 'feature'
): string {
  let context = '# Project Context for AI Assistant\n\n';
  context += `*This context is generated from your current ${documentType} document wizard data.*\n\n`;

  if (documentType === 'spec' && specData) {
    // Add Project Overview
    if (specData.projectOverview.name || specData.projectOverview.description) {
      context += '## Project Overview\n\n';
      if (specData.projectOverview.name) {
        context += `**Project Name:** ${specData.projectOverview.name}\n\n`;
      }
      if (specData.projectOverview.description) {
        context += `**Description:** ${specData.projectOverview.description}\n\n`;
      }
      if (specData.projectOverview.purpose) {
        context += `**Purpose:** ${specData.projectOverview.purpose}\n\n`;
      }
      if (specData.projectOverview.stakeholders.length > 0) {
        context += `**Stakeholders:** ${specData.projectOverview.stakeholders.join(', ')}\n\n`;
      }
      if (specData.projectOverview.timeline) {
        context += `**Timeline:** ${specData.projectOverview.timeline}\n\n`;
      }
    }

    // Add Technical Requirements based on task type
    if (['feature', 'architecture', 'refactor'].includes(taskType) && 
        (specData.technicalRequirements.architecture || 
         specData.technicalRequirements.technologies.length > 0)) {
      context += '## Technical Requirements\n\n';
      if (specData.technicalRequirements.architecture) {
        context += `**Architecture:** ${specData.technicalRequirements.architecture}\n\n`;
      }
      if (specData.technicalRequirements.technologies.length > 0) {
        context += `**Technologies:** ${specData.technicalRequirements.technologies.join(', ')}\n\n`;
      }
      if (specData.technicalRequirements.infrastructure) {
        context += `**Infrastructure:** ${specData.technicalRequirements.infrastructure}\n\n`;
      }
      if (specData.technicalRequirements.dependencies.length > 0) {
        context += `**Dependencies:** ${specData.technicalRequirements.dependencies.join(', ')}\n\n`;
      }
    }

    // Add Functional Requirements for feature tasks
    if (taskType === 'feature' && specData.functionalRequirements.userStories.length > 0) {
      context += '## Functional Requirements\n\n';
      if (specData.functionalRequirements.userStories.length > 0) {
        context += '**User Stories:**\n';
        specData.functionalRequirements.userStories.forEach((story, i) => {
          context += `${i + 1}. ${story}\n`;
        });
        context += '\n';
      }
      if (specData.functionalRequirements.features.length > 0) {
        context += '**Features:**\n';
        specData.functionalRequirements.features.forEach((feature, i) => {
          context += `${i + 1}. ${feature}\n`;
        });
        context += '\n';
      }
    }

    // Add API information if relevant
    if (specData.apis.endpoints.length > 0) {
      context += '## API Information\n\n';
      context += '**Endpoints:**\n';
      specData.apis.endpoints.forEach((endpoint, i) => {
        context += `${i + 1}. ${endpoint}\n`;
      });
      context += '\n';
      if (specData.apis.authentication) {
        context += `**Authentication:** ${specData.apis.authentication}\n\n`;
      }
    }

    // Add Non-Functional Requirements for architecture/performance tasks
    if (['architecture', 'bug'].includes(taskType)) {
      const nfr = specData.nonFunctionalRequirements;
      if (nfr.performance || nfr.security || nfr.scalability || nfr.availability) {
        context += '## Non-Functional Requirements\n\n';
        if (nfr.performance) context += `**Performance:** ${nfr.performance}\n\n`;
        if (nfr.security) context += `**Security:** ${nfr.security}\n\n`;
        if (nfr.scalability) context += `**Scalability:** ${nfr.scalability}\n\n`;
        if (nfr.availability) context += `**Availability:** ${nfr.availability}\n\n`;
      }
    }
  }

  if (documentType === 'memory' && memoryData) {
    // Add Project Information
    if (memoryData.projectInfo.name || memoryData.projectInfo.description) {
      context += '## Project Information\n\n';
      if (memoryData.projectInfo.name) {
        context += `**Project Name:** ${memoryData.projectInfo.name}\n\n`;
      }
      if (memoryData.projectInfo.description) {
        context += `**Description:** ${memoryData.projectInfo.description}\n\n`;
      }
      if (memoryData.projectInfo.team.length > 0) {
        context += `**Team Members:** ${memoryData.projectInfo.team.join(', ')}\n\n`;
      }
    }

    // Add Decision Log
    if (memoryData.decisionLog.length > 0) {
      context += '## Recent Decisions\n\n';
      memoryData.decisionLog.slice(0, 5).forEach((decision, i) => {
        context += `**Decision ${i + 1}:** ${decision.title || 'Untitled'}\n`;
        if (decision.description) context += `${decision.description}\n`;
        if (decision.rationale) context += `*Rationale:* ${decision.rationale}\n`;
        context += '\n';
      });
    }

    // Add Lessons Learned
    if (memoryData.lessonsLearned.length > 0) {
      context += '## Lessons Learned\n\n';
      memoryData.lessonsLearned.slice(0, 3).forEach((lesson, i) => {
        context += `**Lesson ${i + 1}:** ${lesson.title || 'Untitled'}\n`;
        if (lesson.lesson) context += `${lesson.lesson}\n`;
        if (lesson.application) context += `*Application:* ${lesson.application}\n`;
        context += '\n';
      });
    }

    // Add Glossary
    if (memoryData.glossary.length > 0) {
      context += '## Key Terms\n\n';
      memoryData.glossary.forEach((term) => {
        context += `**${term.term}:** ${term.definition}\n`;
      });
      context += '\n';
    }
  }

  // Add contextual guidance based on task type
  context += '## Context Notes\n\n';
  const taskGuidance = {
    feature: 'This context includes project requirements, technical architecture, and user stories to help implement new features that align with the project goals.',
    bug: 'This context focuses on technical requirements, architecture decisions, and known constraints to help debug issues effectively.',
    refactor: 'This context emphasizes technical architecture, past decisions, and lessons learned to guide refactoring efforts.',
    architecture: 'This context includes project overview, technical requirements, and past architectural decisions to inform new architectural choices.'
  };
  
  context += taskGuidance[taskType] + '\n\n';
  
  if (!specData && !memoryData) {
    context += '*Note: No wizard data available yet. Complete the wizard steps to generate more comprehensive context.*\n';
  }

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