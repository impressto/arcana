# React Markdown Test Document

## Code Blocks and Syntax Highlighting

Here's some JavaScript with syntax highlighting:

```javascript
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};
```

And some TypeScript:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

const processUsers = (users: User[]): User[] => {
  return users.filter(user => user.isActive);
};
```

## Tables

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| User Authentication | ✅ Complete | High | OAuth 2.0 implementation |
| Data Export | 🔄 In Progress | Medium | CSV and JSON formats |
| Real-time Sync | ❌ Not Started | Low | WebSocket implementation |

## Task Lists

### Sprint Planning
- [x] Define user stories
- [x] Create wireframes
- [ ] Implementation
  - [x] Backend API
  - [ ] Frontend components
  - [ ] Testing
- [ ] Documentation
- [ ] Deployment

## Blockquotes

> **Important Note:** This is a critical system requirement that must be implemented according to security standards.

> ### Multi-line Blockquote
> 
> This blockquote spans multiple lines and includes formatting.
> 
> - It can contain lists
> - And **bold text**
> - Even `inline code`

## Links and References

Check out the [React Markdown documentation](https://github.com/remarkjs/react-markdown) for more details.

You can also reference internal sections like [Code Blocks](#code-blocks-and-syntax-highlighting).

## Inline Formatting

This text has **bold**, *italic*, and `inline code` formatting. You can also have ~~strikethrough~~ text.

## Horizontal Rules

Content above the rule.

---

Content below the rule.

## Nested Lists

1. **Phase 1: Planning**
   - Requirements gathering
   - User research
   - Technical architecture
     - Database design
     - API specification
     - Frontend framework selection

2. **Phase 2: Development**
   - Core functionality
   - User interface
   - Integration testing

3. **Phase 3: Deployment**
   - Production setup
   - Monitor and maintain

## Mixed Content

The system should handle `inline code` within **bold text** and *italic text with `code`* seamlessly.

### Mathematical Expressions (if supported)

The time complexity is O(n²) for the nested loop implementation.

## Emojis and Unicode

✅ Success  
❌ Error  
🔄 In Progress  
⚡ Performance Critical  
🔒 Security Requirement  
📊 Analytics  

## HTML Entities

This &amp; that, copyright &copy; 2025, registered &reg; trademark.