# GitHub Copilot Integration Guide for Arcana Project

*AI-Assisted Development Guidelines and Reference Prompts*  
*Last Updated: October 2, 2025*

## 📋 Quick Reference

**Always reference these documents when working on this project:**
- **Project Spec:** [`docs/spec/arcana-project-spec.md`](./spec/arcana-project-spec.md)
- **Project Memory:** [`docs/memory/arcana-project-memory.md`](./memory/arcana-project-memory.md)
- **Codebase Root:** `/src/` directory contains all application code

## 🤖 GitHub Copilot Configuration

### Essential Context Prompts

#### Project Context Prompt
```
This is the Arcana project - a React 19 + TypeScript + Vite wizard-driven documentation platform. 

Key context:
- Project Spec: docs/spec/arcana-project-spec.md
- Project Memory: docs/memory/arcana-project-memory.md  
- Architecture: Component-based with React Context for state management
- Styling: Tailwind CSS with custom modal components
- File Structure: src/components/, src/contexts/, src/utils/, src/types/
- Recent Focus: Custom confirmation modals, sample document loading, UX improvements

Please reference the project spec and memory documents when suggesting code changes or new features.
```

#### Code Style Prompt
```
For this Arcana project, follow these patterns:

TypeScript:
- Strict mode enabled, proper interface definitions
- Defensive programming with null checks and validation
- Error handling with meaningful user messages

React:
- Functional components with hooks
- Custom hooks for business logic (useWizard)
- Context providers for global state
- Component isolation with clear props interfaces

Styling:
- Tailwind CSS utility classes
- Consistent spacing and color scheme
- Custom modal components instead of browser dialogs
- Responsive design (mobile-first)

File Organization:
- Components in src/components/ with clear naming
- Utilities in src/utils/ for shared logic
- Types in src/types/ for interfaces
- Context providers in src/contexts/

Always check existing patterns before creating new ones.
```

#### Memory Update Prompt
```
When implementing features or making decisions, update the project memory document at docs/memory/arcana-project-memory.md.

Add entries to:
- Decision Log: For architectural or UX decisions with rationale
- Lessons Learned: For insights gained during development  
- Glossary: For new technical terms or concepts
- Meeting Notes: For significant discussions or requirements

Format decisions with: Date, Description, Rationale, Status, Impact, Stakeholders, Implementation details.
```

### Feature Development Prompts

#### New Component Creation
```
Create a new React component for [FEATURE] following Arcana project patterns:

Reference:
- Project spec: docs/spec/arcana-project-spec.md
- Existing components in src/components/
- TypeScript interfaces in src/types/

Requirements:
- TypeScript with proper interfaces
- Tailwind CSS styling matching existing design
- Accessibility considerations (ARIA labels, keyboard navigation)
- Error boundaries and defensive programming
- Integration with existing wizard context if applicable

Follow the component structure and naming conventions used in existing components.
```

#### Bug Fix Prompt  
```
Fix [BUG DESCRIPTION] in the Arcana project:

Context:
- Project memory: docs/memory/arcana-project-memory.md
- Recent changes and lessons learned are documented
- Error handling patterns established in utils/markdownParsers.ts
- Custom modal patterns in components/ConfirmationModal.tsx

Requirements:
- Follow existing error handling patterns
- Add appropriate validation and null checks
- Update project memory with lessons learned if applicable
- Maintain consistency with established code style
```

#### Feature Enhancement Prompt
```
Enhance [EXISTING FEATURE] in the Arcana project:

References:
- Current implementation in [FILE PATH]
- Project requirements in docs/spec/arcana-project-spec.md
- Previous decisions in docs/memory/arcana-project-memory.md

Ensure:
- Backward compatibility with existing wizard flow
- Consistent UX with custom modal patterns
- Proper TypeScript typing and error handling
- Update to project memory if significant decisions made
```

### Testing and Quality Prompts

#### Code Review Prompt
```
Review this code for the Arcana project against established patterns:

Check for:
- TypeScript strict mode compliance
- Error handling and validation
- Accessibility considerations
- Consistency with existing components
- Performance implications for wizard flow
- Integration with useWizard context

Reference project standards in docs/spec/arcana-project-spec.md
```

#### Refactoring Prompt
```
Refactor this code following Arcana project patterns:

Goals:
- Extract reusable logic to src/utils/
- Improve TypeScript type safety
- Enhance error handling
- Maintain component isolation
- Follow established naming conventions

Reference existing utilities and patterns before creating new ones.
```

