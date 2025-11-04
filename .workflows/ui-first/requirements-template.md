---
description: "UI-first requirements gathering template with comprehensive UI coverage analysis and UI-centric user stories. Apply when working with requirements gathering, UI specification, or project planning."
alwaysApply: false
category: "ui-design"
priority: "high"
triggers:
  - "phase: requirements"
  - "keywords: requirements, specification, ui requirements"
  - "file_patterns: requirements.md, spec.md"
---

# UI First Requirements Template

## 📋 Project Information

- **Project Name**: [Project Name]
- **Project Type**: [Mobile App / Web App / Desktop App]
- **Target Platform**: [iOS / Android / Web / Desktop]
- **UI Framework**: [React Native / Flutter / SwiftUI / Jetpack Compose / React / Vue]
- **Design System**: [Material Design / Human Interface Guidelines / Custom]
- **Created Date**: [YYYY-MM-DD]
- **Last Updated**: [YYYY-MM-DD]

## 🎯 UI First Analysis Checklist

### UI Coverage Analysis
- [ ] All user stories have corresponding UI screens
- [ ] Navigation flows connect all features
- [ ] CRUD operations accessible via interface
- [ ] Error states have UI representation
- [ ] Loading states properly handled
- [ ] User feedback mechanisms implemented
- [ ] Empty states designed and specified
- [ ] Success states defined

### User Flow Coverage
- [ ] Primary user journey mapped to screens
- [ ] Secondary user journeys documented
- [ ] Error recovery flows designed
- [ ] Onboarding flow specified
- [ ] Settings and preferences flow
- [ ] Logout and session management flow

### CRUD Operations UI Coverage
- [ ] Create operations have dedicated UI screens
- [ ] Read operations have list and detail views
- [ ] Update operations have edit interfaces
- [ ] Delete operations have confirmation flows
- [ ] Bulk operations have appropriate UI
- [ ] Search and filtering interfaces

### UI States Coverage
- [ ] Loading states for all async operations
- [ ] Empty states for all data lists
- [ ] Error states for all failure scenarios
- [ ] Success states for all completion scenarios
- [ ] Offline states for network issues
- [ ] Permission states for access control

## 📱 UI Requirements Section

### Main Screen Requirements

#### Screen: [Main Screen Name]
**Purpose**: [Primary user goal and functionality]

**UI Components**:
- [ ] Header/Navigation bar
- [ ] Main content area
- [ ] Action buttons
- [ ] Status indicators
- [ ] Search/filter controls
- [ ] User profile section

**User Interactions**:
- [ ] Touch/click interactions
- [ ] Gesture support (swipe, pinch, etc.)
- [ ] Keyboard shortcuts (desktop/web)
- [ ] Voice commands (if applicable)

**Data Display**:
- [ ] List/grid view of items
- [ ] Item details and metadata
- [ ] Real-time updates
- [ ] Pagination or infinite scroll

**UI States**:
- [ ] Loading state with skeleton screens
- [ ] Empty state with helpful messaging
- [ ] Error state with recovery options
- [ ] Success state with confirmation

### Secondary Screens Requirements

#### Screen: [Secondary Screen Name]
**Navigation From**: [Parent screen]
**Navigation To**: [Child screens]

**UI Components**:
- [ ] Screen header with back navigation
- [ ] Content area with specific layout
- [ ] Action buttons and controls
- [ ] Form elements (if applicable)
- [ ] Data visualization (if applicable)

**User Interactions**:
- [ ] Form input and validation
- [ ] Button interactions
- [ ] Navigation gestures
- [ ] Data manipulation

**UI States**:
- [ ] Form validation states
- [ ] Submission states
- [ ] Error handling states
- [ ] Success confirmation states

### CRUD Operations UI Specifications

#### Create Operations
**UI Requirements**:
- [ ] Dedicated create screen or modal
- [ ] Form with all required fields
- [ ] Input validation with real-time feedback
- [ ] Save and cancel buttons
- [ ] Success confirmation
- [ ] Error handling with helpful messages

**User Experience**:
- [ ] Intuitive form layout
- [ ] Clear field labels and placeholders
- [ ] Progressive disclosure for complex forms
- [ ] Auto-save functionality (if applicable)
- [ ] Draft saving capability

#### Read Operations
**UI Requirements**:
- [ ] List view with search and filtering
- [ ] Detail view with comprehensive information
- [ ] Pagination or infinite scroll
- [ ] Sort and filter controls
- [ ] Export functionality (if applicable)

**User Experience**:
- [ ] Fast loading with skeleton screens
- [ ] Smooth scrolling and navigation
- [ ] Quick access to frequently used items
- [ ] Bookmarking or favorites (if applicable)
- [ ] Sharing functionality

#### Update Operations
**UI Requirements**:
- [ ] Edit screen or inline editing
- [ ] Pre-populated form fields
- [ ] Change tracking and highlighting
- [ ] Save and cancel options
- [ ] Confirmation for destructive changes

