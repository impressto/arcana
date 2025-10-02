import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import type { APIEndpoint } from '../../types';

export const ApiStep: React.FC = () => {
  const { specData, updateSpecData } = useWizard();
  const { apis } = specData;

  const [formData, setFormData] = useState(apis);
  const [showEndpointForm, setShowEndpointForm] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<APIEndpoint | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData(apis);
  }, [apis]);

  // Scroll to form when showing endpoint form (for both add and edit)
  useEffect(() => {
    if (showEndpointForm && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [showEndpointForm]);

  const updateData = (updatedData: typeof apis) => {
    setFormData(updatedData);
    updateSpecData('apis', updatedData);
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    updateData(updatedData);
  };

  const addOrUpdateEndpoint = (endpoint: Omit<APIEndpoint, 'id'>) => {
    if (editingEndpoint) {
      const updatedEndpoints = formData.endpoints.map(e => 
        e === editingEndpoint ? { ...endpoint } as APIEndpoint : e
      );
      updateData({ ...formData, endpoints: updatedEndpoints });
    } else {
      const newEndpoint: APIEndpoint = { ...endpoint } as APIEndpoint;
      updateData({ ...formData, endpoints: [...formData.endpoints, newEndpoint] });
    }
    setEditingEndpoint(null);
    setShowEndpointForm(false);
  };

  const removeEndpoint = (endpoint: APIEndpoint) => {
    const updatedData = {
      ...formData,
      endpoints: formData.endpoints.filter(e => e !== endpoint)
    };
    updateData(updatedData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">API Documentation</h2>
        <p className="text-gray-600">
          Document your API endpoints, authentication, and usage guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="authentication" className="block text-sm font-medium text-gray-700 mb-2">
            Authentication Method
          </label>
          <input
            type="text"
            id="authentication"
            value={formData.authentication}
            onChange={(e) => handleInputChange('authentication', e.target.value)}
            className="input-field"
            placeholder="e.g., JWT Bearer Token, API Key, OAuth 2.0"
          />
        </div>

        <div>
          <label htmlFor="rateLimit" className="block text-sm font-medium text-gray-700 mb-2">
            Rate Limiting
          </label>
          <input
            type="text"
            id="rateLimit"
            value={formData.rateLimit}
            onChange={(e) => handleInputChange('rateLimit', e.target.value)}
            className="input-field"
            placeholder="e.g., 1000 requests/hour, 10 requests/second"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">API Endpoints</h3>
          <button
            onClick={() => setShowEndpointForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Endpoint</span>
          </button>
        </div>

        {formData.endpoints.length > 0 && (
          <div className="space-y-4">
            {formData.endpoints.map((endpoint, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs rounded font-mono ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                        endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-600 mb-2">{endpoint.description}</p>
                    {endpoint.parameters.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Parameters: </span>
                        <span className="text-gray-600">{endpoint.parameters.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingEndpoint(endpoint);
                        setShowEndpointForm(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeEndpoint(endpoint)}
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

        {showEndpointForm && (
          <div ref={formRef}>
            <EndpointForm
              endpoint={editingEndpoint}
              onSave={addOrUpdateEndpoint}
              onCancel={() => {
                setShowEndpointForm(false);
                setEditingEndpoint(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface EndpointFormProps {
  endpoint: APIEndpoint | null;
  onSave: (endpoint: Omit<APIEndpoint, 'id'>) => void;
  onCancel: () => void;
}

const EndpointForm: React.FC<EndpointFormProps> = ({ endpoint, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    path: endpoint?.path || '',
    method: endpoint?.method || 'GET' as const,
    description: endpoint?.description || '',
    parameters: endpoint?.parameters?.join(', ') || '',
    response: endpoint?.response || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.path.trim() && formData.description.trim()) {
      onSave({
        ...formData,
        parameters: formData.parameters.split(',').map(p => p.trim()).filter(p => p)
      });
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Method *
            </label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value as APIEndpoint['method'] })}
              className="input-field"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Path *
            </label>
            <input
              type="text"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              className="input-field"
              placeholder="/api/v1/users"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="textarea-field"
            placeholder="Describe what this endpoint does"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parameters
          </label>
          <input
            type="text"
            value={formData.parameters}
            onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
            className="input-field"
            placeholder="id, name, email (comma-separated)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Response Format
          </label>
          <textarea
            value={formData.response}
            onChange={(e) => setFormData({ ...formData, response: e.target.value })}
            className="textarea-field"
            placeholder="Describe the response format or provide example JSON"
            rows={3}
          />
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
            {endpoint ? 'Update' : 'Add'} Endpoint
          </button>
        </div>
      </form>
    </div>
  );
};
