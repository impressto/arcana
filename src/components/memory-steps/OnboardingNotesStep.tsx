import { useState, useMemo } from 'react';
import { useWizard } from '../../contexts/WizardContext';
import { ConceptTooltip } from '../ConceptTooltip';
import { LearningCard } from '../LearningCard';
import type { OnboardingNote } from '../../types';
import { Plus, Users, CheckCircle, AlertCircle, Clock, Target, BookOpen, Trash2 } from 'lucide-react';

export function OnboardingNotesStep() {
  const { memoryData, updateMemoryData } = useWizard();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const onboardingEntries = memoryData.onboardingNotes || [];

  const [newEntry, setNewEntry] = useState<Omit<OnboardingNote, 'id'>>({
    newHireName: '',
    role: '',
    startDate: '',
    mentor: '',
    department: '',
    status: 'in-progress',
    onboardingTasks: [],
    resources: [],
    feedback: '',
    completionDate: '',
    notes: ''
  });

  const [newTask, setNewTask] = useState('');
  const [newResource, setNewResource] = useState({ title: '', url: '', type: 'document' });

  const handleAddEntry = () => {
    if (!newEntry.newHireName.trim() || !newEntry.role.trim()) return;

    const entry: OnboardingNote = {
      ...newEntry,
      id: Date.now().toString()
    };

    updateMemoryData('onboardingNotes', [...onboardingEntries, entry]);

    setNewEntry({
      newHireName: '',
      role: '',
      startDate: '',
      mentor: '',
      department: '',
      status: 'in-progress',
      onboardingTasks: [],
      resources: [],
      feedback: '',
      completionDate: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    updateMemoryData('onboardingNotes', onboardingEntries.filter((entry: OnboardingNote) => entry.id !== id));
  };

  const handleUpdateEntry = (id: string, updates: Partial<OnboardingNote>) => {
    updateMemoryData('onboardingNotes', onboardingEntries.map((entry: OnboardingNote) =>
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setNewEntry({
      ...newEntry,
      onboardingTasks: [...newEntry.onboardingTasks, { task: newTask, completed: false }]
    });
    setNewTask('');
  };

  const addResource = () => {
    if (!newResource.title.trim()) return;
    setNewEntry({
      ...newEntry,
      resources: [...newEntry.resources, { ...newResource }]
    });
    setNewResource({ title: '', url: '', type: 'document' });
  };

  const toggleTaskCompletion = (entryId: string, taskIndex: number) => {
    const entry = onboardingEntries.find((e: OnboardingNote) => e.id === entryId);
    if (!entry) return;

    const updatedTasks = entry.onboardingTasks.map((task: any, index: number) =>
      index === taskIndex ? { ...task, completed: !task.completed } : task
    );

    handleUpdateEntry(entryId, { onboardingTasks: updatedTasks });
  };

  const filteredEntries = useMemo(() => {
    return onboardingEntries.filter((entry: OnboardingNote) => {
      const matchesRole = filterRole === 'all' || entry.role.toLowerCase().includes(filterRole.toLowerCase());
      const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
      
      return matchesRole && matchesStatus;
    });
  }, [onboardingEntries, filterRole, filterStatus]);

  const stats = useMemo(() => {
    const total = onboardingEntries.length;
    const completed = onboardingEntries.filter((e: OnboardingNote) => e.status === 'completed').length;
    const inProgress = onboardingEntries.filter((e: OnboardingNote) => e.status === 'in-progress').length;
    const totalTasks = onboardingEntries.reduce((sum: number, e: OnboardingNote) => sum + e.onboardingTasks.length, 0);
    const completedTasks = onboardingEntries.reduce((sum: number, e: OnboardingNote) => 
      sum + e.onboardingTasks.filter((t: any) => t.completed).length, 0
    );

    return { total, completed, inProgress, totalTasks, completedTasks };
  }, [onboardingEntries]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'on-hold': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <ConceptTooltip concept="onboarding-notes">
            <h2 className="text-2xl font-bold text-gray-900 inline-block">Onboarding Notes</h2>
          </ConceptTooltip>
          <p className="text-gray-600 mt-1">Track new team member onboarding progress and resources</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Hire
        </button>
      </div>

      {/* Learning Mode Content */}
      <LearningCard
        type="why-matters"
        title="Why Onboarding Documentation Matters"
        content="Structured onboarding documentation ensures consistent team integration and helps AI assistants understand team structure and knowledge levels when providing guidance to different team members."
        className="mb-4"
      />

      <LearningCard
        type="tip"
        title="Pro Tip: Create Reusable Templates"
        content="Standardize your onboarding process with checklists and templates. This ensures nothing gets missed and helps AI assistants understand your team's knowledge transfer patterns."
        className="mb-4"
      />

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Total Hires</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-green-600">{stats.completed}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">In Progress</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Total Tasks</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{stats.totalTasks}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Tasks Done</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-orange-600">{stats.completedTasks}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
          <option value="analyst">Analyst</option>
          <option value="other">Other</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Statuses</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Hire</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="New hire name *"
              value={newEntry.newHireName}
              onChange={(e) => setNewEntry({ ...newEntry, newHireName: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Role *"
              value={newEntry.role}
              onChange={(e) => setNewEntry({ ...newEntry, role: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              placeholder="Start date"
              value={newEntry.startDate}
              onChange={(e) => setNewEntry({ ...newEntry, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Mentor"
              value={newEntry.mentor}
              onChange={(e) => setNewEntry({ ...newEntry, mentor: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Department"
              value={newEntry.department}
              onChange={(e) => setNewEntry({ ...newEntry, department: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={newEntry.status}
              onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          {/* Tasks Section */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Onboarding Tasks</h4>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            {newEntry.onboardingTasks.length > 0 && (
              <div className="space-y-1">
                {newEntry.onboardingTasks.map((task: any, index: number) => (
                  <div key={index} className="text-sm text-gray-600">• {task.task}</div>
                ))}
              </div>
            )}
          </div>

          {/* Resources Section */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
              <input
                type="text"
                placeholder="Resource title"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="URL (optional)"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
                <option value="tool">Tool</option>
              </select>
              <button
                onClick={addResource}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            {newEntry.resources.length > 0 && (
              <div className="space-y-1">
                {newEntry.resources.map((resource: any, index: number) => (
                  <div key={index} className="text-sm text-gray-600">
                    • {resource.title} ({resource.type})
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <textarea
              placeholder="Notes and observations..."
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              rows={3}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddEntry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!newEntry.newHireName.trim() || !newEntry.role.trim()}
            >
              Add Entry
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No onboarding entries found</h3>
            <p className="text-gray-600 mb-4">Start tracking new team member onboarding progress</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Entry
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{entry.newHireName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(entry.status)}`}>
                      {getStatusIcon(entry.status)}
                      <span className="ml-1">{entry.status.replace('-', ' ')}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div><strong>Role:</strong> {entry.role}</div>
                    <div><strong>Department:</strong> {entry.department}</div>
                    <div><strong>Start Date:</strong> {entry.startDate || 'Not set'}</div>
                    <div><strong>Mentor:</strong> {entry.mentor || 'Not assigned'}</div>
                    <div><strong>Completion:</strong> {entry.completionDate || 'In progress'}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks */}
              {entry.onboardingTasks.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Onboarding Tasks</h4>
                  <div className="space-y-2">
                    {entry.onboardingTasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <button
                          onClick={() => toggleTaskCompletion(entry.id, index)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            task.completed 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {task.completed && <CheckCircle className="w-3 h-3" />}
                        </button>
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {task.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {entry.resources.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {entry.resources.map((resource, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        {resource.url ? (
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {resource.title}
                          </a>
                        ) : (
                          <span className="text-gray-700">{resource.title}</span>
                        )}
                        <span className="text-gray-500">({resource.type})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {entry.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                  <p className="text-sm text-gray-700">{entry.notes}</p>
                </div>
              )}

              {/* Feedback */}
              {entry.feedback && (
                <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Feedback</h4>
                  <p className="text-sm text-gray-700">{entry.feedback}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
