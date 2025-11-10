<!-- ab968def-b070-4c37-8fb0-17e77fd4a684 2b77c586-1236-4958-b0e0-eb7f2578a689 -->
# AI Tool Builder Framework - Implementation Plan

## Phase 1: Core Types & Configuration Schema

### 1.1 Create AI Tool Types

**File**: `modules/ai-tools/types.ts`

- Define `AIToolType`, `InputType`, `OutputType` enums
- Define `ToolOption`, `ToolInputConfig`, `ToolOptionConfig` interfaces
- Define `PromptBuilder` interface với template system
- Define `AIToolConfig` interface với đầy đủ configuration options
- Define `AIToolDefinition` interface với config, component, service

### 1.2 Create Tool Registry System

**File**: `modules/ai-tools/registry.ts`

- Implement `registerTool()` function
- Implement `getTool()` function
- Implement `listTools()` function
- Export registry utilities

## Phase 2: Image Generation Service

### 2.1 Extend AI Types for Image Generation

**File**: `services/ai/types.ts`

- Add `AIImageGenerationRequest` interface
- Add `AIImageGenerationResponse` interface
- Extend existing types nếu cần

### 2.2 Create Image Generation Service

**File**: `services/ai/tools/image-generation.ts`

- Implement `generateImage()` function sử dụng Firebase AI Logic SDK
- Support `gemini-2.5-flash-image` model
- Handle multimodal input (image + text prompt)
- Return base64 image data với mimeType
- Error handling và retry logic
- Sử dụng pattern từ `services/ai/client.ts` (retryOperation)

### 2.3 Create Prompt Builder Service

**File**: `services/ai/tools/prompt-builder.ts`

- Implement `buildPrompt()` function
- Support template string với placeholders ({{variable}})
- Support variable mapping từ options
- Support base prompt + variable substitution

## Phase 3: Tool Builder Engine

### 3.1 Create Tool Builder Class

**File**: `modules/ai-tools/builder.ts`

- Implement `AIToolBuilder` class
- Implement `execute()` method:
- Validate inputs và options
- Build prompt từ template
- Prepare request cho AI service
- Call appropriate AI service (image-generation, etc.)
- Process response
- Implement validation methods
- Implement request preparation methods
- Implement response processing methods

## Phase 4: Reusable UI Components

### 4.1 Create Input Selector Component

**File**: `components/ai-tools/InputSelector.tsx`

- Support file input (image picker)
- Support text input
- Support URL input
- Support camera input (React Native)
- Validate input theo config (file size, MIME type)
- Display preview cho images

### 4.2 Create Option Selector Component

**File**: `components/ai-tools/OptionSelector.tsx`

- Support select (single choice)
- Support multi-select
- Support text input
- Support number input
- Support slider input
- Display options với icons và descriptions
- Handle validation

### 4.3 Create Result Display Component

**File**: `components/ai-tools/ResultDisplay.tsx`

- Display image results
- Display text results
- Support download button
- Support share button (React Native)
- Support copy to clipboard
- Display loading states
- Display error states

### 4.4 Create Collection View Component

**File**: `components/ai-tools/CollectionView.tsx`

- Display collection of results
- Support localStorage storage
- Support Firebase Storage (future)
- Grid layout với images
- Click to view full result
- Delete items from collection
- Limit collection size

### 4.5 Create Tool Container Component

**File**: `components/ai-tools/ToolContainer.tsx`

- Main container component
- Render InputSelector cho mỗi input config
- Render OptionSelector cho mỗi option config
- Render generate button
- Render ResultDisplay
- Render CollectionView nếu enabled
- Handle state management (inputs, options, result, loading, error)
- Integrate với AIToolBuilder
- Use HeroUI components khi có thể

## Phase 5: Roman Portrait Tool Implementation

### 5.1 Create Roman Portrait Tool Config

**File**: `modules/ai-tools/tools/roman-portrait/config.ts`

- Define `romanPortraitConfig` với đầy đủ configuration:
- Input: file (image)
- Options: role (select), scene (select)
- Prompt template với role và scene details
- UI config: two-column layout, collection enabled
- Storage config: localStorage

### 5.2 Create Role Details Data

**File**: `modules/ai-tools/tools/roman-portrait/role-details.ts`

- Define role details mapping (Legionary, Centurion, Senator, etc.)
- Export role descriptions cho prompt building

### 5.3 Create Scene Details Data

**File**: `modules/ai-tools/tools/roman-portrait/scene-details.ts`

- Define scene details mapping (Arena, Senate, Battlefield, etc.)
- Export scene descriptions cho prompt building

### 5.4 Register Roman Portrait Tool

**File**: `modules/ai-tools/registry.ts`

- Import romanPortraitConfig
- Register tool với `registerTool()`

## Phase 6: AI Tools Module Integration

### 6.1 Update AI Tools Module Screen

**File**: `app/modules/ai-tools/index.tsx`

- Create tool list view
- Display available tools từ registry
- Navigate to tool detail screen
- Use HeroUI components

### 6.2 Create Tool Detail Screen

**File**: `app/modules/ai-tools/[toolId].tsx`

- Get tool từ registry by ID
- Render ToolContainer với tool config
- Handle navigation
- Display tool metadata (name, description, icon)

### 6.3 Update Module Definition

**File**: `modules/ai-tools/index.ts`

