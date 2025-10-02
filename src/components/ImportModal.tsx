import { useState } from 'react';
import { useWizard } from '../contexts/WizardContext';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { updateMemoryData, memoryData } = useWizard();
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
      const parsedData = parseMarkdownContent(content);

      if (parsedData.success && parsedData.data) {
        // Merge with existing data or replace
        const shouldMerge = window.confirm(
          'Do you want to merge with existing data? Click OK to merge, Cancel to replace all data.'
        );

        if (shouldMerge) {
          // Merge arrays
          updateMemoryData('decisionLog', [...memoryData.decisionLog, ...parsedData.data.decisionLog]);
          updateMemoryData('glossary', [...memoryData.glossary, ...parsedData.data.glossary]);
          updateMemoryData('meetingNotes', [...memoryData.meetingNotes, ...parsedData.data.meetingNotes]);
          updateMemoryData('lessonsLearned', [...memoryData.lessonsLearned, ...parsedData.data.lessonsLearned]);
          updateMemoryData('onboardingNotes', [...memoryData.onboardingNotes, ...parsedData.data.onboardingNotes]);
          
          // Update project info if it's not empty
          if (parsedData.data.projectInfo.name || parsedData.data.projectInfo.description) {
            updateMemoryData('projectInfo', parsedData.data.projectInfo);
          }
        } else {
          // Replace all sections
          Object.keys(parsedData.data).forEach(key => {
            updateMemoryData(key as any, (parsedData.data as any)[key]);
          });
        }

        setImportResult({
          success: true,
          message: `Successfully imported memory document!`,
          details: {
            decisions: parsedData.data.decisionLog.length,
            glossaryTerms: parsedData.data.glossary.length,
            meetings: parsedData.data.meetingNotes.length,
            lessons: parsedData.data.lessonsLearned.length,
            onboarding: parsedData.data.onboardingNotes.length,
            // Additional details for complex structures
            actionItems: parsedData.data.meetingNotes.reduce((sum: number, meeting: any) => 
              sum + (meeting.actionItems?.length || 0), 0),
            onboardingTasks: parsedData.data.onboardingNotes.reduce((sum: number, note: any) => 
              sum + (note.onboardingTasks?.length || 0), 0)
          }
        });
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

  // Simple markdown parser - basic implementation
  const parseMarkdownContent = (content: string) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Memory Document
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-4">
              Import a previously exported memory document (.md file) to populate the wizard fields.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="mb-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
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
                <p className="text-gray-500 text-sm mt-1">
                  or drag and drop your .md file here
                </p>
              </div>
            </div>
          </div>

          {isImporting && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Importing...</span>
            </div>
          )}

          {importResult && (
            <div className={`p-4 rounded-lg ${
              importResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-2">
                {importResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    importResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {importResult.message}
                  </p>
                  {importResult.success && importResult.details && (
                    <div className="mt-2 text-sm text-green-700">
                      <p>Imported items:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
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
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
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
