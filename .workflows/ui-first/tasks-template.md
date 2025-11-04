---
description: "UI-first tasks template with strict task prioritization (UI → Integration → Backend) and comprehensive task breakdown. Apply when working with task creation, project planning, or development task management."
alwaysApply: false
category: "ui-design"
priority: "high"
triggers:
  - "phase: tasks"
  - "keywords: tasks, implementation, development planning"
  - "file_patterns: tasks.md, implementation.md"
---

# UI First Tasks Template

## 📋 Project Information

- **Project Name**: [Project Name]
- **Based on Design**: [Link to design.md]
- **UI First Validation**: ✅ Design phase completed
- **Task Phase**: Phase 3 - UI First Task Creation
- **Created Date**: [YYYY-MM-DD]
- **Last Updated**: [YYYY-MM-DD]

## 🎯 UI First Task Prioritization

### Task Priority Order (MANDATORY)
1. **🎨 UI Implementation Tasks** (Priority 1)
2. **🔗 UI Integration Tasks** (Priority 2)  
3. **⚙️ Backend Logic Tasks** (Priority 3)

### UI-First Execution Rules
- ✅ **UI tasks MUST be completed before backend tasks**
- ✅ **Each screen MUST have corresponding UI implementation task**
- ✅ **Each CRUD operation MUST have UI task before logic task**
- ✅ **Navigation between screens MUST be implemented with UI**
- ❌ **Backend logic tasks CANNOT start until UI dependencies complete**

## 🎨 Phase 1: UI Implementation Tasks (Priority 1)

### Main Screen UI Tasks

#### Task: Implement Main Screen UI Layout
**Type**: UI Implementation  
**Priority**: High  
**Dependencies**: None  
**Estimated Time**: [X hours]

**Description**: Create the main screen user interface with all visual elements and basic interactions.

**Acceptance Criteria**:
- [ ] Screen layout matches design specifications
- [ ] All UI components are rendered correctly
- [ ] Basic navigation elements are functional
- [ ] Responsive design works on target screen sizes
- [ ] Accessibility features are implemented
- [ ] Loading states are implemented
- [ ] Empty states are implemented
- [ ] Error states are implemented

**UI Elements to Implement**:
- [ ] Header/navigation bar
- [ ] Main content area
- [ ] Action buttons
- [ ] Bottom navigation (if applicable)
- [ ] Status indicators
- [ ] Loading indicators

**Platform-Specific Requirements**:
- [ ] iOS: Follow Human Interface Guidelines
- [ ] Android: Follow Material Design principles
- [ ] Web: Responsive design implementation

---

#### Task: Implement Main Screen User Interactions
**Type**: UI Implementation  
**Priority**: High  
**Dependencies**: Main Screen UI Layout  
**Estimated Time**: [X hours]

**Description**: Implement user interactions and event handlers for the main screen.

**Acceptance Criteria**:
- [ ] Touch/click interactions work correctly
- [ ] Gesture support is implemented (swipe, pinch, etc.)
- [ ] Button press feedback is provided
- [ ] Navigation between screens works
- [ ] Form interactions are functional
- [ ] Search functionality works
- [ ] Filter and sort options work

**Interactions to Implement**:
- [ ] Button click handlers
- [ ] Form input handlers
- [ ] Navigation handlers
- [ ] Search input handlers
- [ ] Filter/sort handlers
- [ ] Gesture recognizers

---

### Secondary Screens UI Tasks

#### Task: Implement [Screen Name] UI
**Type**: UI Implementation  
**Priority**: High  
**Dependencies**: Main Screen UI  
**Estimated Time**: [X hours]

**Description**: Create the [Screen Name] user interface according to design specifications.

**Acceptance Criteria**:
- [ ] Screen layout matches design
- [ ] All UI components are implemented
- [ ] Navigation to/from screen works
- [ ] Form elements are functional
- [ ] Data display is correct
- [ ] Error handling is implemented

**UI Components**:
- [ ] Screen header with back navigation
- [ ] Content area with specific layout
- [ ] Form elements (if applicable)
- [ ] Action buttons
- [ ] Data visualization (if applicable)

---

### CRUD Operations UI Tasks

#### Task: Implement Create Operation UI
**Type**: UI Implementation  
**Priority**: High  
**Dependencies**: Main Screen UI  
**Estimated Time**: [X hours]

**Description**: Create the user interface for creating new items/records.

**Acceptance Criteria**:
- [ ] Create form is implemented
- [ ] Form validation works
- [ ] Save and cancel buttons work
- [ ] Success feedback is provided
- [ ] Error handling is implemented
- [ ] Form resets after successful creation

