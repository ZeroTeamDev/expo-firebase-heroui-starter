---
description: "UI-first design template with comprehensive screen-by-screen specifications, visual design system, and implementation guidelines. Apply when working with UI design, screen specifications, or design-to-implementation workflows."
alwaysApply: false
category: "ui-design"
priority: "high"
triggers:
  - "phase: design"
  - "keywords: ui design, screen design, visual design"
  - "file_patterns: design.md, ui-design.md"
---

# UI First Design Template

## 📋 Project Information

- **Project Name**: [Project Name]
- **Based on Requirements**: [Link to requirements.md]
- **UI First Validation**: ✅ Requirements phase completed
- **Design Phase**: Phase 2 - UI Priority Design
- **Design System**: [Material Design / Human Interface Guidelines / Custom]
- **Created Date**: [YYYY-MM-DD]
- **Last Updated**: [YYYY-MM-DD]

## 🎨 UI Priority Design Overview

### UI Design Philosophy
**Primary Focus**: User Interface and User Experience  
**Design Approach**: [Mobile-first / Desktop-first / Platform-specific]  
**UI Framework**: [React Native / Flutter / SwiftUI / Jetpack Compose / React / Vue]  
**Design System**: [Material Design / Human Interface Guidelines / Custom]

### UI Architecture Strategy
- **Component-Based**: Reusable UI components
- **State-Driven**: UI reflects application state
- **Responsive**: Adaptive to different screen sizes
- **Accessible**: WCAG 2.1 AA compliance

## 📱 Screen-by-Screen UI Design

### Main Screen Design
**Screen Name**: [Main Screen Name]  
**Purpose**: [Primary user goal]  
**Layout Type**: [List / Grid / Dashboard / Custom]

#### UI Components
- **Header**: [Navigation, title, actions]
- **Content Area**: [Main content layout]
- **Navigation**: [Bottom nav / Side nav / Tab bar]
- **Actions**: [Primary and secondary actions]

#### UI States
- [ ] **Loading State**: Skeleton screens, progress indicators
- [ ] **Empty State**: No data scenarios with helpful messaging
- [ ] **Error State**: Error messages with recovery actions
- [ ] **Success State**: Normal operation with full data

#### User Interactions
- [ ] **Touch/Click**: Primary interaction methods
- [ ] **Gestures**: Swipe, pinch, long press (mobile)
- [ ] **Keyboard**: Shortcuts and navigation (desktop/web)
- [ ] **Voice**: Voice commands (if applicable)

### Secondary Screens Design

#### [Screen Name 1]
**Navigation From**: [Parent screen]  
**Navigation To**: [Child screens]  
**UI Layout**: [Description]

**UI Components**:
- [ ] Header design with back navigation
- [ ] Content layout with specific structure
- [ ] Action buttons and controls
- [ ] Form elements (if applicable)
- [ ] Data visualization (if applicable)

**UI States**:
- [ ] Form validation states
- [ ] Loading and submission states
- [ ] Error handling states
- [ ] Success confirmation states

**User Interactions**:
- [ ] Form input and validation
- [ ] Button interactions
- [ ] Navigation gestures
- [ ] Data manipulation

#### [Screen Name 2]
**Navigation From**: [Parent screen]  
**Navigation To**: [Child screens]  
**UI Layout**: [Description]

**UI Components**:
- [ ] Screen-specific components
- [ ] Navigation elements
- [ ] Action controls
- [ ] Content areas

**UI States**:
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Success states

## 🔄 CRUD Operations UI Design

### Create Operations UI

#### Create Form Design
**Form Type**: [Modal / Full Screen / Inline]  
**Form Layout**: [Single Column / Multi Column / Wizard]

**Form Elements**:
- [ ] Input fields with labels and placeholders
- [ ] Validation messages and error states
- [ ] Required field indicators
- [ ] Help text and tooltips
- [ ] Auto-complete and suggestions

**Form Interactions**:
- [ ] Real-time validation
- [ ] Progressive disclosure
- [ ] Auto-save functionality
- [ ] Draft saving
- [ ] Form reset and clear

**Form States**:
- [ ] Initial state with empty fields
- [ ] Validation state with error messages
- [ ] Submission state with loading indicator
- [ ] Success state with confirmation
- [ ] Error state with recovery options

### Read Operations UI

#### List View Design
**List Type**: [Simple List / Card List / Grid List]  
**List Features**: [Search / Filter / Sort / Pagination]

**List Components**:
- [ ] Search bar with real-time filtering
- [ ] Filter controls and options
- [ ] Sort controls and indicators
- [ ] List items with consistent layout
- [ ] Pagination or infinite scroll

