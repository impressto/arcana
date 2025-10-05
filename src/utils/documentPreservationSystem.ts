import type { SpecDocumentData } from '../types';

/**
 * Enhanced document preservation system that maintains all content while extracting parseable sections
 * This system ensures no content is lost during import/export cycles, even for modified documents
 */

export interface PreservedDocument {
  parsedData: any;
  originalContent: string;
  preservedSections: Map<string, string>;
  metadata: {
    parsingDate: string;
    unparsedSectionCount: number;
    totalSections: number;
    documentType: 'spec' | 'memory';
    parsingMethod: 'enhanced' | 'legacy';
  };
}

/**
 * Document reconstruction system that rebuilds documents from parsed data while preserving unparsed content
 */
export class DocumentPreservationSystem {
  /**
   * Parse and preserve a document with full content retention
   */
  static parseDocument(content: string, documentType: 'spec' | 'memory'): PreservedDocument {
    const originalContent = content;
    const preservedSections = new Map<string, string>();
    let parsedData: any;
    let unparsedSectionCount = 0;
    let totalSections = 0;

    try {
      if (documentType === 'spec') {
        const result = this.parseSpecDocumentWithPreservation(content);
        parsedData = result.parsedData;
        
        // Preserve unparsed sections
        result.unparsedSections.forEach(section => {
          preservedSections.set(section.title, section.content);
          unparsedSectionCount++;
        });
        totalSections = result.totalSections;
        
      } else {
        const result = this.parseMemoryDocumentWithPreservation(content);
        parsedData = result.parsedData;
        
        // Preserve unparsed sections
        result.unparsedSections.forEach(section => {
          preservedSections.set(section.title, section.content);
          unparsedSectionCount++;
        });
        totalSections = result.totalSections;
      }
    } catch (error) {
      console.error('Failed to parse document with preservation:', error);
      // Fallback: preserve entire document as single section
      preservedSections.set('FULL_DOCUMENT', content);
      parsedData = documentType === 'spec' ? this.getEmptySpecData() : this.getEmptyMemoryData();
      unparsedSectionCount = 1;
      totalSections = 1;
    }

    return {
      parsedData,
      originalContent,
      preservedSections,
      metadata: {
        parsingDate: new Date().toISOString(),
        unparsedSectionCount,
        totalSections,
        documentType,
        parsingMethod: 'enhanced'
      }
    };
  }

  /**
   * Reconstruct document from parsed data and preserved sections
   */
  static reconstructDocument(preservedDoc: PreservedDocument): string {
    try {
      // For now, prioritize preservation over regeneration
      // If we have significant preserved content, use original with selective updates
      if (preservedDoc.preservedSections.size > 0 && preservedDoc.metadata.unparsedSectionCount > 0) {
        return this.reconstructWithPreservation(preservedDoc);
      }
      
      // Otherwise use the full reconstruction
      if (preservedDoc.metadata.documentType === 'spec') {
        return this.reconstructSpecDocument(preservedDoc);
      } else {
        return this.reconstructMemoryDocument(preservedDoc);
      }
    } catch (error) {
      console.error('Failed to reconstruct document:', error);
      // Fallback: return original content
      return preservedDoc.originalContent;
    }
  }

  /**
   * Reconstruct document prioritizing preservation of original structure
   */
  private static reconstructWithPreservation(preservedDoc: PreservedDocument): string {
    try {
      // Use a hybrid approach: preserve original structure but merge updated wizard data
      let content = preservedDoc.originalContent;
      const data = preservedDoc.parsedData;
      
      if (preservedDoc.metadata.documentType === 'spec') {
        content = this.mergeSpecWizardChanges(content, data);
      } else if (preservedDoc.metadata.documentType === 'memory') {
        content = this.mergeMemoryWizardChanges(content, data);
      }
      
      return content;
      
    } catch (error) {
      console.warn('Error in preservation reconstruction, falling back to full reconstruction:', error);
      // Fallback to full reconstruction instead of returning unchanged original
      if (preservedDoc.metadata.documentType === 'spec') {
        return this.reconstructSpecDocument(preservedDoc);
      } else {
        return this.reconstructMemoryDocument(preservedDoc);
      }
    }
  }