**User Experience**:
- [ ] Easy access to edit mode
- [ ] Clear indication of changes
- [ ] Undo/redo functionality
- [ ] Bulk edit capabilities (if applicable)
- [ ] Version history (if applicable)

#### Delete Operations
**UI Requirements**:
- [ ] Confirmation dialog or screen
- [ ] Clear explanation of consequences
- [ ] Soft delete with restore option (if applicable)
- [ ] Bulk delete with confirmation
- [ ] Success feedback

**User Experience**:
- [ ] Clear warning messages
- [ ] Easy recovery from accidental deletion
- [ ] Batch operations for efficiency
- [ ] Audit trail for deleted items

## 🎨 UI Design Standards

### Visual Consistency
- [ ] Consistent color palette across all screens
- [ ] Typography hierarchy and spacing
- [ ] Icon library with consistent style
- [ ] Component library for reusable elements
- [ ] Brand guidelines compliance

### Responsive Design
- [ ] Mobile-first design approach
- [ ] Responsive breakpoints defined
- [ ] Touch-friendly interface elements
- [ ] Optimized for mobile performance
- [ ] Cross-platform consistency

### Accessibility Design
- [ ] WCAG 2.1 AA compliance
- [ ] Color contrast ratios meet standards
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Focus indicators for interactive elements
- [ ] Alternative text for images
- [ ] High contrast mode support

## 🔄 User Stories (UI-Centric)

### Template Format
```markdown
As a [user type], I want to [UI action] so that [benefit]

**UI Requirements**:
- [Specific UI element or interaction]
- [Expected behavior]
- [Success criteria]

**Acceptance Criteria**:
- [ ] [UI-specific acceptance criterion]
- [ ] [UI-specific acceptance criterion]
- [ ] [UI-specific acceptance criterion]
```

### Example User Stories

#### Story 1: User Authentication
As a **new user**, I want to **see a welcome screen with clear sign-up options** so that **I can easily create an account**

**UI Requirements**:
- Welcome screen with app branding
- Clear sign-up button with prominent placement
- Alternative sign-up methods (social login)
- Privacy policy and terms links

**Acceptance Criteria**:
- [ ] Welcome screen loads within 2 seconds
- [ ] Sign-up button is prominently displayed
- [ ] Social login options are clearly visible
- [ ] Privacy links are accessible but not intrusive

#### Story 2: Data Management
As a **regular user**, I want to **view my data in a clean, organized list** so that **I can quickly find what I'm looking for**

**UI Requirements**:
- List view with clear item separation
- Search bar at the top of the list
- Filter and sort options
- Pull-to-refresh functionality

**Acceptance Criteria**:
- [ ] List loads with skeleton screens
- [ ] Search functionality works in real-time
- [ ] Filter options are intuitive
- [ ] Pull-to-refresh provides visual feedback

## ✅ UI First Quality Standards

### Completeness Requirements
- [ ] Every feature has corresponding UI implementation
- [ ] All user flows have complete screen sequences
- [ ] All CRUD operations are accessible through UI
- [ ] All error scenarios have UI representation
- [ ] All success scenarios have UI confirmation

### Testability Requirements
- [ ] All UI elements are testable
- [ ] User flows can be automated tested
- [ ] UI states can be programmatically verified
- [ ] Accessibility features can be tested
- [ ] Cross-platform compatibility can be tested

### User Experience Requirements
- [ ] Intuitive navigation and user flows
- [ ] Consistent design language
- [ ] Responsive and accessible design
- [ ] Fast loading and smooth interactions
- [ ] Clear feedback for all user actions

## 🚀 Implementation Priority

### Phase 1: Core UI Implementation (Priority 1)
- [ ] Main screen UI components
- [ ] Primary navigation structure
- [ ] Core CRUD operation UIs
- [ ] Basic error and loading states

### Phase 2: Enhanced UI Features (Priority 2)
- [ ] Secondary screens and flows
- [ ] Advanced UI interactions
- [ ] Comprehensive error handling
- [ ] Accessibility features

### Phase 3: UI Polish and Optimization (Priority 3)
- [ ] Animation and transitions
- [ ] Performance optimization
- [ ] Advanced accessibility features
- [ ] Cross-platform refinements

## 📝 Approval Checklist

### Requirements Review
- [ ] All user stories have UI requirements
- [ ] All CRUD operations have UI specifications
- [ ] All user flows are complete and logical
- [ ] All UI states are defined and specified

### Technical Review
- [ ] UI requirements are technically feasible
- [ ] Performance requirements are realistic
- [ ] Accessibility requirements are achievable
- [ ] Cross-platform requirements are clear

### Stakeholder Approval
- [ ] Product owner approval
- [ ] Design team approval
- [ ] Development team approval
- [ ] QA team approval

---

**Success Criteria**: Complete UI coverage for all features, comprehensive user stories, clear implementation priorities, and stakeholder approval for UI-first development approach.
