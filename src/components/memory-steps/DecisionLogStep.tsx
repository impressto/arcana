import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, FileText, Lightbulb } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import type { DecisionEntry } from '../../types';

export const DecisionLogStep: React.FC = () => {
  const { memoryData, updateMemoryData } = useWizard();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<DecisionEntry>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    rationale: '',
    stakeholders: [''],
    impact: '',
    alternatives: [''],
    status: 'decided'
  });

  const decisions = memoryData.decisionLog || [];

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      rationale: '',
      stakeholders: [''],
      impact: '',
      alternatives: [''],
      status: 'decided'
    });
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const updatedDecisions = [...decisions];
    
    if (editingIndex !== null) {
      updatedDecisions[editingIndex] = formData;
    } else {
      updatedDecisions.push(formData);
    }

    updateMemoryData('decisionLog', updatedDecisions);
    setEditingIndex(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setFormData(decisions[index]);
    setEditingIndex(index);
    setIsAddingNew(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this decision?')) {
      const updatedDecisions = decisions.filter((_, i) => i !== index);
      updateMemoryData('decisionLog', updatedDecisions);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAddingNew(false);
    resetForm();
  };

  const updateFormField = (field: keyof DecisionEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: 'stakeholders' | 'alternatives', index: number, value: string) => {
    const currentArray = formData[field] as string[];
    const updatedArray = [...currentArray];
    updatedArray[index] = value;
    updateFormField(field, updatedArray);
  };

  const addArrayItem = (field: 'stakeholders' | 'alternatives') => {
    const currentArray = formData[field] as string[];
    updateFormField(field, [...currentArray, '']);
  };

  const removeArrayItem = (field: 'stakeholders' | 'alternatives', index: number) => {
    const currentArray = formData[field] as string[];
    if (currentArray.length > 1) {
      updateFormField(field, currentArray.filter((_, i) => i !== index));
    }
  };

  return (
    <div id="decision-log-step" className="space-y-6">
      <div id="decision-log-header">
        <h2 id="decision-log-title" className="text-2xl font-bold text-gray-900 mb-2">Decision Log</h2>
        <p id="decision-log-description" className="text-gray-600">
          Document important project decisions, their rationale, and impact on the project.
        </p>
      </div>

      {/* Add New Button */}
      {!isAddingNew && (
        <button
          id="add-decision-button"
          onClick={() => setIsAddingNew(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus id="add-decision-icon" className="w-4 h-4" />
          <span>Add Decision</span>
        </button>
      )}

      {/* Form for Adding/Editing */}
      {isAddingNew && (
        <div id="decision-form-card" className="card">
          <h3 id="decision-form-title" className="text-lg font-semibold text-gray-900 mb-4">
            {editingIndex !== null ? 'Edit Decision' : 'Add New Decision'}
          </h3>

          <div id="decision-form-fields" className="space-y-4">
            {/* Title */}
            <div id="decision-title-field">
              <label htmlFor="decision-title-input" className="block text-sm font-medium text-gray-700 mb-1">
                Decision Title *
              </label>
              <input
                id="decision-title-input"
                type="text"
                value={formData.title}
                onChange={(e) => updateFormField('title', e.target.value)}
                className="input-field"
                placeholder="e.g., Choose React for frontend framework"
              />
            </div>

            {/* Date and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateFormField('date', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateFormField('status', e.target.value)}
                  className="input-field"
                >
                  <option value="decided">Decided</option>
                  <option value="pending">Pending</option>
                  <option value="revisit">Needs Revisit</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormField('description', e.target.value)}
                className="textarea-field"
                placeholder="Describe what decision was made and the context..."
                rows={3}
              />
            </div>

            {/* Rationale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rationale
              </label>
              <textarea
                value={formData.rationale}
                onChange={(e) => updateFormField('rationale', e.target.value)}
                className="textarea-field"
                placeholder="Explain why this decision was made..."
                rows={3}
              />
            </div>

            {/* Impact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Impact
              </label>
              <textarea
                value={formData.impact}
                onChange={(e) => updateFormField('impact', e.target.value)}
                className="textarea-field"
                placeholder="Describe the expected impact of this decision..."
                rows={2}
              />
            </div>

            {/* Stakeholders */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stakeholders Involved
              </label>
              {formData.stakeholders.map((stakeholder, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={stakeholder}
                    onChange={(e) => updateArrayField('stakeholders', index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="Stakeholder name or role"
                  />
                  {formData.stakeholders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('stakeholders', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('stakeholders')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Stakeholder
              </button>
            </div>

            {/* Alternatives Considered */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternatives Considered
              </label>
              {formData.alternatives.map((alternative, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={alternative}
                    onChange={(e) => updateArrayField('alternatives', index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="Alternative option that was considered"
                  />
                  {formData.alternatives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('alternatives', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('alternatives')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Alternative
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingIndex !== null ? 'Update Decision' : 'Add Decision'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decision List */}
      {decisions.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recorded Decisions ({decisions.length})
          </h3>
          
          {decisions.map((decision, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {decision.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{decision.date}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      decision.status === 'decided' ? 'bg-green-100 text-green-700' :
                      decision.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {decision.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit decision"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete decision"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {decision.description && (
                <div className="mb-3">
                  <div className="flex items-center space-x-1 mb-1">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Description</span>
                  </div>
                  <p className="text-gray-800 text-sm pl-5">{decision.description}</p>
                </div>
              )}

              {decision.rationale && (
                <div className="mb-3">
                  <div className="flex items-center space-x-1 mb-1">
                    <Lightbulb className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Rationale</span>
                  </div>
                  <p className="text-gray-800 text-sm pl-5">{decision.rationale}</p>
                </div>
              )}

              {decision.impact && (
                <div className="mb-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r">
                  <p className="text-sm text-blue-800">
                    <strong>Impact:</strong> {decision.impact}
                  </p>
                </div>
              )}

              {decision.stakeholders && decision.stakeholders.some(s => s.trim()) && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Stakeholders:</span>
                  <div className="flex flex-wrap gap-2 pl-5">
                    {decision.stakeholders.filter(s => s.trim()).map((stakeholder, sIndex) => (
                      <span key={sIndex} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        {stakeholder}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {decision.alternatives && decision.alternatives.some(a => a.trim()) && (
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Alternatives Considered:</span>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {decision.alternatives.filter(a => a.trim()).map((alternative, aIndex) => (
                      <li key={aIndex}>{alternative}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : !isAddingNew && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No decisions recorded yet</h3>
          <p className="text-gray-500 mb-4">
            Start documenting important project decisions to build your knowledge base.
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn-primary"
          >
            Add Your First Decision
          </button>
        </div>
      )}
    </div>
  );
};