## 📚 Common Implementation Patterns

### Modal Confirmations
```typescript
// Always use custom ConfirmationModal instead of window.confirm
const [showConfirmModal, setShowConfirmModal] = useState(false);

const handleAction = () => {
  setShowConfirmModal(true);
};

const handleConfirmAction = () => {
  setShowConfirmModal(false);
  // Perform actual action
};

// In JSX:
<ConfirmationModal
  isOpen={showConfirmModal}
  onClose={() => setShowConfirmModal(false)}
  onConfirm={handleConfirmAction}
  title="Confirm Action"
  message="Clear warning message about consequences"
  confirmText="Action Name"
  cancelText="Cancel"
  type="warning" // or "danger"
/>
```

### Error Handling
```typescript
// Always include comprehensive error handling
try {
  const result = await someOperation();
  if (!result || !result.data) {
    throw new Error('Operation failed: No data returned');
  }
  // Process result
} catch (error) {
  console.error('Operation failed:', error);
  if ((window as any).showToast) {
    (window as any).showToast(
      `Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'error'
    );
  }
}
```

### TypeScript Interfaces
```typescript
// Always define proper interfaces for component props
interface ComponentProps {
  required: string;
  optional?: boolean;
  callback: (data: SomeType) => void;
}

export const Component: React.FC<ComponentProps> = ({ 
  required, 
  optional = false, 
  callback 
}) => {
  // Component implementation
};
```

### Utility Functions
```typescript
// Create shared utilities for reusable logic
export const utilityFunction = (input: InputType): ResultType => {
  // Validate input
  if (!input || typeof input !== 'expected') {
    throw new Error('Invalid input provided');
  }
  
  // Process and return result
  return processedResult;
};
```

## 🔄 Documentation Update Workflow

### When to Update Memory Document

**Always update for:**
- New architectural decisions
- Bug fixes with lessons learned  
- UX improvements and rationale
- New team members or role changes
- Significant refactoring decisions

**Memory sections to update:**
- **Decision Log:** New decisions with full context
- **Lessons Learned:** Insights gained during development
- **Glossary:** New technical terms or concepts
- **Meeting Notes:** Important discussions or requirement changes

### When to Update Spec Document

**Always update for:**
- New features or capabilities
- API changes or new endpoints
- Technology stack modifications
- Architecture changes
- Requirement modifications

**Spec sections to update:**
- **Functional Requirements:** New features or capabilities
- **Technical Requirements:** Stack or architecture changes
- **API Specifications:** New interfaces or data models
- **Roadmap:** Timeline or milestone updates

## 🎯 AI Assistant Best Practices

### Context Awareness
- Always read project spec and memory before suggesting changes
- Reference existing decisions and patterns
- Consider impact on wizard flow and user experience
- Maintain consistency with established code style

### Code Quality
- Follow TypeScript strict mode requirements
- Implement proper error handling and validation
- Consider accessibility from the start
- Write maintainable, testable code

### Documentation
- Update memory document for significant decisions
- Add inline comments for complex logic
- Document new interfaces and types
- Explain architectural choices in commit messages

### User Experience
- Prioritize user experience over technical complexity
- Use custom modals instead of browser dialogs
- Provide clear error messages and recovery paths
- Test edge cases and error conditions

---

## 📖 Example AI Prompts for Common Tasks

### Adding a New Wizard Step
```
Add a new wizard step for [STEP NAME] to the Arcana documentation wizard:

Requirements from spec:
- Should fit into existing wizard flow
- Follow established step patterns in src/components/[memory|spec]-steps/
- Include proper validation and error handling
- Integrate with useWizard context
- Support both memory and spec document types if applicable

Reference existing step implementations and maintain consistency with established patterns.
```

### Improving Error Handling
```
Improve error handling in [COMPONENT/FUNCTION] following Arcana project patterns:

Current patterns:
- Comprehensive try/catch blocks
- Meaningful error messages for users
- Console logging for debugging
- Toast notifications for user feedback
- Graceful fallbacks where possible

Reference error handling in utils/markdownParsers.ts for established patterns.
```

### Accessibility Enhancement
```
Enhance accessibility for [COMPONENT] in the Arcana project:

Requirements:
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management for modals
- Color contrast compliance

Reference existing modal components for established accessibility patterns.
```

This guide should be referenced whenever working with AI assistants on the Arcana project to ensure consistency, quality, and proper documentation updates.