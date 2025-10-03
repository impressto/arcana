import type { SpecDocumentData } from '../types';

// Memory document markdown parser
export const parseMemoryMarkdownContent = (content: string) => {
  try {
    // Validate input
    if (!content || typeof content !== 'string') {
      throw new Error('Content must be a non-empty string');
    }

    const data = {
      projectInfo: { name: '', description: '', team: [] as string[] },
      decisionLog: [] as any[],
      glossary: [] as any[],
      meetingNotes: [] as any[],
      lessonsLearned: [] as any[],
      onboardingNotes: [] as any[]
    };

    const lines = content.split('\n');
    let currentSection = '';

    // Extract project name from title
    const titleMatch = content.match(/^# (.+?) - Memory Document/m);
    if (titleMatch && titleMatch[1]) {
      data.projectInfo.name = titleMatch[1].trim();
    }

    // Simple parsing - look for section headers and basic content
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim() || '';
      
      if (line.startsWith('## ')) {
        currentSection = line.replace('## ', '').trim();
      }
      
      // Parse project info (ignore emojis and special characters)
      const sectionText = currentSection.replace(/[^\w\s]/g, '').trim().toLowerCase();
      
      if (sectionText.includes('project information')) {
        if (line.startsWith('**Description:**')) {
          data.projectInfo.description = line.replace('**Description:**', '').trim();
        } else if (line.startsWith('**Team:**')) {
          const teamText = line.replace('**Team:**', '').trim();
          data.projectInfo.team = teamText.split(',').map(member => member.trim()).filter(Boolean);
        }
      }

      // Basic glossary parsing
      if (sectionText.includes('glossary') && line.startsWith('**') && line.includes(':**')) {
        const match = line.match(/\*\*(.+?):\*\*\s*(.+)/);
        if (match) {
          data.glossary.push({
            term: match[1].trim(),
            definition: match[2].trim(),
            category: ''
          });
        }
      }

      // Enhanced decision log parsing
      if (sectionText.includes('decision log') && line.startsWith('### ') && !line.includes('No decisions')) {
        const title = line.replace('### ', '').trim();
        let j = i + 1;
        const decision: any = {
          title,
          description: '',
          date: '',
          rationale: '',
          stakeholders: [],
          impact: '',
          alternatives: [],
          status: 'decided'
        };

        // Parse following lines for decision details
        while (j < lines.length && !lines[j]?.startsWith('###') && !lines[j]?.startsWith('##')) {
          const detailLine = lines[j]?.trim() || '';
          if (detailLine.startsWith('**Date:**')) {
            decision.date = detailLine.replace('**Date:**', '').trim();
          } else if (detailLine.startsWith('**Description:**')) {
            decision.description = detailLine.replace('**Description:**', '').trim();
          } else if (detailLine.startsWith('**Status:**')) {
            const status = detailLine.replace('**Status:**', '').trim().toLowerCase();
            decision.status = ['pending', 'revisit'].includes(status) ? status : 'decided';
          } else if (detailLine.startsWith('**Rationale:**')) {
            decision.rationale = detailLine.replace('**Rationale:**', '').trim();
          } else if (detailLine.startsWith('**Impact:**')) {
            decision.impact = detailLine.replace('**Impact:**', '').trim();
          } else if (detailLine.startsWith('**Stakeholders:**')) {
            const stakeholders = detailLine.replace('**Stakeholders:**', '').trim();
            decision.stakeholders = stakeholders.split(',').map((s: string) => s.trim()).filter(Boolean);
          } else if (detailLine.startsWith('**Alternatives:**')) {
            const alternatives = detailLine.replace('**Alternatives:**', '').trim();
            decision.alternatives = alternatives.split(',').map((a: string) => a.trim()).filter(Boolean);
          }
          j++;
        }

        if (decision.title) {
          data.decisionLog.push(decision);
          i = j - 1; // Skip processed lines
        }
      }

      // Enhanced meeting notes parsing
      if (sectionText.includes('meeting notes') && line.startsWith('### ') && !line.includes('No meeting')) {
        const titleMatch = line.match(/^### (.+?)(?: - (\d{4}-\d{2}-\d{2}))?$/);
        const title = titleMatch ? titleMatch[1].trim() : line.replace('### ', '').trim();
        const date = titleMatch && titleMatch[2] ? titleMatch[2].trim() : '';

        let j = i + 1;
        const meeting: any = {
          title,
          date,
          attendees: [],
          agenda: [],
          notes: '',
          actionItems: []
        };

        let currentMeetingSection = '';
        let collectingNotes = false;
        let notesContent = '';

        // Parse following lines for meeting details
        while (j < lines.length && !lines[j].startsWith('###') && !lines[j].startsWith('##')) {
          const detailLine = lines[j].trim();
          
          if (detailLine.startsWith('**Attendees:**')) {
            currentMeetingSection = 'attendees';
            const attendees = detailLine.replace('**Attendees:**', '').trim();
            if (attendees) {
              meeting.attendees = attendees.split(',').map((a: string) => a.trim()).filter(Boolean);
            }
          } else if (detailLine.startsWith('**Agenda:**')) {
            currentMeetingSection = 'agenda';
            collectingNotes = false;
          } else if (detailLine.startsWith('**Notes:**')) {
            currentMeetingSection = 'notes';
            collectingNotes = true;
            notesContent = '';
          } else if (detailLine.startsWith('**Action Items:**')) {
            currentMeetingSection = 'actions';
            collectingNotes = false;
            if (notesContent) {
              meeting.notes = notesContent;
              notesContent = '';
            }
          } else if (currentMeetingSection === 'agenda' && detailLine.startsWith('- ')) {
            meeting.agenda.push(detailLine.replace('- ', '').trim());
          } else if (currentMeetingSection === 'actions' && detailLine.startsWith('- ')) {
            // Parse action items: - [x] Task (Assignee - Date) or - [x] Task (Assignee - Due: Date)
            const actionMatch = detailLine.match(/^- \[([x ])\]\s*(.+?)(?:\s*\((.+?)\s*-\s*(?:Due:\s*)?(.+?)\))?$/);
            if (actionMatch) {
              const completed = actionMatch[1] === 'x';
              const description = actionMatch[2].trim();
              const assignee = actionMatch[3]?.trim() || '';
              const dueDate = actionMatch[4]?.trim() || '';
              
              meeting.actionItems.push({
                description,
                assignee,
                dueDate,
                status: completed ? 'complete' : 'open'
              });
            } else {
              // Fallback for simple format
              meeting.actionItems.push({
                description: detailLine.replace('- ', '').trim(),
                assignee: '',
                dueDate: '',
                status: 'open'
              });
            }
          } else if (collectingNotes && detailLine && !detailLine.startsWith('**')) {
            notesContent += (notesContent ? '\n' : '') + detailLine;
          }
          j++;
        }

        if (notesContent) {
          meeting.notes = notesContent;
        }

        if (meeting.title) {
          data.meetingNotes.push(meeting);
          i = j - 1; // Skip processed lines
        }
      }

      // Enhanced lessons learned parsing
      if (sectionText.includes('lessons learned') && line.startsWith('### ') && !line.includes('No lessons')) {
        const title = line.replace('### ', '').trim();
        let j = i + 1;
        const lesson: any = {
          title,
          date: '',
          category: '',
          situation: '',
          lesson: '',
          application: '',
          impact: 'medium'
        };

        // Parse following lines for lesson details
        while (j < lines.length && !lines[j].startsWith('###') && !lines[j].startsWith('##')) {
          const detailLine = lines[j].trim();
          if (detailLine.startsWith('**Date:**')) {
            lesson.date = detailLine.replace('**Date:**', '').trim();
          } else if (detailLine.startsWith('**Category:**')) {
            lesson.category = detailLine.replace('**Category:**', '').trim();
          } else if (detailLine.startsWith('**Situation:**')) {
            lesson.situation = detailLine.replace('**Situation:**', '').trim();
          } else if (detailLine.startsWith('**Lesson:**')) {
            lesson.lesson = detailLine.replace('**Lesson:**', '').trim();
          } else if (detailLine.startsWith('**Application:**')) {
            lesson.application = detailLine.replace('**Application:**', '').trim();
          } else if (detailLine.startsWith('**Impact:**')) {
            const impact = detailLine.replace('**Impact:**', '').trim().toLowerCase();
            lesson.impact = ['low', 'high'].includes(impact) ? impact : 'medium';
          }
          j++;
        }

        if (lesson.title) {
          data.lessonsLearned.push(lesson);
          i = j - 1; // Skip processed lines
        }
      }

      // Enhanced onboarding notes parsing
      if (sectionText.includes('onboarding notes') && line.startsWith('### ') && !line.includes('New team member')) {
        const nameAndRole = line.replace('### ', '').trim();
        const match = nameAndRole.match(/^(.+?)\s*-\s*(.+)$/);
        const newHireName = match ? match[1].trim() : nameAndRole;
        const role = match ? match[2].trim() : '';

        let j = i + 1;
        const note: any = {
          id: Date.now().toString() + Math.random(),
          newHireName,
          role,
          startDate: '',
          mentor: '',
          department: '',
          status: 'in-progress',
          onboardingTasks: [],
          resources: [],
          feedback: '',
          completionDate: '',
          notes: ''
        };

        let collectingTasks = false;
        let collectingResources = false;
        let collectingNotes = false;
        let notesContent = '';

        // Parse following lines for onboarding details
        while (j < lines.length && !lines[j].startsWith('###') && !lines[j].startsWith('##')) {
          const detailLine = lines[j].trim();
          
          if (detailLine.startsWith('**Status:**')) {
            const status = detailLine.replace('**Status:**', '').trim().toLowerCase().replace(' ', '-');
            note.status = ['completed', 'on-hold'].includes(status) ? status : 'in-progress';
            collectingTasks = false;
            collectingResources = false;
            collectingNotes = false;
          } else if (detailLine.startsWith('**Department:**')) {
            note.department = detailLine.replace('**Department:**', '').trim();
          } else if (detailLine.startsWith('**Start Date:**')) {
            note.startDate = detailLine.replace('**Start Date:**', '').trim();
          } else if (detailLine.startsWith('**Mentor:**')) {
            note.mentor = detailLine.replace('**Mentor:**', '').trim();
          } else if (detailLine.startsWith('**Onboarding Tasks:**')) {
            collectingTasks = true;
            collectingResources = false;
            collectingNotes = false;
          } else if (detailLine.startsWith('**Resources:**')) {
            collectingTasks = false;
            collectingResources = true;
            collectingNotes = false;
          } else if (detailLine.startsWith('**Notes:**')) {
            collectingTasks = false;
            collectingResources = false;
            collectingNotes = true;
            notesContent = '';
          } else if (detailLine.startsWith('**Feedback:**')) {
            note.feedback = detailLine.replace('**Feedback:**', '').trim();
            collectingNotes = false;
            if (notesContent) {
              note.notes = notesContent;
            }
          } else if (detailLine.startsWith('**Completion Date:**')) {
            note.completionDate = detailLine.replace('**Completion Date:**', '').trim();
          } else if (collectingTasks && detailLine.match(/^- \[[ x]\]/)) {
            // Parse tasks: - [x] Task description or - [ ] Task description
            const taskMatch = detailLine.match(/^- \[([x ])\]\s*(.+)$/);
            if (taskMatch) {
              const completed = taskMatch[1] === 'x';
              const task = taskMatch[2].trim();
              note.onboardingTasks.push({ task, completed });
            }
          } else if (detailLine.startsWith('- 📚') && collectingResources) {
            // Parse resources: - 📚 Resource Name (type)
            const resourceMatch = detailLine.match(/^- 📚\s*(.+?)\s*\((.+?)\)$/);
            if (resourceMatch) {
              const title = resourceMatch[1].trim();
              const type = resourceMatch[2].trim();
              note.resources.push({ title, url: '', type });
            }
          } else if (collectingNotes && detailLine && !detailLine.startsWith('**')) {
            // Continue collecting notes content
            notesContent += (notesContent ? '\n' : '') + detailLine;
          }
          j++;
        }

        if (notesContent) {
          note.notes = notesContent;
        }

        if (note.newHireName) {
          data.onboardingNotes.push(note);
          i = j - 1; // Skip processed lines
        }
      }
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: `Parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Specification document markdown parser
export const parseSpecMarkdownContent = (content: string) => {
  try {
    // Validate input
    if (!content || typeof content !== 'string') {
      throw new Error('Content must be a non-empty string');
    }

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

    const lines = content.split('\n');
    let currentSection = '';
    let currentSubsection = '';

    // Extract project name from title
    const titleMatch = content.match(/^# (.+?) - (?:Project )?Specification/m);
    if (titleMatch && titleMatch[1]) {
      data.projectOverview.name = titleMatch[1].trim();
    }

    // Parse content line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim() || '';
      
      if (!line) continue;

      // Section headers
      if (line.startsWith('## ')) {
        currentSection = line.replace('## ', '').trim();
        currentSubsection = '';
        continue;
      }

      // Subsection headers  
      if (line.startsWith('### ')) {
        currentSubsection = line.replace('### ', '').trim();
        continue;
      }

      // Parse based on current section (ignore emojis, match text content)
      const sectionText = currentSection.replace(/[^\w\s]/g, '').trim().toLowerCase();
      
      if (sectionText.includes('project overview')) {
        parseSpecProjectOverview(line, data);
      } else if (sectionText.includes('functional requirements')) {
        parseSpecFunctionalRequirements(line, data, currentSubsection);
      } else if (sectionText.includes('technical requirements')) {
        parseSpecTechnicalRequirements(line, data, currentSubsection);
      } else if (sectionText.includes('api') && (sectionText.includes('specifications') || sectionText.includes('documentation'))) {
        parseSpecApiDocumentation(line, lines, i, data);
      } else if (sectionText.includes('non') && sectionText.includes('functional') && sectionText.includes('requirements')) {
        parseSpecNonFunctionalRequirements(line, data);
      } else if (sectionText.includes('roadmap') || sectionText.includes('implementation')) {
        parseSpecRoadmap(line, data, currentSubsection);
      }
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: `Parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Helper functions for parsing different sections
const parseSpecProjectOverview = (line: string, data: SpecDocumentData) => {
  if (line.startsWith('**Description:**')) {
    data.projectOverview.description = line.replace('**Description:**', '').trim();
  } else if (line.startsWith('**Purpose:**')) {
    data.projectOverview.purpose = line.replace('**Purpose:**', '').trim();
  } else if (line.startsWith('**Timeline:**')) {
    data.projectOverview.timeline = line.replace('**Timeline:**', '').trim();
  }
};

const parseSpecFunctionalRequirements = (line: string, data: SpecDocumentData, subsection: string) => {
  // Handle traditional subsection-based format
  if (subsection.includes('User Stories') && line.startsWith('- ')) {
    data.functionalRequirements.userStories.push(line.replace('- ', '').trim());
  } else if (subsection.includes('Features') && line.startsWith('- **')) {
    const featureMatch = line.match(/^- \*\*(.+?):\*\*\s*(.+)/);
    if (featureMatch) {
      data.functionalRequirements.features.push({
        id: `feat-${data.functionalRequirements.features.length + 1}`,
        name: featureMatch[1].trim(),
        description: featureMatch[2].trim(),
        priority: 'Medium' as const,
        status: 'Planned' as const
      });
    }
  } else if (subsection.includes('Acceptance Criteria') && line.startsWith('- ')) {
    data.functionalRequirements.acceptanceCriteria.push(line.replace('- ', '').trim());
  }
  
  // Handle embedded format within functional requirements section
  else if (line.startsWith('#### ')) {
    // Feature defined as a heading (e.g., "#### Environment Build and Setup")
    const featureName = line.replace('#### ', '').trim();
    data.functionalRequirements.features.push({
      id: `feat-${data.functionalRequirements.features.length + 1}`,
      name: featureName,
      description: '',
      priority: 'Medium' as const,
      status: 'Planned' as const
    });
  } else if (line.startsWith('**User Story:**')) {
    // User story field (e.g., "**User Story:** As a developer, I want...")
    const userStory = line.replace('**User Story:**', '').trim();
    data.functionalRequirements.userStories.push(userStory);
  } else if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
    // Acceptance criteria as checkboxes
    const criteria = line.replace(/^- \[[x ]\]\s*/, '').trim();
    data.functionalRequirements.acceptanceCriteria.push(criteria);
  } else if (line.startsWith('**Priority:**')) {
    // Update the priority of the last added feature
    const priority = line.replace('**Priority:**', '').trim();
    const lastFeature = data.functionalRequirements.features[data.functionalRequirements.features.length - 1];
    if (lastFeature && ['High', 'Medium', 'Low'].includes(priority)) {
      lastFeature.priority = priority as 'High' | 'Medium' | 'Low';
    } else if (lastFeature && priority === 'Critical') {
      // Map Critical to High since Critical is not in the type definition
      lastFeature.priority = 'High';
    }
  }
};

const parseSpecTechnicalRequirements = (line: string, data: SpecDocumentData, subsection: string) => {
  // Handle traditional subsection-based format
  if (subsection.includes('Architecture') && line.startsWith('**Architecture:**')) {
    data.technicalRequirements.architecture = line.replace('**Architecture:**', '').trim();
  } else if (subsection.includes('Technologies') && line.startsWith('- ')) {
    data.technicalRequirements.technologies.push(line.replace('- ', '').trim());
  } else if (subsection.includes('Infrastructure') && line.startsWith('**Infrastructure:**')) {
    data.technicalRequirements.infrastructure = line.replace('**Infrastructure:**', '').trim();
  } else if (subsection.includes('Dependencies') && line.startsWith('- ')) {
    data.technicalRequirements.dependencies.push(line.replace('- ', '').trim());
  }
  
  // Handle embedded format within technical requirements section
  else if (line.startsWith('- **')) {
    // Technology items formatted as "- **Category:** Description"
    const techMatch = line.match(/^- \*\*(.+?):\*\*\s*(.+)/);
    if (techMatch) {
      data.technicalRequirements.technologies.push(`${techMatch[1]}: ${techMatch[2]}`);
    }
  } else if (line.startsWith('**Technology Stack:**')) {
    // Section header - skip
    return;
  } else if (line.startsWith('**System Requirements:**')) {
    // Section header - skip  
    return;
  } else if (line.startsWith('**Development Environment:**')) {
    // Section header - skip
    return;
  }
};

const parseSpecApiDocumentation = (line: string, _lines: string[], _currentIndex: number, data: SpecDocumentData) => {
  if (line.startsWith('**Authentication:**')) {
    data.apis.authentication = line.replace('**Authentication:**', '').trim();
  } else if (line.startsWith('**Rate Limit:**')) {
    data.apis.rateLimit = line.replace('**Rate Limit:**', '').trim();
  }
};

const parseSpecNonFunctionalRequirements = (line: string, data: SpecDocumentData) => {
  if (line.startsWith('**Performance:**')) {
    data.nonFunctionalRequirements.performance = line.replace('**Performance:**', '').trim();
  } else if (line.startsWith('**Security:**')) {
    data.nonFunctionalRequirements.security = line.replace('**Security:**', '').trim();
  } else if (line.startsWith('**Scalability:**')) {
    data.nonFunctionalRequirements.scalability = line.replace('**Scalability:**', '').trim();
  } else if (line.startsWith('**Availability:**')) {
    data.nonFunctionalRequirements.availability = line.replace('**Availability:**', '').trim();
  }
};

const parseSpecRoadmap = (line: string, data: SpecDocumentData, subsection: string) => {
  // Handle subsection-based phases (e.g., "Phase 1: Core Infrastructure - Completed")
  if (subsection.includes('Phase ')) {
    // Extract phase info from subsection name
    const phaseMatch = subsection.match(/Phase\s+(\d+):\s*(.+?)(?:\s*-\s*(.+))?$/);
    if (phaseMatch && data.roadmap.phases.find(p => p.name === `Phase ${phaseMatch[1]}`) === undefined) {
      const phase = {
        name: `Phase ${phaseMatch[1]}`,
        description: phaseMatch[2].trim(),
        duration: phaseMatch[3]?.trim() || '',
        deliverables: [] as string[]
      };
      data.roadmap.phases.push(phase);
    }
    
    // Add deliverables or objectives to the current phase
    if (line.startsWith('**Deliverables:**') || line.startsWith('**Objectives:**')) {
      // Skip headers
      return;
    } else if (line.startsWith('- ')) {
      const currentPhase = data.roadmap.phases[data.roadmap.phases.length - 1];
      if (currentPhase) {
        currentPhase.deliverables.push(line.replace('- ', '').trim());
      }
    }
  } else if (subsection.includes('Phases') || subsection.includes('Phase')) {
    // Handle traditional phase format: **Phase 1:** Description
    if (line.startsWith('**Phase ')) {
      const phaseMatch = line.match(/\*\*Phase (\d+):\*\*\s*(.+?)(?:\s*\(Duration:\s*(.+?)\))?$/);
      if (phaseMatch) {
        const phase = {
          name: `Phase ${phaseMatch[1]}`,
          description: phaseMatch[2].trim(),
          duration: phaseMatch[3]?.trim() || '',
          deliverables: [] as string[]
        };
        data.roadmap.phases.push(phase);
      }
    } else if (line.startsWith('  - ')) {
      // Add deliverable to last phase
      const lastPhase = data.roadmap.phases[data.roadmap.phases.length - 1];
      if (lastPhase) {
        lastPhase.deliverables.push(line.replace('  - ', '').trim());
      }
    }
  } else if (subsection.includes('Milestones') || subsection.includes('Milestone')) {
    // Parse milestone: **Beta Release:** Description (Date: 2025-06-01, Dependencies: Phase 1)
    const milestoneMatch = line.match(/\*\*(.+?):\*\*\s*(.+?)(?:\s*\(Date:\s*(.+?)(?:,\s*Dependencies:\s*(.+?))?\))?$/);
    if (milestoneMatch) {
      const milestone = {
        name: milestoneMatch[1].trim(),
        description: milestoneMatch[2].trim(),
        date: milestoneMatch[3]?.trim() || '',
        dependencies: milestoneMatch[4] ? milestoneMatch[4].split(',').map(d => d.trim()).filter(Boolean) : []
      };
      data.roadmap.milestones.push(milestone);
    }
  }
};