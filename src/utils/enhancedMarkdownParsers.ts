import type { SpecDocumentData } from '../types';

/**
 * Enhanced document parser that preserves all content while extracting what it can parse
 * Key features:
 * - Preserves unparsed content for round-trip integrity
 * - Fault-tolerant parsing that continues even if sections fail
 * - Flexible section matching that handles variations in structure
 * - Content preservation system that maintains original document structure
 */

interface ParsedDocument {
  parsedData: any;
  originalContent: string;
  unparsedSections: string[];
  sectionMap: Record<string, { start: number; end: number; content: string }>;
}

/**
 * Enhanced memory document parser with content preservation
 */
export const parseMemoryMarkdownContentEnhanced = (content: string): ParsedDocument => {
  const originalContent = content;
  const unparsedSections: string[] = [];
  const sectionMap: Record<string, { start: number; end: number; content: string }> = {};
  
  const data = {
    projectInfo: { name: '', description: '', team: [] as string[] },
    decisionLog: [] as any[],
    glossary: [] as any[],
    meetingNotes: [] as any[],
    lessonsLearned: [] as any[],
    onboardingNotes: [] as any[]
  };

  try {
    const lines = content.split('\n');
    let currentSectionStart = 0;
    let currentSection = '';
    
    // Extract project name from title - flexible matching
    const titlePatterns = [
      /^# (.+?) - Memory Document/m,
      /^# (.+?) Memory Document/m,
      /^# (.+?)\s*$/m
    ];
    
    for (const pattern of titlePatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        data.projectInfo.name = match[1].trim();
        break;
      }
    }

    // Parse sections with enhanced structure detection
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim() || '';
      
      // Detect section headers (## level)
      if (line.match(/^## /)) {
        // Save previous section
        if (currentSection) {
          const sectionContent = lines.slice(currentSectionStart, i).join('\n');
          sectionMap[currentSection] = {
            start: currentSectionStart,
            end: i,
            content: sectionContent
          };
        }
        
        currentSection = line.replace(/^## /, '').trim();
        currentSectionStart = i;
        
        // Parse known sections
        try {
          parseSection(currentSection, lines, i, data);
        } catch (error) {
          console.warn(`Failed to parse section "${currentSection}":`, error);
          unparsedSections.push(currentSection);
        }
      }
    }
    
    // Handle final section
    if (currentSection) {
      const sectionContent = lines.slice(currentSectionStart).join('\n');
      sectionMap[currentSection] = {
        start: currentSectionStart,
        end: lines.length,
        content: sectionContent
      };
    }

  } catch (error) {
    console.error('Error parsing memory document:', error);
  }

  return {
    parsedData: data,
    originalContent,
    unparsedSections,
    sectionMap
  };
};

/**
 * Enhanced spec document parser with content preservation  
 */
