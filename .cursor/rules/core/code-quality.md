---
description: "Code quality standards and best practices. Apply when writing code, reviewing code, or ensuring code quality across all development activities."
alwaysApply: false
category: "core"
priority: "high"
---

# Code Quality Standards

## Core Principles

### SOLID Principles
- **Single Responsibility**: Each class/function has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes must be substitutable for base classes
- **Interface Segregation**: No client should depend on unused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### Clean Code Guidelines
- **Meaningful Names**: Use descriptive variable and function names
- **Small Functions**: Functions should do one thing well
- **Comments**: Explain why, not what
- **Formatting**: Consistent code formatting and style
- **Error Handling**: Proper exception handling and validation

## Code Standards

### Naming Conventions
```typescript
// Variables and functions: camelCase
const userName = 'john_doe';
function calculateTotalPrice() { }

// Classes: PascalCase
class UserService { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Files: kebab-case
// user-service.ts, feature-component.vue
```

### Function Design
```typescript
// Good: Single responsibility, clear naming
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Bad: Multiple responsibilities, unclear naming
function processUser(data: any) {
  // validation, transformation, and saving all in one
}
```

### Error Handling
```typescript
// Good: Specific error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    throw new UserInputError('Invalid input provided');
  }
  throw new InternalServerError('Service temporarily unavailable');
}

// Bad: Generic error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.log('Error occurred');
  return null;
}
```

## Testing Standards

### Test Structure (AAA Pattern)
```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' };
      const mockRepository = createMockRepository();
      
      // Act
      const result = await userService.createUser(userData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe(userData.name);
      expect(mockRepository.save).toHaveBeenCalledWith(userData);
    });
  });
});
```

### Coverage Requirements
- **Unit Tests**: Minimum 80% line coverage
- **Integration Tests**: Critical user flows covered
- **E2E Tests**: Main user journeys tested
- **Edge Cases**: Error conditions and boundary values

### Test Quality
- **Fast**: Tests should run quickly
- **Independent**: Tests should not depend on each other
- **Repeatable**: Tests should produce consistent results
- **Self-Validating**: Tests should have clear pass/fail criteria
- **Timely**: Tests should be written alongside code

## Code Review Standards

### Review Checklist
- [ ] **Functionality**: Code works as intended
- [ ] **Readability**: Code is easy to understand
- [ ] **Performance**: No obvious performance issues
- [ ] **Security**: No security vulnerabilities
- [ ] **Testing**: Adequate test coverage
- [ ] **Documentation**: Complex logic is documented
- [ ] **Standards**: Follows coding standards

### Review Process
1. **Self Review**: Author reviews their own code first
2. **Peer Review**: At least one team member reviews
3. **Automated Checks**: CI/CD pipeline validates code
4. **Approval**: Required approvals before merge

## Documentation Standards

### Code Documentation
```typescript
/**
 * Calculates the total price including tax and discounts
 * @param basePrice - The base price before tax and discounts
 * @param taxRate - The tax rate as a decimal (e.g., 0.1 for 10%)
 * @param discountAmount - The discount amount to apply
 * @returns The final price after tax and discount
 * @throws {ValidationError} When basePrice is negative
 */
function calculateTotalPrice(
  basePrice: number,
  taxRate: number,
  discountAmount: number
): number {
  if (basePrice < 0) {
    throw new ValidationError('Base price cannot be negative');
  }
  
  const priceAfterDiscount = basePrice - discountAmount;
  const priceWithTax = priceAfterDiscount * (1 + taxRate);
  
  return Math.max(0, priceWithTax);
}
```

### README Requirements
- **Setup Instructions**: How to install and run the project
- **API Documentation**: Endpoint descriptions and examples
- **Architecture Overview**: High-level system design
- **Contributing Guidelines**: How to contribute to the project
- **Deployment Instructions**: How to deploy the application

## Performance Standards

### Optimization Guidelines
- **Database Queries**: Optimize queries and use indexes
- **API Responses**: Minimize payload size and response time
- **Frontend Assets**: Optimize images and bundle size
- **Caching**: Implement appropriate caching strategies
- **Monitoring**: Track performance metrics

### Performance Targets
- **API Response Time**: < 200ms for 95th percentile
- **Page Load Time**: < 3 seconds for initial load
- **Bundle Size**: < 1MB for initial JavaScript bundle
- **Database Query Time**: < 100ms for 95th percentile

## Security Standards

### Input Validation
- **Sanitization**: Sanitize all user inputs
- **Validation**: Validate data types and formats
- **Authentication**: Implement proper authentication
- **Authorization**: Enforce access controls
- **HTTPS**: Use secure connections in production

### Security Checklist
- [ ] **Input Validation**: All inputs are validated
- [ ] **SQL Injection**: Parameterized queries used
- [ ] **XSS Prevention**: Output is properly escaped
- [ ] **CSRF Protection**: CSRF tokens implemented
- [ ] **Authentication**: Secure authentication system
- [ ] **Authorization**: Proper access controls
- [ ] **Secrets Management**: No hardcoded secrets
- [ ] **Dependencies**: Regular security updates

## Quality Metrics

### Code Quality Metrics
- **Cyclomatic Complexity**: < 10 per function
- **Function Length**: < 50 lines per function
- **Class Length**: < 500 lines per class
- **Test Coverage**: > 80% line coverage
- **Code Duplication**: < 5% duplicate code

### Process Metrics
- **Code Review Time**: < 24 hours for review
- **Bug Rate**: < 1 bug per 1000 lines of code
- **Technical Debt**: Regular refactoring and cleanup
- **Documentation**: Up-to-date documentation

---

**Comprehensive code quality standards ensuring maintainable, testable, and secure software development across all platforms.**
