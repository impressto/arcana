import type { MemoryDocumentData } from '../types';

export interface ParsedMemoryDocument {
  success: boolean;
  data?: MemoryDocumentData;
  error?: string;
}

export function parseMemoryDocumentMarkdown(markdown: string): ParsedMemoryDocument {
  try {
    const lines = markdown.split('\n');
    
    // Initialize the data structure
    const data: MemoryDocumentData = {
      projectInfo: {
        name: '',
        description: '',
        team: []
      },
      decisionLog: [],
      glossary: [],
      meetingNotes: [],
      lessonsLearned: [],
      onboardingNotes: []
    };

    let currentSection = '';
    let currentSubsection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;

      // Main sections
      if (line.startsWith('# ')) {
        const title = line.replace('# ', '').trim();
        if (title.includes('Memory Document')) {
          // Extract project name from title
          const match = title.match(/^(.+?)\s*-?\s*Memory Document/);
          if (match) {
            data.projectInfo.name = match[1].trim();
          }
        }
        continue;
      }

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
        case '📋 Project Information':
          parseProjectInfo(line, data);
          break;
        
        case '📝 Decision Log':
          parseDecisionLog(line, data, currentSubsection);
          break;
        
        case '📚 Glossary':
          parseGlossary(line, data, currentSubsection);
          break;
        
        case '🤝 Meeting Notes':
        case '📅 Meeting Notes':
          parseMeetingNotes(line, lines, i, data, currentSubsection);
          break;
        
        case '💡 Lessons Learned':
        case '🎓 Lessons Learned':
          parseLessonsLearned(line, lines, i, data, currentSubsection);
          break;
        
        case '👥 Onboarding Notes':
        case '🚀 Onboarding Notes':
          parseOnboardingNotes(line, lines, i, data, currentSubsection);
          break;
      }
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to parse markdown: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

function parseProjectInfo(line: string, data: MemoryDocumentData) {
  if (line.startsWith('**Description:**')) {
    data.projectInfo.description = line.replace('**Description:**', '').trim();
  } else if (line.startsWith('**Team:**')) {
    const teamText = line.replace('**Team:**', '').trim();
    data.projectInfo.team = teamText.split(',').map(member => member.trim()).filter(Boolean);
  }
}

function parseDecisionLog(line: string, data: MemoryDocumentData, subsection: string) {
  // Decision titles are subsections
  if (subsection && !subsection.includes('No decisions')) {
    // Find or create decision entry
    let decision = data.decisionLog.find(d => d.title === subsection);
    if (!decision) {
      decision = {
        title: subsection,
        description: '',
        date: '',
        rationale: '',
        stakeholders: [],
        impact: '',
        alternatives: [],
        status: 'decided' as const
      };
      data.decisionLog.push(decision);
    }

    // Parse decision fields
    if (line.startsWith('**Date:**')) {
      decision.date = line.replace('**Date:**', '').trim();
    } else if (line.startsWith('**Status:**')) {
      const status = line.replace('**Status:**', '').trim().toLowerCase();
      decision.status = (status === 'pending' || status === 'revisit') ? status as any : 'decided';
    } else if (line.startsWith('**Description:**')) {
      decision.description = line.replace('**Description:**', '').trim();
    } else if (line.startsWith('**Rationale:**')) {
      decision.rationale = line.replace('**Rationale:**', '').trim();
    } else if (line.startsWith('**Impact:**')) {
      decision.impact = line.replace('**Impact:**', '').trim();
    } else if (line.startsWith('**Stakeholders:**')) {
      const stakeholders = line.replace('**Stakeholders:**', '').trim();
      decision.stakeholders = stakeholders.split(',').map(s => s.trim()).filter(Boolean);
    } else if (line.startsWith('**Alternatives:**')) {
      const alternatives = line.replace('**Alternatives:**', '').trim();
      decision.alternatives = alternatives.split(',').map(a => a.trim()).filter(Boolean);
    }
  }
}

function parseGlossary(line: string, data: MemoryDocumentData, subsection: string) {
  // Glossary entries are in format: **Term:** Definition
  if (line.startsWith('**') && line.includes(':**')) {
    const match = line.match(/\*\*(.+?):\*\*\s*(.+)/);
    if (match) {
      const term = match[1].trim();
      const definition = match[2].trim();
      
      // Extract category from subsection if it exists
      let category = '';
      if (subsection && !subsection.includes('No terms')) {
        category = subsection;
      }
      
      data.glossary.push({
        term,
        definition,
        category
      });
    }
  }
}

function parseMeetingNotes(line: string, lines: string[], index: number, data: MemoryDocumentData, subsection: string) {
  if (subsection && !subsection.includes('No meeting notes')) {
    // Parse meeting title with date
    const titleMatch = subsection.match(/^(.+?)\s*-\s*(.+)$/);
    const title = titleMatch ? titleMatch[1].trim() : subsection;
    const date = titleMatch ? titleMatch[2].trim() : '';

    // Find or create meeting note
    let meeting = data.meetingNotes.find(m => m.title === title);
    if (!meeting) {
      meeting = {
        title,
        date,
        attendees: [],
        agenda: [],
        notes: '',
        actionItems: []
      };
      data.meetingNotes.push(meeting);
    }

    // Parse meeting fields
    if (line.startsWith('**Attendees:**')) {
      const attendees = line.replace('**Attendees:**', '').trim();
      meeting.attendees = attendees.split(',').map(a => a.trim()).filter(Boolean);
    } else if (line.startsWith('**Agenda:**')) {
      // Skip the header, agenda items are in following lines
    } else if (line.startsWith('- ') && meeting.agenda !== undefined) {
      // Check if we're in agenda section by looking at previous lines context
      const prevLines = lines.slice(Math.max(0, index - 5), index);
      if (prevLines.some(l => l.includes('**Agenda:**'))) {
        meeting.agenda.push(line.replace('- ', '').trim());
      }
    } else if (line.startsWith('**Notes:**')) {
      // Get the content after Notes:
      meeting.notes = line.replace('**Notes:**', '').trim();
    } else if (line.startsWith('**Action Items:**')) {
      // Skip header, action items follow
    } else if (line.match(/^- \[[ x]\]/)) {
      // Parse action items: - [x] Task (Assignee - Date) or - [x] Task (Assignee - Due: Date)
      const actionMatch = line.match(/^- \[([x ])\]\s*(.+?)(?:\s*\((.+?)\s*-\s*(?:Due:\s*)?(.+?)\))?$/);
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
    }
  }
}

function parseLessonsLearned(line: string, _lines: string[], _index: number, data: MemoryDocumentData, subsection: string) {
  if (subsection && !subsection.includes('No lessons')) {
    // Find or create lesson entry
    let lesson = data.lessonsLearned.find(l => l.title === subsection);
    if (!lesson) {
      lesson = {
        title: subsection,
        date: '',
        category: '',
        situation: '',
        lesson: '',
        application: '',
        impact: 'medium' as const
      };
      data.lessonsLearned.push(lesson);
    }

    // Parse lesson fields
    if (line.startsWith('**Date:**')) {
      lesson.date = line.replace('**Date:**', '').trim();
    } else if (line.startsWith('**Category:**')) {
      lesson.category = line.replace('**Category:**', '').trim();
    } else if (line.startsWith('**Impact:**')) {
      const impact = line.replace('**Impact:**', '').trim().toLowerCase();
      lesson.impact = (impact === 'low' || impact === 'high') ? impact as any : 'medium';
    } else if (line.startsWith('**Situation:**')) {
      lesson.situation = line.replace('**Situation:**', '').trim();
    } else if (line.startsWith('**Lesson:**')) {
      lesson.lesson = line.replace('**Lesson:**', '').trim();
    } else if (line.startsWith('**Application:**')) {
      lesson.application = line.replace('**Application:**', '').trim();
    }
  }
}

function parseOnboardingNotes(line: string, _lines: string[], _index: number, data: MemoryDocumentData, subsection: string) {
  if (subsection && !subsection.includes('New team member')) {
    // Parse name and role from subsection: "John Doe - Developer"
    const match = subsection.match(/^(.+?)\s*-\s*(.+)$/);
    const newHireName = match ? match[1].trim() : subsection;
    const role = match ? match[2].trim() : '';

    // Find or create onboarding note
    let note = data.onboardingNotes.find(n => n.newHireName === newHireName);
    if (!note) {
      note = {
        id: Date.now().toString() + Math.random(),
        newHireName,
        role,
        startDate: '',
        mentor: '',
        department: '',
        status: 'in-progress' as const,
        onboardingTasks: [],
        resources: [],
        feedback: '',
        completionDate: '',
        notes: ''
      };
      data.onboardingNotes.push(note);
    }

    // Parse onboarding fields
    if (line.startsWith('**Status:**')) {
      const status = line.replace('**Status:**', '').trim().toLowerCase().replace(' ', '-');
      note.status = (status === 'completed' || status === 'on-hold') ? status as any : 'in-progress';
    } else if (line.startsWith('**Department:**')) {
      note.department = line.replace('**Department:**', '').trim();
    } else if (line.startsWith('**Start Date:**')) {
      note.startDate = line.replace('**Start Date:**', '').trim();
    } else if (line.startsWith('**Mentor:**')) {
      note.mentor = line.replace('**Mentor:**', '').trim();
    } else if (line.startsWith('**Notes:**')) {
      note.notes = line.replace('**Notes:**', '').trim();
    } else if (line.match(/^- \[[ x]\]/)) {
      // Parse tasks: - [x] Task name
      const taskMatch = line.match(/^- \[([x ])\]\s*(.+)$/);
      if (taskMatch) {
        const completed = taskMatch[1] === 'x';
        const task = taskMatch[2].trim();
        note.onboardingTasks.push({ task, completed });
      }
    } else if (line.startsWith('- 📚')) {
      // Parse resources: - 📚 Resource Name (type)
      const resourceMatch = line.match(/^- 📚\s*(.+?)\s*\((.+?)\)$/);
      if (resourceMatch) {
        const title = resourceMatch[1].trim();
        const type = resourceMatch[2].trim();
        note.resources.push({ title, url: '', type });
      }
    }
  }
}

export function exportMemoryDocumentMarkdown(data: MemoryDocumentData): string {
  // This would contain the same logic as the existing markdown export
  // from PreviewStep.tsx - extracting it for reuse
  let markdown = `# ${data.projectInfo.name || 'Project'} - Memory Document\n\n`;
  
  // Add the rest of the export logic here
  // (This is the same logic that's currently in PreviewStep.tsx)
  
  return markdown;
}
