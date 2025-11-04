---
description: "Core development workflows for Cursor IDE with references to shared workflows. Apply when working with development tasks, code quality, or project setup in Cursor."
alwaysApply: true
category: "development"
priority: "high"
triggers:
  - "file_patterns: *.ts, *.js, *.py, *.java, *.swift, *.kt"
  - "keywords: development, code quality, git"
  - "context: Cursor IDE, development work"
---

# Core Development Workflows for Cursor

## Referenced Shared Workflows

This file references the following shared workflows from `templates/shared/workflows/`:

### Core Development Workflows
- **Development Workflow**: `templates/shared/workflows/core/development-workflow.md`
  - Code quality standards, SOLID principles, error handling
  - Code duplication prevention, async/await validation
  - Import management and validation

- **Git Workflow**: `templates/shared/workflows/core/git-workflow.md`
  - Branching strategies, commit conventions
  - Collaboration workflows, best practices

- **Database Workflow**: `templates/shared/workflows/core/database-workflow.md`
  - Schema design, migration management
  - CRUD operations, performance optimization

- **Code Quality Workflow**: `templates/shared/workflows/core/code-quality-workflow.md`
  - Automated quality checks, testing requirements
  - Performance validation, documentation standards

## Cursor-Specific Enhancements

### IDE Integration
- **Cursor AI Integration**: Leverage Cursor's AI capabilities for code suggestions
- **Real-time Collaboration**: Use Cursor's collaboration features for team development
- **Code Navigation**: Utilize Cursor's advanced code navigation and search
- **IntelliSense**: Maximize use of Cursor's intelligent code completion

### Development Environment
- **Workspace Configuration**: Configure Cursor workspace for optimal development
- **Extension Management**: Use recommended extensions for enhanced productivity
- **Debugging Setup**: Configure debugging for different languages and frameworks
- **Terminal Integration**: Use integrated terminal for development tasks

### Code Quality Integration
- **Linting Integration**: Configure ESLint, Prettier, and other linters
- **Type Checking**: Enable strict TypeScript checking
- **Format on Save**: Configure automatic code formatting
- **Error Highlighting**: Enable real-time error detection and highlighting

## Activation Logic

### Automatic Activation
This workflow is automatically activated when:
- Working with source code files (*.ts, *.js, *.py, *.java, *.swift, *.kt)
- Performing development tasks in Cursor IDE
- Working on code quality improvements
- Managing git operations

### Manual Activation
Manually activate this workflow when:
- Setting up new development projects
- Reviewing code quality standards
- Implementing development best practices
- Training new team members

## Implementation Guidelines

### For Developers
1. **Follow Referenced Workflows**: Implement all standards from shared workflows
2. **Use Cursor Features**: Leverage Cursor's AI and collaboration features
3. **Maintain Quality**: Ensure code meets all quality standards
4. **Document Changes**: Document all significant changes and decisions

### For Team Leads
1. **Enforce Standards**: Ensure team follows all development standards
2. **Review Code**: Conduct regular code reviews using shared standards
3. **Mentor Team**: Help team members understand and apply standards
4. **Improve Process**: Continuously improve development processes

---

**Success Criteria**: Consistent application of development standards, effective use of Cursor IDE features, and high-quality code output.
