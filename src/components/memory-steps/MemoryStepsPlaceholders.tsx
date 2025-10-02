import React from 'react';

export const GlossaryStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Glossary</h2>
        <p className="text-gray-600">
          Define terms and concepts used in the project.
        </p>
      </div>
      <div className="text-center py-12">
        <p className="text-gray-500">Glossary management coming soon...</p>
      </div>
    </div>
  );
};

export const MeetingNotesStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting Notes</h2>
        <p className="text-gray-600">
          Record meeting notes and action items.
        </p>
      </div>
      <div className="text-center py-12">
        <p className="text-gray-500">Meeting notes management coming soon...</p>
      </div>
    </div>
  );
};

export const LessonsLearnedStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lessons Learned</h2>
        <p className="text-gray-600">
          Document insights and lessons from the project.
        </p>
      </div>
      <div className="text-center py-12">
        <p className="text-gray-500">Lessons learned management coming soon...</p>
      </div>
    </div>
  );
};

export const OnboardingNotesStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Notes</h2>
        <p className="text-gray-600">
          Create guides for new team members.
        </p>
      </div>
      <div className="text-center py-12">
        <p className="text-gray-500">Onboarding notes management coming soon...</p>
      </div>
    </div>
  );
};