**Form Elements**:
- [ ] Input fields with labels
- [ ] Validation messages
- [ ] Required field indicators
- [ ] Save button
- [ ] Cancel button
- [ ] Success/error messages

---

#### Task: Implement Read Operation UI
**Type**: UI Implementation  
**Priority**: High  
**Dependencies**: Main Screen UI  
**Estimated Time**: [X hours]

**Description**: Create the user interface for viewing and browsing items/records.

**Acceptance Criteria**:
- [ ] List view is implemented
- [ ] Detail view is implemented
- [ ] Search functionality works
- [ ] Filter options work
- [ ] Pagination/infinite scroll works
- [ ] Empty states are handled

**UI Components**:
- [ ] List/grid view
- [ ] Search bar
- [ ] Filter controls
- [ ] Item cards/rows
- [ ] Detail view modal/screen
- [ ] Pagination controls

---

#### Task: Implement Update Operation UI
**Type**: UI Implementation  
**Priority**: High  
**Dependencies**: Read Operation UI  
**Estimated Time**: [X hours]

**Description**: Create the user interface for editing existing items/records.

**Acceptance Criteria**:
- [ ] Edit form is implemented
- [ ] Pre-populated fields work
- [ ] Change tracking is implemented
- [ ] Save and cancel buttons work
- [ ] Confirmation dialogs work
- [ ] Success feedback is provided

**Form Elements**:
- [ ] Pre-populated input fields
- [ ] Change indicators
- [ ] Save button
- [ ] Cancel button
- [ ] Confirmation dialog
- [ ] Success message

---

#### Task: Implement Delete Operation UI
**Type**: UI Implementation  
**Priority**: High  
**Dependencies**: Read Operation UI  
**Estimated Time**: [X hours]

**Description**: Create the user interface for deleting items/records.

**Acceptance Criteria**:
- [ ] Delete confirmation dialog is implemented
- [ ] Bulk delete functionality works
- [ ] Soft delete with restore option works
- [ ] Success feedback is provided
- [ ] Error handling is implemented

**UI Components**:
- [ ] Delete button/action
- [ ] Confirmation dialog
- [ ] Bulk selection UI
- [ ] Success message
- [ ] Error message
- [ ] Undo option (if applicable)

---

## 🔗 Phase 2: UI Integration Tasks (Priority 2)

### Screen-to-Screen Navigation

#### Task: Implement Navigation System
**Type**: UI Integration  
**Priority**: High  
**Dependencies**: All UI Implementation Tasks  
**Estimated Time**: [X hours]

**Description**: Implement navigation between all screens and ensure smooth user flow.

**Acceptance Criteria**:
- [ ] Navigation between all screens works
- [ ] Back navigation works correctly
- [ ] Deep linking works (web)
- [ ] Navigation state is preserved
- [ ] Navigation animations are smooth
- [ ] Breadcrumbs work (if applicable)

**Navigation Features**:
- [ ] Screen transitions
- [ ] Back button handling
- [ ] Deep link routing
- [ ] Navigation state management
- [ ] Transition animations
- [ ] Navigation history

---

### UI State Management

#### Task: Implement UI State Management
**Type**: UI Integration  
**Priority**: High  
**Dependencies**: All UI Implementation Tasks  
**Estimated Time**: [X hours]

**Description**: Implement state management for UI components and user interactions.

**Acceptance Criteria**:
- [ ] UI state is managed correctly
- [ ] State updates trigger UI changes
- [ ] State persistence works
- [ ] State synchronization works
- [ ] Error states are handled
- [ ] Loading states are managed

**State Management Features**:
- [ ] Component state management
- [ ] Global state management
- [ ] State persistence
- [ ] State synchronization
- [ ] Error state handling
- [ ] Loading state management

---

### Mock Data Integration

#### Task: Implement Mock Data for UI Testing
**Type**: UI Integration  
**Priority**: Medium  
**Dependencies**: All UI Implementation Tasks  
**Estimated Time**: [X hours]

**Description**: Implement mock data to test UI components and user flows.

**Acceptance Criteria**:
- [ ] Mock data is implemented
- [ ] All UI components work with mock data
- [ ] User flows are testable with mock data
- [ ] Mock data covers all scenarios
- [ ] Mock data is easily configurable
- [ ] Mock data can be easily replaced

**Mock Data Features**:
- [ ] User data
- [ ] Content data
- [ ] Configuration data
- [ ] Error scenarios
- [ ] Edge cases
- [ ] Performance test data

---

## ⚙️ Phase 3: Backend Logic Tasks (Priority 3)

### Data Models

