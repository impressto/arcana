import React, { useState, useEffect } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { ConceptTooltip } from '../ConceptTooltip';
import { LearningCard } from '../LearningCard';

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
        <ConceptTooltip concept="non-functional-requirements">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 inline-block">Non-Functional Requirements</h2>
        </ConceptTooltip>
        <p className="text-gray-600">
          Define quality attributes and constraints for your system.
        </p>
      </div>

      {/* Learning Mode Content */}
      <LearningCard
        type="why-matters"
        title="Why Quality Attributes Shape System Design"
        content="Non-functional requirements like performance, security, and scalability determine how AI assistants architect solutions. They're the invisible requirements that make systems production-ready."
        className="mb-4"
      />

      <LearningCard
        type="explanation"
        title="Understanding Quality vs Features"
        content="While functional requirements define what your system does, non-functional requirements define how well it does it. They're often the difference between a prototype and a production system."
        className="mb-4"
      />

      <div className="space-y-6">
        <div>
          <label htmlFor="performance" className="block text-sm font-medium text-gray-700 mb-2">
            Performance Requirements
          </label>
          
          <LearningCard
            type="explanation"
            title="Performance Metrics That Matter"
            content="Define specific, measurable performance targets: response times (< 200ms for API calls), throughput (1000 requests/second), page load times (< 3 seconds), and resource limits (memory, CPU usage). Concrete numbers help AI assistants optimize code effectively."
            className="mb-4"
          />
          
          <LearningCard
            type="tip"
            title="Performance Requirements Best Practices"
            content="Consider different user scenarios: peak load vs normal usage, mobile vs desktop performance, and geographic variations. Include both average and worst-case scenarios to guide optimization strategies."
            className="mb-4"
          />
          
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
          
          <LearningCard
            type="explanation"
            title="Security Foundation Elements"
            content="Cover key areas: authentication methods (JWT, OAuth), authorization levels, data encryption (at rest and in transit), input validation, and compliance requirements (GDPR, HIPAA). Clear security requirements help AI assistants suggest secure coding patterns."
            className="mb-4"
          />
          
          <LearningCard
            type="tip"
            title="Security Planning Strategy"
            content="Think about the complete security lifecycle: user authentication, session management, data protection, API security, and incident response. Include specific threats you need to protect against and compliance standards you must meet."
            className="mb-4"
          />
          
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
          
          <LearningCard
            type="explanation"
            title="Scalability Planning Fundamentals"
            content="Define growth expectations: user base growth (100 to 10,000 users), data volume increases, traffic patterns, and resource scaling needs. Include both horizontal scaling (more servers) and vertical scaling (bigger servers) considerations."
            className="mb-4"
          />
          
          <LearningCard
            type="tip"
            title="Scalability Design Considerations"
            content="Consider auto-scaling triggers, database scaling strategies, CDN requirements, and microservices architecture. Document expected growth patterns and bottleneck scenarios to help AI assistants suggest scalable solutions from the start."
            className="mb-4"
          />
          
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
          
          <LearningCard
            type="explanation"
            title="Availability and Reliability Targets"
            content="Set specific uptime targets (99.9% = 8.7 hours downtime/year), define acceptable failure scenarios, recovery time objectives (RTO), and recovery point objectives (RPO). Include backup strategies and disaster recovery procedures."
            className="mb-4"
          />
          
          <LearningCard
            type="tip"
            title="Reliability Engineering Approach"
            content="Plan for failure: health checks, graceful degradation, circuit breakers, and monitoring alerts. Define what constitutes 'system failure' and acceptable recovery times. This helps AI assistants suggest resilient architecture patterns."
            className="mb-4"
          />
          
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
