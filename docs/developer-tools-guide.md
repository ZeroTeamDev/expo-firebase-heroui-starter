# Developer Tools Guide

Created by Kien AI (leejungkiin@gmail.com)

Comprehensive guide for using CLI tools, dev tools, templates, and example apps in this Expo Firebase HeroUI Starter Kit.

## Table of Contents

- [CLI Tools](#cli-tools)
- [Dev Tools](#dev-tools)
- [Starter Templates](#starter-templates)
- [Example Apps](#example-apps)
- [AI Assistant Usage](#ai-assistant-usage)

## CLI Tools

### Overview

CLI tools provide code generation capabilities for modules, components, services, and screens. They automatically handle file creation, imports, exports, and registration.

### Installation

Install required dependencies:

```bash
npm install --save-dev tsx
```

### Basic Usage

```bash
npm run cli <command> <name> [options]
```

### Commands

#### Generate Module

Creates a new module with definition file and auto-registration.

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

**What it does:**

1. Creates `modules/<category>/<module-id>/index.ts` with module definition
2. Updates `modules/index.ts` to import and register the module
3. Updates `modules/types.ts` to add the module ID to the `ModuleId` type union

**Generated files:**

- `modules/<category>/<module-id>/index.ts` - Module definition
- Updates to `modules/index.ts` - Import and registration
- Updates to `modules/types.ts` - Type definitions

#### Generate Component

Creates a new component with TypeScript types and styling.

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

**What it does:**

1. Creates `components/<category>/<ComponentName>.tsx` with component code
2. Updates `components/<category>/index.ts` to export the component
3. Updates `components/index.ts` to export from category (if needed)

**Generated files:**

- `components/<category>/<ComponentName>.tsx` - Component implementation
- Updates to `components/<category>/index.ts` - Category exports
- Updates to `components/index.ts` - Root exports

#### Generate Service

Creates a new service with TypeScript types.

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

**What it does:**

1. Creates `services/<category>/<serviceName>.ts` with service code
2. Updates `services/<category>/index.ts` to export the service
3. Updates `services/index.ts` to export from category (if needed)

**Generated files:**

- `services/<category>/<serviceName>.ts` - Service implementation
- Updates to `services/<category>/index.ts` - Category exports
- Updates to `services/index.ts` - Root exports

#### Generate Screen

Creates a new screen component.

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

**What it does:**

1. Creates `app/modules/<category>/<name>/index.tsx` with screen code
2. Note: Screen registration should be done via module generator

**Generated files:**

- `app/modules/<category>/<name>/index.tsx` - Screen implementation

### Naming Conventions

CLI tools automatically convert names:

- **Module**: `my-feature` → `my-feature` (kebab-case)
- **Component**: `my-component` → `MyComponent` (PascalCase)
- **Service**: `my-service` → `myService` (camelCase)
- **Screen**: `my-screen` → `MyScreen` (PascalCase)

### File Structure

```
tools/cli/
├── index.ts                 # CLI runner
├── generate-module.ts       # Module generator
├── generate-component.ts    # Component generator
├── generate-service.ts      # Service generator
├── generate-screen.ts       # Screen generator
└── README.md                # CLI documentation
```

### Extending CLI Tools

To add a new generator:

1. Create a new generator file in `tools/cli/`:

   ```typescript
   // tools/cli/generate-<type>.ts
   export async function generate<Type>(
     name: string,
     options: Record<string, string>
   ) {
     // Implementation
   }
   ```

2. Register in `tools/cli/index.ts`:

   ```typescript
   const COMMANDS = {
     // ... existing commands
     <type>: generate<Type>,
   };
   ```

3. Update CLI README with usage instructions

## Dev Tools

### Overview

Dev tools provide debugging and development utilities for Firebase, database, analytics, and AI features.

### Accessing Dev Tools

Navigate to the Dev Tools module in the app:

- Route: `/modules/dev-tools`
- Or access via the modules list in the Explore tab

### Available Tools

#### Database Browser

Browse and query Firestore collections in real-time.

**Features:**

- View collections and documents
- Query with filters
- Real-time updates
- Document details view

**Usage:**

1. Open Dev Tools → Database Browser
2. Enter collection path (e.g., `users`, `posts/comments`)
3. View documents in real-time
4. Use query path for advanced filtering

**Example queries:**

- `users` - All users
- `users?orderBy=createdAt&limit=10` - Sorted and limited

#### Analytics Debugger

View analytics events in real-time.

**Features:**

- Real-time event tracking
- Event details and parameters
- Test event generation
- Event history

**Usage:**

1. Open Dev Tools → Analytics Debugger
2. Trigger events in your app
3. View events in the debugger
4. Use "Log Test Event" to test analytics

#### AI Playground

Test AI features and models.

**Features:**

- Interactive AI chat
- Model testing
- Prompt experimentation
- Response visualization

**Usage:**

1. Open Dev Tools → AI Playground
2. Enter prompts
3. Test different AI models
4. View responses in real-time

#### Firebase Emulator

Launch Firebase emulators for local development.

**Features:**

- Start/stop emulators
- Configure emulator ports
- Check emulator status
- Access emulator UI

**Usage:**

```typescript
import {
  startEmulators,
  stopEmulators,
  checkEmulatorStatus,
} from "@/tools/dev/firebase-emulator";

// Start emulators
await startEmulators({
  auth: true,
  firestore: true,
  functions: false,
});

// Check status
const isRunning = await checkEmulatorStatus();

// Stop emulators
await stopEmulators();
```

**CLI Usage:**

```bash
# Start emulators
firebase emulators:start --only auth,firestore

# Stop emulators
firebase emulators:stop

# Access UI
open http://localhost:4000
```

### File Structure

```
tools/dev/
├── firebase-emulator.ts     # Emulator launcher
app/modules/dev-tools/
├── index.tsx                # Main dev tools screen
├── database.tsx             # Database browser
├── analytics.tsx            # Analytics debugger
└── ai.tsx                   # AI playground
```

## Starter Templates

### Overview

Starter templates provide consistent code structure for modules, screens, components, and services.

### Template Location

Templates are located in `templates/` directory:

```
templates/
├── module-template/
│   └── index.ts
├── screen-template/
│   └── index.tsx
├── component-template/
│   ├── {{ComponentName}}.tsx
│   └── index.ts
├── service-template/
│   ├── {{serviceName}}.ts
│   └── index.ts
└── README.md
```

### Placeholders

Templates use placeholders that are replaced by CLI generators:

- `{{ModuleTitle}}` → PascalCase module title
- `{{moduleId}}` → kebab-case module ID
- `{{ScreenName}}` → PascalCase screen name
- `{{ScreenTitle}}` → Human-readable screen title
- `{{ComponentName}}` → PascalCase component name
- `{{ServiceName}}` → PascalCase service name
- `{{serviceName}}` → camelCase service name
- `{{category}}` → Category folder name
- `{{Description}}` → Description text
- `{{Subtitle}}` → Subtitle text

### Using Templates

Templates are automatically used by CLI generators. To use manually:

1. Copy template file
2. Replace placeholders with actual values
3. Place in appropriate directory
4. Update exports if needed

### Customizing Templates

To customize templates:

1. Edit template files in `templates/` directory
2. Update placeholder names if needed
3. Update CLI generators to use new placeholders
4. Test with `npm run cli` commands

**Example customization:**

```typescript
// templates/component-template/{{ComponentName}}.tsx
// Add custom props or styling
export interface {{ComponentName}}Props {
  // Custom props here
  customProp?: string;
}
```

## Example Apps

### Overview

Example apps demonstrate real-world usage of the starter kit features, including database operations, real-time updates, AI integration, and analytics tracking.

### Available Examples

#### Todo App

Full CRUD app demonstrating database operations.

**Location:** `app/modules/examples/todo-app/`

**Features:**

- Create, read, update, delete todos
- Real-time updates
- Form validation
- Toast notifications
- Loading states

**Key Concepts:**

- `useCollection` hook for reading data
- `useMutation` hook for write operations
- Real-time subscriptions
- Form handling

**Usage:**

1. Navigate to Todo App module
2. Create todos
3. Mark as complete
4. Edit and delete todos

**Code Example:**

```typescript
// Read todos
const { data: todos, loading } = useCollection<Todo>("todos", {
  subscribe: true,
  filters: {
    orderBy: [["createdAt", "desc"]],
  },
});

// Create todo
const { mutate: createTodo } = useMutation();
await createTodo("todos", {
  title: "New Todo",
  completed: false,
  createdAt: Date.now(),
});
```

#### Chat App

Real-time chat demonstrating real-time database operations.

**Location:** `app/modules/examples/chat-app/`

**Features:**

- Real-time messaging
- User authentication
- Message history
- Auto-scroll
- Keyboard handling

**Key Concepts:**

- Real-time subscriptions
- User authentication
- Message ordering
- UI updates

**Usage:**

1. Navigate to Chat App module
2. Sign in (if not authenticated)
3. Send messages
4. View real-time updates

**Code Example:**

```typescript
// Real-time messages
const { data: messages } = useCollection<Message>("chat-messages", {
  subscribe: true,
  filters: {
    orderBy: [["timestamp", "asc"]],
    limit: 100,
  },
});

// Send message
await sendMessage("chat-messages", {
  text: messageText,
  userId: user.uid,
  userName: user.displayName,
  timestamp: Date.now(),
});
```

#### AI Assistant

AI assistant demonstrating AI features.

**Location:** `app/modules/examples/ai-assistant/`

**Features:**

- Interactive AI chat
- Conversation management
- Quick prompts
- Streaming responses

**Key Concepts:**

- `useAIChat` hook
- Conversation management
- Streaming responses
- AI components

**Usage:**

1. Navigate to AI Assistant module
2. Use quick prompts or type custom prompts
3. View AI responses
4. Continue conversation

**Code Example:**

```typescript
const { startChat, isStreaming } = useAIChat(conversationId);

await startChat(
  {
    message: prompt,
    model: "gemini-1.5-flash",
  },
  (chunk) => {
    // Handle streaming chunks
  }
);
```

#### E-commerce

E-commerce app demonstrating analytics tracking.

**Location:** `app/modules/examples/ecommerce/`

**Features:**

- Product listing
- Shopping cart
- Checkout flow
- Analytics tracking
- Event logging

**Key Concepts:**

- Analytics events
- Cart management
- Purchase tracking
- Event parameters

**Usage:**

1. Navigate to E-commerce module
2. Browse products
3. Add to cart
4. Checkout
5. View analytics events in Dev Tools

**Code Example:**

```typescript
// View item
logViewItem({
  item_id: product.id,
  item_name: product.name,
  item_category: product.category,
  price: product.price,
  currency: "USD",
});

// Add to cart
logAddToCart({
  item_id: product.id,
  item_name: product.name,
  price: product.price,
  quantity: 1,
  currency: "USD",
});

// Purchase
logPurchase({
  transaction_id: `TXN-${Date.now()}`,
  value: total,
  currency: "USD",
  items: cartItems,
});
```

### Learning from Examples

**For Database Operations:**

- Study Todo App for CRUD operations
- Study Chat App for real-time updates

**For AI Integration:**

- Study AI Assistant for chat features
- Study AI Example module for advanced AI features

**For Analytics:**

- Study E-commerce for event tracking
- Study Analytics Example module for detailed analytics

**For UI Components:**

- Study UI Components Example module for component usage
- Study all examples for layout patterns

## AI Assistant Usage

### For AI Assistants (Claude, GPT, etc.)

This guide is designed for AI assistants to understand and use the developer tools in this project.

### Key Information for AI Assistants

#### 1. CLI Tools Usage

When a user requests to create a new module, component, service, or screen:

1. **Identify the type**: module, component, service, or screen
2. **Extract the name**: from user request
3. **Determine category**: from context or use default
4. **Run CLI command**: `npm run cli <type> <name> [options]`

**Example AI workflow:**

```
User: "Create a new module called user-profile"
AI: Runs `npm run cli module user-profile --category management`
AI: Verifies files were created
AI: Reports success to user
```

#### 2. Dev Tools Usage

When a user needs to debug or test:

1. **Identify the tool needed**: database, analytics, AI, emulator
2. **Provide navigation instructions**: route to dev tools
3. **Explain usage**: how to use the specific tool
4. **Provide examples**: code examples if relevant

**Example AI workflow:**

```
User: "How do I debug database queries?"
AI: Explains Database Browser usage
AI: Provides navigation: /modules/dev-tools → Database Browser
AI: Shows example queries
```

#### 3. Template Usage

When a user wants to customize code structure:

1. **Identify the template**: module, screen, component, service
2. **Explain template location**: `templates/<type>-template/`
3. **Show placeholders**: list available placeholders
4. **Provide customization steps**: how to modify templates

**Example AI workflow:**

```
User: "How do I customize component templates?"
AI: Explains template location
AI: Lists placeholders
AI: Shows how to modify templates
AI: Explains how CLI uses templates
```

#### 4. Example Apps Usage

When a user wants to learn how to implement features:

1. **Identify the feature**: CRUD, real-time, AI, analytics
2. **Point to relevant example**: Todo, Chat, AI Assistant, E-commerce
3. **Explain key concepts**: hooks, patterns, best practices
4. **Provide code examples**: relevant code snippets

**Example AI workflow:**

```
User: "How do I implement real-time updates?"
AI: Points to Chat App example
AI: Explains useCollection hook with subscribe
AI: Shows code example
AI: Explains real-time subscription patterns
```

### Best Practices for AI Assistants

1. **Always check for existing examples** before creating new code
2. **Use CLI tools** instead of manual file creation when possible
3. **Reference example apps** when explaining concepts
4. **Provide navigation paths** for dev tools
5. **Show code examples** from examples when relevant
6. **Explain patterns** used in examples
7. **Suggest improvements** based on examples

### Common Tasks

#### Creating a New Module

```bash
# Step 1: Generate module
npm run cli module my-module --category examples

# Step 2: Generate screen (if needed)
npm run cli screen my-screen --category examples

# Step 3: Update module definition to include screen route
# Edit modules/examples/my-module/index.ts
```

#### Creating a New Component

```bash
# Step 1: Generate component
npm run cli component MyComponent --category ui

# Step 2: Use component in your code
import { MyComponent } from '@/components/ui';
```

#### Creating a New Service

```bash
# Step 1: Generate service
npm run cli service myService --category common

# Step 2: Use service in your code
import { myService } from '@/services/common';
```

#### Debugging Database

1. Navigate to `/modules/dev-tools`
2. Open Database Browser
3. Enter collection path
4. View documents
5. Use query path for filtering

#### Testing AI Features

1. Navigate to `/modules/dev-tools`
2. Open AI Playground
3. Enter prompts
4. Test different models
5. View responses

#### Tracking Analytics

1. Use analytics functions in your code
2. Navigate to `/modules/dev-tools`
3. Open Analytics Debugger
4. View events in real-time
5. Test with "Log Test Event"

### Troubleshooting

#### CLI Tools Not Working

1. Check if `tsx` is installed: `npm list tsx`
2. Install if missing: `npm install --save-dev tsx`
3. Check script in `package.json`: `"cli": "npx tsx tools/cli/index.ts"`
4. Verify file permissions

#### Dev Tools Not Showing

1. Check if module is registered in `modules/index.ts`
2. Check if routes are correct in module definition
3. Verify app navigation setup
4. Check console for errors

#### Templates Not Found

1. Check if templates exist in `templates/` directory
2. Verify template file names match CLI expectations
3. Check placeholder syntax: `{{Placeholder}}`
4. Verify CLI generator reads from templates

#### Example Apps Not Working

1. Check if Firebase is configured
2. Verify database rules allow reads/writes
3. Check authentication status
4. Verify API keys are set
5. Check console for errors

### Additional Resources

- [UI Components Documentation](./ui-components.md)
- [Database Integration Guide](./database-integration.md)
- [AI Integration Guide](./ai-integration.md)
- [Analytics Integration Guide](./analytics-integration.md)

### Summary

This starter kit provides comprehensive developer tools for:

- **Code generation** via CLI tools
- **Debugging** via dev tools
- **Consistency** via templates
- **Learning** via example apps

AI assistants should use these tools to:

1. Generate code quickly and consistently
2. Debug issues efficiently
3. Learn from examples
4. Provide better assistance to users

For questions or issues, refer to the specific documentation files or check the example apps for implementation patterns.
