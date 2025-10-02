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
      
      // Parse project info
      if (currentSection.includes('Project Information')) {
        if (line.startsWith('**Description:**')) {
          data.projectInfo.description = line.replace('**Description:**', '').trim();
        } else if (line.startsWith('**Team:**')) {
          const teamText = line.replace('**Team:**', '').trim();
          data.projectInfo.team = teamText.split(',').map(member => member.trim()).filter(Boolean);
        }
      }

      // Basic glossary parsing
      if (currentSection.includes('Glossary') && line.startsWith('**') && line.includes(':**')) {
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
      if (currentSection.includes('Decision Log') && line.startsWith('### ') && !line.includes('No decisions')) {
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
      if (currentSection.includes('Meeting Notes') && line.startsWith('### ') && !line.includes('No meeting')) {
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
            meeting.actionItems.push({
              item: detailLine.replace('- ', '').trim(),
              assignee: '',
              dueDate: '',
              status: 'pending'
            });
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
      if (currentSection.includes('Lessons Learned') && line.startsWith('### ') && !line.includes('No lessons')) {
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
      if (currentSection.includes('Onboarding Notes') && line.startsWith('### ') && !line.includes('New team member')) {
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

      // Parse based on current section
      switch (currentSection) {
        case '📋 Project Overview':
          parseSpecProjectOverview(line, data);
          break;
        
        case '🎯 Functional Requirements':
          parseSpecFunctionalRequirements(line, data, currentSubsection);
          break;
        
        case '⚙️ Technical Requirements':
          parseSpecTechnicalRequirements(line, data, currentSubsection);
          break;
        
        case '🔌 API Documentation':
          parseSpecApiDocumentation(line, lines, i, data);
          break;
        
        case '📊 Non-Functional Requirements':
          parseSpecNonFunctionalRequirements(line, data);
          break;
        
        case '🗓️ Roadmap':
          parseSpecRoadmap(line, data, currentSubsection);
          break;
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
};

const parseSpecTechnicalRequirements = (line: string, data: SpecDocumentData, subsection: string) => {
  if (subsection.includes('Architecture') && line.startsWith('**Architecture:**')) {
    data.technicalRequirements.architecture = line.replace('**Architecture:**', '').trim();
  } else if (subsection.includes('Technologies') && line.startsWith('- ')) {
    data.technicalRequirements.technologies.push(line.replace('- ', '').trim());
  } else if (subsection.includes('Infrastructure') && line.startsWith('**Infrastructure:**')) {
    data.technicalRequirements.infrastructure = line.replace('**Infrastructure:**', '').trim();
  } else if (subsection.includes('Dependencies') && line.startsWith('- ')) {
    data.technicalRequirements.dependencies.push(line.replace('- ', '').trim());
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
  if (subsection.includes('Phases') || subsection.includes('Phase')) {
    if (line.startsWith('**Phase ')) {
      // Parse phase: **Phase 1:** Description (Duration: 3 months)
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