export const parseSpecMarkdownContentEnhanced = (content: string): ParsedDocument => {
  const originalContent = content;
  const unparsedSections: string[] = [];
  const sectionMap: Record<string, { start: number; end: number; content: string }> = {};
  
  const data: SpecDocumentData = {
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

  try {
    const lines = content.split('\n');
    let currentSectionStart = 0;
    let currentSection = '';
    
    // Extract project name - flexible matching
    const titlePatterns = [
      /^# (.+?) - (?:Project )?(?:Technical )?Specification(?:\s+Document)?/m,
      /^# (.+?)\s*$/m
    ];
    
    for (const pattern of titlePatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        data.projectOverview.name = match[1].trim();
        break;
      }
    }

    // Parse sections with enhanced structure detection
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim() || '';
      
      // Detect section headers (## level)
      if (line.match(/^## /)) {
        // Save previous section
        if (currentSection) {
          const sectionContent = lines.slice(currentSectionStart, i).join('\n');
          sectionMap[currentSection] = {
            start: currentSectionStart,
            end: i,
            content: sectionContent
          };
        }
        
        currentSection = line.replace(/^## /, '').trim();
        currentSectionStart = i;
        
        // Parse known sections
        try {
          parseSpecSection(currentSection, lines, i, data);
        } catch (error) {
          console.warn(`Failed to parse spec section "${currentSection}":`, error);
          unparsedSections.push(currentSection);
        }
      }
    }
    
    // Handle final section
    if (currentSection) {
      const sectionContent = lines.slice(currentSectionStart).join('\n');
      sectionMap[currentSection] = {
        start: currentSectionStart,
        end: lines.length,
        content: sectionContent
      };
    }

  } catch (error) {
    console.error('Error parsing spec document:', error);
  }

  return {
    parsedData: data,
    originalContent,
    unparsedSections,
    sectionMap
  };
};

/**
 * Parse a memory document section
 */
function parseSection(sectionTitle: string, lines: string[], startIndex: number, data: any) {
  const normalizedTitle = sectionTitle.replace(/[^\w\s]/g, '').trim().toLowerCase();
  
  // Project Information
  if (normalizedTitle.includes('project information')) {
    parseProjectInfo(lines, startIndex, data);
  }
  // Decision Log  
  else if (normalizedTitle.includes('decision log')) {
    parseDecisionLog(lines, startIndex, data);
  }
  // Glossary
  else if (normalizedTitle.includes('glossary')) {
    parseGlossary(lines, startIndex, data);
  }
  // Meeting Notes
  else if (normalizedTitle.includes('meeting notes')) {
    parseMeetingNotes(lines, startIndex, data);
  }
  // Lessons Learned
  else if (normalizedTitle.includes('lessons learned')) {
    parseLessonsLearned(lines, startIndex, data);
  }
  // Onboarding Notes
  else if (normalizedTitle.includes('onboarding')) {
    parseOnboardingNotes(lines, startIndex, data);
  }
}

/**
 * Parse a spec document section
 */
function parseSpecSection(sectionTitle: string, lines: string[], startIndex: number, data: SpecDocumentData) {
  const normalizedTitle = sectionTitle.replace(/[^\w\s]/g, '').trim().toLowerCase();
  
  // Project Overview
  if (normalizedTitle.includes('project overview')) {
    parseProjectOverview(lines, startIndex, data);
  }
  // Functional Requirements
  else if (normalizedTitle.includes('functional requirements')) {
    parseFunctionalRequirements(lines, startIndex, data);
  }
  // Technical Requirements
  else if (normalizedTitle.includes('technical requirements')) {
    parseTechnicalRequirements(lines, startIndex, data);
  }
  // API Documentation
  else if (normalizedTitle.includes('api')) {
    parseApiDocumentation(lines, startIndex, data);
  }
  // Non-Functional Requirements
  else if (normalizedTitle.includes('non functional') || normalizedTitle.includes('nonfunctional')) {
    parseNonFunctionalRequirements(lines, startIndex, data);
  }
  // Roadmap
  else if (normalizedTitle.includes('roadmap')) {
    parseRoadmap(lines, startIndex, data);
  }
}

// Helper parsing functions for memory document sections
function parseProjectInfo(lines: string[], startIndex: number, data: any) {
  for (let i = startIndex; i < lines.length && !lines[i].startsWith('##'); i++) {
    const line = lines[i]?.trim() || '';
    
    if (line.startsWith('**Description:**')) {
      data.projectInfo.description = line.replace('**Description:**', '').trim();
    } else if (line.startsWith('**Team:**')) {
      const teamText = line.replace('**Team:**', '').trim();
      if (teamText && teamText !== '[To be updated as team members are identified]') {
        data.projectInfo.team = teamText.split(',').map((member: string) => member.trim()).filter(Boolean);
      }
    }
  }
}

function parseDecisionLog(lines: string[], startIndex: number, data: any) {
  for (let i = startIndex; i < lines.length && !lines[i].startsWith('##'); i++) {
    const line = lines[i]?.trim() || '';
    
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
        const detailLine = lines[j]?.trim() || '';
        
        if (detailLine.startsWith('**Date:**')) {
          decision.date = detailLine.replace('**Date:**', '').trim();
        } else if (detailLine.startsWith('**Description:**')) {
          decision.description = detailLine.replace('**Description:**', '').trim();
        } else if (detailLine.startsWith('**Rationale:**')) {
          decision.rationale = detailLine.replace('**Rationale:**', '').trim();
        } else if (detailLine.startsWith('**Status:**')) {
          const status = detailLine.replace('**Status:**', '').trim();
          decision.status = ['Decided', 'Pending', 'Rejected'].includes(status) ? status : 'Decided';
        } else if (detailLine.startsWith('**Impact:**')) {
          decision.impact = detailLine.replace('**Impact:**', '').trim();
        } else if (detailLine.startsWith('**Stakeholders:**')) {
          decision.stakeholders = detailLine.replace('**Stakeholders:**', '').trim();
        }
        j++;
      }
      
      if (decision.title) {
        data.decisionLog.push(decision);
      }
      i = j - 1;
    }
  }
}