**List Interactions**:
- [ ] Item selection and highlighting
- [ ] Swipe actions (mobile)
- [ ] Bulk selection
- [ ] Quick actions menu
- [ ] Pull-to-refresh

**List States**:
- [ ] Loading state with skeleton items
- [ ] Empty state with helpful messaging
- [ ] Error state with retry options
- [ ] Success state with data display

#### Detail View Design
**Detail Layout**: [Single Column / Multi Column / Tabbed]  
**Detail Features**: [Edit / Delete / Share / Export]

**Detail Components**:
- [ ] Header with title and actions
- [ ] Content sections with clear hierarchy
- [ ] Action buttons and controls
- [ ] Related items or suggestions
- [ ] Navigation breadcrumbs

**Detail Interactions**:
- [ ] Edit mode toggle
- [ ] Action button interactions
- [ ] Content expansion/collapse
- [ ] Related item navigation
- [ ] Sharing and export

### Update Operations UI

#### Edit Form Design
**Edit Mode**: [Inline / Modal / Full Screen]  
**Edit Features**: [Auto-save / Change Tracking / Undo]

**Edit Components**:
- [ ] Pre-populated form fields
- [ ] Change indicators and highlighting
- [ ] Save and cancel buttons
- [ ] Undo/redo controls
- [ ] Version history (if applicable)

**Edit Interactions**:
- [ ] Field-level editing
- [ ] Change confirmation
- [ ] Auto-save with indicators
- [ ] Conflict resolution
- [ ] Bulk edit capabilities

### Delete Operations UI

#### Delete Confirmation Design
**Confirmation Type**: [Dialog / Screen / Inline]  
**Confirmation Features**: [Soft Delete / Hard Delete / Bulk Delete]

**Confirmation Components**:
- [ ] Clear warning message
- [ ] Item details and impact
- [ ] Confirmation buttons
- [ ] Cancel and undo options
- [ ] Recovery information

**Confirmation Interactions**:
- [ ] Confirmation button press
- [ ] Cancel and abort
- [ ] Undo after deletion
- [ ] Bulk confirmation
- [ ] Recovery actions

## 🎨 Visual Design System

### Color Palette
**Primary Colors**:
- Primary: [Color code and usage]
- Secondary: [Color code and usage]
- Accent: [Color code and usage]

**Semantic Colors**:
- Success: [Color code and usage]
- Warning: [Color code and usage]
- Error: [Color code and usage]
- Info: [Color code and usage]

**Neutral Colors**:
- Background: [Color code and usage]
- Surface: [Color code and usage]
- Text Primary: [Color code and usage]
- Text Secondary: [Color code and usage]
- Border: [Color code and usage]

### Typography
**Font Family**: [Font name and fallbacks]  
**Font Weights**: [Light / Regular / Medium / Bold]

**Text Styles**:
- **Heading 1**: [Size, weight, line height]
- **Heading 2**: [Size, weight, line height]
- **Heading 3**: [Size, weight, line height]
- **Body Text**: [Size, weight, line height]
- **Caption**: [Size, weight, line height]
- **Button Text**: [Size, weight, line height]

### Spacing System
**Base Unit**: [8px / 4px / other]  
**Spacing Scale**: [xs, sm, md, lg, xl, xxl]

**Spacing Usage**:
- **Component Padding**: [Spacing values]
- **Component Margins**: [Spacing values]
- **Grid Gutters**: [Spacing values]
- **Section Spacing**: [Spacing values]

### Component Library
**Button Components**:
- [ ] Primary Button: [Style specifications]
- [ ] Secondary Button: [Style specifications]
- [ ] Text Button: [Style specifications]
- [ ] Icon Button: [Style specifications]

**Input Components**:
- [ ] Text Input: [Style specifications]
- [ ] Text Area: [Style specifications]
- [ ] Select Dropdown: [Style specifications]
- [ ] Checkbox: [Style specifications]
- [ ] Radio Button: [Style specifications]

**Navigation Components**:
- [ ] Header/Navbar: [Style specifications]
- [ ] Bottom Navigation: [Style specifications]
- [ ] Side Navigation: [Style specifications]
- [ ] Breadcrumbs: [Style specifications]

**Feedback Components**:
- [ ] Loading Spinner: [Style specifications]
- [ ] Progress Bar: [Style specifications]
- [ ] Toast Notification: [Style specifications]
- [ ] Alert/Modal: [Style specifications]

## 📐 Responsive Design Strategy

### Breakpoints
**Mobile**: 320px - 768px  
**Tablet**: 768px - 1024px  
**Desktop**: 1024px+  
**Large Desktop**: 1440px+

### Adaptive UI Elements
**Navigation**:
- Mobile: Bottom navigation or hamburger menu
- Tablet: Side navigation or tab bar
- Desktop: Top navigation with dropdowns

