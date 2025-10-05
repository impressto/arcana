import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  DocumentType,
  WizardStep,
  SpecDocumentData,
  MemoryDocumentData,
  WizardContextType,
  PreservedDocument,
} from '../types';
import { DocumentPreservationSystem } from '../utils/documentPreservationSystem';

// URL hash management
const parseHashUrl = () => {
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash || hash === '/') {
    return { documentType: null, step: 0 };
  }
  
  const parts = hash.split('/').filter(Boolean);
  const docType = parts[0];
  const step = parts[1] ? parseInt(parts[1], 10) : 0;
  
  if (docType === 'spec' || docType === 'memory') {
    return { 
      documentType: docType as DocumentType, 
      step: isNaN(step) ? 0 : Math.max(0, step)
    };
  }
  
  return { documentType: null, step: 0 };
};

const updateHashUrl = (documentType: DocumentType | null, step: number = 0) => {
  if (!documentType) {
    window.history.replaceState(null, '', '#/');
  } else {
    const url = step > 0 ? `#/${documentType}/${step}` : `#/${documentType}`;
    window.history.replaceState(null, '', url);
  }
};

// localStorage key
const STORAGE_KEY = 'arcana-state';

// localStorage helper functions
let saveTimeout: number | null = null;
let lastSaveNotification = 0;

const saveToStorage = (data: any, showNotification = false) => {
  try {
    // Clear any existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Debounce the save operation
    saveTimeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      // Show notification only occasionally (every 30 seconds max) and if requested
      const now = Date.now();
      if (showNotification && now - lastSaveNotification > 30000) {
        if ((window as any).showToast) {
          (window as any).showToast('Progress saved', 'success');
          lastSaveNotification = now;
        }
      }
    }, 500); // 500ms debounce
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
    if ((window as any).showToast) {
      (window as any).showToast('Failed to save progress', 'error');
    }
  }
};

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return null;
  }
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
};

// Default data structures
const defaultSpecData: SpecDocumentData = {
  projectOverview: {
    name: '',
    description: '',
    purpose: '',
    stakeholders: [],
    timeline: '',
  },
  functionalRequirements: {
    userStories: [],
    features: [],
    acceptanceCriteria: [],
  },
  technicalRequirements: {
    architecture: '',
    technologies: [],
    infrastructure: '',
    dependencies: [],
  },
  apis: {
    endpoints: [],
    authentication: '',
    rateLimit: '',
  },
  nonFunctionalRequirements: {
    performance: '',
    security: '',
    scalability: '',
    availability: '',
  },
  roadmap: {
    phases: [],
    milestones: [],
  },
};

const defaultMemoryData: MemoryDocumentData = {
  projectInfo: {
    name: '',
    description: '',
    team: [],
  },
  decisionLog: [],
  glossary: [],
  meetingNotes: [],
  lessonsLearned: [],
  onboardingNotes: [],
};

// Step definitions for each document type
const specSteps: WizardStep[] = [
  { id: 'overview', title: 'Project Overview', description: 'Basic project information', completed: false },
  { id: 'functional', title: 'Functional Requirements', description: 'Features and user stories', completed: false },
  { id: 'technical', title: 'Technical Requirements', description: 'Architecture and technologies', completed: false },
  { id: 'apis', title: 'APIs', description: 'API endpoints and documentation', completed: false },
  { id: 'nonfunctional', title: 'Non-Functional Requirements', description: 'Performance, security, etc.', completed: false },
  { id: 'roadmap', title: 'Roadmap', description: 'Project phases and milestones', completed: false },
  { id: 'preview', title: 'Preview & Export', description: 'Review and export document', completed: false },
];

const memorySteps: WizardStep[] = [
  { id: 'project-info', title: 'Project Info', description: 'Basic project information', completed: false },
  { id: 'decisions', title: 'Decision Log', description: 'Important decisions made', completed: false },
  { id: 'glossary', title: 'Glossary', description: 'Terms and definitions', completed: false },
  { id: 'meetings', title: 'Meeting Notes', description: 'Meeting records and action items', completed: false },
  { id: 'lessons', title: 'Lessons Learned', description: 'Key insights and learnings', completed: false },
  { id: 'onboarding', title: 'Onboarding Notes', description: 'New team member guidance', completed: false },
  { id: 'preview', title: 'Preview & Export', description: 'Review and export document', completed: false },
];

const WizardContext = createContext<WizardContextType | undefined>(undefined);

