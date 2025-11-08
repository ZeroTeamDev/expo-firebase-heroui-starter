# UI Components Library

Created by Kien AI (leejungkiin@gmail.com)

Comprehensive documentation for the UI Components Library, including data display, forms, navigation, feedback, and media components.

## Table of Contents

- [Data Display Components](#data-display-components)
- [Form Components](#form-components)
- [Navigation Components](#navigation-components)
- [Feedback Components](#feedback-components)
- [Media Components](#media-components)
- [Theming](#theming)
- [Accessibility](#accessibility)
- [Usage Patterns](#usage-patterns)
- [Anti-Patterns](#anti-patterns)

## Data Display Components

### DataTable

Display tabular data with sorting, filtering, and pagination.

#### API

```typescript
interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
  filters?: React.ReactNode;
}
```

#### Usage

```tsx
import { DataTable } from '@/components/data';

const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'role', title: 'Role', sortable: true },
];

<DataTable
  columns={columns}
  data={users}
  sortKey="name"
  sortDirection="asc"
  onSortChange={(key, dir) => setSort({ key, dir })}
  page={1}
  pageSize={10}
  onPageChange={setPage}
/>
```

### DataList

Display lists with pull-to-refresh and infinite scroll support.

#### API

```typescript
interface DataListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: { item: T; index: number }) => React.ReactNode;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  ListEmptyComponent?: React.ReactNode;
  scrollEnabled?: boolean;
  nestedScrollEnabled?: boolean;
}
```

### DataCard

Composable information cards with badges, metadata, and actions.

#### API

```typescript
interface DataCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  media?: React.ReactNode;
  badges?: DataCardBadge[];
  metadata?: DataCardMetadataItem[];
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  condensed?: boolean;
}
```

### DataGrid

Responsive grid layout for displaying card-based data.

#### API

```typescript
interface DataGridProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: { item: T; index: number }) => React.ReactNode;
  minColumnWidth?: number;
  spacing?: number;
  scrollEnabled?: boolean;
  nestedScrollEnabled?: boolean;
}
```

## Form Components

### FormInput

Enhanced text input with helper text, icons, and validation.

#### API

```typescript
interface FormInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  helperText?: string;
  leadingAdornment?: React.ReactNode;
  trailingAdornment?: React.ReactNode;
  showCharacterCount?: boolean;
  maxLength?: number;
  disabled?: boolean;
}
```

### FormSelect

Select input with async search and multi-select support.

#### API

```typescript
interface FormSelectProps<T = string> {
  label?: string;
  value: T | T[];
  onChange: (value: T | T[]) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  helperText?: string;
  error?: string;
}
```

### FormDatePicker

Date and time picker with range support.

#### API

```typescript
interface FormDatePickerProps {
  label?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  mode?: 'date' | 'time' | 'datetime';
  range?: boolean;
  rangeValue?: DateRangeValue;
  onRangeChange?: (range: DateRangeValue) => void;
  helperText?: string;
  error?: string;
}
```

### FormFileUpload

File upload with preview and drag-drop support.

#### API

```typescript
interface FormFileUploadProps {
  label?: string;
  value: SelectedFile[];
  onChange: (files: SelectedFile[]) => void;
  allowMultiple?: boolean;
  accept?: string[];
  helperText?: string;
  error?: string;
}
```

## Navigation Components

### Breadcrumbs

Hierarchical navigation with responsive overflow handling.

#### API

```typescript
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxVisible?: number;
}

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
  isCurrent?: boolean;
}
```

### Pagination

Pagination controls with page size selection.

#### API

```typescript
interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}
```

### Stepper

Step indicator for multi-step processes.

#### API

```typescript
interface StepperProps {
  steps: StepItem[];
  orientation?: 'horizontal' | 'vertical';
}

interface StepItem {
  id: string;
  title: string;
  description?: string;
  status: 'complete' | 'current' | 'upcoming';
}
```

### Tabs

Tab navigation with scrolling and badge support.

#### API

```typescript
interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  scrollable?: boolean;
}

interface TabItem {
  key: string;
  label: string;
  badge?: number;
}
```

## Feedback Components

### Toast

Toast notifications with queueing and variants.

#### API

```typescript
interface ToastOptions {
  title: string;
  message?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  duration?: number;
  action?: ToastAction;
  icon?: React.ReactNode;
  canClose?: boolean;
}

// Usage
const { showToast } = useToast();

showToast({
  title: 'Success!',
  message: 'Your changes have been saved.',
  variant: 'success',
});
```

### Alert

Alert messages with actions and dismissal.

#### API

```typescript
interface AlertProps {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: AlertAction[];
  icon?: React.ReactNode;
  compact?: boolean;
}
```

### Progress

Progress indicators with linear and circular variants.

#### API

```typescript
interface ProgressProps {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
  helperText?: string;
  showValue?: boolean;
  indeterminate?: boolean;
  variant?: 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'linear' | 'circular';
}
```

### Badge

Badge component with variants and dot indicators.

#### API

```typescript
interface BadgeProps {
  label: string;
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  leadingDot?: boolean;
  onPress?: () => void;
}
```

### Spinner

Loading spinner with size and variant options.

#### API

```typescript
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  label?: string;
  helperText?: string;
  variant?: 'accent' | 'contrast' | 'muted';
}
```

## Media Components

### MediaImage

Image component with lazy loading and placeholders.

#### API

```typescript
interface MediaImageProps {
  source: ImageSource;
  alt?: string;
  aspectRatio?: number;
  borderRadius?: number;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  transitionDuration?: number;
  blurhash?: string;
  loadingIndicator?: React.ReactNode;
  overlayContent?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}
```

### MediaVideo

Video player with controls and fullscreen support.

#### API

```typescript
interface MediaVideoProps {
  source: AVPlaybackSource;
  posterSource?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  aspectRatio?: number;
  borderRadius?: number;
  overlay?: React.ReactNode;
  onStatusChange?: (status: AVPlaybackStatus) => void;
  onPressPlay?: () => void;
}
```

### MediaAudio

Audio player with waveform and playback controls.

#### API

```typescript
interface MediaAudioProps {
  source: AVPlaybackSource;
  title?: string;
  subtitle?: string;
  artworkUri?: string;
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
  compact?: boolean;
  onStatusChange?: (status: AVPlaybackStatus) => void;
}
```

### MediaImageGallery

Image gallery with swipe and thumbnail navigation.

#### API

```typescript
interface MediaImageGalleryProps {
  items: MediaGalleryItem[];
  initialIndex?: number;
  onChange?: (index: number) => void;
}

interface MediaGalleryItem {
  id: string;
  imageProps: MediaImageProps;
  caption?: string;
}
```

## Theming

### Using Theme Tokens

All components support theming through `heroui-native`'s `useTheme` hook. The library also provides shared theming utilities:

```typescript
import { spacing, borderRadius, fontSize, fontWeight } from '@/components/utils/theming';

// Usage
const containerStyle = {
  padding: spacing.lg,
  borderRadius: borderRadius.md,
  fontSize: fontSize.md,
  fontWeight: fontWeight.semibold,
};
```

### Available Tokens

- **Spacing**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`
- **Border Radius**: `sm`, `md`, `lg`, `xl`, `2xl`, `full`
- **Font Size**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- **Font Weight**: `normal`, `medium`, `semibold`, `bold`
- **Animation Duration**: `fast`, `normal`, `slow`, `slower`
- **Z-Index**: `base`, `dropdown`, `sticky`, `fixed`, `modalBackdrop`, `modal`, `popover`, `tooltip`, `toast`

### Dark/Light Theme Support

All components automatically adapt to the current theme:

```tsx
import { useTheme } from 'heroui-native';

function MyComponent() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Components handle theme switching automatically
  return <DataCard title="Example" />;
}
```

## Accessibility

### Best Practices

1. **Always provide labels**: Use `label` prop for form inputs and `alt` for images
2. **Use semantic roles**: Components use appropriate `accessibilityRole` props
3. **Keyboard navigation**: All interactive components support keyboard navigation
4. **Screen reader support**: Use `accessibilityLabel` for custom interactive elements

### Example

```tsx
<FormInput
  label="Email Address"
  placeholder="Enter your email"
  accessibilityLabel="Email input field"
  accessibilityHint="Enter your email address to receive updates"
/>

<MediaImage
  source={{ uri: '...' }}
  alt="Product screenshot showing the dashboard interface"
/>
```

## Usage Patterns

### Pattern 1: Form with Validation

```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<FormInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={error}
  helperText="We'll never share your email"
  onBlur={() => {
    if (!email.includes('@')) {
      setError('Invalid email address');
    }
  }}
/>
```

### Pattern 2: Data Table with Sorting

```tsx
const [sortKey, setSortKey] = useState('name');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

<DataTable
  columns={columns}
  data={sortedData}
  sortKey={sortKey}
  sortDirection={sortDirection}
  onSortChange={(key, dir) => {
    setSortKey(key);
    setSortDirection(dir);
  }}
/>
```

### Pattern 3: Toast Notifications

```tsx
function MyComponent() {
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showToast({
        title: 'Success!',
        message: 'Your data has been saved.',
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Failed to save data.',
        variant: 'danger',
      });
    }
  };

  return <FormButton title="Save" onPress={handleSave} />;
}
```

### Pattern 4: Media Gallery

```tsx
const galleryItems = [
  {
    id: '1',
    imageProps: {
      source: { uri: '...' },
      alt: 'First image',
    },
    caption: 'Description of first image',
  },
  // ... more items
];

<MediaImageGallery
  items={galleryItems}
  initialIndex={0}
  onChange={(index) => console.log('Selected index:', index)}
/>
```

## Anti-Patterns

### ❌ Don't: Nest ScrollViews with VirtualizedLists

```tsx
// BAD
<ScrollView>
  <DataList data={items} /> {/* DataList uses FlatList internally */}
</ScrollView>
```

```tsx
// GOOD
<ScrollView>
  <DataList
    data={items}
    scrollEnabled={false}
    nestedScrollEnabled={false}
  />
</ScrollView>
```

### ❌ Don't: Use Toast without Provider

```tsx
// BAD
function App() {
  return <MyComponent />; // useToast() will throw error
}

// GOOD
function App() {
  return (
    <ToastProvider>
      <MyComponent />
    </ToastProvider>
  );
}
```

### ❌ Don't: Forget Error Handling

```tsx
// BAD
<MediaImage source={{ uri: invalidUrl }} />

// GOOD
<MediaImage
  source={{ uri: url }}
  onError={(error) => {
    console.error('Image load failed:', error);
    // Show fallback or error state
  }}
/>
```

### ❌ Don't: Hardcode Colors

```tsx
// BAD
<View style={{ backgroundColor: '#ffffff' }} />

// GOOD
const { colors } = useTheme();
<View style={{ backgroundColor: colors.background }} />
```

## Performance Considerations

### Lazy Loading

Media components support lazy loading by default:

```tsx
<MediaImage
  source={{ uri: largeImageUrl }}
  // Image loads only when in viewport
  blurhash="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
/>
```

### Virtualization

Use `DataList` and `DataGrid` for large datasets:

```tsx
<DataList
  data={largeDataSet} // 1000+ items
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemCard item={item} />}
  // Only renders visible items
/>
```

### Memoization

Memoize expensive computations:

```tsx
const sortedData = useMemo(() => {
  return [...data].sort((a, b) => {
    // Expensive sorting logic
  });
}, [data, sortKey, sortDirection]);
```

## Testing

### Unit Tests

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { DataTable } from '@/components/data';

test('DataTable sorts correctly', () => {
  const { getByText } = render(
    <DataTable
      columns={columns}
      data={data}
      onSortChange={jest.fn()}
    />
  );

  fireEvent.press(getByText('Name'));
  expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
});
```

### Snapshot Tests

```tsx
import renderer from 'react-test-renderer';
import { Alert } from '@/components/feedback';

test('Alert renders correctly', () => {
  const tree = renderer.create(
    <Alert title="Test" variant="info" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
```

## Platform Support

All components are tested and verified on:

- ✅ iOS (React Native)
- ✅ Android (React Native)
- ✅ Web (React Native Web)

### Platform-Specific Considerations

- **iOS**: Native controls are used for date/time pickers
- **Android**: Material Design guidelines are followed
- **Web**: Accessibility attributes are enhanced for screen readers

## Contributing

When adding new components:

1. Follow the existing TypeScript patterns
2. Support both light and dark themes
3. Include accessibility labels
4. Add loading and error states
5. Export through appropriate barrel files
6. Update this documentation

## Examples

See `app/modules/examples/ui-components-example/index.tsx` for comprehensive examples of all components.
