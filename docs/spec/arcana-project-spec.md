# Arcana Project Specification

## Project Overview

**Project Name:** Arcana - Document Wizard System
**Version:** 1.0.0
**Last Updated:** October 2, 2025
**Owner:** impressto

### Purpose
Arcana is an interactive document wizard system that guides users through creating structured documentation for projects. It supports two main document types:
1. **Specification Documents** - Technical project requirements and planning
2. **Memory Documents** - Living project knowledge and decision tracking

### Core Value Proposition
- Streamlined document creation through guided wizards
- Consistent document structure across projects
- AI-assisted content generation and validation
- Import/export capabilities for existing documentation
- Sample document templates for quick starts

## Functional Requirements

### Document Wizard System
- **Multi-step wizard interface** with progress tracking
- **Document type selection** (Spec vs Memory)
- **Step-by-step guided input** with validation
- **Real-time preview** of generated documents
- **Save/restore progress** using localStorage
- **Import existing documents** via file upload or sample loading
- **Export to markdown** format

### Specification Document Wizard
**Steps:**
1. Project Overview - Basic project information and goals
2. Functional Requirements - Core features and user stories
3. Technical Requirements - Architecture and technology stack
4. API Specifications - Endpoints, data models, authentication
5. Non-Functional Requirements - Performance, security, scalability
6. Roadmap - Timeline and milestones

### Memory Document Wizard
**Steps:**
1. Project Information - Metadata and context
2. Decision Log - Architecture and design decisions with rationale
3. Glossary - Domain-specific terminology and definitions
4. Meeting Notes - Team communications and outcomes
5. Lessons Learned - Insights and best practices discovered
6. Onboarding Notes - New team member guidance

### User Interface Requirements
- **Responsive design** supporting desktop and mobile
- **Consistent styling** using Tailwind CSS
- **Accessibility compliance** (WCAG 2.1 AA)
- **Loading states** and error handling
- **Toast notifications** for user feedback
- **Custom modals** for confirmations (no browser alerts)

## Technical Requirements

### Technology Stack
- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7.x
- **Styling:** Tailwind CSS 3.x
- **Icons:** Lucide React
- **State Management:** React Context API
- **Persistence:** localStorage for progress saving
- **File Processing:** Custom markdown parsers

### Architecture Patterns
- **Component-based architecture** with reusable UI components
- **Context providers** for global state management
- **Custom hooks** for business logic encapsulation
- **Utility functions** for shared operations
- **Type-safe interfaces** for all data structures

### Code Quality Standards
- **TypeScript strict mode** enabled
- **ESLint configuration** for code consistency
- **Component isolation** with clear props interfaces
- **Error boundaries** for graceful error handling
- **Defensive programming** with null checks and validation

### File Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and helpers
├── styles/            # Global styles and CSS modules
└── assets/            # Static assets
```

## API Specifications

### Environment Variables
- `VITE_SAMPLE_SPEC_DOCUMENT_PATH` - Path to sample specification document
- `VITE_SAMPLE_MEMORY_DOCUMENT_PATH` - Path to sample memory document

### Data Models

#### SpecData Interface
```typescript
interface SpecData {
  projectOverview: ProjectOverviewData;
  functionalRequirements: FunctionalRequirementsData;
  technicalRequirements: TechnicalRequirementsData;
  apis: ApiData;
  nonFunctionalRequirements: NonFunctionalRequirementsData;
  roadmap: RoadmapData;
}
```

#### MemoryData Interface
```typescript
interface MemoryData {
  projectInfo: ProjectInfoData;
  decisionLog: DecisionLogData;
  glossary: GlossaryData;
  meetingNotes: MeetingNotesData;
  lessonsLearned: LessonsLearnedData;
  onboardingNotes: OnboardingNotesData;
}
```

### File Operations
- **Import:** Parse markdown files using regex-based parsers
- **Export:** Generate structured markdown from wizard data
- **Sample Loading:** Fetch and parse sample documents
- **Progress Persistence:** Save/restore wizard state to localStorage

## Non-Functional Requirements

### Performance
- **Initial Load Time:** < 2 seconds on standard broadband
- **Step Navigation:** Instant transitions between wizard steps
- **File Processing:** Handle documents up to 10MB
- **Build Size:** Optimized bundle under 500KB gzipped

### Security
- **Client-side Only:** No server-side data storage
- **Local Storage:** Sensitive data remains in browser
- **Input Validation:** Sanitize all user inputs
- **XSS Prevention:** Proper React rendering practices

### Usability
- **Responsive Design:** Support mobile devices 320px+
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Reader Support:** ARIA labels and descriptions
- **Error Recovery:** Clear error messages and recovery paths

### Maintainability
- **Modular Components:** Single responsibility principle
- **Type Safety:** Comprehensive TypeScript coverage
- **Documentation:** Inline comments and README files
- **Testing:** Unit tests for critical functions

## Roadmap

### Phase 1: Core Wizard (Completed)
- ✅ Basic wizard framework with step navigation
- ✅ Specification and memory document types
- ✅ Form validation and progress saving
- ✅ Import/export functionality
- ✅ Sample document loading
- ✅ Custom confirmation modals

### Phase 2: Enhanced UX (Next)
- 🔄 AI-assisted content suggestions
- 🔄 Document templates and presets
- 🔄 Collaborative editing features
- 🔄 Version control integration

### Phase 3: Advanced Features (Future)
- 📋 Multi-project management
- 📋 Team collaboration tools
- 📋 Integration with project management tools
- 📋 Analytics and usage tracking

## Dependencies

### Production Dependencies
- `react`: ^19.x - UI framework
- `react-dom`: ^19.x - DOM rendering
- `lucide-react`: ^0.x - Icon library

### Development Dependencies
- `@vitejs/plugin-react`: ^4.x - Vite React plugin
- `typescript`: ^5.x - Type checking
- `tailwindcss`: ^3.x - CSS framework
- `eslint`: ^9.x - Code linting
- `postcss`: ^8.x - CSS processing

---

**Note:** This specification is a living document that should be updated as the project evolves. All changes should be documented in the decision log within the memory documentation.