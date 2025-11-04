---
description: "Core development workflow with code quality, SOLID principles, error handling, and code duplication prevention. Apply when working with any programming language, code review, or quality assurance tasks."
alwaysApply: true
category: "development"
priority: "high"
triggers:
  - "file_patterns: *.ts, *.js, *.py, *.java, *.swift, *.kt"
  - "keywords: code, development, implementation"
  - "context: code review, quality assurance"
---

# Core Development Workflow

## Essential Development Rules

### Code Quality Standards

- Write clean, readable code with self-documenting names
- Follow consistent naming conventions (camelCase for variables, PascalCase for classes)
- Add appropriate comments for complex logic
- Keep functions and classes focused and single-purpose
- Maintain consistent indentation and formatting

### SOLID Principles

- **Single Responsibility**: Each class/function should have one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes must be substitutable for base classes
- **Interface Segregation**: No client should depend on methods it doesn't use
- **Dependency Inversion**: Depend on abstractions, not concretions

### Error Handling Standards

- Handle errors gracefully with meaningful error messages
- Use try-catch blocks appropriately
- Log important events and errors
- Have fallback plans for critical operations
- Validate inputs and handle edge cases

### Code Duplication Prevention

- **PROHIBITED**: Never duplicate code blocks
- Extract common functionality into reusable functions/classes
- Use inheritance and composition to share behavior
- Create utility libraries for common operations
- Refactor duplicated code immediately when detected

### Async/Await Validation

- Use async/await patterns correctly
- Handle promises properly
- Avoid callback hell
- Use proper error handling in async functions
- Validate async function signatures

### Import Management

- Keep imports organized and clean
- Remove unused imports
- Use absolute imports when possible
- Group imports logically (external, internal, relative)
- Validate import paths and dependencies

## Implementation Guidelines

### Before Writing Code

1. **Analyze Requirements**: Understand what needs to be built
2. **Design Architecture**: Plan the structure and relationships
3. **Choose Patterns**: Select appropriate design patterns
4. **Plan Error Handling**: Define error scenarios and responses

### During Development

1. **Write Tests First**: Follow TDD when possible
2. **Implement Incrementally**: Build and test small pieces
3. **Refactor Continuously**: Improve code quality as you go
4. **Document Decisions**: Record important architectural choices

### After Implementation

1. **Code Review**: Check for quality and standards compliance
2. **Test Coverage**: Ensure adequate test coverage
3. **Performance Check**: Verify performance requirements
4. **Documentation Update**: Update relevant documentation

## Quality Assurance

### Code Review Checklist

- [ ] Code follows naming conventions
- [ ] Functions are single-purpose and focused
- [ ] Error handling is comprehensive
- [ ] No code duplication exists
- [ ] Tests cover critical functionality
- [ ] Documentation is up to date
- [ ] Performance requirements are met

### Automated Checks

- Linting rules are enforced
- Type checking passes
- Unit tests pass
- Integration tests pass
- Code coverage meets minimum threshold
- Security scans pass

## Best Practices

### File Organization

- Keep related files together
- Use descriptive file and folder names
- Separate concerns appropriately
- Maintain consistent directory structure

### Version Control

- Use meaningful commit messages
- Make small, focused commits
- Use branches for feature development
- Review changes before merging

### Documentation

- Write clear, concise comments
- Document public APIs thoroughly
- Keep README files updated
- Maintain changelog for releases

---

**Success Criteria**: Clean, maintainable, testable code that follows industry best practices and project standards.
