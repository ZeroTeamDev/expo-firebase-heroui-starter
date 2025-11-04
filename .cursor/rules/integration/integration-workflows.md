---
description: "Integration workflows for Cursor IDE including Context7 and memory bank systems. Apply when working with external integrations, knowledge management, or workflow coordination in Cursor."
alwaysApply: false
category: "integration"
priority: "medium"
triggers:
  - "keywords: context7, memory bank, integration, knowledge"
  - "context: external integrations, workflow management"
  - "file_patterns: *.config, *.env, *.json"
---

# Integration Workflows for Cursor

## Referenced Shared Workflows

This file references the following shared workflows from `templates/shared/workflows/`:

### Integration Workflows
- **Context7 Workflow**: `templates/shared/workflows/integration/context7-workflow.md`
  - Automatic context validation and knowledge base integration
  - Library documentation and best practices lookup
  - Graceful fallback handling

- **Memory Bank Workflow**: `templates/shared/workflows/integration/memory-bank-workflow.md`
  - Conversation state management and workflow tracking
  - Knowledge capture and experience sharing
  - Cross-project learning and team knowledge

## Cursor-Specific Integration Features

### Context7 Integration
- **Knowledge Base Access**: Leverage Context7 MCP for up-to-date documentation
- **Library Integration**: Automatically fetch library-specific best practices
- **Code Suggestions**: Use Context7 knowledge for intelligent code suggestions
- **Dependency Management**: Get recommendations for dependency updates

### Memory Bank Integration
- **Session Management**: Track development sessions and progress
- **Knowledge Persistence**: Maintain knowledge across Cursor sessions
- **Team Collaboration**: Share knowledge and experiences with team members
- **Project History**: Keep track of project decisions and learnings

### External Service Integration
- **API Integration**: Connect with external APIs and services
- **Authentication**: Handle authentication with external services
- **Data Synchronization**: Sync data with external systems
- **Error Handling**: Manage errors from external integrations

## Cursor IDE Integration

### Workspace Configuration
- **Environment Setup**: Configure development environment for integrations
- **API Keys**: Securely manage API keys and credentials
- **Service Configuration**: Configure external service connections
- **Monitoring Setup**: Set up monitoring for integrated services

### Development Workflow
1. **Context Check**: Automatically check Context7 for relevant information
2. **Memory Update**: Update memory bank with current session information
3. **Integration Setup**: Configure necessary integrations for the project
4. **Service Testing**: Test all integrated services and connections
5. **Documentation**: Document integration points and configurations

## Activation Logic

### Automatic Activation
This workflow is automatically activated when:
- Working with configuration files (*.config, *.env, *.json)
- Mentioning integration, context7, or memory bank keywords
- Setting up external service connections
- Managing project knowledge and documentation

### Manual Activation
Manually activate this workflow when:
- Setting up new project integrations
- Configuring external service connections
- Managing team knowledge and documentation
- Troubleshooting integration issues

## Implementation Guidelines

### For Developers
1. **Use Context7**: Leverage Context7 for up-to-date information and best practices
2. **Maintain Memory Bank**: Keep memory bank updated with project knowledge
3. **Document Integrations**: Document all integration points and configurations
4. **Test Thoroughly**: Test all integrations thoroughly before deployment

### For Team Leads
1. **Configure Services**: Set up and configure all necessary integrations
2. **Manage Knowledge**: Ensure team knowledge is properly captured and shared
3. **Monitor Integrations**: Monitor integration health and performance
4. **Train Team**: Train team members on integration workflows and tools

---

**Success Criteria**: Seamless integration with external services, comprehensive knowledge management, and effective team collaboration through shared knowledge.
