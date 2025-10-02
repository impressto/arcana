import { useState } from 'react';
import { useWizard } from '../contexts/WizardContext';
import type { SpecDocumentData } from '../types';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { parseSpecMarkdownContent, parseMemoryMarkdownContent } from '../utils/markdownParsers';

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
