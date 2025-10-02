import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Users, FileText, CheckSquare, Clock, User } from 'lucide-react';
import { useWizard } from '../../contexts/WizardContext';
import type { MeetingNote, ActionItem } from '../../types';

export const MeetingNotesStep: React.FC = () => {
  const { memoryData, updateMemoryData } = useWizard();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<MeetingNote>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    attendees: [''],
    agenda: [''],
    notes: '',
    actionItems: []
  });

  const meetings = memoryData.meetingNotes || [];

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      attendees: [''],
      agenda: [''],
      notes: '',
      actionItems: []
    });
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const updatedMeetings = [...meetings];
    
    if (editingIndex !== null) {
      updatedMeetings[editingIndex] = formData;
    } else {
      updatedMeetings.push(formData);
    }

    // Sort meetings by date (newest first)
    updatedMeetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    updateMemoryData('meetingNotes', updatedMeetings);
    setEditingIndex(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setFormData(meetings[index]);
    setEditingIndex(index);
    setIsAddingNew(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this meeting note?')) {
      const updatedMeetings = meetings.filter((_, i) => i !== index);
      updateMemoryData('meetingNotes', updatedMeetings);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAddingNew(false);
    resetForm();
  };

  const updateFormField = (field: keyof MeetingNote, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: 'attendees' | 'agenda', index: number, value: string) => {
    const currentArray = formData[field];
    const updatedArray = [...currentArray];
    updatedArray[index] = value;
    updateFormField(field, updatedArray);
  };

  const addArrayItem = (field: 'attendees' | 'agenda') => {
    const currentArray = formData[field];
    updateFormField(field, [...currentArray, '']);
  };

  const removeArrayItem = (field: 'attendees' | 'agenda', index: number) => {
    const currentArray = formData[field];
    if (currentArray.length > 1) {
      updateFormField(field, currentArray.filter((_, i) => i !== index));
    }
  };

  // Action Items Management
  const addActionItem = () => {
    const newActionItem: ActionItem = {
      description: '',
      assignee: '',
      dueDate: '',
      status: 'open'
    };
    updateFormField('actionItems', [...formData.actionItems, newActionItem]);
  };

  const updateActionItem = (index: number, field: keyof ActionItem, value: string) => {
    const updatedActionItems = [...formData.actionItems];
    updatedActionItems[index] = { ...updatedActionItems[index], [field]: value };
    updateFormField('actionItems', updatedActionItems);
  };

  const removeActionItem = (index: number) => {
    const updatedActionItems = formData.actionItems.filter((_, i) => i !== index);
    updateFormField('actionItems', updatedActionItems);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting Notes</h2>
        <p className="text-gray-600">
          Record meeting minutes, attendees, agenda items, and track action items.
        </p>
      </div>

      {/* Add New Button */}
      {!isAddingNew && (
        <button
          onClick={() => setIsAddingNew(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Meeting</span>
        </button>
      )}

      {/* Form for Adding/Editing */}
      {isAddingNew && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingIndex !== null ? 'Edit Meeting Notes' : 'Add New Meeting'}
          </h3>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormField('title', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Weekly Team Standup, Project Kickoff"
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

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendees
              </label>
              {formData.attendees.map((attendee, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={attendee}
                    onChange={(e) => updateArrayField('attendees', index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="Attendee name"
                  />
                  {formData.attendees.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('attendees', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('attendees')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Attendee</span>
              </button>
            </div>

            {/* Agenda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agenda Items
              </label>
              {formData.agenda.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <CheckSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayField('agenda', index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="Agenda item"
                  />
                  {formData.agenda.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('agenda', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('agenda')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Agenda Item</span>
              </button>
            </div>

            {/* Meeting Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateFormField('notes', e.target.value)}
                className="textarea-field"
                placeholder="Record key discussion points, decisions made, and important information..."
                rows={6}
              />
            </div>

            {/* Action Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Action Items
                </label>
                <button
                  type="button"
                  onClick={addActionItem}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Action Item</span>
                </button>
              </div>

              {formData.actionItems.map((actionItem, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-medium text-gray-900">Action Item {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeActionItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={actionItem.description}
                        onChange={(e) => updateActionItem(index, 'description', e.target.value)}
                        className="input-field"
                        placeholder="What needs to be done?"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          value={actionItem.assignee}
                          onChange={(e) => updateActionItem(index, 'assignee', e.target.value)}
                          className="input-field"
                          placeholder="Assigned to"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={actionItem.dueDate}
                          onChange={(e) => updateActionItem(index, 'dueDate', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <select
                          value={actionItem.status}
                          onChange={(e) => updateActionItem(index, 'status', e.target.value)}
                          className="input-field"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="complete">Complete</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {formData.actionItems.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No action items yet. Click "Add Action Item" to get started.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingIndex !== null ? 'Update Meeting' : 'Save Meeting'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting List */}
      {meetings.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Meeting History ({meetings.length})
          </h3>
          
          {meetings.map((meeting, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {meeting.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(meeting.date)}</span>
                    </div>
                    {meeting.attendees.filter(a => a.trim()).length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{meeting.attendees.filter(a => a.trim()).length} attendees</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit meeting"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete meeting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Attendees */}
              {meeting.attendees.filter(a => a.trim()).length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Attendees</h5>
                  <div className="flex flex-wrap gap-2">
                    {meeting.attendees.filter(a => a.trim()).map((attendee, aIndex) => (
                      <span key={aIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda */}
              {meeting.agenda.filter(a => a.trim()).length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Agenda</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-4">
                    {meeting.agenda.filter(a => a.trim()).map((item, aIndex) => (
                      <li key={aIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {meeting.notes && (
                <div className="mb-4">
                  <div className="flex items-center space-x-1 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <h5 className="text-sm font-medium text-gray-700">Notes</h5>
                  </div>
                  <div className="bg-gray-50 border-l-4 border-green-400 p-4 rounded-r">
                    <p className="text-sm text-gray-800 whitespace-pre-line">{meeting.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Items */}
              {meeting.actionItems.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Action Items</h5>
                  <div className="space-y-2">
                    {meeting.actionItems.map((actionItem, aIndex) => (
                      <div key={aIndex} className="bg-white border border-gray-200 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-gray-800 flex-1">{actionItem.description}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(actionItem.status)}`}>
                            {actionItem.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          {actionItem.assignee && (
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{actionItem.assignee}</span>
                            </div>
                          )}
                          {actionItem.dueDate && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(actionItem.dueDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : !isAddingNew && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meeting notes yet</h3>
          <p className="text-gray-500 mb-4">
            Start documenting your meetings to keep track of decisions and action items.
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn-primary"
          >
            Record Your First Meeting
          </button>
        </div>
      )}

      {/* Quick Stats */}
      {meetings.length > 0 && !isAddingNew && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Meeting Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{meetings.length}</div>
              <div className="text-sm text-gray-600">Meetings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {meetings.reduce((sum, meeting) => sum + meeting.actionItems.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Action Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {meetings.reduce((sum, meeting) => 
                  sum + meeting.actionItems.filter(item => item.status === 'in-progress').length, 0
                )}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {meetings.reduce((sum, meeting) => 
                  sum + meeting.actionItems.filter(item => item.status === 'complete').length, 0
                )}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
