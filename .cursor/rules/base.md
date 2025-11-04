# Kien DevKit Enhanced Rules

## Project Context
Phase documentation is located in `docs/ai/`.

## Enhanced Rule System

### Core Rules
- **universal-base-rule.mdc**: Universal base rule for all projects
- **base-rules.mdc**: Essential development principles and code quality standards
- **user-intent-analysis-workflow.mdc**: Enhanced reasoning and intent analysis
- **file-protection-rules.mdc**: File safety and backup protocols
- **project-identity-enforcement.mdc**: Project identity and consistency management

### Development Rules
- **development-rules.mdc**: General development rules for all technologies
- **frontend-rules.mdc**: Frontend development with React, Vue, Angular
- **backend-rules.mdc**: Backend development with Node.js, Python, etc.

### Planning & Workflow
- **planning-workflow.mdc**: Structured brainstorming and planning process
- **cursor-optimization-rules.mdc**: Cursor AI performance optimization
- **documentation-rules.mdc**: Comprehensive documentation standards

### Integration Rules
- **context7-auto-workflow.mdc**: Context7 MCP server integration
- Additional integration rules for MCP servers and external tools

## Documentation Structure
- `docs/ai/requirements/` - Problem understanding and requirements
- `docs/ai/design/` - System architecture and design decisions (include mermaid diagrams)
- `docs/ai/planning/` - Task breakdown and project planning
- `docs/ai/implementation/` - Implementation guides and notes
- `docs/ai/testing/` - Testing strategy and test cases
- `docs/ai/deployment/` - Deployment and infrastructure docs
- `docs/ai/monitoring/` - Monitoring and observability setup

## Enhanced Development Workflow

### 1. Intent Analysis (Mandatory)
- Always analyze user intent before taking action
- Understand context and goals behind requests
- Propose optimal solutions with alternatives
- Confirm understanding before proceeding

### 2. Project Identity Management
- Check .project-identity for project structure and language
- Create .project-identity if missing
- Maintain consistency across all project files
- Use English as primary language for all technical content

### 3. File Safety
- Always backup files before major changes
- Use version control for all modifications
- Document breaking changes
- Maintain file organization

### 4. Code Quality Standards
- Write clean, readable code in English
- Use consistent naming conventions
- Add appropriate comments for complex logic
- Keep functions and classes focused
- Follow SOLID principles
- Implement proper error handling

### 5. Planning Process
- Follow 4-role process: Planner > Architect > Builder > Tester
- Create detailed plans before coding
- Use EARS format for requirements
- Break complex tasks into manageable pieces

## AI Interaction Guidelines
- When implementing features, first check relevant phase documentation
- For new features, start with requirements clarification
- Update phase docs when significant changes or decisions are made
- Use Context7 integration for industry best practices
- Apply appropriate rules based on file type and context

## Testing & Quality
- Write tests alongside implementation
- Follow the testing strategy defined in `docs/ai/testing/`
- Use `/writing-test` to generate unit and integration tests targeting 100% coverage
- Ensure code passes all tests before considering it complete

## Documentation
- Update phase documentation when requirements or design changes
- Keep inline code comments focused and relevant
- Document architectural decisions and their rationale
- Use mermaid diagrams for any architectural or data-flow visuals
- Record test coverage results and outstanding gaps in `docs/ai/testing/`

## Key Commands
When working on this project, you can run commands to:
- Understand project requirements and goals (`review-requirements`)
- Review architectural decisions (`review-design`)
- Plan and execute tasks (`execute-plan`)
- Verify implementation against design (`check-implementation`)
- Suggest missing tests (`suggest-tests`)
- Perform structured code reviews (`code-review`)

## Rule System Benefits
- **Token Efficiency**: 95%+ reduction in auto-attached rules
- **Context-Aware**: Rules load based on project type and current work
- **Comprehensive**: Covers all aspects of development
- **Maintainable**: Easy to update and extend
- **Flexible**: Adapts to different project needs