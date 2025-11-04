---
description: "Automated code quality workflow with AI-powered checks, import validation, syntax checking, type safety, and error prevention. Apply when working with code quality enforcement, automated error detection, or development optimization."
alwaysApply: true
category: "development"
priority: "high"
triggers:
  - "keywords: code quality, linting, testing, validation"
  - "file_patterns: *.ts, *.js, *.py, *.java, *.swift, *.kt"
  - "context: code review, quality assurance"
---

# AI Code Quality Automation Workflow

## Automated Quality Checks

### Pre-commit Validation

#### Syntax and Type Checking

- **TypeScript**: Run `tsc --noEmit` for type checking
- **JavaScript**: Use ESLint for syntax validation
- **Python**: Run `python -m py_compile` for syntax check
- **Java**: Use `javac` for compilation check
- **Swift**: Use `swiftc` for compilation validation

#### Import Validation

- **Missing Imports**: Detect and suggest missing imports
- **Unused Imports**: Remove unused import statements
- **Circular Dependencies**: Detect and warn about circular imports
- **Import Order**: Enforce consistent import ordering
- **Path Validation**: Verify import paths are correct

#### Code Style Enforcement

- **Formatting**: Enforce consistent code formatting
- **Naming Conventions**: Validate naming patterns
- **Line Length**: Enforce maximum line length
- **Indentation**: Ensure consistent indentation
- **Spacing**: Validate proper spacing around operators

### Runtime Quality Checks

#### Error Prevention

- **Null/Undefined Checks**: Detect potential null reference errors
- **Type Safety**: Ensure type consistency
- **Boundary Checks**: Validate array bounds and limits
- **Resource Management**: Check for memory leaks
- **Exception Handling**: Verify proper error handling

#### Performance Validation

- **Complexity Analysis**: Check cyclomatic complexity
- **Performance Bottlenecks**: Identify slow operations
- **Memory Usage**: Monitor memory consumption
- **Resource Leaks**: Detect resource leaks
- **Optimization Opportunities**: Suggest improvements

## Quality Standards

### Code Metrics

#### Complexity Metrics

- **Cyclomatic Complexity**: Maximum 10 per function
- **Cognitive Complexity**: Maximum 15 per function
- **Nesting Depth**: Maximum 4 levels
- **Function Length**: Maximum 50 lines
- **Class Length**: Maximum 500 lines

#### Coverage Requirements

- **Unit Test Coverage**: Minimum 80%
- **Integration Test Coverage**: Minimum 70%
- **Critical Path Coverage**: Minimum 95%
- **Edge Case Coverage**: Minimum 60%
- **Error Path Coverage**: Minimum 50%

### Documentation Standards

#### Code Documentation

- **Function Documentation**: All public functions documented
- **Class Documentation**: All public classes documented
- **API Documentation**: All public APIs documented
- **Parameter Documentation**: All parameters documented
- **Return Value Documentation**: All return values documented

#### Comment Standards

- **Complex Logic**: Explain complex algorithms
- **Business Rules**: Document business logic
- **Temporary Code**: Mark temporary solutions
- **TODO Items**: Track pending improvements
- **Deprecated Code**: Mark deprecated functions

## Automated Testing

### Unit Testing

#### Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup test environment
  });

  afterEach(() => {
    // Cleanup test environment
  });

  it('should handle normal case', () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe('expected output');
  });

  it('should handle edge case', () => {
    // Test edge cases
  });

  it('should handle error case', () => {
    // Test error scenarios
  });
});
```

#### Test Coverage

- **Happy Path**: Test normal operation
- **Edge Cases**: Test boundary conditions
- **Error Cases**: Test error scenarios
- **Integration**: Test component interactions
- **Performance**: Test performance requirements

### Integration Testing

#### API Testing

- **Endpoint Testing**: Test all API endpoints
- **Authentication**: Test auth flows
- **Authorization**: Test permission checks
- **Data Validation**: Test input validation
- **Error Handling**: Test error responses

#### Database Testing

- **CRUD Operations**: Test database operations
- **Transaction Testing**: Test transaction handling
- **Constraint Testing**: Test database constraints
- **Performance Testing**: Test query performance
- **Data Integrity**: Test data consistency

## Quality Gates

### Pre-commit Gates

1. **Syntax Check**: All files must compile/parse
2. **Type Check**: All type errors must be resolved
3. **Lint Check**: All linting errors must be fixed
4. **Test Check**: All tests must pass
5. **Coverage Check**: Coverage must meet minimum threshold

### Pre-merge Gates

1. **Code Review**: All changes must be reviewed
2. **Integration Tests**: All integration tests must pass
3. **Performance Tests**: Performance must meet requirements
4. **Security Scan**: Security vulnerabilities must be addressed
5. **Documentation**: Documentation must be updated

### Pre-deployment Gates

1. **Full Test Suite**: All tests must pass
2. **Load Testing**: System must handle expected load
3. **Security Audit**: Security audit must pass
4. **Performance Benchmark**: Performance must meet SLA
5. **Rollback Plan**: Rollback plan must be ready

## Quality Tools Integration

### Static Analysis Tools

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **SonarQube**: Code quality analysis
- **CodeClimate**: Automated code review
- **DeepCode**: AI-powered code analysis

### Testing Tools

- **Jest**: JavaScript testing framework
- **Pytest**: Python testing framework
- **JUnit**: Java testing framework
- **XCTest**: iOS testing framework
- **Espresso**: Android testing framework

### Coverage Tools

- **Istanbul**: JavaScript coverage
- **Coverage.py**: Python coverage
- **JaCoCo**: Java coverage
- **Xcode Coverage**: iOS coverage
- **Android Coverage**: Android coverage

## Continuous Quality Improvement

### Metrics Tracking

- **Code Quality Trends**: Track quality over time
- **Bug Density**: Monitor bug rates
- **Technical Debt**: Track technical debt
- **Performance Metrics**: Monitor performance
- **Team Velocity**: Track development speed

### Quality Reviews

- **Weekly Quality Reviews**: Regular quality assessments
- **Monthly Quality Reports**: Comprehensive quality reports
- **Quarterly Quality Planning**: Quality improvement planning
- **Annual Quality Audit**: Comprehensive quality audit

### Process Improvement

- **Root Cause Analysis**: Analyze quality issues
- **Process Optimization**: Improve development processes
- **Tool Evaluation**: Evaluate and update tools
- **Training Programs**: Improve team skills
- **Best Practice Sharing**: Share quality practices

---

**Success Criteria**: High-quality code with comprehensive testing, automated quality checks, and continuous improvement processes.