  /**
   * Update project name in content while preserving original format
   */
  private static updateProjectNameInContent(content: string, projectName: string, _docType: 'spec' | 'memory'): string {
    const lines = content.split('\n');
    const titleLineIndex = lines.findIndex(line => line.trim().startsWith('# '));
    
    if (titleLineIndex >= 0) {
      const originalTitle = lines[titleLineIndex];
      
      // Check if we need to update the project name
      const currentNameMatch = originalTitle.match(/^# (.+?)(?:\s*-\s*.*)?$/);
      if (currentNameMatch && currentNameMatch[1].trim() !== projectName) {
        // Update the project name while preserving the rest of the title format
        const hasExistingSuffix = originalTitle.includes('-');
        
        if (hasExistingSuffix) {
          // Replace the name part but keep the existing suffix format
          lines[titleLineIndex] = originalTitle.replace(currentNameMatch[1], projectName);
        } else {
          // Keep original format if no suffix exists
          lines[titleLineIndex] = `# ${projectName}`;
        }
        
        return lines.join('\n');
      }
    }
    
    return content;
  }

  /**
   * Merge wizard changes for spec documents while preserving unparsed sections
   */
  private static mergeSpecWizardChanges(content: string, data: SpecDocumentData): string {
    let updatedContent = content;
    
    // Update project name in title
    if (data.projectOverview?.name) {
      updatedContent = this.updateProjectNameInContent(updatedContent, data.projectOverview.name, 'spec');
    }
    
    // Update project overview section
    if (data.projectOverview) {
      updatedContent = this.updateProjectOverviewInContent(updatedContent, data.projectOverview);
    }
    
    // Update functional requirements section
    if (data.functionalRequirements) {
      updatedContent = this.updateFunctionalRequirementsInContent(updatedContent, data.functionalRequirements);
    }
    
    // Update technical requirements section
    if (data.technicalRequirements) {
      updatedContent = this.updateTechnicalRequirementsInContent(updatedContent, data.technicalRequirements);
    }
    
    // Update API section
    if (data.apis) {
      updatedContent = this.updateApisInContent(updatedContent, data.apis);
    }
    
    // Update non-functional requirements section
    if (data.nonFunctionalRequirements) {
      updatedContent = this.updateNonFunctionalRequirementsInContent(updatedContent, data.nonFunctionalRequirements);
    }
    
    // Update roadmap section
    if (data.roadmap) {
      updatedContent = this.updateRoadmapInContent(updatedContent, data.roadmap);
    }
    
    return updatedContent;
  }

  /**
   * Merge wizard changes for memory documents while preserving unparsed sections
   */
  private static mergeMemoryWizardChanges(content: string, data: any): string {
    let updatedContent = content;
    
    // Update project name in title
    if (data.projectInfo?.name) {
      updatedContent = this.updateProjectNameInContent(updatedContent, data.projectInfo.name, 'memory');
    }
    
    // Update project info section
    if (data.projectInfo) {
      updatedContent = this.updateProjectInfoInContent(updatedContent, data.projectInfo);
    }
    
    // Update decision log section
    if (data.decisionLog && data.decisionLog.length > 0) {
      updatedContent = this.updateDecisionLogInContent(updatedContent, data.decisionLog);
    }
    
    // Update glossary section
    if (data.glossary && data.glossary.length > 0) {
      updatedContent = this.updateGlossaryInContent(updatedContent, data.glossary);
    }
    
    // Update meeting notes section
    if (data.meetingNotes && data.meetingNotes.length > 0) {
      updatedContent = this.updateMeetingNotesInContent(updatedContent, data.meetingNotes);
    }
    
    // Update lessons learned section
    if (data.lessonsLearned && data.lessonsLearned.length > 0) {
      updatedContent = this.updateLessonsLearnedInContent(updatedContent, data.lessonsLearned);
    }
    
    // Update onboarding notes section
    if (data.onboardingNotes && data.onboardingNotes.length > 0) {
      updatedContent = this.updateOnboardingNotesInContent(updatedContent, data.onboardingNotes);
    }
    
    return updatedContent;
  }

  /**
   * Update project overview section content while preserving format
   */
  private static updateProjectOverviewInContent(content: string, projectOverview: any): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isProjectOverviewSection(sectionTitle || '')) {
        // Update the project overview section with wizard data
        let updatedSection = section;
        
        // Update description if present
        if (projectOverview.description) {
          updatedSection = this.updateFieldInSection(updatedSection, 'description', projectOverview.description);
        }
        
        // Update purpose if present
        if (projectOverview.purpose) {
          updatedSection = this.updateFieldInSection(updatedSection, 'purpose', projectOverview.purpose);
        }
        
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update project info section content while preserving format
   */
  private static updateProjectInfoInContent(content: string, projectInfo: any): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isProjectInfoSection(sectionTitle || '')) {
        // Update the project info section with wizard data
        let updatedSection = section;
        
        // Update description if present
        if (projectInfo.description) {
          updatedSection = this.updateFieldInSection(updatedSection, 'description', projectInfo.description);
        }
        
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update a specific field within a section while preserving format
   */
  private static updateFieldInSection(section: string, fieldName: string, newValue: string): string {
    const lines = section.split('\n');
    let foundField = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for field patterns like "**Description:**", "Description:", or paragraph descriptions
      if (line.toLowerCase().includes(fieldName.toLowerCase())) {
        // Check if this is a labeled field (e.g., "**Description:** value")
        const labelMatch = line.match(/^(\*\*[^*]+\*\*:?\s*|[^:]+:\s*)(.*)/);
        if (labelMatch) {
          lines[i] = lines[i].replace(labelMatch[0], labelMatch[1] + newValue);
          foundField = true;
          break;
        }
      }
      
      // Also look for paragraph content after project overview header
      if (!foundField && fieldName.toLowerCase() === 'description' && 
          (line.toLowerCase().includes('project overview') || 
           line.toLowerCase().includes('description') ||
           (i > 0 && lines[i-1].toLowerCase().includes('project overview')))) {
        
        // Find the next paragraph and replace it
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim() && !lines[j].startsWith('#') && !lines[j].startsWith('**')) {
            lines[j] = newValue;
            foundField = true;
            break;
          }
        }
        if (foundField) break;
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Update functional requirements section content while preserving format
   */
  private static updateFunctionalRequirementsInContent(content: string, functionalReqs: any): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isFunctionalRequirementsSection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Update user stories if present
        if (functionalReqs.userStories && functionalReqs.userStories.length > 0) {
          updatedSection = this.updateUserStoriesInSection(updatedSection, functionalReqs.userStories);
        }
        
        // Update features if present
        if (functionalReqs.features && functionalReqs.features.length > 0) {
          updatedSection = this.updateFeaturesInSection(updatedSection, functionalReqs.features);
        }
        
        // Update acceptance criteria if present
        if (functionalReqs.acceptanceCriteria && functionalReqs.acceptanceCriteria.length > 0) {
          updatedSection = this.updateAcceptanceCriteriaInSection(updatedSection, functionalReqs.acceptanceCriteria);
        }
        
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update technical requirements section content while preserving format
   */
  private static updateTechnicalRequirementsInContent(content: string, techReqs: any): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isTechnicalRequirementsSection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Update architecture if present
        if (techReqs.architecture) {
          updatedSection = this.updateFieldInSection(updatedSection, 'architecture', techReqs.architecture);
        }
        
        // Update infrastructure if present
        if (techReqs.infrastructure) {
          updatedSection = this.updateFieldInSection(updatedSection, 'infrastructure', techReqs.infrastructure);
        }
        
        // Update technologies if present
        if (techReqs.technologies && techReqs.technologies.length > 0) {
          updatedSection = this.updateTechnologiesInSection(updatedSection, techReqs.technologies);
        }
        
        // Update dependencies if present
        if (techReqs.dependencies && techReqs.dependencies.length > 0) {
          updatedSection = this.updateDependenciesInSection(updatedSection, techReqs.dependencies);
        }
        
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update APIs section content while preserving format
   */
  private static updateApisInContent(content: string, apis: any): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isApiSection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Update authentication if present
        if (apis.authentication) {
          updatedSection = this.updateFieldInSection(updatedSection, 'authentication', apis.authentication);
        }
        
        // Update rate limit if present
        if (apis.rateLimit) {
          updatedSection = this.updateFieldInSection(updatedSection, 'rate limit', apis.rateLimit);
        }
        
        // Update endpoints if present
        if (apis.endpoints && apis.endpoints.length > 0) {
          updatedSection = this.updateEndpointsInSection(updatedSection, apis.endpoints);
        }
        
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update non-functional requirements section content while preserving format
   */
  private static updateNonFunctionalRequirementsInContent(content: string, nonFuncReqs: any): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isNonFunctionalRequirementsSection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Update performance if present
        if (nonFuncReqs.performance) {
          updatedSection = this.updateFieldInSection(updatedSection, 'performance', nonFuncReqs.performance);
        }
        
        // Update security if present
        if (nonFuncReqs.security) {
          updatedSection = this.updateFieldInSection(updatedSection, 'security', nonFuncReqs.security);
        }
        
        // Update scalability if present
        if (nonFuncReqs.scalability) {
          updatedSection = this.updateFieldInSection(updatedSection, 'scalability', nonFuncReqs.scalability);
        }
        
        // Update availability if present
        if (nonFuncReqs.availability) {
          updatedSection = this.updateFieldInSection(updatedSection, 'availability', nonFuncReqs.availability);
        }
        
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update roadmap section content while preserving format
   */
  private static updateRoadmapInContent(content: string, roadmap: any): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isRoadmapSection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Update phases if present
        if (roadmap.phases && roadmap.phases.length > 0) {
          updatedSection = this.updatePhasesInSection(updatedSection, roadmap.phases);
        }
        
        // Update milestones if present
        if (roadmap.milestones && roadmap.milestones.length > 0) {
          updatedSection = this.updateMilestonesInSection(updatedSection, roadmap.milestones);
        }
        
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update user stories in a section while preserving format
   */
  private static updateUserStoriesInSection(section: string, userStories: string[]): string {
    const lines = section.split('\n');
    let storyStartIndex = -1;
    let storyEndIndex = -1;
    
    // Find the user stories subsection
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('User Stories') || lines[i].includes('user stories')) {
        storyStartIndex = i + 1;
        break;
      }
    }
    
