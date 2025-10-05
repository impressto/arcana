import { useState } from 'react';
import { useWizard } from '../contexts/WizardContext';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { importDocument, documentType } = useWizard();
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
      
      // Determine document type from content or use current selection
      let detectedType = documentType;
      if (!detectedType) {
        // Try to detect from content
        if (content.includes('Memory Document') || content.includes('Decision Log') || content.includes('Glossary')) {
          detectedType = 'memory';
        } else if (content.includes('Technical Specification') || content.includes('Functional Requirements')) {
          detectedType = 'spec';
        } else {
          // Default to spec if uncertain
          detectedType = 'spec';
        }
      }

      // Use the new enhanced import system
      importDocument(content, detectedType);

      setImportResult({
        success: true,
        message: 'Document imported successfully with full content preservation!',
      });

      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setImportResult({
        success: false,
        message: 'Error reading file: ' + (error as Error).message
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
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
