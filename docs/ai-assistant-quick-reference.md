# AI Assistant Quick Reference

Created by Kien AI (leejungkiin@gmail.com)

Quick reference guide for AI assistants working with this Expo Firebase HeroUI Starter Kit.

## Quick Commands

### Generate Code

```bash
# Module
npm run cli module <name> [--category <category>]

# Component
npm run cli component <name> [--category <category>]

# Service
npm run cli service <name> [--category <category>]

# Screen
npm run cli screen <name> [--category <category>]
```

### Access Dev Tools

- Route: `/modules/dev-tools`
- Database Browser: `/modules/dev-tools/database`
- Analytics Debugger: `/modules/dev-tools/analytics`
- AI Playground: `/modules/dev-tools/ai`

## Common Workflows

### Create New Feature Module

```bash
# 1. Generate module
npm run cli module my-feature --category examples

# 2. Generate screen
npm run cli screen my-feature --category examples

# 3. Module is auto-registered in modules/index.ts
```

### Create New Component

```bash
# 1. Generate component
npm run cli component MyComponent --category ui

# 2. Component is auto-exported in components/ui/index.ts
# 3. Use in code: import { MyComponent } from '@/components/ui';
```

### Debug Database

1. Navigate to `/modules/dev-tools/database`
2. Enter collection path (e.g., `users`)
3. View documents in real-time

### Test AI Features

1. Navigate to `/modules/dev-tools/ai`
2. Enter prompts
3. View responses

### Track Analytics

1. Use analytics functions in code
2. Navigate to `/modules/dev-tools/analytics`
3. View events in real-time

## Example Apps Reference

| App | Location | Purpose |
|-----|----------|---------|
| Todo App | `/modules/examples/todo-app` | CRUD operations |
| Chat App | `/modules/examples/chat-app` | Real-time updates |
| AI Assistant | `/modules/examples/ai-assistant` | AI integration |
| E-commerce | `/modules/examples/ecommerce` | Analytics tracking |

## File Locations

### CLI Tools
- `tools/cli/index.ts` - Main CLI runner
- `tools/cli/generate-*.ts` - Generators

### Dev Tools
- `tools/dev/firebase-emulator.ts` - Emulator launcher
- `app/modules/dev-tools/` - Dev tool screens

### Templates
- `templates/module-template/` - Module template
- `templates/screen-template/` - Screen template
- `templates/component-template/` - Component template
- `templates/service-template/` - Service template

### Example Apps
- `app/modules/examples/todo-app/` - Todo app
- `app/modules/examples/chat-app/` - Chat app
- `app/modules/examples/ai-assistant/` - AI assistant
- `app/modules/examples/ecommerce/` - E-commerce

## Key Patterns

### Database Operations

```typescript
// Read collection
const { data, loading } = useCollection('collection-name', {
  subscribe: true,
  filters: { orderBy: [['field', 'desc']] },
});

// Mutate
const { mutate } = useMutation();
await mutate('collection-name/doc-id', { field: 'value' });
```

### AI Integration

```typescript
const { startChat } = useAIChat();
await startChat({ message: 'prompt', model: 'gemini-1.5-flash' }, (chunk) => {
  // Handle chunks
});
```

### Analytics Tracking

```typescript
logEvent('event_name', { param: 'value' });
logViewItem({ item_id: '123', item_name: 'Product' });
logAddToCart({ item_id: '123', price: 99.99 });
logPurchase({ transaction_id: 'TXN-1', value: 99.99 });
```

## Troubleshooting

### CLI Not Working
- Check `tsx` is installed: `npm list tsx`
- Install if missing: `npm install --save-dev tsx`

### Dev Tools Not Showing
- Check module registration in `modules/index.ts`
- Verify routes in module definition

### Examples Not Working
- Check Firebase configuration
- Verify database rules
- Check authentication status

## Documentation Links

- [Full Developer Tools Guide](./developer-tools-guide.md)
- [UI Components](./ui-components.md)
- [Database Integration](./database-integration.md)
- [AI Integration](./ai-integration.md)
- [Analytics Integration](./analytics-integration.md)

## AI Assistant Best Practices

1. **Always use CLI tools** for code generation
2. **Reference example apps** when explaining patterns
3. **Point to dev tools** for debugging
4. **Show code examples** from examples
5. **Explain patterns** used in examples
6. **Check existing examples** before creating new code

## Quick Decision Tree

```
User needs to:
├─ Create new code
│  ├─ Module → npm run cli module <name>
│  ├─ Component → npm run cli component <name>
│  ├─ Service → npm run cli service <name>
│  └─ Screen → npm run cli screen <name>
├─ Debug/Test
│  ├─ Database → /modules/dev-tools/database
│  ├─ Analytics → /modules/dev-tools/analytics
│  └─ AI → /modules/dev-tools/ai
└─ Learn patterns
   ├─ CRUD → Todo App example
   ├─ Real-time → Chat App example
   ├─ AI → AI Assistant example
   └─ Analytics → E-commerce example
```

