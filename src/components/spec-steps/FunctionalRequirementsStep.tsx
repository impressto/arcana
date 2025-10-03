import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import { ConceptTooltip } from '../ConceptTooltip';
import { LearningCard } from '../LearningCard';
import type { Feature } from '../../types';

export const FunctionalRequirementsStep: React.FC = () => {
  const { specData, updateSpecData } = useWizard();
  const { functionalRequirements } = specData;

  const [formData, setFormData] = useState(functionalRequirements);
  const [newUserStory, setNewUserStory] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData(functionalRequirements);
  }, [functionalRequirements]);

  // Scroll to form when showing feature form (for both add and edit)
  useEffect(() => {
    if (showFeatureForm && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [showFeatureForm]);

  const updateData = (updatedData: typeof functionalRequirements) => {
    setFormData(updatedData);
    updateSpecData('functionalRequirements', updatedData);
  };

  // User Stories
  const addUserStory = () => {
    if (newUserStory.trim()) {
      const updatedData = {
        ...formData,
        userStories: [...formData.userStories, newUserStory.trim()]
      };
      updateData(updatedData);
      setNewUserStory('');
    }
  };

  const removeUserStory = (index: number) => {
    const updatedData = {
      ...formData,
      userStories: formData.userStories.filter((_, i) => i !== index)
    };
    updateData(updatedData);
  };

  // Acceptance Criteria
  const addCriteria = () => {
    if (newCriteria.trim()) {
      const updatedData = {
        ...formData,
        acceptanceCriteria: [...formData.acceptanceCriteria, newCriteria.trim()]
      };
      updateData(updatedData);
      setNewCriteria('');
    }
  };

  const removeCriteria = (index: number) => {
    const updatedData = {
      ...formData,
      acceptanceCriteria: formData.acceptanceCriteria.filter((_, i) => i !== index)
    };
    updateData(updatedData);
  };

  // Features
  const addOrUpdateFeature = (feature: Omit<Feature, 'id'>) => {
    if (editingFeature) {
      const updatedFeatures = formData.features.map(f => 
        f.id === editingFeature.id ? { ...feature, id: editingFeature.id } : f
      );
      updateData({ ...formData, features: updatedFeatures });
    } else {
      const newFeature: Feature = {
        ...feature,
        id: Date.now().toString()
      };
      updateData({ ...formData, features: [...formData.features, newFeature] });
    }
    setEditingFeature(null);
    setShowFeatureForm(false);
  };

  const removeFeature = (id: string) => {
    const updatedData = {
      ...formData,
      features: formData.features.filter(f => f.id !== id)
    };
    updateData(updatedData);
  };

  const startEditingFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setShowFeatureForm(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Functional Requirements</h2>
        <p className="text-gray-600">
          Define what your system should do from a user perspective.
        </p>
      </div>

      {/* User Stories */}
      <div className="space-y-4">
        <ConceptTooltip concept="user-stories">
          <h3 className="text-lg font-semibold text-gray-800 inline-block">User Stories</h3>
        </ConceptTooltip>
        
        <LearningCard
          type="explanation"
          title="User Story Best Practices"
          content="Good user stories follow the format 'As a [role], I want [feature] so that [benefit]'. This helps AI assistants understand not just what to build, but why users need it."
          className="mb-4"
        />
        
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newUserStory}
              onChange={(e) => setNewUserStory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addUserStory()}
              className="input-field"
              placeholder="As a [user type], I want [functionality] so that [benefit]"
            />
            <button
              type="button"
              onClick={addUserStory}
              className="btn-primary flex items-center px-3"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {formData.userStories.length > 0 && (
            <div className="space-y-2">
              {formData.userStories.map((story, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-gray-700 flex-1">{story}</span>
                  <button
                    type="button"
                    onClick={() => removeUserStory(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Features</h3>
          <button
            onClick={() => setShowFeatureForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Feature</span>
          </button>
        </div>

        {formData.features.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {formData.features.map((feature) => (
              <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{feature.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        feature.priority === 'High' ? 'bg-red-100 text-red-800' :
                        feature.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {feature.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        feature.status === 'Complete' ? 'bg-green-100 text-green-800' :
                        feature.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => startEditingFeature(feature)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFeature(feature.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showFeatureForm && (
          <div ref={formRef}>
            <FeatureForm
              feature={editingFeature}
              onSave={addOrUpdateFeature}
              onCancel={() => {
                setShowFeatureForm(false);
                setEditingFeature(null);
              }}
            />
          </div>
        )}
      </div>

      {/* Acceptance Criteria */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Acceptance Criteria</h3>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCriteria}
              onChange={(e) => setNewCriteria(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCriteria()}
              className="input-field"
              placeholder="Define a specific, testable acceptance criterion"
            />
            <button
              type="button"
              onClick={addCriteria}
              className="btn-primary flex items-center px-3"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {formData.acceptanceCriteria.length > 0 && (
            <div className="space-y-2">
              {formData.acceptanceCriteria.map((criteria, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-gray-700 flex-1">{criteria}</span>
                  <button
                    type="button"
                    onClick={() => removeCriteria(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
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
  );
};

// Feature Form Component
interface FeatureFormProps {
  feature: Feature | null;
  onSave: (feature: Omit<Feature, 'id'>) => void;
  onCancel: () => void;
}

const FeatureForm: React.FC<FeatureFormProps> = ({ feature, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: feature?.name || '',
    description: feature?.description || '',
    priority: feature?.priority || 'Medium' as const,
    status: feature?.status || 'Planned' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Feature Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder="Enter feature name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="textarea-field"
            placeholder="Describe what this feature does"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Feature['priority'] })}
              className="input-field"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Feature['status'] })}
              className="input-field"
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {feature ? 'Update' : 'Add'} Feature
          </button>
        </div>
      </form>
    </div>
  );
};