#### Task: Implement Data Models
**Type**: Backend Logic  
**Priority**: Medium  
**Dependencies**: UI Integration Tasks  
**Estimated Time**: [X hours]

**Description**: Implement data models and business logic for the application.

**Acceptance Criteria**:
- [ ] Data models are implemented
- [ ] Business logic is implemented
- [ ] Data validation works
- [ ] Data relationships are correct
- [ ] Data persistence works
- [ ] Data retrieval works

**Data Model Features**:
- [ ] Entity definitions
- [ ] Business rules
- [ ] Data validation
- [ ] Data relationships
- [ ] Data persistence
- [ ] Data retrieval

---

### API Integration

#### Task: Implement API Integration
**Type**: Backend Logic  
**Priority**: Medium  
**Dependencies**: Data Models  
**Estimated Time**: [X hours]

**Description**: Implement API endpoints and integrate with UI components.

**Acceptance Criteria**:
- [ ] API endpoints are implemented
- [ ] API integration with UI works
- [ ] Error handling is implemented
- [ ] Authentication works
- [ ] Data synchronization works
- [ ] Performance is optimized

**API Features**:
- [ ] REST API endpoints
- [ ] Authentication
- [ ] Authorization
- [ ] Error handling
- [ ] Data validation
- [ ] Performance optimization

---

### Business Rules

#### Task: Implement Business Rules
**Type**: Backend Logic  
**Priority**: Low  
**Dependencies**: API Integration  
**Estimated Time**: [X hours]

**Description**: Implement complex business logic and rules.

**Acceptance Criteria**:
- [ ] Business rules are implemented
- [ ] Rule validation works
- [ ] Rule execution is efficient
- [ ] Rule configuration is flexible
- [ ] Rule testing is comprehensive
- [ ] Rule documentation is complete

**Business Rule Features**:
- [ ] Rule definitions
- [ ] Rule validation
- [ ] Rule execution
- [ ] Rule configuration
- [ ] Rule testing
- [ ] Rule documentation

---

## 📊 Task Progress Tracking

### Phase 1: UI Implementation Progress
- [ ] Main Screen UI Layout: [Status]
- [ ] Main Screen User Interactions: [Status]
- [ ] Secondary Screens UI: [Status]
- [ ] Create Operation UI: [Status]
- [ ] Read Operation UI: [Status]
- [ ] Update Operation UI: [Status]
- [ ] Delete Operation UI: [Status]

**Phase 1 Completion**: [X%]

### Phase 2: UI Integration Progress
- [ ] Navigation System: [Status]
- [ ] UI State Management: [Status]
- [ ] Mock Data Integration: [Status]

**Phase 2 Completion**: [X%]

### Phase 3: Backend Logic Progress
- [ ] Data Models: [Status]
- [ ] API Integration: [Status]
- [ ] Business Rules: [Status]

**Phase 3 Completion**: [X%]

### Overall Project Progress
**Total Completion**: [X%]

## ✅ UI First Quality Standards

### Task Completeness Requirements
- [ ] All UI screens have corresponding implementation tasks
- [ ] All CRUD operations have UI tasks
- [ ] All user flows have complete task sequences
- [ ] All UI states have implementation tasks
- [ ] All error scenarios have handling tasks

### Task Dependencies Requirements
- [ ] UI tasks are prioritized before backend tasks
- [ ] Task dependencies are clearly defined
- [ ] Task execution order is logical
- [ ] Task blocking conditions are identified
- [ ] Task parallel execution opportunities are identified

### Platform Compliance Requirements
- [ ] Platform-specific requirements are included
- [ ] Cross-platform compatibility is considered
- [ ] Performance requirements are specified
- [ ] Accessibility requirements are included
- [ ] Security requirements are addressed

## 📝 Task Approval Checklist

### Task Coverage Review
- [ ] All UI screens have implementation tasks
- [ ] All CRUD operations have UI tasks
- [ ] All user flows have complete task sequences
- [ ] All UI states have handling tasks
- [ ] All error scenarios have recovery tasks

### Task Quality Review
- [ ] Task descriptions are clear and specific
- [ ] Acceptance criteria are measurable
- [ ] Dependencies are correctly identified
- [ ] Time estimates are realistic
- [ ] Priority assignments are correct

### Implementation Readiness Review
- [ ] All dependencies are resolved
- [ ] Resources are available
- [ ] Timeline is realistic
- [ ] Quality standards are achievable
- [ ] Success criteria are clear

---

**Success Criteria**: Complete UI-first task breakdown, strict priority enforcement, comprehensive progress tracking, and implementation-ready task specifications.