- Update routes để support tool detail screens
- Add proper icons và metadata

## Phase 7: Storage Integration

### 7.1 Create Storage Service

**File**: `services/ai-tools/storage.ts`

- Implement localStorage storage
- Implement collection management (save, get, delete, limit size)
- Support data URL storage
- Support blob storage (future Firebase Storage)
- Export storage utilities

### 7.2 Integrate Storage với CollectionView

**File**: `components/ai-tools/CollectionView.tsx`

- Use storage service
- Load collection on mount
- Save to collection on result
- Delete from collection
- Update UI khi collection changes

## Phase 8: Testing & Documentation

### 8.1 Test Roman Portrait Tool

- Test file upload
- Test option selection
- Test image generation
- Test collection management
- Test download functionality
- Test error handling

### 8.2 Create Documentation

**File**: `docs/AI_TOOLS_FRAMEWORK.md`

- Framework overview
- Configuration guide
- Creating new tools guide
- API reference
- Examples

### 8.3 Create Example Tool Configs

**File**: `modules/ai-tools/tools/examples/`

- Create example tool configs cho các use cases khác
- Style transfer tool config
- Text-to-image tool config
- Image editing tool config

## Implementation Order

**Priority: Build complete framework first, then implement tools**

1. **Phase 1** - Core types và registry (Foundation)
2. **Phase 2** - Image generation service (Core functionality)
3. **Phase 3** - Tool builder engine (Logic layer)
4. **Phase 4** - UI components (Presentation layer) - Use HeroUI components when possible
5. **Phase 7** - Storage integration (Persistence) - Support both localStorage and Firebase Storage with config
6. **Phase 5** - Roman Portrait tool (First tool implementation - validates framework)
7. **Phase 6** - Module integration (App integration)
8. **Phase 8** - Testing & Documentation (Quality assurance)

## Key Files to Create/Modify

**New Files:**

- `modules/ai-tools/types.ts`
- `modules/ai-tools/registry.ts`
- `modules/ai-tools/builder.ts`
- `services/ai/tools/image-generation.ts`
- `services/ai/tools/prompt-builder.ts`
- `services/ai-tools/storage.ts`
- `components/ai-tools/InputSelector.tsx`
- `components/ai-tools/OptionSelector.tsx`
- `components/ai-tools/ResultDisplay.tsx`
- `components/ai-tools/CollectionView.tsx`
- `components/ai-tools/ToolContainer.tsx`
- `components/ai-tools/index.ts`
- `modules/ai-tools/tools/roman-portrait/config.ts`
- `modules/ai-tools/tools/roman-portrait/role-details.ts`
- `modules/ai-tools/tools/roman-portrait/scene-details.ts`
- `app/modules/ai-tools/[toolId].tsx`
- `docs/AI_TOOLS_FRAMEWORK.md`

**Modified Files:**

- `services/ai/types.ts` - Add image generation types
- `app/modules/ai-tools/index.tsx` - Update với tool list
- `modules/ai-tools/index.ts` - Update routes
- `modules/ai-tools/registry.ts` - Register Roman Portrait tool

## Technical Considerations

1. **Firebase AI Integration**: Sử dụng Firebase AI Logic SDK với `gemini-2.5-flash-image` model cho image generation
2. **Platform Support**: Support cả web và React Native (Expo)
3. **File Handling**: Support file picker cho React Native, file input cho web
4. **Storage**: Bắt đầu với localStorage, có thể extend sang Firebase Storage sau
5. **Error Handling**: Comprehensive error handling với user-friendly messages
6. **Loading States**: Proper loading states cho tất cả async operations
7. **Type Safety**: Full TypeScript support với strict types
8. **Reusability**: Components và services phải reusable cho nhiều tools

## Success Criteria

1. Roman Portrait tool hoạt động end-to-end
2. Framework cho phép tạo tool mới chỉ bằng config
3. UI components reusable và customizable
4. Storage integration working
5. Documentation đầy đủ
6. Type-safe implementation
7. Error handling comprehensive
8. Platform support (web + React Native)

### To-dos

- [ ] Create core types and configuration schema (AIToolConfig, ToolOption, etc.)
- [ ] Create tool registry system (registerTool, getTool, listTools)
- [ ] Extend AI types for image generation (AIImageGenerationRequest/Response)
- [ ] Create image generation service using Firebase AI Logic SDK
- [ ] Create prompt builder service with template system
- [ ] Create AIToolBuilder class with execute, validate, and process methods
- [ ] Create InputSelector component (file, text, URL, camera)
- [ ] Create OptionSelector component (select, multi-select, text, number, slider)
- [ ] Create ResultDisplay component (image, text, download, share)
- [ ] Create CollectionView component (grid layout, storage integration)
- [ ] Create ToolContainer component (main container với state management)
- [ ] Create Roman Portrait tool config với role và scene options
- [ ] Create role details và scene details data files
- [ ] Register Roman Portrait tool in registry
- [ ] Update AI Tools module screen với tool list
- [ ] Create tool detail screen ([toolId].tsx) với ToolContainer
- [ ] Create storage service (localStorage, collection management)
- [ ] Integrate storage với CollectionView component
- [ ] Test Roman Portrait tool end-to-end (upload, generate, collection, download)
- [ ] Create documentation (AI_TOOLS_FRAMEWORK.md) với guides và examples