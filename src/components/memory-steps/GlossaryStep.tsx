import React, { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, Search, Tag } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import type { GlossaryEntry } from '../../types';

export const GlossaryStep: React.FC = () => {
  const { memoryData, updateMemoryData } = useWizard();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState<GlossaryEntry>({
    term: '',
    definition: '',
    category: ''
  });

  const glossary = memoryData.glossary || [];
  
  // Get unique categories for filtering
  const categories = ['all', ...new Set(glossary.map(entry => entry.category).filter(Boolean))];
  
  // Filter glossary entries
  const filteredGlossary = glossary.filter(entry => {
    const matchesSearch = entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      term: '',
      definition: '',
      category: ''
    });
  };

  const handleSave = () => {
    if (!formData.term.trim() || !formData.definition.trim()) return;

    const updatedGlossary = [...glossary];
    
    if (editingIndex !== null) {
      updatedGlossary[editingIndex] = formData;
    } else {
      updatedGlossary.push(formData);
    }

    // Sort glossary alphabetically by term
    updatedGlossary.sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()));

    updateMemoryData('glossary', updatedGlossary);
    setEditingIndex(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleEdit = (index: number) => {
    // Find the original index in the unsorted array
    const originalEntry = filteredGlossary[index];
    const originalIndex = glossary.findIndex(entry => 
      entry.term === originalEntry.term && entry.definition === originalEntry.definition
    );
    
    setFormData(originalEntry);
    setEditingIndex(originalIndex);
    setIsAddingNew(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this glossary term?')) {
      // Find the original index in the unsorted array
      const originalEntry = filteredGlossary[index];
      const originalIndex = glossary.findIndex(entry => 
        entry.term === originalEntry.term && entry.definition === originalEntry.definition
      );
      
      const updatedGlossary = glossary.filter((_, i) => i !== originalIndex);
      updateMemoryData('glossary', updatedGlossary);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAddingNew(false);
    resetForm();
  };

  const updateFormField = (field: keyof GlossaryEntry, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Glossary</h2>
        <p className="text-gray-600">
          Define technical terms, concepts, and project-specific vocabulary for clear communication.
        </p>
      </div>

      {/* Search and Filter Controls */}
      {glossary.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search terms or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          {categories.length > 1 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field sm:w-48"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Add New Button */}
      {!isAddingNew && (
        <button
          onClick={() => setIsAddingNew(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Term</span>
        </button>
      )}

      {/* Form for Adding/Editing */}
      {isAddingNew && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingIndex !== null ? 'Edit Glossary Term' : 'Add New Term'}
          </h3>

          <div className="space-y-4">
            {/* Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term *
              </label>
              <input
                type="text"
                value={formData.term}
                onChange={(e) => updateFormField('term', e.target.value)}
                className="input-field"
                placeholder="e.g., API, Microservice, Docker"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => updateFormField('category', e.target.value)}
                className="input-field"
                placeholder="e.g., Technical, Business, Process (optional)"
              />
            </div>

            {/* Definition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Definition *
              </label>
              <textarea
                value={formData.definition}
                onChange={(e) => updateFormField('definition', e.target.value)}
                className="textarea-field"
                placeholder="Provide a clear, concise definition of the term..."
                rows={4}
              />
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
                disabled={!formData.term.trim() || !formData.definition.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingIndex !== null ? 'Update Term' : 'Add Term'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Glossary List */}
      {filteredGlossary.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Glossary Terms
              {searchTerm || selectedCategory !== 'all' ? (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({filteredGlossary.length} of {glossary.length} terms)
                </span>
              ) : (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({glossary.length} terms)
                </span>
              )}
            </h3>
            
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="grid gap-4">
            {filteredGlossary.map((entry, index) => (
              <div key={`${entry.term}-${index}`} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {entry.term}
                      </h4>
                      {entry.category && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {entry.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit term"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete term"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border-l-4 border-blue-400 p-4 rounded-r">
                  <p className="text-gray-800 text-sm whitespace-pre-line">
                    {entry.definition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : glossary.length > 0 ? (
        // Show when filtered results are empty but glossary has items
        <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg p-8 text-center">
          <div className="text-yellow-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No terms match your search</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or category filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : !isAddingNew ? (
        // Show when glossary is completely empty
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <BookOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No terms defined yet</h3>
          <p className="text-gray-500 mb-4">
            Start building your project glossary by defining technical terms and concepts.
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn-primary"
          >
            Add Your First Term
          </button>
        </div>
      ) : null}

      {/* Quick Stats */}
      {glossary.length > 0 && !isAddingNew && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{glossary.length}</div>
                <div className="text-sm text-gray-600">Terms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(glossary.map(entry => entry.category).filter(Boolean)).size}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(glossary.reduce((sum, entry) => sum + entry.definition.split(' ').length, 0) / glossary.length) || 0}
                </div>
                <div className="text-sm text-gray-600">Avg Words</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Glossary Statistics
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
