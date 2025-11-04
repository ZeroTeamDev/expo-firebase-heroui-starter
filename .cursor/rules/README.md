# AI DevKit Enhanced Rule System

This template includes a comprehensive rule system based on Base-AI-Project, designed to optimize Cursor AI performance and provide structured development workflows.

## 🎯 Overview

The enhanced rule system provides:
- **95%+ token efficiency** through smart rule loading
- **Context-aware** rule application based on project type and current work
- **Comprehensive coverage** of all development aspects
- **Easy maintenance** and extensibility
- **Flexible adaptation** to different project needs

## 📁 Rule Structure

```
rules/
├── core/                           # Essential rules (always applied)
│   ├── base-rules.mdc
│   ├── user-intent-analysis-workflow.mdc
│   ├── file-protection-rules.mdc
│   └── project-identity-enforcement.mdc
├── development/                    # Development-specific rules
│   └── development-rules.mdc
├── platform/                      # Platform-specific rules
│   ├── frontend-rules.mdc
│   └── backend-rules.mdc
├── planning/                      # Planning and workflow rules
│   └── planning-workflow.mdc
├── integration/                   # Integration rules
│   └── context7-auto-workflow.mdc
├── specialized/                   # Specialized rules
│   ├── cursor-optimization-rules.mdc
│   └── documentation-rules.mdc
└── universal-base-rule.mdc        # Universal base rule
```

## 🚀 Quick Start

### 1. Configuration

The rule system is configured via `.cursorrc`:

```json
{
  "rules": {
    "enabled": true,
    "alwaysApplyRules": [
      "universal-base-rule.mdc",
      "base-rules.mdc",
      "user-intent-analysis-workflow.mdc",
      "file-protection-rules.mdc",
      "project-identity-enforcement.mdc"
    ],
    "autoApplyRules": {
      "*.js": ["frontend-rules.mdc", "development-rules.mdc"],
      "*.ts": ["frontend-rules.mdc", "development-rules.mdc"],
      "*.py": ["backend-rules.mdc", "development-rules.mdc"],
      "*.md": ["documentation-rules.mdc"]
    }
  }
}
```

### 2. Project Identity

Create a `.project-identity` file in your project root:

```json
{
  "projectName": "My Project",
  "projectType": "web",
  "primaryLanguage": "en",
  "techStack": {
    "frontend": ["React", "TypeScript"],
    "backend": ["Node.js", "Express"]
  },
  "projectStage": "development",
  "targetAudience": "End users",
  "projectGoals": ["Goal 1", "Goal 2"],
  "codingStandards": {
    "language": "en",
    "namingConvention": "camelCase",
    "indentation": "spaces",
    "lineLength": 80
  }
}
```

## 📋 Core Rules

### Universal Base Rule
- **File**: `universal-base-rule.mdc`
- **Purpose**: Single rule that auto-attaches, delegates to project-specific rules
- **Benefits**: 95%+ token reduction, smart delegation

### Base Rules
- **File**: `base-rules.mdc`
- **Purpose**: Essential development principles and code quality standards
- **Features**: Language enforcement, task management, file safety

### User Intent Analysis
- **File**: `user-intent-analysis-workflow.mdc`
- **Purpose**: Enhanced reasoning and intent analysis before any action
- **Features**: 4-phase analysis process, solution alternatives, confirmation

### File Protection
- **File**: `file-protection-rules.mdc`
- **Purpose**: File safety and backup protocols
- **Features**: Automatic backups, recovery procedures, safety measures

### Project Identity Enforcement
- **File**: `project-identity-enforcement.mdc`
- **Purpose**: Project identity and consistency management
- **Features**: Language enforcement, tech stack validation, consistency checks

## 🛠️ Development Rules

### General Development
- **File**: `development/development-rules.mdc`
- **Purpose**: Multi-language development standards
- **Features**: Code quality, architecture, security, performance, testing

### Frontend Development
- **File**: `platform/frontend-rules.mdc`
- **Purpose**: Frontend development with modern frameworks
- **Features**: React/Vue/Angular patterns, component design, performance optimization

### Backend Development
- **File**: `platform/backend-rules.mdc`
- **Purpose**: Backend development with various technologies
- **Features**: API design, database patterns, security, performance

## 📊 Planning & Workflow

### Planning Workflow
- **File**: `planning/planning-workflow.mdc`
- **Purpose**: Structured brainstorming and planning process
- **Features**: EARS requirements format, 4-role process, task breakdown

### Cursor Optimization
- **File**: `specialized/cursor-optimization-rules.mdc`
- **Purpose**: Cursor AI performance optimization
- **Features**: File size management, caching strategies, performance monitoring

### Documentation
- **File**: `specialized/documentation-rules.mdc`
- **Purpose**: Comprehensive documentation standards
- **Features**: README standards, API documentation, architecture docs

## 🔗 Integration Rules

### Context7 Integration
- **File**: `integration/context7-auto-workflow.mdc`
- **Purpose**: Context7 MCP server integration
- **Features**: Auto-check workflow, knowledge retrieval, caching

## 🎨 Usage Examples

### Web Development
```typescript
// When working with React + TypeScript
// Rules applied: frontend-rules.mdc, development-rules.mdc

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Backend Development
```typescript
// When working with Node.js + Express
// Rules applied: backend-rules.mdc, development-rules.mdc

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
});

const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }
  next();
};
```

## 🔧 Customization

### Adding New Rules

1. Create new rule file in appropriate directory
2. Add rule to `.cursorrc` configuration
3. Update this README with rule description

### Modifying Existing Rules

1. Edit the rule file directly
2. Test changes with your project
3. Update documentation if needed

### Disabling Rules

1. Remove rule from `.cursorrc` configuration
2. Or add rule to `.cursorignore` for specific projects

## 📈 Performance Benefits

### Token Efficiency
- **Before**: 20+ rules auto-attached
- **After**: 1 rule auto-attached
- **Reduction**: 95%+ token savings

### Performance Improvements
- Faster initial load
- Contextual rule loading
- Reduced memory usage
- Better AI response times

### Maintainability
- Single point of control
- Easy to update and extend
- Clear delegation structure
- Modular design

## 🚨 Troubleshooting

### Common Issues

1. **Rules not loading**
   - Check `.cursorrc` configuration
   - Verify rule file paths
   - Restart Cursor

2. **Performance issues**
   - Check file sizes (keep under 250 lines)
   - Use `.cursorignore` for large files
   - Optimize rule content

3. **Conflicting rules**
   - Check rule priorities
   - Review rule content for conflicts
   - Use specific rule conditions

### Debug Mode

Enable debug mode in `.cursorrc`:

```json
{
  "rules": {
    "enabled": true,
    "debug": true
  }
}
```

## 📚 Additional Resources

- [Base-AI-Project](https://github.com/your-org/Base-AI-Project) - Source of rule system
- [Cursor Documentation](https://cursor.sh/docs) - Cursor AI documentation
- [Context7 MCP](https://context7.io) - Context7 MCP server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add or modify rules
4. Test with your projects
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

_This enhanced rule system provides a solid foundation for AI-assisted development with optimal performance and comprehensive coverage._
