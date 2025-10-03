# Arcana Format Quick Reference

## 🎯 Essential Formatting Rules

### Section Headers (Required Emojis)
```markdown
## 🏢 Project Information
## 📋 Decision Log  
## 📚 Glossary
## 🤝 Meeting Notes
## 💡 Lessons Learned
## 👥 Onboarding Notes
## ⚙️ Technical Requirements
## 🎯 Functional Requirements
## 🔒 Non-Functional Requirements
## 🛣️ Implementation Roadmap
## 🔌 API Specifications
```

### Action Items Format
```markdown
**Action Items:**
- [x] Completed task (Person Name - Date)
- [ ] Pending task (Person Name - Date)
```

### Required Field Names
```markdown
**Date:** YYYY-MM-DD
**Status:** [Proposed | Decided | Implemented | Deprecated]
**Priority:** [Critical | High | Medium | Low]
**Impact:** [High | Medium | Low]
**Method:** [GET | POST | PUT | DELETE]
**User Story:** As a [user type], I want [action] so that [benefit]
```

### User Stories & Acceptance Criteria
```markdown
**User Story:** As a [user type], I want to [action] so that [benefit/goal]
**Acceptance Criteria:**
- [ ] Specific testable criterion 1
- [ ] Specific testable criterion 2
```

### API Endpoint Format
```markdown
#### [Endpoint Name]
**Method:** GET
**URL:** `/api/endpoint-path`
**Description:** [What this endpoint does]

**Request:**
```json
{
  "field": "value"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {}
}
```

## 🤖 AI Prompt Templates

### Update Memory Document
```
Update my project memory document with [specific information]. Follow the existing format and use these sections:
- Decision Log: For decisions made
- Meeting Notes: For team discussions  
- Lessons Learned: For insights gained
- Glossary: For new terms

Maintain Arcana compatibility with exact field names and action item format: - [x] Task (Person - Date)
```

### Update Spec Document  
```
Update my specification document with [specific changes]. Use the established format:
- Functional Requirements: For new features
- API Specifications: For endpoints
- User stories format: "As a [user], I want [action] so that [benefit]"
- Acceptance criteria as checkboxes: - [ ] Criterion

Keep all field names exactly as specified for Arcana compatibility.
```

## ⚠️ Common Mistakes to Avoid

❌ Wrong: `## Meeting Notes` (missing emoji)  
✅ Right: `## 🤝 Meeting Notes`

❌ Wrong: `- [x] John: Fix bug (Due: Oct 5)`  
✅ Right: `- [x] Fix bug (John - Oct 5)`

❌ Wrong: `**Date**: October 5, 2025`  
✅ Right: `**Date:** 2025-10-05`

❌ Wrong: `**Priority**: High`  
✅ Right: `**Priority:** High`

❌ Wrong: `**HTTP Method:** GET`  
✅ Right: `**Method:** GET`