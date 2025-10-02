import React, { useState, useEffect } from 'react';
import { useWizard } from '../../contexts/WizardContext';

export const NonFunctionalRequirementsStep: React.FC = () => {
  const { specData, updateSpecData } = useWizard();
  const { nonFunctionalRequirements } = specData;

  const [formData, setFormData] = useState(nonFunctionalRequirements);

  useEffect(() => {
    setFormData(nonFunctionalRequirements);
  }, [nonFunctionalRequirements]);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    updateSpecData('nonFunctionalRequirements', updatedData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Non-Functional Requirements</h2>
        <p className="text-gray-600">
          Define quality attributes and constraints for your system.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="performance" className="block text-sm font-medium text-gray-700 mb-2">
            Performance Requirements
          </label>
          <textarea
            id="performance"
            value={formData.performance}
            onChange={(e) => handleInputChange('performance', e.target.value)}
            className="textarea-field"
            placeholder="Define response times, throughput, resource usage, and scalability requirements"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="security" className="block text-sm font-medium text-gray-700 mb-2">
            Security Requirements
          </label>
          <textarea
            id="security"
            value={formData.security}
            onChange={(e) => handleInputChange('security', e.target.value)}
            className="textarea-field"
            placeholder="Define authentication, authorization, data protection, and compliance requirements"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="scalability" className="block text-sm font-medium text-gray-700 mb-2">
            Scalability Requirements
          </label>
          <textarea
            id="scalability"
            value={formData.scalability}
            onChange={(e) => handleInputChange('scalability', e.target.value)}
            className="textarea-field"
            placeholder="Define how the system should scale with increased load or users"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
            Availability & Reliability
          </label>
          <textarea
            id="availability"
            value={formData.availability}
            onChange={(e) => handleInputChange('availability', e.target.value)}
            className="textarea-field"
            placeholder="Define uptime requirements, disaster recovery, and failure handling"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
