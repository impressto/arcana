import { useState } from 'react';
import { useWizard } from '../contexts/WizardContext';
import type { SpecDocumentData } from '../types';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { updateMemoryData, memoryData, updateSpecData, specData, documentType } = useWizard();
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      setImportResult({
        success: false,
        message: 'Please select a valid Markdown (.md) file'
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const content = await file.text();
      const parsedData = documentType === 'spec' 
        ? parseSpecMarkdownContent(content)
        : parseMemoryMarkdownContent(content);

      if (parsedData.success && parsedData.data) {
        // Merge with existing data or replace
        const shouldMerge = window.confirm(
          'Do you want to merge with existing data? Click OK to merge, Cancel to replace all data.'
        );

        if (documentType === 'memory') {
          const memoryDocData = parsedData.data as any; // Memory document data
          if (shouldMerge) {
            // Merge arrays for memory document
            if (memoryDocData.decisionLog) {
              updateMemoryData('decisionLog', [...memoryData.decisionLog, ...memoryDocData.decisionLog]);
            }
            if (memoryDocData.glossary) {
              updateMemoryData('glossary', [...memoryData.glossary, ...memoryDocData.glossary]);
            }
            if (memoryDocData.meetingNotes) {
              updateMemoryData('meetingNotes', [...memoryData.meetingNotes, ...memoryDocData.meetingNotes]);
            }
            if (memoryDocData.lessonsLearned) {
              updateMemoryData('lessonsLearned', [...memoryData.lessonsLearned, ...memoryDocData.lessonsLearned]);
            }
            if (memoryDocData.onboardingNotes) {
              updateMemoryData('onboardingNotes', [...memoryData.onboardingNotes, ...memoryDocData.onboardingNotes]);
            }
            
            // Update project info if it's not empty
            if (memoryDocData.projectInfo && (memoryDocData.projectInfo.name || memoryDocData.projectInfo.description)) {
              updateMemoryData('projectInfo', memoryDocData.projectInfo);
            }
          } else {
            // Replace all sections
            Object.keys(memoryDocData).forEach(key => {
              updateMemoryData(key as any, memoryDocData[key]);
            });
          }
        } else {
          // Handle spec document
          const specDocData = parsedData.data as SpecDocumentData;
          if (shouldMerge) {
            // Merge arrays for spec document
            if (specDocData.functionalRequirements) {
              updateSpecData('functionalRequirements', {
                ...specData.functionalRequirements,
                userStories: [...specData.functionalRequirements.userStories, ...(specDocData.functionalRequirements.userStories || [])],
                features: [...specData.functionalRequirements.features, ...(specDocData.functionalRequirements.features || [])],
                acceptanceCriteria: [...specData.functionalRequirements.acceptanceCriteria, ...(specDocData.functionalRequirements.acceptanceCriteria || [])]
              });
            }
            if (specDocData.technicalRequirements) {
              updateSpecData('technicalRequirements', {
                ...specDocData.technicalRequirements,
                technologies: [...specData.technicalRequirements.technologies, ...(specDocData.technicalRequirements.technologies || [])],
                dependencies: [...specData.technicalRequirements.dependencies, ...(specDocData.technicalRequirements.dependencies || [])]
              });
            }
            if (specDocData.apis) {
              updateSpecData('apis', {
                ...specDocData.apis,
                endpoints: [...specData.apis.endpoints, ...(specDocData.apis.endpoints || [])]
              });
            }
            if (specDocData.roadmap) {
              updateSpecData('roadmap', {
                phases: [...specData.roadmap.phases, ...(specDocData.roadmap.phases || [])],
                milestones: [...specData.roadmap.milestones, ...(specDocData.roadmap.milestones || [])]
              });
            }
            
            // Update other sections if they have content
            if (specDocData.projectOverview && (specDocData.projectOverview.name || specDocData.projectOverview.description)) {
              updateSpecData('projectOverview', specDocData.projectOverview);
            }
            if (specDocData.nonFunctionalRequirements && (specDocData.nonFunctionalRequirements.performance || specDocData.nonFunctionalRequirements.security)) {
              updateSpecData('nonFunctionalRequirements', specDocData.nonFunctionalRequirements);
            }
          } else {
            // Replace all sections
            Object.keys(specDocData).forEach(key => {
              updateSpecData(key as any, (specDocData as any)[key]);
            });
          }
        }

        if (documentType === 'memory') {
          const memoryData = parsedData.data as any;
          setImportResult({
            success: true,
            message: `Successfully imported memory document!`,
            details: {
              decisions: memoryData.decisionLog.length,
              glossaryTerms: memoryData.glossary.length,
              meetings: memoryData.meetingNotes.length,
              lessons: memoryData.lessonsLearned.length,
              onboarding: memoryData.onboardingNotes.length,
              // Additional details for complex structures
              actionItems: memoryData.meetingNotes.reduce((sum: number, meeting: any) => 
                sum + (meeting.actionItems?.length || 0), 0),
              onboardingTasks: memoryData.onboardingNotes.reduce((sum: number, note: any) => 
                sum + (note.onboardingTasks?.length || 0), 0)
            }
          });
        } else {
          const specData = parsedData.data as SpecDocumentData;
          setImportResult({
            success: true,
            message: `Successfully imported specification document!`,
            details: {
              userStories: specData.functionalRequirements.userStories.length,
              features: specData.functionalRequirements.features.length,
              acceptanceCriteria: specData.functionalRequirements.acceptanceCriteria.length,
              technologies: specData.technicalRequirements.technologies.length,
              dependencies: specData.technicalRequirements.dependencies.length,
              endpoints: specData.apis.endpoints.length,
              phases: specData.roadmap.phases.length,
              milestones: specData.roadmap.milestones.length
            }
          });
        }
      } else {
        setImportResult({
          success: false,
          message: parsedData.error || 'Failed to parse the markdown file'
        });
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: `Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Memory document markdown parser
  const parseMemoryMarkdownContent = (content: string) => {
    try {
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
      if (titleMatch) {
        data.projectInfo.name = titleMatch[1].trim();
      }

      // Simple parsing - look for section headers and basic content
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
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
          while (j < lines.length && !lines[j].startsWith('###') && !lines[j].startsWith('##')) {
            const detailLine = lines[j].trim();
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
          const titleWithDate = line.replace('### ', '').trim();
          const titleMatch = titleWithDate.match(/^(.+?)\s*-\s*(.+)$/);
          const title = titleMatch ? titleMatch[1].trim() : titleWithDate;
          const date = titleMatch ? titleMatch[2].trim() : '';

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
            } else if (detailLine.startsWith('**Notes:**')) {
              currentMeetingSection = 'notes';
              collectingNotes = true;
              const notes = detailLine.replace('**Notes:**', '').trim();
              if (notes) {
                notesContent = notes;
              }
            } else if (detailLine.startsWith('**Action Items:**')) {
              currentMeetingSection = 'actionItems';
              if (notesContent) {
                meeting.notes = notesContent;
                collectingNotes = false;
              }
            } else if (detailLine.startsWith('- ') && currentMeetingSection === 'agenda') {
              meeting.agenda.push(detailLine.replace('- ', '').trim());
            } else if (detailLine.match(/^- \[[ x]\]/)) {
              // Parse action items: - [x] Task (Assignee - Due: Date)
              const actionMatch = detailLine.match(/^- \[([x ])\]\s*(.+?)(?:\s*\((.+?)\s*-\s*Due:\s*(.+?)\))?$/);
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
              }
            } else if (collectingNotes && detailLine && !detailLine.startsWith('**')) {
              // Continue collecting notes content
              notesContent += (notesContent ? '\n' : '') + detailLine;
            }
            j++;
          }

          if (notesContent && !meeting.notes) {
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
            } else if (detailLine.startsWith('**Impact:**')) {
              const impact = detailLine.replace('**Impact:**', '').trim().toLowerCase();
              lesson.impact = ['low', 'high'].includes(impact) ? impact : 'medium';
            } else if (detailLine.startsWith('**Situation:**')) {
              lesson.situation = detailLine.replace('**Situation:**', '').trim();
            } else if (detailLine.startsWith('**Lesson:**')) {
              lesson.lesson = detailLine.replace('**Lesson:**', '').trim();
            } else if (detailLine.startsWith('**Application:**')) {
              lesson.application = detailLine.replace('**Application:**', '').trim();
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
            } else if (detailLine.startsWith('**Onboarding Tasks')) {
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
              const notesText = detailLine.replace('**Notes:**', '').trim();
              if (notesText) {
                notesContent = notesText;
              }
            } else if (detailLine.match(/^- \[[ x]\]/) && collectingTasks) {
              // Parse tasks: - [x] Task name
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
  const parseSpecMarkdownContent = (content: string) => {
    try {
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
      if (titleMatch) {
        data.projectOverview.name = titleMatch[1].trim();
      }

      // Parse content line by line
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
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
        error: `Spec parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };

  // Helper functions for spec parsing
  const parseSpecProjectOverview = (line: string, data: SpecDocumentData) => {
    if (line.startsWith('**Description:**')) {
      data.projectOverview.description = line.replace('**Description:**', '').trim();
    } else if (line.startsWith('**Purpose:**')) {
      data.projectOverview.purpose = line.replace('**Purpose:**', '').trim();
    } else if (line.startsWith('**Timeline:**')) {
      data.projectOverview.timeline = line.replace('**Timeline:**', '').trim();
    } else if (line.startsWith('**Stakeholders:**')) {
      const stakeholders = line.replace('**Stakeholders:**', '').trim();
      data.projectOverview.stakeholders = stakeholders.split(',').map(s => s.trim()).filter(Boolean);
    }
  };

  const parseSpecFunctionalRequirements = (line: string, data: SpecDocumentData, subsection: string) => {
    if (subsection.includes('User Stories') && line.startsWith('- ')) {
      data.functionalRequirements.userStories.push(line.replace('- ', '').trim());
    } else if (subsection.includes('Acceptance Criteria') && line.startsWith('- ')) {
      data.functionalRequirements.acceptanceCriteria.push(line.replace('- ', '').trim());
    } else if (subsection.includes('Features') && line.startsWith('**') && line.includes(':**')) {
      // Parse feature: **Feature Name:** Description (Priority: High, Status: Planned)
      const featureMatch = line.match(/\*\*(.+?):\*\*\s*(.+?)(?:\s*\(Priority:\s*(.+?),\s*Status:\s*(.+?)\))?$/);
      if (featureMatch) {
        const feature = {
          id: Date.now().toString() + Math.random(),
          name: featureMatch[1].trim(),
          description: featureMatch[2].trim(),
          priority: (featureMatch[3]?.trim() as any) || 'Medium',
          status: (featureMatch[4]?.trim() as any) || 'Planned'
        };
        data.functionalRequirements.features.push(feature);
      }
    }
  };

  const parseSpecTechnicalRequirements = (line: string, data: SpecDocumentData, subsection: string) => {
    if (line.startsWith('**Architecture:**')) {
      data.technicalRequirements.architecture = line.replace('**Architecture:**', '').trim();
    } else if (line.startsWith('**Infrastructure:**')) {
      data.technicalRequirements.infrastructure = line.replace('**Infrastructure:**', '').trim();
    } else if (subsection.includes('Technologies') && line.startsWith('- ')) {
      data.technicalRequirements.technologies.push(line.replace('- ', '').trim());
    } else if (subsection.includes('Dependencies') && line.startsWith('- ')) {
      data.technicalRequirements.dependencies.push(line.replace('- ', '').trim());
    }
  };

  const parseSpecApiDocumentation = (line: string, lines: string[], index: number, data: SpecDocumentData) => {
    if (line.startsWith('**🔐 Authentication:**')) {
      data.apis.authentication = line.replace('**🔐 Authentication:**', '').trim();
    } else if (line.startsWith('**⚡ Rate Limiting:**')) {
      data.apis.rateLimit = line.replace('**⚡ Rate Limiting:**', '').trim();
    } else if (line.startsWith('#### `') && line.includes('`')) {
      // Parse endpoint: #### `GET` /api/users
      const endpointMatch = line.match(/####\s*`(\w+)`\s*(.+)/);
      if (endpointMatch) {
        const endpoint = {
          method: endpointMatch[1] as any,
          path: endpointMatch[2].trim(),
          description: '',
          parameters: [],
          response: ''
        };
        
        // Look ahead for endpoint details
        let j = index + 1;
        while (j < lines.length && !lines[j].startsWith('####') && !lines[j].startsWith('##')) {
          const detailLine = lines[j].trim();
          if (detailLine && !detailLine.startsWith('**')) {
            endpoint.description = detailLine;
            break;
          }
          j++;
        }
        
        data.apis.endpoints.push(endpoint);
      }
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
      // Parse phase: **Phase 1 - Foundation:** Description (Duration: 3 months)
      const phaseMatch = line.match(/\*\*(.+?):\*\*\s*(.+?)(?:\s*\(Duration:\s*(.+?)\))?$/);
      if (phaseMatch) {
        const phase = {
          name: phaseMatch[1].trim(),
          description: phaseMatch[2].trim(),
          duration: phaseMatch[3]?.trim() || '',
          deliverables: []
        };
        data.roadmap.phases.push(phase);
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
          dependencies: milestoneMatch[4]?.split(',').map(d => d.trim()).filter(Boolean) || []
        };
        data.roadmap.milestones.push(milestone);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div id="import-modal-overlay" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div id="import-modal" className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        <div id="import-modal-header" className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 id="import-modal-title" className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Upload id="import-modal-icon" className="w-5 h-5" />
            Import {documentType === 'spec' ? 'Specification' : 'Memory'} Document
          </h2>
          <button
            id="import-modal-close"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div id="import-modal-content" className="p-6 flex-1 overflow-y-auto">
          <div id="import-instructions" className="mb-4">
            <p id="import-description" className="text-gray-600 text-sm mb-4">
              Import a previously exported {documentType === 'spec' ? 'specification' : 'memory'} document (.md file) to populate the wizard fields.
            </p>
            
            <div id="file-drop-zone" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <FileText id="file-icon" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div id="file-upload-section" className="mb-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span id="file-upload-text" className="text-blue-600 hover:text-blue-700 font-medium">
                    Choose a markdown file
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".md"
                    onChange={handleFileUpload}
                    disabled={isImporting}
                    className="hidden"
                  />
                </label>
                <p id="drag-drop-text" className="text-gray-500 text-sm mt-1">
                  or drag and drop your .md file here
                </p>
              </div>
            </div>
            
            {/* Sample File Links */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Try a Sample File
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                Want to test the import functionality? Download one of our sample files and then import it above.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                {documentType === 'spec' ? (
                  <a
                    href="https://impressto.ca/arcana/public/sample-spec-document.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    📄 Download Sample Spec Document
                  </a>
                ) : (
                  <a
                    href="https://impressto.ca/arcana/public/sample-memory-document.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    📄 Download Sample Memory Document
                  </a>
                )}
                <span className="text-xs text-blue-600 self-center">
                  Right-click → "Save As" to download
                </span>
              </div>
            </div>
          </div>

          {isImporting && (
            <div id="import-loading" className="flex items-center justify-center py-4">
              <div id="import-spinner" className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span id="import-loading-text" className="ml-2 text-gray-600">Importing...</span>
            </div>
          )}

          {importResult && (
            <div id="import-result" className={`p-4 rounded-lg ${
              importResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div id="import-result-content" className="flex items-start gap-2">
                {importResult.success ? (
                  <CheckCircle id="import-success-icon" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle id="import-error-icon" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div id="import-result-text" className="flex-1">
                  <p id="import-result-message" className={`font-medium ${
                    importResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {importResult.message}
                  </p>
                  {importResult.success && importResult.details && (
                    <div id="import-details" className="mt-2 text-sm text-green-700">
                      <p id="import-details-title">Imported items:</p>
                      <ul id="import-details-list" className="list-disc list-inside mt-1 space-y-1">
                        {documentType === 'memory' ? (
                          <>
                            {importResult.details.decisions > 0 && (
                              <li>{importResult.details.decisions} decision(s)</li>
                            )}
                            {importResult.details.glossaryTerms > 0 && (
                              <li>{importResult.details.glossaryTerms} glossary term(s)</li>
                            )}
                            {importResult.details.meetings > 0 && (
                              <li>{importResult.details.meetings} meeting note(s)</li>
                            )}
                            {importResult.details.lessons > 0 && (
                              <li>{importResult.details.lessons} lesson(s) learned</li>
                            )}
                            {importResult.details.onboarding > 0 && (
                              <li>{importResult.details.onboarding} onboarding note(s)</li>
                            )}
                            {importResult.details.actionItems > 0 && (
                              <li>{importResult.details.actionItems} action item(s)</li>
                            )}
                            {importResult.details.onboardingTasks > 0 && (
                              <li>{importResult.details.onboardingTasks} onboarding task(s)</li>
                            )}
                          </>
                        ) : (
                          <>
                            {importResult.details.userStories > 0 && (
                              <li>{importResult.details.userStories} user stor{importResult.details.userStories === 1 ? 'y' : 'ies'}</li>
                            )}
                            {importResult.details.features > 0 && (
                              <li>{importResult.details.features} feature(s)</li>
                            )}
                            {importResult.details.acceptanceCriteria > 0 && (
                              <li>{importResult.details.acceptanceCriteria} acceptance criteria</li>
                            )}
                            {importResult.details.technologies > 0 && (
                              <li>{importResult.details.technologies} technolog{importResult.details.technologies === 1 ? 'y' : 'ies'}</li>
                            )}
                            {importResult.details.dependencies > 0 && (
                              <li>{importResult.details.dependencies} dependenc{importResult.details.dependencies === 1 ? 'y' : 'ies'}</li>
                            )}
                            {importResult.details.endpoints > 0 && (
                              <li>{importResult.details.endpoints} API endpoint(s)</li>
                            )}
                            {importResult.details.phases > 0 && (
                              <li>{importResult.details.phases} roadmap phase(s)</li>
                            )}
                            {importResult.details.milestones > 0 && (
                              <li>{importResult.details.milestones} milestone(s)</li>
                            )}
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div id="import-modal-footer" className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
          <button
            id="import-modal-close-button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
