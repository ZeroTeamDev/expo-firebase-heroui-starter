---
description: "Technical handoff template for developer collaboration with component specifications, API contracts, and implementation guidelines. Apply when working with developer handoff, technical documentation, or implementation planning."
alwaysApply: false
category: "ui-design"
priority: "high"
triggers:
  - "phase: handoff"
  - "keywords: technical handoff, developer documentation, implementation"
  - "file_patterns: handoff.md, technical.md"
---

# Technical Handoff Template

## 📋 Project Information

- **Project Name**: [Project Name]
- **Based on Design**: [Link to design.md]
- **Technical Handoff Phase**: Developer Collaboration
- **Target Platforms**: [iOS / Android / Web / Desktop]
- **UI Framework**: [React Native / Flutter / SwiftUI / Jetpack Compose / React / Vue]
- **Created Date**: [YYYY-MM-DD]
- **Last Updated**: [YYYY-MM-DD]

## 🎯 Handoff Overview

### Purpose
This document provides comprehensive technical specifications for developers to implement the UI-first design with complete understanding of components, interactions, and business logic requirements.

### Scope
- Component specifications with props, state, and events
- Screen flow diagrams and navigation patterns
- Data requirements and API contracts
- Business logic requirements and validation rules
- State management patterns and data flow
- Integration points and external dependencies
- Edge cases and error handling scenarios
- Performance requirements and optimization guidelines
- Accessibility requirements and implementation details

## 🧩 Component Specifications

### Main Screen Components

#### Component: MainScreen
**Purpose**: Primary application screen with main functionality and navigation

**Props Interface**:
```typescript
interface MainScreenProps {
  // Data props
  user: User | null;
  items: Item[];
  loading: boolean;
  error: string | null;
  
  // Event handlers
  onItemSelect: (item: Item) => void;
  onItemCreate: () => void;
  onItemEdit: (item: Item) => void;
  onItemDelete: (item: Item) => void;
  onRefresh: () => void;
  onSearch: (query: string) => void;
  onFilter: (filter: FilterOptions) => void;
  
  // Configuration
  showCreateButton: boolean;
  enableSearch: boolean;
  enableFilter: boolean;
  maxItemsPerPage: number;
}
```

**State Management**:
```typescript
interface MainScreenState {
  // UI state
  selectedItem: Item | null;
  searchQuery: string;
  filterOptions: FilterOptions;
  sortOrder: SortOrder;
  viewMode: 'list' | 'grid';
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  isSearching: boolean;
  
  // Error states
  error: string | null;
  networkError: boolean;
  
  // Pagination
  currentPage: number;
  hasMoreItems: boolean;
}
```

**Event Handlers**:
- `handleItemSelect`: Navigate to item detail screen
- `handleItemCreate`: Navigate to create item screen
- `handleItemEdit`: Navigate to edit item screen
- `handleItemDelete`: Show delete confirmation dialog
- `handleRefresh`: Refresh data from server
- `handleSearch`: Filter items by search query
- `handleFilter`: Apply filter options
- `handleLoadMore`: Load next page of items

**UI States**:
- **Loading State**: Show skeleton screens while data loads
- **Empty State**: Show empty state message with create button
- **Error State**: Show error message with retry button
- **Success State**: Show items in list/grid format
- **Search State**: Show filtered results with search query
- **Filter State**: Show filtered results with active filters

---

#### Component: ItemCard
**Purpose**: Display individual item information in list/grid view

**Props Interface**:
```typescript
interface ItemCardProps {
  // Data
  item: Item;
  viewMode: 'list' | 'grid';
  
  // Actions
  onSelect: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onShare: (item: Item) => void;
  
  // Configuration
  showActions: boolean;
  enableSelection: boolean;
  isSelected: boolean;
}
```

**Item Data Structure**:
```typescript
interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'archived';
  tags: string[];
  metadata: Record<string, any>;
}
```

---

### Form Components

#### Component: CreateItemForm
**Purpose**: Form for creating new items with validation

