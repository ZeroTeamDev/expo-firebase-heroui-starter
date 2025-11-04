---
description: "Core development workflow phases and project structure. Always apply to ensure consistent development process across all projects."
alwaysApply: true
category: "core"
priority: "critical"
---

# Development Workflow Phases

## Phase Structure
All projects follow: `docs/ai/{requirements,design,planning,implementation,testing,deployment,monitoring}/`

## 1. Requirements (docs/ai/requirements/)
- **Problem Statement**: Define the core problem or pain point
- **Goals & Objectives**: Primary and secondary goals, non-goals
- **User Stories**: As a [user type], I want [action] so that [benefit]
- **Success Criteria**: Measurable outcomes and acceptance criteria
- **Constraints**: Technical, time, resource limitations

## 2. Design (docs/ai/design/)
- **Architecture Decisions**: System design and technology choices
- **Data Models**: Entity relationships and data structures
- **API Contracts**: Endpoint specifications and data formats
- **UI/UX Design**: User interface and experience design
- **Database Schema**: Data storage and relationships

## 3. Planning (docs/ai/planning/)
- **Task Breakdown**: Detailed task decomposition
- **Dependencies**: Task relationships and prerequisites
- **Estimates**: Time and effort estimates
- **Timeline**: Project schedule and milestones
- **Resource Allocation**: Team assignments and responsibilities

## 4. Implementation (docs/ai/implementation/)
- **Code Development**: Following design specifications
- **Feature Implementation**: Building according to requirements
- **Code Quality**: Following established standards
- **Documentation**: Inline code documentation
- **Progress Tracking**: Regular updates and status reports

## 5. Testing (docs/ai/testing/)
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Complete user journey testing
- **Coverage Targets**: Minimum test coverage requirements
- **Test Automation**: Automated testing strategies

## 6. Deployment (docs/ai/deployment/)
- **Deployment Strategy**: Release and rollback plans
- **Environment Configuration**: Dev, staging, production setup
- **CI/CD Pipeline**: Automated build and deployment
- **Monitoring Setup**: Production monitoring configuration
- **Documentation**: Deployment procedures and runbooks

## 7. Monitoring (docs/ai/monitoring/)
- **Metrics Collection**: Key performance indicators
- **Logging Strategy**: Application and system logging
- **Alerting Rules**: Automated alert configuration
- **Performance Monitoring**: System health and performance
- **User Analytics**: Usage patterns and feedback

## Workflow Integration

### Phase Transitions
1. **Requirements → Design**: Validate requirements completeness
2. **Design → Planning**: Ensure design is implementable
3. **Planning → Implementation**: Confirm resource availability
4. **Implementation → Testing**: Code review and quality gates
5. **Testing → Deployment**: Test coverage and quality metrics
6. **Deployment → Monitoring**: Production readiness checklist

### Quality Gates
- **Requirements Gate**: Stakeholder approval and sign-off
- **Design Gate**: Technical review and architecture validation
- **Planning Gate**: Resource confirmation and timeline approval
- **Implementation Gate**: Code review and quality standards
- **Testing Gate**: Coverage targets and test results
- **Deployment Gate**: Production readiness and rollback plan
- **Monitoring Gate**: Operational readiness and alerting

### Documentation Standards
- **Living Documents**: Keep documentation current with implementation
- **Version Control**: Track changes and maintain history
- **Collaboration**: Enable team access and contribution
- **Review Process**: Regular documentation reviews and updates

---

**Standardized 7-phase development workflow ensuring consistent project delivery across all platforms and teams.**