function parseGlossary(lines: string[], startIndex: number, data: any) {
  for (let i = startIndex; i < lines.length && !lines[i].startsWith('##'); i++) {
    const line = lines[i]?.trim() || '';
    
    if (line.startsWith('**') && line.includes(':**')) {
      const colonIndex = line.indexOf(':**');
      const term = line.substring(2, colonIndex).trim();
      const definition = line.substring(colonIndex + 3).trim();
      
      if (term && definition) {
        data.glossary.push({ term, definition });
      }
    }
  }
}

function parseMeetingNotes(_lines: string[], _startIndex: number, _data: any) {
  // Implementation similar to existing meeting notes parsing but more robust
  // This would be a longer implementation - focusing on the structure for now
}

function parseLessonsLearned(_lines: string[], _startIndex: number, _data: any) {
  // Implementation for lessons learned parsing
}

function parseOnboardingNotes(_lines: string[], _startIndex: number, _data: any) {
  // Implementation for onboarding notes parsing
}

// Helper parsing functions for spec document sections
function parseProjectOverview(lines: string[], startIndex: number, data: SpecDocumentData) {
  for (let i = startIndex; i < lines.length && !lines[i].startsWith('##'); i++) {
    const line = lines[i]?.trim() || '';
    
    // Look for description in paragraph form
    if (!line.startsWith('**') && !line.startsWith('#') && line.length > 10) {
      if (!data.projectOverview.description) {
        data.projectOverview.description = line;
      }
    }
    
    if (line.startsWith('**🎯 Purpose:**') || line.startsWith('**Purpose:**')) {
      data.projectOverview.purpose = line.replace(/\*\*.*?Purpose:\*\*\s*/, '').trim();
    }
  }
}

function parseFunctionalRequirements(lines: string[], startIndex: number, data: SpecDocumentData) {
  let currentSubsection = '';
  
  for (let i = startIndex; i < lines.length && !lines[i].startsWith('##'); i++) {
    const line = lines[i]?.trim() || '';
    
    if (line.startsWith('### ')) {
      currentSubsection = line.replace('### ', '').trim().toLowerCase();
    }
    
    // Parse user stories
    if (currentSubsection.includes('user stories') || currentSubsection.includes('core collaboration')) {
      if (line.startsWith('- 📖 **As a') || line.startsWith('- **As a')) {
        const userStory = line.replace(/^- .*?\*\*(.*?)\*\*.*$/, '$1').trim();
        if (userStory && userStory.startsWith('As a')) {
          data.functionalRequirements.userStories.push(userStory);
        }
      }
    }
    
    // Parse acceptance criteria
    if (line.includes('Acceptance Criteria') || line.includes('✅') || line.includes('🔄')) {
      let j = i + 1;
      while (j < lines.length && (lines[j]?.trim().startsWith('- ') || lines[j]?.trim().startsWith('✅') || lines[j]?.trim().startsWith('🔄'))) {
        const criteriaLine = lines[j]?.trim() || '';
        const criteria = criteriaLine.replace(/^[- ✅🔄]\s*/, '').trim();
        if (criteria && !data.functionalRequirements.acceptanceCriteria.includes(criteria)) {
          data.functionalRequirements.acceptanceCriteria.push(criteria);
        }
        j++;
      }
      i = j - 1;
    }
  }
}

function parseTechnicalRequirements(_lines: string[], _startIndex: number, _data: SpecDocumentData) {
  // Implementation for technical requirements parsing
}

function parseApiDocumentation(_lines: string[], _startIndex: number, _data: SpecDocumentData) {
  // Implementation for API documentation parsing
}

function parseNonFunctionalRequirements(_lines: string[], _startIndex: number, _data: SpecDocumentData) {
  // Implementation for non-functional requirements parsing
}

function parseRoadmap(_lines: string[], _startIndex: number, _data: SpecDocumentData) {
  // Implementation for roadmap parsing
}