**Props Interface**:
```typescript
interface CreateItemFormProps {
  // Event handlers
  onSubmit: (data: CreateItemData) => void;
  onCancel: () => void;
  onSaveDraft: (data: CreateItemData) => void;
  
  // Configuration
  initialData?: Partial<CreateItemData>;
  isDraft?: boolean;
  autoSave?: boolean;
  validationRules: ValidationRules;
}
```

**Form Data Structure**:
```typescript
interface CreateItemData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: File;
  metadata: Record<string, any>;
}
```

**Validation Rules**:
```typescript
interface ValidationRules {
  title: {
    required: true;
    minLength: 3;
    maxLength: 100;
    pattern?: RegExp;
  };
  description: {
    required: true;
    minLength: 10;
    maxLength: 1000;
  };
  category: {
    required: true;
    allowedValues: string[];
  };
  tags: {
    maxItems: 10;
    maxLength: 20;
  };
}
```

---

### Navigation Components

#### Component: NavigationHeader
**Purpose**: Application header with navigation and actions

**Props Interface**:
```typescript
interface NavigationHeaderProps {
  // Content
  title: string;
  subtitle?: string;
  
  // Navigation
  showBackButton: boolean;
  onBackPress: () => void;
  
  // Actions
  actions: HeaderAction[];
  onActionPress: (action: HeaderAction) => void;
  
  // Configuration
  showSearch: boolean;
  searchPlaceholder: string;
  onSearchChange: (query: string) => void;
}
```

**Header Action Structure**:
```typescript
interface HeaderAction {
  id: string;
  icon: string;
  label: string;
  type: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  visible?: boolean;
}
```

---

## 🔄 Screen Flow Diagrams

### Primary User Flow
```
App Launch → Onboarding → Main Screen → Item Detail → Edit Item → Save Changes → Main Screen
     ↓              ↓           ↓            ↓           ↓            ↓           ↓
  Splash Screen  Welcome    Item List    Item Info    Edit Form   Success     Updated List
                 Screen     with Search  with Actions Form with   Message     with Changes
                           and Filters  Edit/Delete  Validation
```

### Secondary User Flows
```
Main Screen → Create Item → Form Validation → Save Item → Success → Main Screen
     ↓            ↓             ↓              ↓          ↓          ↓
  Item List   Create Form   Real-time      API Call   Confirmation Updated List
              with Fields   Validation     with Error   Message     with New Item
                          and Feedback    Handling
```

### Error Recovery Flows
```
Error State → Error Message → Retry Action → Loading State → Success/Error
     ↓             ↓              ↓              ↓              ↓
  Network      "Connection     Retry Button   Spinner with   Success: Show
  Error        Failed" with   with Loading    Retry Text    Updated Data
               Retry Button    State                          Error: Show Error
                                                             Message Again
```

---

## 📊 Data Requirements and API Contracts

### Data Models

#### User Model
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}
```

#### Item Model
```typescript
interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  imageUrl?: string;
  status: ItemStatus;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