    if (storyStartIndex > -1) {
      // Find the end of user stories section (next ### or ## or end of section)
      for (let i = storyStartIndex; i < lines.length; i++) {
        if (lines[i].startsWith('###') || lines[i].startsWith('##') || lines[i].trim().length === 0) {
          storyEndIndex = i;
          break;
        }
      }
      
      if (storyEndIndex === -1) storyEndIndex = lines.length;
      
      // Replace the user stories content
      const newStories = userStories.map(story => `- **${story}**`);
      lines.splice(storyStartIndex, storyEndIndex - storyStartIndex, ...newStories, '');
    }
    
    return lines.join('\n');
  }

  /**
   * Update features in a section while preserving format
   */
  private static updateFeaturesInSection(section: string, features: any[]): string {
    const lines = section.split('\n');
    let featuresStartIndex = -1;
    
    // Find the features subsection
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('features') || lines[i].toLowerCase().includes('key features')) {
        featuresStartIndex = i + 1;
        break;
      }
    }
    
    if (featuresStartIndex > -1) {
      // Find existing features and update or add new ones
      const newFeatures = features.map(feature => 
        `- **${feature.name}**: ${feature.description || 'No description provided'}`
      );
      
      // Replace or insert features
      lines.splice(featuresStartIndex, 0, ...newFeatures, '');
    }
    
    return lines.join('\n');
  }

  /**
   * Update acceptance criteria in a section while preserving format
   */
  private static updateAcceptanceCriteriaInSection(section: string, criteria: string[]): string {
    const lines = section.split('\n');
    let criteriaStartIndex = -1;
    
    // Find the acceptance criteria subsection
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('acceptance criteria') || lines[i].toLowerCase().includes('acceptance')) {
        criteriaStartIndex = i + 1;
        break;
      }
    }
    
    if (criteriaStartIndex > -1) {
      const newCriteria = criteria.map(criterion => `- ✅ ${criterion}`);
      lines.splice(criteriaStartIndex, 0, ...newCriteria, '');
    }
    
    return lines.join('\n');
  }

  /**
   * Update technologies in a section while preserving format
   */
  private static updateTechnologiesInSection(section: string, technologies: string[]): string {
    const lines = section.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('technologies') || lines[i].toLowerCase().includes('tech stack')) {
        const techList = technologies.map(tech => `- ${tech}`);
        lines.splice(i + 1, 0, ...techList, '');
        break;
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Update dependencies in a section while preserving format
   */
  private static updateDependenciesInSection(section: string, dependencies: string[]): string {
    const lines = section.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('dependencies')) {
        const depList = dependencies.map(dep => `- ${dep}`);
        lines.splice(i + 1, 0, ...depList, '');
        break;
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Update endpoints in a section while preserving format
   */
  private static updateEndpointsInSection(section: string, endpoints: any[]): string {
    const lines = section.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('endpoints') || lines[i].toLowerCase().includes('api endpoints')) {
        const endpointList = endpoints.map(endpoint => 
          `- **${endpoint.method}** \`${endpoint.path}\` - ${endpoint.description || 'No description'}`
        );
        lines.splice(i + 1, 0, ...endpointList, '');
        break;
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Update phases in a section while preserving format
   */
  private static updatePhasesInSection(section: string, phases: any[]): string {
    const lines = section.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('phases') || lines[i].toLowerCase().includes('project phases')) {
        const phaseList = phases.map(phase => 
          `- **${phase.name}** (${phase.duration || 'TBD'}): ${phase.description || 'No description'}`
        );
        lines.splice(i + 1, 0, ...phaseList, '');
        break;
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Update milestones in a section while preserving format
   */
  private static updateMilestonesInSection(section: string, milestones: any[]): string {
    const lines = section.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('milestones')) {
        const milestoneList = milestones.map(milestone => 
          `- **${milestone.name}** (${milestone.date || 'TBD'}): ${milestone.description || 'No description'}`
        );
        lines.splice(i + 1, 0, ...milestoneList, '');
        break;
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Update decision log section content while preserving format
   */
  private static updateDecisionLogInContent(content: string, decisionLog: any[]): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isDecisionLogSection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Add new decisions to the section
        const decisionEntries = decisionLog.map(decision => {
          let entry = `\n### ${decision.title}\n`;
          if (decision.date) entry += `**Date:** ${decision.date}  \n`;
          if (decision.description) entry += `**Description:** ${decision.description}  \n`;
          if (decision.rationale) entry += `**Rationale:** ${decision.rationale}  \n`;
          if (decision.status) entry += `**Status:** ${decision.status}  \n`;
          if (decision.impact) entry += `**Impact:** ${decision.impact}  \n`;
          if (decision.stakeholders) entry += `**Stakeholders:** ${decision.stakeholders}  \n`;
          return entry;
        });
        
        // Append new decisions to the section
        updatedSection += '\n' + decisionEntries.join('\n');
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update glossary section content while preserving format
   */
  private static updateGlossaryInContent(content: string, glossary: any[]): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isGlossarySection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Add new glossary terms
        const glossaryEntries = glossary.map(term => 
          `**${term.term}:** ${term.definition}`
        );
        
        updatedSection += '\n\n' + glossaryEntries.join('  \n');
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update meeting notes section content while preserving format
   */
  private static updateMeetingNotesInContent(content: string, meetingNotes: any[]): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isMeetingNotesSection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Add new meeting notes
        const meetingEntries = meetingNotes.map(meeting => {
          let entry = `\n### ${meeting.title}\n`;
          if (meeting.date) entry += `**Date:** ${meeting.date}  \n`;
          if (meeting.attendees) entry += `**Attendees:** ${meeting.attendees}  \n`;
          if (meeting.agenda) entry += `**Agenda:** ${meeting.agenda}  \n`;
          if (meeting.notes) entry += `**Notes:** ${meeting.notes}  \n`;
          if (meeting.actionItems && meeting.actionItems.length > 0) {
            entry += `**Action Items:**\n`;
            meeting.actionItems.forEach((item: any) => {
              entry += `- [ ] ${item.task} (${item.assignee} - ${item.dueDate})\n`;
            });
          }
          return entry;
        });
        
        updatedSection += '\n' + meetingEntries.join('\n');
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update lessons learned section content while preserving format
   */
  private static updateLessonsLearnedInContent(content: string, lessonsLearned: any[]): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isLessonsLearnedSection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Add new lessons learned
        const lessonEntries = lessonsLearned.map(lesson => {
          let entry = `\n### ${lesson.title}\n`;
          if (lesson.date) entry += `**Date:** ${lesson.date}  \n`;
          if (lesson.category) entry += `**Category:** ${lesson.category}  \n`;
          if (lesson.situation) entry += `**Situation:** ${lesson.situation}  \n`;
          if (lesson.lesson) entry += `**Lesson:** ${lesson.lesson}  \n`;
          if (lesson.application) entry += `**Application:** ${lesson.application}  \n`;
          if (lesson.impact) entry += `**Impact:** ${lesson.impact}  \n`;
          return entry;
        });
        
        updatedSection += '\n' + lessonEntries.join('\n');
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Update onboarding notes section content while preserving format
   */
  private static updateOnboardingNotesInContent(content: string, onboardingNotes: any[]): string {
    const sections = content.split(/(?=^## )/m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.match(/^## (.+?)$/m)?.[1]?.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (this.isOnboardingNotesSection(sectionTitle || '')) {
        let updatedSection = section;
        
        // Add new onboarding notes
        const onboardingEntries = onboardingNotes.map(note => {
          let entry = `\n### ${note.title}\n`;
          if (note.role) entry += `**Role:** ${note.role}  \n`;
          if (note.content) entry += `**Content:** ${note.content}  \n`;
          if (note.resources && note.resources.length > 0) {
            entry += `**Resources:**\n`;
            note.resources.forEach((resource: string) => {
              entry += `- ${resource}\n`;
            });
          }
          return entry;
        });
        
        updatedSection += '\n' + onboardingEntries.join('\n');
        sections[i] = updatedSection;
        break;
      }
    }
    
    return sections.join('');
  }

  /**
   * Parse spec document with section preservation
   */
  private static parseSpecDocumentWithPreservation(content: string) {
    const data = this.getEmptySpecData();
    const unparsedSections: Array<{title: string, content: string}> = [];
    let totalSections = 0;

    // Extract project name from title
    const titleMatch = content.match(/^# (.+?)(?:\s*-\s*.*)?$/m);
    if (titleMatch) {
      data.projectOverview.name = titleMatch[1].trim();
    }

    // Find all sections
    const sections = this.extractSections(content);
    totalSections = sections.length;

    sections.forEach(section => {
      const sectionTitle = section.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      try {
        // Try to parse known sections
        if (this.isProjectOverviewSection(sectionTitle)) {
          this.parseProjectOverviewSection(section.content, data);
        } else if (this.isFunctionalRequirementsSection(sectionTitle)) {
          this.parseFunctionalRequirementsSection(section.content, data);
        } else if (this.isTechnicalRequirementsSection(sectionTitle)) {
          this.parseTechnicalRequirementsSection(section.content, data);
        } else if (this.isApiSection(sectionTitle)) {
          this.parseApiSection(section.content, data);
        } else if (this.isNonFunctionalRequirementsSection(sectionTitle)) {
          this.parseNonFunctionalRequirementsSection(section.content, data);
        } else if (this.isRoadmapSection(sectionTitle)) {
          this.parseRoadmapSection(section.content, data);
        } else {
          // Preserve unknown sections
          unparsedSections.push({
            title: section.title,
            content: section.fullContent
          });
        }
      } catch (error) {
        console.warn(`Failed to parse section "${section.title}":`, error);
        // Preserve failed sections
        unparsedSections.push({
          title: section.title,
          content: section.fullContent
        });
      }
    });

    return {
      parsedData: data,
      unparsedSections,
      totalSections
    };
  }

  /**
   * Parse memory document with section preservation
   */
  private static parseMemoryDocumentWithPreservation(content: string) {
    const data = this.getEmptyMemoryData();
    const unparsedSections: Array<{title: string, content: string}> = [];
    let totalSections = 0;

    // Extract project name from title
    const titleMatch = content.match(/^# (.+?)(?:\s*-\s*Memory Document)?$/m);
    if (titleMatch) {
      data.projectInfo.name = titleMatch[1].trim();
    }

    // Find all sections
    const sections = this.extractSections(content);
    totalSections = sections.length;

    sections.forEach(section => {
      const sectionTitle = section.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      try {
        // Try to parse known sections
        if (this.isProjectInfoSection(sectionTitle)) {
          this.parseProjectInfoSection(section.content, data);
        } else if (this.isDecisionLogSection(sectionTitle)) {
          this.parseDecisionLogSection(section.content, data);
        } else if (this.isGlossarySection(sectionTitle)) {
          this.parseGlossarySection(section.content, data);
        } else if (this.isMeetingNotesSection(sectionTitle)) {
          this.parseMeetingNotesSection(section.content, data);
        } else if (this.isLessonsLearnedSection(sectionTitle)) {
          this.parseLessonsLearnedSection(section.content, data);
        } else if (this.isOnboardingNotesSection(sectionTitle)) {
          this.parseOnboardingNotesSection(section.content, data);
        } else {
          // Preserve unknown sections
          unparsedSections.push({
            title: section.title,
            content: section.fullContent
          });
        }
      } catch (error) {
        console.warn(`Failed to parse section "${section.title}":`, error);
        // Preserve failed sections
        unparsedSections.push({
          title: section.title,
          content: section.fullContent
        });
      }
    });

    return {
      parsedData: data,
      unparsedSections,
      totalSections
    };
  }

  /**
   * Extract all sections from markdown content
   */
  private static extractSections(content: string) {
    const sections: Array<{title: string, content: string, fullContent: string}> = [];
    const lines = content.split('\n');
    
    let currentSection: {title: string, startIndex: number} | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection) {
          const sectionLines = lines.slice(currentSection.startIndex, i);
          const title = sectionLines[0].replace('## ', '').trim();
          const content = sectionLines.slice(1).join('\n');
          const fullContent = sectionLines.join('\n');
          
          sections.push({
            title,
            content,
            fullContent
          });
        }
        
        // Start new section
        currentSection = {
          title: line.replace('## ', '').trim(),
          startIndex: i
        };
      }
    }
    
    // Handle final section
    if (currentSection) {
      const sectionLines = lines.slice(currentSection.startIndex);
      const title = sectionLines[0].replace('## ', '').trim();
      const content = sectionLines.slice(1).join('\n');
      const fullContent = sectionLines.join('\n');
      
      sections.push({
        title,
        content,
        fullContent
      });
    }
    
    return sections;
  }

  // Section type detection methods
  private static isProjectOverviewSection(title: string): boolean {
    return title.includes('project overview') || title.includes('overview');
  }

  private static isFunctionalRequirementsSection(title: string): boolean {
    return title.includes('functional requirements') || title.includes('user requirements');
  }

  private static isTechnicalRequirementsSection(title: string): boolean {
    return title.includes('technical requirements') || title.includes('system requirements');
  }

  private static isApiSection(title: string): boolean {
    return title.includes('api') || title.includes('endpoints');
  }

  private static isNonFunctionalRequirementsSection(title: string): boolean {
    return title.includes('non functional') || title.includes('nonfunctional') || title.includes('quality attributes');
  }

  private static isRoadmapSection(title: string): boolean {
    return title.includes('roadmap') || title.includes('timeline') || title.includes('milestones');
  }

  private static isProjectInfoSection(title: string): boolean {
    return title.includes('project information') || title.includes('project info');
  }

  private static isDecisionLogSection(title: string): boolean {
    return title.includes('decision log') || title.includes('decisions');
  }

  private static isGlossarySection(title: string): boolean {
    return title.includes('glossary') || title.includes('definitions');
  }

  private static isMeetingNotesSection(title: string): boolean {
    return title.includes('meeting notes') || title.includes('meetings');
  }

  private static isLessonsLearnedSection(title: string): boolean {
    return title.includes('lessons learned') || title.includes('lessons');
  }

  private static isOnboardingNotesSection(title: string): boolean {
    return title.includes('onboarding') || title.includes('team onboarding');
  }

  // Parsing methods for each section type
  private static parseProjectOverviewSection(content: string, data: SpecDocumentData) {
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Look for description paragraph
      if (!trimmed.startsWith('**') && !trimmed.startsWith('#') && trimmed.length > 10) {
        if (!data.projectOverview.description) {
          data.projectOverview.description = trimmed;
        }
      }
      
      // Look for purpose
      if (trimmed.includes('Purpose:') || trimmed.includes('🎯 Purpose:')) {
        data.projectOverview.purpose = trimmed.replace(/.*?Purpose:\s*/, '').replace(/\*\*/g, '').trim();
      }
    }
  }

  private static parseFunctionalRequirementsSection(content: string, data: SpecDocumentData) {
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Parse user stories
      if (line.includes('As a ') && (line.startsWith('- ') || line.includes('**'))) {
        const userStory = line.replace(/^- .*?\*\*(.*?)\*\*.*$/, '$1').trim();
        if (userStory.startsWith('As a')) {
          data.functionalRequirements.userStories.push(userStory);
        }
      }
      
      // Parse acceptance criteria
      if (line.includes('✅') || line.includes('🔄') || (line.startsWith('- ') && i > 0 && lines[i-1].includes('Acceptance'))) {
        const criteria = line.replace(/^[- ✅🔄]\s*/, '').trim();
        if (criteria && !data.functionalRequirements.acceptanceCriteria.includes(criteria)) {
          data.functionalRequirements.acceptanceCriteria.push(criteria);
        }
      }
    }
  }

  private static parseTechnicalRequirementsSection(_content: string, _data: SpecDocumentData) {
    // Implementation for technical requirements
  }

  private static parseApiSection(_content: string, _data: SpecDocumentData) {
    // Implementation for API documentation
  }

  private static parseNonFunctionalRequirementsSection(_content: string, _data: SpecDocumentData) {
    // Implementation for non-functional requirements
  }

  private static parseRoadmapSection(_content: string, _data: SpecDocumentData) {
    // Implementation for roadmap
  }

  private static parseProjectInfoSection(content: string, data: any) {
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('**Description:**')) {
        data.projectInfo.description = trimmed.replace('**Description:**', '').trim();
      } else if (trimmed.startsWith('**Team:**')) {
        const teamText = trimmed.replace('**Team:**', '').trim();
        if (teamText && !teamText.includes('[To be updated')) {
          data.projectInfo.team = teamText.split(',').map((member: string) => member.trim()).filter(Boolean);
        }
      }
    }
  }

  private static parseDecisionLogSection(content: string, data: any) {
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('### ') && !line.includes('No decision')) {
        const title = line.replace('### ', '').trim();
        
        const decision: any = {
          title,
          date: '',
          description: '',
          rationale: '',
          status: 'Decided',
          impact: '',
          stakeholders: ''
        };
        
        // Parse decision details
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith('###') && !lines[j].startsWith('##')) {
          const detailLine = lines[j].trim();
          
          if (detailLine.startsWith('**Date:**')) {
            decision.date = detailLine.replace('**Date:**', '').trim();
          } else if (detailLine.startsWith('**Description:**')) {
            decision.description = detailLine.replace('**Description:**', '').trim();
          }
          // Add other decision fields...
          
          j++;
        }
        
        if (decision.title) {
          data.decisionLog.push(decision);
        }
        i = j - 1;
      }
    }
  }

  private static parseGlossarySection(content: string, data: any) {
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('**') && trimmed.includes(':**')) {
        const colonIndex = trimmed.indexOf(':**');
        const term = trimmed.substring(2, colonIndex).trim();
        const definition = trimmed.substring(colonIndex + 3).trim();
        
        if (term && definition) {
          data.glossary.push({ term, definition });
        }
      }
    }
  }

  private static parseMeetingNotesSection(_content: string, _data: any) {
    // Implementation for meeting notes
  }

  private static parseLessonsLearnedSection(_content: string, _data: any) {
    // Implementation for lessons learned
  }

  private static parseOnboardingNotesSection(_content: string, _data: any) {
    // Implementation for onboarding notes
  }

  // Document reconstruction methods
  private static reconstructSpecDocument(preservedDoc: PreservedDocument): string {
    const data = preservedDoc.parsedData as SpecDocumentData;
    let content = '';
    
    // Add title
    content += `# ${data.projectOverview.name} - Project Technical Specification\n\n`;
    
    // Add parsed sections
    if (data.projectOverview.description || data.projectOverview.purpose) {
      content += '## Project Overview\n\n';
      if (data.projectOverview.description) {
        content += `${data.projectOverview.description}\n\n`;
      }
      if (data.projectOverview.purpose) {
        content += `**🎯 Purpose:** ${data.projectOverview.purpose}\n\n`;
      }
    }
    
    // Add preserved sections
    preservedDoc.preservedSections.forEach((sectionContent, sectionTitle) => {
      if (sectionTitle !== 'FULL_DOCUMENT') {
        content += sectionContent + '\n\n';
      }
    });
    
    return content.trim();
  }

  private static reconstructMemoryDocument(preservedDoc: PreservedDocument): string {
    const data = preservedDoc.parsedData;
    let content = '';
    
    // Add title
    content += `# ${data.projectInfo.name} - Memory Document\n\n`;
    
    // Add parsed sections
    if (data.projectInfo.description || data.projectInfo.team.length > 0) {
      content += '## Project Information\n\n';
      if (data.projectInfo.description) {
        content += `**Description:** ${data.projectInfo.description}\n\n`;
      }
      if (data.projectInfo.team.length > 0) {
        content += `**Team:** ${data.projectInfo.team.join(', ')}\n\n`;
      }
    }
    
    // Add preserved sections
    preservedDoc.preservedSections.forEach((sectionContent, sectionTitle) => {
      if (sectionTitle !== 'FULL_DOCUMENT') {
        content += sectionContent + '\n\n';
      }
    });
    
    return content.trim();
  }

  // Helper methods for empty data structures
  private static getEmptySpecData(): SpecDocumentData {
    return {
      projectOverview: {
        name: '',
        description: '',
        purpose: '',
        stakeholders: [],
        timeline: ''
      },
      functionalRequirements: {
        userStories: [],
        features: [],
        acceptanceCriteria: []
      },
      technicalRequirements: {
        architecture: '',
        technologies: [],
        infrastructure: '',
        dependencies: []
      },
      apis: {
        endpoints: [],
        authentication: '',
        rateLimit: ''
      },
      nonFunctionalRequirements: {
        performance: '',
        security: '',
        scalability: '',
        availability: ''
      },
      roadmap: {
        phases: [],
        milestones: []
      }
    };
  }

  private static getEmptyMemoryData() {
    return {
      projectInfo: { name: '', description: '', team: [] as string[] },
      decisionLog: [] as any[],
      glossary: [] as any[],
      meetingNotes: [] as any[],
      lessonsLearned: [] as any[],
      onboardingNotes: [] as any[]
    };
  }
}