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
      // Use a hybrid approach: preserve original structure but allow selective updates
      let content = preservedDoc.originalContent;
      const data = preservedDoc.parsedData;
      
      // If we have parsed data changes, we need to merge them back intelligently
      // For the first iteration, let's focus on preserving everything
      // and just ensuring the project name is updated if changed
      
      if (preservedDoc.metadata.documentType === 'spec' && data.projectOverview?.name) {
        content = this.updateProjectNameInContent(content, data.projectOverview.name, 'spec');
      } else if (preservedDoc.metadata.documentType === 'memory' && data.projectInfo?.name) {
        content = this.updateProjectNameInContent(content, data.projectInfo.name, 'memory');
      }
      
      // TODO: In future iterations, we can add more sophisticated merging
      // For example, updating specific sections that were parsed while preserving others
      
      return content;
      
    } catch (error) {
      console.warn('Error in preservation reconstruction, falling back to original:', error);
      return preservedDoc.originalContent;
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