type ItemStatus = 'active' | 'inactive' | 'archived' | 'deleted';
```

### API Endpoints

#### Items API
```typescript
// GET /api/items
interface GetItemsRequest {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ItemStatus;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

interface GetItemsResponse {
  items: Item[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// POST /api/items
interface CreateItemRequest {
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: File;
  metadata?: Record<string, any>;
}

interface CreateItemResponse {
  item: Item;
  success: boolean;
  message: string;
}

// PUT /api/items/:id
interface UpdateItemRequest {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  image?: File;
  metadata?: Record<string, any>;
  status?: ItemStatus;
}

interface UpdateItemResponse {
  item: Item;
  success: boolean;
  message: string;
}

// DELETE /api/items/:id
interface DeleteItemRequest {
  id: string;
  permanent?: boolean;
}

interface DeleteItemResponse {
  success: boolean;
  message: string;
}
```

### Error Handling

#### API Error Response
```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId: string;
}

// Common error codes
type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR';
```

---

## ⚙️ Business Logic Requirements

### Validation Rules

#### Item Validation
```typescript
const itemValidationRules = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
    message: 'Title must be 3-100 characters, alphanumeric with spaces, hyphens, and underscores only'
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    message: 'Description must be 10-1000 characters'
  },
  category: {
    required: true,
    allowedValues: ['work', 'personal', 'shopping', 'other'],
    message: 'Category must be one of: work, personal, shopping, other'
  },
  tags: {
    maxItems: 10,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9\-_]+$/,
    message: 'Tags must be alphanumeric with hyphens and underscores, max 20 characters each'
  }
};
```

#### User Input Validation
```typescript
const userInputValidation = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  }
};
```

### Business Rules

#### Item Management Rules
1. **Creation Rules**:
   - Users can create unlimited items
   - Items must have unique titles within user's scope
   - Items are created with 'active' status by default
   - Created items are immediately visible to the user

2. **Update Rules**:
   - Users can only update their own items
   - Updates must maintain data integrity
   - Updated items maintain their creation date
   - Update history is tracked for audit purposes

3. **Deletion Rules**:
   - Users can only delete their own items
   - Deletion is soft delete by default (status = 'deleted')
   - Permanent deletion requires confirmation
   - Deleted items are not visible in normal views

4. **Access Rules**:
   - Users can only view their own items
   - Items are filtered by user ID in all queries
   - No cross-user data access is allowed
   - Admin users have special permissions

#### Search and Filter Rules
1. **Search Rules**:
   - Search is case-insensitive
   - Search matches title and description
   - Search results are paginated
   - Search is limited to user's own items

2. **Filter Rules**:
   - Filters can be combined (AND logic)
   - Filters are applied after search
   - Filter state is preserved during session
   - Filters are reset when changing users

---

## 🔄 State Management Patterns

### Global State Structure
```typescript
interface AppState {
  // User state
  user: {
    current: User | null;
    loading: boolean;
    error: string | null;
  };
  
  // Items state
  items: {
    list: Item[];
    selected: Item | null;
    loading: boolean;
    error: string | null;
    pagination: PaginationState;
    filters: FilterState;
    search: SearchState;
  };
  
  // UI state
  ui: {
    theme: 'light' | 'dark';
    language: string;
    sidebarOpen: boolean;
    modals: ModalState[];
    notifications: Notification[];
  };
  
