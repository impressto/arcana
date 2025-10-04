import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Both document types support markdown export and professional formatting
        </p>
        <p className="text-sm text-gray-600">
          Like Arcana? 
          <a 
            href="https://github.com/impressto/arcana" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors duration-200"
          >
            Get the code here
          </a>
        </p>
      </div>
    </footer>
  );
};