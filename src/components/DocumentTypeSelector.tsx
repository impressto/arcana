import React from 'react';
import { FileText, BookOpen } from 'lucide-react';
import { useWizard } from '../contexts/WizardContext';
import type { DocumentType } from '../types';

export const DocumentTypeSelector: React.FC = () => {
  const { setDocumentType, resetWizard } = useWizard();
  
  // Check if there's saved progress
  const savedData = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('arcana-state');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const hasSavedProgress = savedData && savedData.documentType;

  const documentTypes = [
    {
      type: 'spec' as DocumentType,
      title: 'Specification Document',
      description: 'Create technical and functional requirements documentation',
      icon: FileText,
      features: [
        'Project Overview',
        'Functional Requirements',
        'Technical Architecture',
        'API Documentation',
        'Non-Functional Requirements',
        'Project Roadmap'
      ]
    },
    {
      type: 'memory' as DocumentType,
      title: 'Memory Document',
      description: 'Create organizational knowledge and decision documentation',
      icon: BookOpen,
      features: [
        'Decision Log',
        'Glossary & Terms',
        'Meeting Notes',
        'Lessons Learned',
        'Onboarding Guide'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Arcana
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the type of documentation you want to create. Arcana will guide you through 
            each step to create professional, comprehensive documentation.
          </p>
        </div>

        {hasSavedProgress && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-blue-600 mr-3">
                    💾
                  </div>
                  <div>
                    <h3 className="text-blue-900 font-medium">
                      Resume Previous Session
                    </h3>
                    <p className="text-blue-700 text-sm">
                      You have saved progress for a {savedData.documentType} document. You can continue where you left off.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDocumentType(savedData.documentType)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to start over? This will delete your saved progress.')) {
                        resetWizard();
                      }
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {documentTypes.map((docType) => {
            const IconComponent = docType.icon;
            return (
              <div
                key={docType.type}
                className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                onClick={() => setDocumentType(docType.type)}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                    <IconComponent className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {docType.title}
                  </h3>
                  <p className="text-gray-600">
                    {docType.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                    Includes:
                  </h4>
                  <ul className="space-y-2">
                    {docType.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button className="btn-primary w-full group-hover:bg-primary-700">
                    Start {docType.title}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Both document types support markdown export and professional formatting
          </p>
        </div>
      </div>
    </div>
  );
};
