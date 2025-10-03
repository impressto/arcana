# Arcana Document Templates

This directory contains standardized templates for creating project documentation that is compatible with the Arcana documentation platform. These templates establish a consistent format that enables seamless importing, parsing, and rendering of your project documentation.

## 📄 Available Templates

### 1. Memory Document Template (`memory-document-template.md`)
Use this template for capturing organizational knowledge, including:
- **Decision logs** - Important project decisions and their rationale
- **Meeting notes** - Team meetings, discussions, and action items  
- **Lessons learned** - Key insights and knowledge gained during development
- **Glossary** - Important terms, acronyms, and concepts
- **Onboarding notes** - New team member progress and resources

### 2. Specification Document Template (`spec-document-template.md`)
Use this template for technical project specifications, including:
- **Project overview** - Goals, scope, and business value
- **Technical requirements** - Technology stack and system requirements
- **Functional requirements** - Features, user stories, and acceptance criteria
- **Non-functional requirements** - Performance, security, and usability requirements
- **Implementation roadmap** - Phases, deliverables, and timelines
- **API specifications** - Endpoint documentation and examples

## 🚀 Getting Started

### 1. Copy Templates to Your Project
```bash
# Copy to your project's docs directory
cp templates/memory-document-template.md your-project/docs/project-memory.md
cp templates/spec-document-template.md your-project/docs/project-spec.md
```

### 2. Customize the Templates
Replace all placeholder text in brackets:
- `[Project Name]` → Your actual project name
- `[Date]` → Current date (YYYY-MM-DD format)
- `[Your description here]` → Your actual content
- `[User type]` → Actual user roles (admin, customer, etc.)

### 3. Start Documenting
Begin filling out the sections relevant to your project. You don't need to complete every section immediately - the templates are designed to grow with your project.

## 🤖 AI Agent Integration

### Prompt Templates for AI Agents

#### For Memory Document Updates:
```
Please update my project memory document (project-memory.md) with the following information:

[Describe what happened, decisions made, meetings held, lessons learned, etc.]

Follow the format in the existing document and add entries to the appropriate sections. Make sure to:
- Use the exact section headers and field names for Arcana compatibility
- Format action items as: - [x] Task description (Assignee - Date)
- Include proper dates, stakeholders, and rationale for decisions
- Add any new terms to the glossary if needed
```

#### For Specification Document Updates:
```
Please update my project specification document (project-spec.md) with the following changes:

[Describe new features, requirements changes, API updates, etc.]

Follow the format in the existing document and:
- Add new features to the appropriate functional requirements section
- Use the user story format: "As a [user], I want [action] so that [benefit]"
- Include acceptance criteria as checkboxes: - [ ] Criterion
- Update API specifications with proper JSON examples
- Maintain all field names and formatting for Arcana compatibility
```

### Advanced AI Integration

For more sophisticated AI assistance, you can use these prompt patterns:

#### Project Analysis and Documentation:
```
Analyze my project codebase and update both my memory document and specification document. Focus on:

Memory Document:
- Document any architectural decisions found in code comments or README files
- Extract and document any lessons learned from issue history or commit messages
- Identify technical terms that should be added to the glossary

Specification Document:
- Document API endpoints found in the codebase
- Extract user stories from issue titles and descriptions
- Update technical requirements based on package.json, dependencies, and config files
- Identify functional requirements from feature implementations

Maintain exact formatting for Arcana compatibility.
```

#### Weekly Documentation Updates:
```
It's been a week since our last documentation update. Please review recent:
- Git commits and their messages
- Closed issues and pull requests  
- Team meeting notes (if available)
- Any new decisions or changes

Update both documents with:
1. New decisions made this week
2. Lessons learned from completed work
3. Progress on roadmap items
4. Any new features or requirements
5. Updates to technical specifications

Use the established format and maintain Arcana compatibility.
```

## 📋 Format Requirements

### Critical Formatting Rules for Arcana Compatibility:

1. **Section Headers**: Must use exact emoji format
   ```markdown
   ## 🏢 Project Information
   ## 📋 Decision Log
   ## 🤝 Meeting Notes
   ```

2. **Action Items**: Must follow exact format
   ```markdown
   - [x] Completed task (Assignee - Date)
   - [ ] Pending task (Assignee - Date)
   ```

3. **Field Names**: Must be preserved exactly
   ```markdown
   **Date:** YYYY-MM-DD
   **Status:** [Proposed | Decided | Implemented]
   **Priority:** [Critical | High | Medium | Low]
   **User Story:** As a [user], I want [action] so that [benefit]
   ```

4. **API Specifications**: Must maintain structure
   ```markdown
   **Method:** GET
   **URL:** `/api/endpoint`
   **Description:** What this does
   ```

5. **Acceptance Criteria**: Must use checkboxes
   ```markdown
   - [ ] Criterion 1
   - [ ] Criterion 2
   ```

## 🔄 Integration with Arcana

Once your documents follow this format, you can:

1. **Import into Arcana**: Use the Import functionality to load your documents
2. **Use Sample Feature**: Load the template structure as a starting point
3. **Export from Arcana**: Generate documents that maintain this format
4. **Round-trip editing**: Edit in Arcana, export, edit externally, and re-import

## 📚 Best Practices

### Memory Documents:
- Update after every major decision or milestone
- Include rationale for all decisions, not just what was decided
- Document failures and mistakes as lessons learned
- Keep the glossary current with project-specific terms
- Track team member progress in onboarding notes

### Specification Documents:
- Write user stories from the user's perspective
- Make acceptance criteria specific and testable
- Keep API documentation current with actual implementation
- Update roadmap as priorities and timelines change
- Include non-functional requirements from the start

### AI Agent Collaboration:
- Be specific about what changes or additions you want
- Reference the exact document sections you want updated
- Ask for format compliance checks when unsure
- Use consistent terminology across all documents
- Regular weekly or sprint-based updates work best

## 🛠️ Troubleshooting

### Common Import Issues:
- **Action items not parsing**: Check format `- [x] Task (Person - Date)`
- **Sections not recognized**: Verify exact emoji usage in headers
- **Field names not recognized**: Ensure exact spelling of `**Date:**`, `**Status:**` etc.
- **API specs not importing**: Check JSON formatting and required fields

### Format Validation:
Before importing into Arcana, verify:
- All section headers match template exactly
- Action items follow the required format
- Field names are spelled exactly as shown
- JSON in API specs is valid
- Checkbox format is used for acceptance criteria

## 📞 Support

If you encounter issues with template compatibility or have suggestions for improvements:
1. Check that formatting matches the templates exactly
2. Verify all required fields are present
3. Test import with a small document first
4. Refer to the Arcana documentation for additional guidance

These templates are designed to evolve with your project and provide a solid foundation for maintainable, AI-friendly project documentation.