import React from 'react';
import { hideHostElement, showHostElement, hostElementExists } from '../utils/hostPageUtils';

/**
 * Test component to verify host page element manipulation
 * This can be used for testing the host page utilities
 */
export const HostPageTest: React.FC = () => {
  const testElementId = 'host-test-element';

  const testHideElement = () => {
    hideHostElement(testElementId);
  };

  const testShowElement = () => {
    showHostElement(testElementId);
  };

  const testElementExists = () => {
    const exists = hostElementExists(testElementId);
    alert(`Element "${testElementId}" exists: ${exists}`);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px', borderRadius: '8px', background: '#f9f9f9' }}>
      <h3>Host Page Element Control Test</h3>
      <p>These buttons test the ability to control host page elements:</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={testHideElement}
          style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Hide Info Box
        </button>
        <button 
          onClick={testShowElement}
          style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Show Info Box
        </button>
        <button 
          onClick={testElementExists}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Check If Exists
        </button>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Target element ID: <code>{testElementId}</code>
      </p>
    </div>
  );
};