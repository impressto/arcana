import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import { ConceptTooltip } from '../ConceptTooltip';
import { LearningCard } from '../LearningCard';

export const ProjectOverviewStep: React.FC = () => {
  const { specData, updateSpecData } = useWizard();
  const { projectOverview } = specData;

  const [formData, setFormData] = useState(projectOverview);
  const [newStakeholder, setNewStakeholder] = useState('');

  useEffect(() => {
    setFormData(projectOverview);
  }, [projectOverview]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    updateSpecData('projectOverview', updatedData);
  };

  const addStakeholder = () => {
    if (newStakeholder.trim()) {
      const updatedStakeholders = [...formData.stakeholders, newStakeholder.trim()];
      const updatedData = { ...formData, stakeholders: updatedStakeholders };
      setFormData(updatedData);
      updateSpecData('projectOverview', updatedData);
      setNewStakeholder('');
    }
  };

  const removeStakeholder = (index: number) => {
    const updatedStakeholders = formData.stakeholders.filter((_, i) => i !== index);
    const updatedData = { ...formData, stakeholders: updatedStakeholders };
    setFormData(updatedData);
    updateSpecData('projectOverview', updatedData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addStakeholder();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <ConceptTooltip concept="project-overview">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 inline-block">Project Overview</h2>
        </ConceptTooltip>
        <p className="text-gray-600">
          Provide basic information about your project to establish context and scope.
        </p>
      </div>

      {/* Learning Mode Content */}
      <LearningCard
        type="why-matters"
        title="Why Project Overview Sets the Foundation"
        content="A clear project overview provides the business context that guides all technical decisions. It helps AI assistants understand your goals and suggest solutions that align with your project's purpose and constraints."
        className="mb-4"
      />

      <LearningCard
        type="tip"
        title="Pro Tip: Start with the Problem"
        content="Begin by clearly defining the problem you're solving. This helps everyone (including AI assistants) understand why the project exists and what success looks like."
        className="mb-4"
      />

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
            Project Name *
          </label>
          <input
            type="text"
            id="projectName"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="input-field"
            placeholder="Enter your project name"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Project Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="textarea-field"
            placeholder="Provide a brief description of what this project does"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
            Project Purpose *
          </label>
          <textarea
            id="purpose"
            value={formData.purpose}
            onChange={(e) => handleInputChange('purpose', e.target.value)}
            className="textarea-field"
            placeholder="Explain why this project exists and what problems it solves"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stakeholders
          </label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newStakeholder}
                onChange={(e) => setNewStakeholder(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field"
                placeholder="Add stakeholder name or role"
              />
              <button
                type="button"
                onClick={addStakeholder}
                className="btn-primary flex items-center px-3"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {formData.stakeholders.length > 0 && (
              <div className="space-y-2">
                {formData.stakeholders.map((stakeholder, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-gray-700">{stakeholder}</span>
                    <button
                      type="button"
                      onClick={() => removeStakeholder(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
            Project Timeline
          </label>
          <input
            type="text"
            id="timeline"
            value={formData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
            className="input-field"
            placeholder="e.g., Q1 2024, 6 months, January - June 2024"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Tip
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                A clear project overview helps stakeholders understand the context and importance of your project. 
                Be specific about the problems being solved and the expected outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
