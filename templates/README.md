# Starter Templates

Created by Kien AI (leejungkiin@gmail.com)

Starter templates for modules, screens, components, and services used by CLI generators.

## Template Structure

### Module Template
- `module-template/index.ts` - Module definition template
- Placeholders: `{{ModuleTitle}}`, `{{moduleId}}`, `{{category}}`, `{{Description}}`

### Screen Template
- `screen-template/index.tsx` - Screen component template
- Placeholders: `{{ScreenTitle}}`, `{{ScreenName}}`, `{{Subtitle}}`, `{{Description}}`

### Component Template
- `component-template/{{ComponentName}}.tsx` - Component template
- `component-template/index.ts` - Component export template
- Placeholders: `{{ComponentName}}`, `{{Category}}`

### Service Template
- `service-template/{{serviceName}}.ts` - Service template
- `service-template/index.ts` - Service export template
- Placeholders: `{{ServiceName}}`, `{{serviceName}}`, `{{Category}}`, `{{Description}}`

## Usage

Templates are automatically used by CLI generators:

```bash
npm run cli module my-feature
npm run cli component Button
npm run cli service auth
npm run cli screen Login
```

## Placeholder Replacement

CLI generators replace placeholders with actual values:

- `{{ModuleTitle}}` → PascalCase module title
- `{{moduleId}}` → kebab-case module ID
- `{{ScreenName}}` → PascalCase screen name
- `{{ComponentName}}` → PascalCase component name
- `{{ServiceName}}` → PascalCase service name
- `{{serviceName}}` → camelCase service name
- `{{category}}` → category folder name
- `{{Description}}` → description text
- `{{Subtitle}}` → subtitle text

## Customization

To customize templates:

1. Edit template files in `templates/` directory
2. Update CLI generators to use new placeholders
3. Test with `npm run cli` commands

