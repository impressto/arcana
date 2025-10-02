import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Lightbulb, Target, TrendingUp, Filter } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import type { LessonEntry } from '../../types';

export const LessonsLearnedStep: React.FC = () => {
  const { memoryData, updateMemoryData } = useWizard();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [formData, setFormData] = useState<LessonEntry>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    situation: '',
    lesson: '',
    application: '',
    impact: 'medium'
  });

  const lessons = memoryData.lessonsLearned || [];
  const formRef = useRef<HTMLDivElement>(null);

  // Scroll to form when editing a lesson
  useEffect(() => {
    if (isAddingNew && editingIndex !== null && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [isAddingNew, editingIndex]);
  
  // Get unique categories for filtering
  const categories = ['all', ...new Set(lessons.map(lesson => lesson.category).filter(Boolean))];
  
  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const matchesCategory = filterCategory === 'all' || lesson.category === filterCategory;
    const matchesImpact = filterImpact === 'all' || lesson.impact === filterImpact;
    return matchesCategory && matchesImpact;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      situation: '',
      lesson: '',
      application: '',
      impact: 'medium'
    });
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.lesson.trim()) return;

    const updatedLessons = [...lessons];
    
    if (editingIndex !== null) {
      updatedLessons[editingIndex] = formData;
    } else {
      updatedLessons.push(formData);
    }

    // Sort lessons by date (newest first)
    updatedLessons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    updateMemoryData('lessonsLearned', updatedLessons);
    setEditingIndex(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleEdit = (index: number) => {
    // Find the original index in the unsorted array
    const originalEntry = filteredLessons[index];
    const originalIndex = lessons.findIndex(lesson => 
      lesson.title === originalEntry.title && lesson.date === originalEntry.date
    );
    
    setFormData(originalEntry);
    setEditingIndex(originalIndex);
    setIsAddingNew(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      // Find the original index in the unsorted array
      const originalEntry = filteredLessons[index];
      const originalIndex = lessons.findIndex(lesson => 
        lesson.title === originalEntry.title && lesson.date === originalEntry.date
      );
      
      const updatedLessons = lessons.filter((_, i) => i !== originalIndex);
      updateMemoryData('lessonsLearned', updatedLessons);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAddingNew(false);
    resetForm();
  };

  const updateFormField = (field: keyof LessonEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⚡';
      case 'low':
        return '💡';
      default:
        return '📝';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lessons Learned</h2>
        <p className="text-gray-600">
          Capture valuable insights, retrospective findings, and key learnings to improve future projects.
        </p>
      </div>

      {/* Filter Controls */}
      {lessons.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          {categories.length > 1 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field sm:w-48"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          )}
          
          <select
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="all">All Impact Levels</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>

          {(filterCategory !== 'all' || filterImpact !== 'all') && (
            <button
              onClick={() => {
                setFilterCategory('all');
                setFilterImpact('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
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
          <span>Add Lesson</span>
        </button>
      )}

      {/* Form for Adding/Editing */}
      {isAddingNew && (
        <div ref={formRef} className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingIndex !== null ? 'Edit Lesson Learned' : 'Add New Lesson'}
          </h3>

          <div className="space-y-4">
            {/* Title and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormField('title', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Communication is key during deployments"
                />
              </div>
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
            </div>

            {/* Category and Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => updateFormField('category', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Technical, Process, Communication"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impact Level
                </label>
                <select
                  value={formData.impact}
                  onChange={(e) => updateFormField('impact', e.target.value)}
                  className="input-field"
                >
                  <option value="low">Low Impact</option>
                  <option value="medium">Medium Impact</option>
                  <option value="high">High Impact</option>
                </select>
              </div>
            </div>

            {/* Situation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Situation/Context
              </label>
              <textarea
                value={formData.situation}
                onChange={(e) => updateFormField('situation', e.target.value)}
                className="textarea-field"
                placeholder="Describe the situation or context that led to this learning..."
                rows={3}
              />
            </div>

            {/* Lesson */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lesson Learned *
              </label>
              <textarea
                value={formData.lesson}
                onChange={(e) => updateFormField('lesson', e.target.value)}
                className="textarea-field"
                placeholder="What was learned? What insight was gained?"
                rows={4}
              />
            </div>

            {/* Application */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Future Application
              </label>
              <textarea
                value={formData.application}
                onChange={(e) => updateFormField('application', e.target.value)}
                className="textarea-field"
                placeholder="How will this learning be applied in future projects?"
                rows={3}
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
                disabled={!formData.title.trim() || !formData.lesson.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingIndex !== null ? 'Update Lesson' : 'Save Lesson'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lessons List */}
      {filteredLessons.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Lessons Learned
              {(filterCategory !== 'all' || filterImpact !== 'all') ? (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({filteredLessons.length} of {lessons.length} lessons)
                </span>
              ) : (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({lessons.length} lessons)
                </span>
              )}
            </h3>
          </div>
          
          <div className="grid gap-6">
            {filteredLessons.map((lesson, index) => (
              <div key={`${lesson.title}-${lesson.date}`} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getImpactColor(lesson.impact)}`}>
                          {getImpactIcon(lesson.impact)} {lesson.impact} impact
                        </span>
                        {lesson.category && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                            {lesson.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(lesson.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit lesson"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete lesson"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Situation */}
                  {lesson.situation && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">1</span>
                        </div>
                        <h5 className="text-sm font-medium text-gray-900">Situation</h5>
                      </div>
                      <div className="ml-8">
                        <p className="text-sm text-gray-700 whitespace-pre-line">{lesson.situation}</p>
                      </div>
                    </div>
                  )}

                  {/* Lesson */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Lightbulb className="w-3 h-3 text-yellow-600" />
                      </div>
                      <h5 className="text-sm font-medium text-gray-900">Key Learning</h5>
                    </div>
                    <div className="ml-8">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
                        <p className="text-sm text-yellow-800 whitespace-pre-line font-medium">
                          {lesson.lesson}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Application */}
                  {lesson.application && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Target className="w-3 h-3 text-green-600" />
                        </div>
                        <h5 className="text-sm font-medium text-gray-900">Future Application</h5>
                      </div>
                      <div className="ml-8">
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
                          <p className="text-sm text-green-800 whitespace-pre-line">
                            {lesson.application}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : lessons.length > 0 ? (
        // Show when filtered results are empty but lessons exist
        <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg p-8 text-center">
          <div className="text-yellow-400 mb-4">
            <Filter className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons match your filters</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your category or impact level filters.
          </p>
          <button
            onClick={() => {
              setFilterCategory('all');
              setFilterImpact('all');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : !isAddingNew ? (
        // Show when no lessons exist at all
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Lightbulb className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons recorded yet</h3>
          <p className="text-gray-500 mb-4">
            Start capturing valuable insights and learnings from your project experience.
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn-primary"
          >
            Record Your First Lesson
          </button>
        </div>
      ) : null}

      {/* Statistics Dashboard */}
      {lessons.length > 0 && !isAddingNew && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
            Learning Analytics
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{lessons.length}</div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {lessons.filter(l => l.impact === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Impact</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {new Set(lessons.map(l => l.category).filter(Boolean)).size}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {lessons.filter(l => l.application.trim()).length}
              </div>
              <div className="text-sm text-gray-600">Actionable</div>
            </div>
          </div>

          {/* Category Breakdown */}
          {new Set(lessons.map(l => l.category).filter(Boolean)).size > 0 && (
            <div className="mt-6 pt-4 border-t border-yellow-200">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Categories</h5>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(lessons.map(l => l.category).filter(Boolean))).map(category => (
                  <span key={category} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {category} ({lessons.filter(l => l.category === category).length})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
