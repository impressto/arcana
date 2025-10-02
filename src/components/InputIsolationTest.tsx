import React, { useState } from 'react';

/**
 * Component to test input field isolation
 * This demonstrates how form elements are protected from host page CSS
 */
export const InputIsolationTest: React.FC = () => {
  const [formData, setFormData] = useState({
    text: '',
    email: '',
    textarea: '',
    select: '',
    number: '',
    checkbox: false,
    radio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px 0',
      border: '2px solid #e5e7eb', 
      borderRadius: '12px', 
      backgroundColor: '#f9fafb' 
    }}>
      <h3 style={{ 
        color: '#1f2937', 
        marginTop: '0', 
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        🔒 Input Field Isolation Test
      </h3>
      
      <p style={{ 
        color: '#6b7280', 
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        These form elements should maintain consistent styling regardless of host page CSS:
      </p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Text Input */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151' 
          }}>
            Text Input:
          </label>
          <input
            type="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="This should look normal..."
            className="input-field"
          />
        </div>

        {/* Email Input */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151' 
          }}>
            Email Input:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="input-field"
          />
        </div>

        {/* Number Input */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151' 
          }}>
            Number Input:
          </label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="123"
            className="input-field"
          />
        </div>

        {/* Textarea */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151' 
          }}>
            Textarea:
          </label>
          <textarea
            name="textarea"
            value={formData.textarea}
            onChange={handleChange}
            placeholder="Multi-line text input..."
            className="textarea-field"
          />
        </div>

        {/* Select */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151' 
          }}>
            Select Dropdown:
          </label>
          <select
            name="select"
            value={formData.select}
            onChange={handleChange}
          >
            <option value="">Choose an option...</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        {/* Checkboxes and Radio buttons */}
        <div>
          <fieldset style={{ 
            border: '1px solid #d1d5db', 
            borderRadius: '8px', 
            padding: '16px',
            margin: '0' 
          }}>
            <legend style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              padding: '0 8px'
            }}>
              Checkbox & Radio Options:
            </legend>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="checkbox"
                  checked={formData.checkbox}
                  onChange={handleChange}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  I agree to the terms and conditions
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="radio"
                  value="yes"
                  checked={formData.radio === 'yes'}
                  onChange={handleChange}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>Yes</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="radio"
                  value="no"
                  checked={formData.radio === 'no'}
                  onChange={handleChange}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>No</span>
              </label>
            </div>
          </fieldset>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="submit" className="btn-primary">
            Submit Form
          </button>
          <button type="button" className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        backgroundColor: '#eff6ff', 
        borderRadius: '8px',
        fontSize: '12px',
        color: '#1e40af'
      }}>
        <strong>💡 Testing Tips:</strong> Try inspecting these elements in browser dev tools. 
        They should have consistent styling with proper focus states, regardless of any 
        aggressive CSS on the host page.
      </div>
    </div>
  );
};