**Content Layout**:
- Mobile: Single column layout
- Tablet: Two column layout
- Desktop: Multi-column layout

**Form Design**:
- Mobile: Full-width inputs, stacked layout
- Tablet: Two-column form layout
- Desktop: Multi-column form layout

## ♿ Accessibility Design

### Visual Accessibility
- [ ] Color contrast ratios meet WCAG 2.1 AA standards
- [ ] High contrast mode support
- [ ] Color-blind friendly palette
- [ ] Scalable text and icons
- [ ] Clear visual hierarchy

### Interaction Accessibility
- [ ] Keyboard navigation support
- [ ] Focus indicators for all interactive elements
- [ ] Touch targets meet minimum size requirements
- [ ] Gesture alternatives for complex interactions
- [ ] Voice control support (if applicable)

### Content Accessibility
- [ ] Alternative text for all images
- [ ] Descriptive labels for form elements
- [ ] Screen reader friendly content structure
- [ ] Captions for video content
- [ ] Transcripts for audio content

## 🔄 User Flow Design

### Primary User Journey
1. **App Launch** → **Onboarding** → **Main Screen** → **Feature Access** → **Task Completion**

**Flow Details**:
- [ ] App launch with splash screen
- [ ] Onboarding with feature introduction
- [ ] Main screen with clear navigation
- [ ] Feature access with intuitive flow
- [ ] Task completion with success feedback

### Secondary User Journeys
1. **Settings Access** → **Preference Changes** → **Save Changes** → **Return to Main**

2. **Error Recovery** → **Error Message** → **Recovery Action** → **Success State**

3. **Search Flow** → **Search Input** → **Results Display** → **Item Selection**

## 🚀 Implementation Guidelines

### UI Development Priority
1. **Core UI Components** (Priority 1)
   - [ ] Basic layout components
   - [ ] Navigation components
   - [ ] Form components
   - [ ] Button components

2. **Feature-Specific UI** (Priority 2)
   - [ ] Screen-specific components
   - [ ] Complex interactions
   - [ ] Advanced form elements
   - [ ] Data visualization

3. **Polish and Enhancement** (Priority 3)
   - [ ] Animations and transitions
   - [ ] Advanced interactions
   - [ ] Performance optimizations
   - [ ] Accessibility enhancements

### Platform-Specific Considerations

#### Mobile (iOS/Android)
- [ ] Platform-specific design guidelines
- [ ] Touch gesture support
- [ ] Platform-specific navigation patterns
- [ ] Performance optimization for mobile
- [ ] Offline functionality

#### Web
- [ ] Cross-browser compatibility
- [ ] Responsive design implementation
- [ ] SEO optimization
- [ ] Progressive Web App features
- [ ] Desktop interaction patterns

#### Desktop
- [ ] Window management
- [ ] Keyboard shortcuts
- [ ] Menu systems
- [ ] System integration
- [ ] Multi-window support

## 📊 UI Performance Considerations

### Loading Performance
- [ ] Skeleton screens for initial load
- [ ] Lazy loading for images and content
- [ ] Progressive image loading
- [ ] Code splitting for large components
- [ ] Caching strategies for static assets

### Runtime Performance
- [ ] Smooth animations (60fps)
- [ ] Efficient list rendering
- [ ] Optimized image handling
- [ ] Memory management
- [ ] Battery optimization (mobile)

## ✅ UI Design Quality Checklist

### Design Completeness
- [ ] All screens have detailed specifications
- [ ] All UI states are defined
- [ ] All interactions are specified
- [ ] All components are documented
- [ ] All responsive breakpoints are covered

### Design Consistency
- [ ] Consistent visual language
- [ ] Consistent interaction patterns
- [ ] Consistent spacing and typography
- [ ] Consistent color usage
- [ ] Consistent component behavior

### Design Feasibility
- [ ] All designs are technically feasible
- [ ] Performance requirements are realistic
- [ ] Accessibility requirements are achievable
- [ ] Cross-platform requirements are clear
- [ ] Timeline requirements are reasonable

## 📝 Approval Checklist

### Design Review
- [ ] Design team approval
- [ ] Product owner approval
- [ ] User experience validation
- [ ] Accessibility review
- [ ] Brand compliance check

### Technical Review
- [ ] Development team approval
- [ ] Technical feasibility confirmation
- [ ] Performance impact assessment
- [ ] Implementation timeline validation
- [ ] Resource requirement confirmation

### Stakeholder Approval
- [ ] Final stakeholder sign-off
- [ ] Implementation approval
- [ ] Quality standards confirmation
- [ ] Success criteria agreement
- [ ] Next phase authorization

---

**Success Criteria**: Complete UI design specifications, comprehensive component library, clear implementation guidelines, and stakeholder approval for UI-first development approach.
