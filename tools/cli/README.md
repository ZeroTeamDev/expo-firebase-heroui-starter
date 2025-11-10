# CLI Tools

Created by Kien AI (leejungkiin@gmail.com)

Command-line tools for generating modules, components, services, and screens.

## Installation

Install required dependencies:

```bash
npm install --save-dev tsx
```

## Usage

### Generate Module

```bash
npm run cli module <name> [--category <category>] [--description <description>]
```

**Examples:**
```bash
# Generate a module in examples category (default)
npm run cli module my-feature

# Generate a module in a specific category
npm run cli module my-feature --category management

# Generate a module with description
npm run cli module my-feature --category examples --description "My feature module"
```

### Generate Component

```bash
npm run cli component <name> [--category <category>]
```

**Examples:**
```bash
# Generate a component in common category (default)
npm run cli component Button

# Generate a component in a specific category
npm run cli component DataTable --category data
```

### Generate Service

```bash
npm run cli service <name> [--category <category>] [--description <description>]
```

**Examples:**
```bash
# Generate a service in common category (default)
npm run cli service auth

# Generate a service in a specific category
npm run cli service payment --category ecommerce --description "Payment processing service"
```

### Generate Screen

```bash
npm run cli screen <name> [--category <category>] [--description <description>] [--subtitle <subtitle>]
```

**Examples:**
```bash
# Generate a screen in examples category (default)
npm run cli screen login

# Generate a screen in a specific category
npm run cli screen login --category auth --description "Login screen" --subtitle "User authentication"
```

## Generated Files

### Module
- Creates `modules/<category>/<name>/index.ts` with module definition
- Updates `modules/index.ts` to register the module
- Updates `modules/types.ts` to add module ID

### Component
- Creates `components/<category>/<ComponentName>.tsx` with component code
- Updates `components/<category>/index.ts` to export the component
- Updates `components/index.ts` to export from category (if needed)

### Service
- Creates `services/<category>/<serviceName>.ts` with service code
- Updates `services/<category>/index.ts` to export the service
- Updates `services/index.ts` to export from category (if needed)

### Screen
- Creates `app/modules/<category>/<name>/index.tsx` with screen code
- Note: Screen registration should be done via module generator

## Options

### Common Options

- `--category <category>`: Category/folder name (default: varies by command)
- `--description <description>`: Description for the generated code
- `--subtitle <subtitle>`: Subtitle (screen only)

## Examples

### Full Workflow

```bash
# 1. Generate a module
npm run cli module todo-app --category management --description "Todo application module"

# 2. Generate a screen for the module
npm run cli screen todo-list --category management --description "Todo list screen"

# 3. Generate components
npm run cli component TodoItem --category data
npm run cli component TodoForm --category forms

# 4. Generate services
npm run cli service todo --category database --description "Todo database service"
```

## Notes

- Module IDs are automatically converted to kebab-case
- Component names are converted to PascalCase
- Service names are converted to camelCase
- Screen names are converted to PascalCase for component names
- All generators automatically update index files for exports

