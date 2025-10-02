import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';

export const TechnicalRequirementsStep: React.FC = () => {
  const { specData, updateSpecData } = useWizard();
  const { technicalRequirements } = specData;

  const [formData, setFormData] = useState(technicalRequirements);
  const [newTechnology, setNewTechnology] = useState('');
  const [newDependency, setNewDependency] = useState('');

  useEffect(() => {
    setFormData(technicalRequirements);
  }, [technicalRequirements]);

  const updateData = (updatedData: typeof technicalRequirements) => {
    setFormData(updatedData);
    updateSpecData('technicalRequirements', updatedData);
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    updateData(updatedData);
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      const updatedData = {
        ...formData,
        technologies: [...formData.technologies, newTechnology.trim()]
      };
      updateData(updatedData);
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    const updatedData = {
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index)
    };
    updateData(updatedData);
  };

  const addDependency = () => {
    if (newDependency.trim()) {
      const updatedData = {
        ...formData,
        dependencies: [...formData.dependencies, newDependency.trim()]
      };
      updateData(updatedData);
      setNewDependency('');
    }
  };

  const removeDependency = (index: number) => {
    const updatedData = {
      ...formData,
      dependencies: formData.dependencies.filter((_, i) => i !== index)
    };
    updateData(updatedData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Technical Requirements</h2>
        <p className="text-gray-600">
          Define the technical architecture and technology stack for your project.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="architecture" className="block text-sm font-medium text-gray-700 mb-2">
            System Architecture *
          </label>
          <textarea
            id="architecture"
            value={formData.architecture}
            onChange={(e) => handleInputChange('architecture', e.target.value)}
            className="textarea-field"
            placeholder="Describe the overall system architecture, patterns, and high-level design decisions"
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Technologies & Tools
          </label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                className="input-field"
                placeholder="e.g., React, Node.js, PostgreSQL, Docker"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="btn-primary flex items-center px-3"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="infrastructure" className="block text-sm font-medium text-gray-700 mb-2">
            Infrastructure & Deployment
          </label>
          <textarea
            id="infrastructure"
            value={formData.infrastructure}
            onChange={(e) => handleInputChange('infrastructure', e.target.value)}
            className="textarea-field"
            placeholder="Describe hosting, deployment strategy, CI/CD, monitoring, and infrastructure requirements"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            External Dependencies
          </label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newDependency}
                onChange={(e) => setNewDependency(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDependency()}
                className="input-field"
                placeholder="e.g., Third-party APIs, external services, libraries"
              />
              <button
                type="button"
                onClick={addDependency}
                className="btn-primary flex items-center px-3"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {formData.dependencies.length > 0 && (
              <div className="space-y-2">
                {formData.dependencies.map((dependency, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-gray-700">{dependency}</span>
                    <button
                      type="button"
                      onClick={() => removeDependency(index)}
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
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Best Practices
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Be specific about versions and compatibility requirements</li>
                <li>Consider scalability and maintainability in your architecture decisions</li>
                <li>Document any special configuration or setup requirements</li>
                <li>Include rationale for major technology choices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
