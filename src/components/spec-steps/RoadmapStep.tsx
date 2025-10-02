import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import type { RoadmapPhase, Milestone } from '../../types';

export const RoadmapStep: React.FC = () => {
  const { specData, updateSpecData } = useWizard();
  const { roadmap } = specData;

  const [formData, setFormData] = useState(roadmap);
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  useEffect(() => {
    setFormData(roadmap);
  }, [roadmap]);

  const updateData = (updatedData: typeof roadmap) => {
    setFormData(updatedData);
    updateSpecData('roadmap', updatedData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Roadmap</h2>
        <p className="text-gray-600">
          Define project phases and key milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Project Phases</h3>
            <button
              onClick={() => setShowPhaseForm(true)}
              className="btn-primary flex items-center space-x-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Phase</span>
            </button>
          </div>

          {formData.phases.length > 0 && (
            <div className="space-y-3">
              {formData.phases.map((phase, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{phase.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{phase.description}</p>
                      <div className="text-xs text-gray-500">
                        Duration: {phase.duration}
                      </div>
                      {phase.deliverables.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">Deliverables:</div>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {phase.deliverables.map((deliverable, i) => (
                              <li key={i}>{deliverable}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const updatedPhases = formData.phases.filter((_, i) => i !== index);
                        updateData({ ...formData, phases: updatedPhases });
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showPhaseForm && (
            <PhaseForm
              onSave={(phase) => {
                updateData({ ...formData, phases: [...formData.phases, phase] });
                setShowPhaseForm(false);
              }}
              onCancel={() => setShowPhaseForm(false)}
            />
          )}
        </div>

        {/* Milestones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Milestones</h3>
            <button
              onClick={() => setShowMilestoneForm(true)}
              className="btn-primary flex items-center space-x-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>

          {formData.milestones.length > 0 && (
            <div className="space-y-3">
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{milestone.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                      <div className="text-xs text-gray-500 mb-1">
                        Target Date: {milestone.date}
                      </div>
                      {milestone.dependencies.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Dependencies: {milestone.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const updatedMilestones = formData.milestones.filter((_, i) => i !== index);
                        updateData({ ...formData, milestones: updatedMilestones });
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showMilestoneForm && (
            <MilestoneForm
              onSave={(milestone) => {
                updateData({ ...formData, milestones: [...formData.milestones, milestone] });
                setShowMilestoneForm(false);
              }}
              onCancel={() => setShowMilestoneForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Phase Form Component
interface PhaseFormProps {
  onSave: (phase: RoadmapPhase) => void;
  onCancel: () => void;
}

const PhaseForm: React.FC<PhaseFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    deliverables: [] as string[],
    newDeliverable: ''
  });

  const addDeliverable = () => {
    if (formData.newDeliverable.trim()) {
      setFormData({
        ...formData,
        deliverables: [...formData.deliverables, formData.newDeliverable.trim()],
        newDeliverable: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      onSave({
        name: formData.name,
        description: formData.description,
        duration: formData.duration,
        deliverables: formData.deliverables
      });
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phase Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="textarea-field"
            rows={2}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="input-field"
            placeholder="e.g., 2 weeks, 1 month"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.newDeliverable}
              onChange={(e) => setFormData({ ...formData, newDeliverable: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
              className="input-field"
              placeholder="Add deliverable"
            />
            <button type="button" onClick={addDeliverable} className="btn-secondary px-3">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">Add Phase</button>
        </div>
      </form>
    </div>
  );
};

// Milestone Form Component
interface MilestoneFormProps {
  onSave: (milestone: Milestone) => void;
  onCancel: () => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    dependencies: [] as string[],
    newDependency: ''
  });



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      onSave({
        name: formData.name,
        date: formData.date,
        description: formData.description,
        dependencies: formData.dependencies
      });
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Milestone Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="textarea-field"
            rows={2}
            required
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">Add Milestone</button>
        </div>
      </form>
    </div>
  );
};