interface WizardProviderProps {
  children: ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [specData, setSpecData] = useState<SpecDocumentData>(defaultSpecData);
  const [memoryData, setMemoryData] = useState<MemoryDocumentData>(defaultMemoryData);
  const [learningMode, setLearningMode] = useState(true);
  const [preservedDocument, setPreservedDocument] = useState<PreservedDocument | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage and URL hash on component mount
  useEffect(() => {
    // First, try to get state from URL hash
    const urlState = parseHashUrl();
    
    // Then load from localStorage
    const savedData = loadFromStorage();
    
    // URL takes precedence over localStorage for navigation state
    const finalDocumentType = urlState.documentType || savedData?.documentType || null;
    const finalCurrentStep = urlState.documentType ? urlState.step : (savedData?.currentStep || 0);
    
    if (finalDocumentType) setDocumentType(finalDocumentType);
    if (finalCurrentStep !== undefined) setCurrentStep(finalCurrentStep);
    if (savedData?.learningMode !== undefined) setLearningMode(savedData.learningMode);
    
    if (savedData) {
      if (savedData.specData) {
        setSpecData(prev => ({
          ...prev,
          ...savedData.specData,
          // Ensure nested objects are properly merged
          projectOverview: { ...prev.projectOverview, ...savedData.specData.projectOverview },
          functionalRequirements: { ...prev.functionalRequirements, ...savedData.specData.functionalRequirements },
          technicalRequirements: { ...prev.technicalRequirements, ...savedData.specData.technicalRequirements },
          apis: { ...prev.apis, ...savedData.specData.apis },
          nonFunctionalRequirements: { ...prev.nonFunctionalRequirements, ...savedData.specData.nonFunctionalRequirements },
          roadmap: { ...prev.roadmap, ...savedData.specData.roadmap },
        }));
      }
      if (savedData.memoryData) {
        setMemoryData(prev => ({
          ...prev,
          ...savedData.memoryData,
          projectInfo: { ...prev.projectInfo, ...savedData.memoryData.projectInfo },
        }));
      }
    }
    setIsLoaded(true);
  }, []);

  // Listen for hash changes (browser back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const urlState = parseHashUrl();
      setDocumentType(urlState.documentType);
      setCurrentStep(urlState.step);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save to localStorage whenever data changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      const dataToSave = {
        documentType,
        currentStep,
        specData,
        memoryData,
        learningMode,
      };
      saveToStorage(dataToSave, false); // Don't show notification for automatic saves
    }
  }, [documentType, currentStep, specData, memoryData, learningMode, isLoaded]);

  const steps = documentType === 'spec' ? specSteps : memorySteps;

  const updateSpecData = (section: keyof SpecDocumentData, data: any) => {
    setSpecData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const updateMemoryData = (section: keyof MemoryDocumentData, data: any) => {
    setMemoryData(prev => ({
      ...prev,
      [section]: Array.isArray(data) ? data : { ...prev[section], ...data }
    }));
  };

  const markStepCompleted = (_stepIndex: number) => {
    // This would be implemented to mark steps as completed
    // For now, we'll handle this in the individual step components
  };

  const resetWizard = () => {
    setDocumentType(null);
    setCurrentStep(0);
    setSpecData(defaultSpecData);
    setMemoryData(defaultMemoryData);
    setPreservedDocument(null); // Clear preserved document state
    clearStorage();
    
    if ((window as any).showToast) {
      (window as any).showToast('Progress cleared', 'info');
    }
  };

  const navigateToDocumentSelection = () => {
    // Navigate back to document selection without losing data
    setDocumentType(null);
    setCurrentStep(0);
    updateHashUrl(null, 0);
  };

  const handleSetDocumentType = (type: DocumentType) => {
    setDocumentType(type);
    setCurrentStep(0);
    setPreservedDocument(null); // Clear preserved document when switching types
    updateHashUrl(type, 0);
  };

  const handleSetCurrentStep = (step: number) => {
    setCurrentStep(step);
    updateHashUrl(documentType, step);
  };

  const importDocument = (content: string, docType: DocumentType) => {
    try {
      const preserved = DocumentPreservationSystem.parseDocument(content, docType);
      setPreservedDocument(preserved);
      
      if (docType === 'spec') {
        setSpecData(preserved.parsedData);
      } else {
        setMemoryData(preserved.parsedData);
      }
      
      // Set document type and navigate to first step
      setDocumentType(docType);
      setCurrentStep(0);
      updateHashUrl(docType, 0);
      
      if ((window as any).showToast) {
        const unparsedCount = preserved.metadata.unparsedSectionCount;
        const message = unparsedCount > 0
          ? `Document imported successfully! ${unparsedCount} sections preserved for export.`
          : 'Document imported successfully!';
        (window as any).showToast(message, 'success');
      }
    } catch (error) {
      console.error('Error importing document:', error);
      if ((window as any).showToast) {
        (window as any).showToast('Failed to import document', 'error');
      }
    }
  };

  const exportDocument = (): string => {
    try {
      if (preservedDocument) {
        // Update preserved document with current data
        const updatedPreserved: PreservedDocument = {
          ...preservedDocument,
          parsedData: documentType === 'spec' ? specData : memoryData
        };
        return DocumentPreservationSystem.reconstructDocument(updatedPreserved);
      } else {
        // Fallback: create new document from current data
        const content = documentType === 'spec' ? specData : memoryData;
        const preserved = DocumentPreservationSystem.parseDocument('', documentType!);
        const updatedPreserved: PreservedDocument = {
          ...preserved,
          parsedData: content
        };
        return DocumentPreservationSystem.reconstructDocument(updatedPreserved);
      }
    } catch (error) {
      console.error('Error exporting document:', error);
      if ((window as any).showToast) {
        (window as any).showToast('Failed to export document', 'error');
      }
      return '';
    }
  };

  const value: WizardContextType = {
    documentType,
    currentStep,
    steps,
    specData,
    memoryData,
    learningMode,
    preservedDocument,
    setDocumentType: handleSetDocumentType,
    setCurrentStep: handleSetCurrentStep,
    updateSpecData,
    updateMemoryData,
    markStepCompleted,
    resetWizard,
    navigateToDocumentSelection,
    setLearningMode,
    importDocument,
    exportDocument,
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