  // Form state
  forms: {
    createItem: FormState<CreateItemData>;
    editItem: FormState<UpdateItemData>;
    userProfile: FormState<UserProfileData>;
  };
}
```

### State Management Actions
```typescript
// Items actions
const itemsActions = {
  // Async actions
  fetchItems: (params: GetItemsRequest) => Promise<void>;
  createItem: (data: CreateItemData) => Promise<void>;
  updateItem: (id: string, data: UpdateItemData) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // Sync actions
  setItems: (items: Item[]) => void;
  setSelectedItem: (item: Item | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  updateSearch: (query: string) => void;
  resetItems: () => void;
};
```

### Data Flow Patterns
```typescript
// Component data flow
const useItemManagement = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.items);
  
  const fetchItems = useCallback(async (params: GetItemsRequest) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const response = await itemsAPI.getItems(params);
      dispatch(setItems(response.items));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  
  return {
    items,
    loading,
    error,
    fetchItems
  };
};
```

---

## 🔗 Integration Points

### External Dependencies

#### Authentication Service
```typescript
interface AuthService {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string>;
  getCurrentUser: () => Promise<User>;
  isAuthenticated: () => boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResult {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}
```

#### File Upload Service
```typescript
interface FileUploadService {
  uploadImage: (file: File) => Promise<UploadResult>;
  deleteImage: (imageId: string) => Promise<void>;
  getImageUrl: (imageId: string) => string;
}

interface UploadResult {
  imageId: string;
  url: string;
  size: number;
  mimeType: string;
}
```

#### Notification Service
```typescript
interface NotificationService {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  showLoading: (message: string) => void;
  hideLoading: () => void;
}
```

### Third-Party Integrations

#### Analytics Integration
```typescript
interface AnalyticsService {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackPageView: (page: string) => void;
  trackUserAction: (action: string, target: string) => void;
  setUserProperties: (properties: Record<string, any>) => void;
}
```

#### Crash Reporting
```typescript
interface CrashReportingService {
  logError: (error: Error, context?: Record<string, any>) => void;
  logMessage: (message: string, level: 'info' | 'warning' | 'error') => void;
  setUserContext: (user: User) => void;
  setCustomContext: (key: string, value: any) => void;
}
```

---

## ⚠️ Edge Cases and Error Handling

### Network Error Scenarios
1. **No Internet Connection**:
   - Show offline indicator
   - Disable network-dependent features
   - Queue actions for when connection returns
   - Provide offline mode functionality

2. **Slow Network**:
   - Show loading indicators
   - Implement request timeouts
   - Provide retry mechanisms
   - Optimize data loading

3. **Server Errors**:
   - Show user-friendly error messages
   - Provide retry options
   - Log errors for debugging
   - Fallback to cached data when possible

### Data Validation Errors
1. **Invalid Input**:
   - Show field-specific error messages
   - Highlight invalid fields
   - Prevent form submission
   - Provide correction suggestions

2. **Server Validation Errors**:
   - Display server error messages
   - Map server errors to UI fields
   - Allow user to correct and resubmit
   - Maintain form state during errors

### User Experience Errors
1. **Empty States**:
   - Show helpful empty state messages
   - Provide actions to populate data
   - Guide users to create content
   - Maintain positive user experience

2. **Permission Errors**:
   - Show clear permission messages
   - Provide guidance on how to get permissions
   - Offer alternative actions when possible
   - Maintain user flow continuity

---

## 🚀 Performance Requirements

### Loading Performance
- **Initial Load**: < 3 seconds for first screen
- **Navigation**: < 1 second for screen transitions
- **Data Loading**: < 2 seconds for API responses
- **Image Loading**: < 5 seconds for images
- **Form Submission**: < 2 seconds for form processing

### Runtime Performance
- **Scroll Performance**: 60fps for smooth scrolling
- **Animation Performance**: 60fps for all animations
- **Memory Usage**: < 100MB for typical usage
- **Battery Impact**: Minimal impact on mobile devices
- **Network Usage**: Optimized data transfer

### Optimization Strategies
1. **Code Splitting**: Split code by routes and features
2. **Lazy Loading**: Load components and data on demand
3. **Image Optimization**: Compress and resize images
4. **Caching**: Implement aggressive caching strategies
5. **Bundle Optimization**: Minimize and compress bundles

---

## ♿ Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Reader**: Compatible with screen readers
- **Focus Management**: Clear focus indicators
- **Text Alternatives**: Alt text for all images

### Implementation Guidelines
1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Provide descriptive labels
3. **Keyboard Support**: Ensure keyboard accessibility
4. **Focus Management**: Manage focus properly
5. **Color Independence**: Don't rely on color alone

### Testing Requirements
- **Automated Testing**: Use accessibility testing tools
- **Manual Testing**: Test with screen readers
- **User Testing**: Test with users with disabilities
- **Cross-Platform**: Test on all target platforms
- **Continuous Testing**: Include in CI/CD pipeline

---

## 📝 Implementation Guidelines

### Development Standards
1. **Code Quality**: Follow established coding standards
2. **Testing**: Write comprehensive tests
3. **Documentation**: Document all components and functions
4. **Performance**: Optimize for performance
5. **Security**: Follow security best practices

### Deployment Requirements
1. **Environment Setup**: Configure all environments
2. **Build Process**: Automated build and deployment
3. **Quality Gates**: Pass all quality checks
4. **Monitoring**: Set up monitoring and alerting
5. **Rollback Plan**: Prepare rollback procedures

### Maintenance Guidelines
1. **Updates**: Regular updates and maintenance
2. **Monitoring**: Continuous monitoring and alerting
3. **Performance**: Regular performance reviews
4. **Security**: Regular security audits
5. **User Feedback**: Collect and act on user feedback

---

**Success Criteria**: Complete technical specifications, clear implementation guidelines, comprehensive error handling, and developer-ready documentation for successful UI-first implementation.
