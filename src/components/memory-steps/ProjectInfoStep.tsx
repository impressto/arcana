import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';

export const ProjectInfoStep: React.FC = () => {
  const { memoryData, updateMemoryData } = useWizard();
  const { projectInfo } = memoryData;

  const [formData, setFormData] = useState(projectInfo);
  const [newTeamMember, setNewTeamMember] = useState('');

  useEffect(() => {
    setFormData(projectInfo);
  }, [projectInfo]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    updateMemoryData('projectInfo', updatedData);
  };

  const addTeamMember = () => {
    if (newTeamMember.trim()) {
      const updatedTeam = [...formData.team, newTeamMember.trim()];
      const updatedData = { ...formData, team: updatedTeam };
      setFormData(updatedData);
      updateMemoryData('projectInfo', updatedData);
      setNewTeamMember('');
    }
  };

  const removeTeamMember = (index: number) => {
    const updatedTeam = formData.team.filter((_, i) => i !== index);
    const updatedData = { ...formData, team: updatedTeam };
    setFormData(updatedData);
    updateMemoryData('projectInfo', updatedData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Information</h2>
        <p className="text-gray-600">
          Basic information about the project for the memory document.
        </p>
      </div>

      <div className="space-y-6">
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
            placeholder="Brief description of the project"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Members
          </label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
                className="input-field"
                placeholder="Add team member name and role"
              />
              <button
                type="button"
                onClick={addTeamMember}
                className="btn-primary flex items-center px-3"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {formData.team.length > 0 && (
              <div className="space-y-2">
                {formData.team.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-gray-700">{member}</span>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
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
    </div>
  );
};
