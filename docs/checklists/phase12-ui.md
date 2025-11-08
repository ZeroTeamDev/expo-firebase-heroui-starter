# Phase 12 — UI Components Library Checklist

Các UI cần có 1 trang index và các trang preview để demo tính năng

## Legend
- [ ] Not Started
- [~] In Progress
- [x] Completed

## Data Display Components (`components/data`)
- [x] `DataTable.tsx` with sorting, filtering, pagination
- [x] `DataList.tsx` supporting pull-to-refresh & infinite scroll
- [x] `DataCard.tsx` with actions, media, and badges
- [x] `DataGrid.tsx` with responsive columns and selection

## Form Components (`components/forms`)
- [x] `FormSelect.tsx` with async search and multi-select
- [x] `FormDatePicker.tsx` for date/time/range
- [x] `FormFileUpload.tsx` with preview and drag-drop
- [x] `FormSwitch.tsx` with label/description
- [x] `FormCheckbox.tsx` supporting groups & validation
- [x] `FormRadio.tsx` supporting groups & validation
- [x] `FormTextarea.tsx` with auto-resize & counters
- [x] Enhance `FormInput.tsx` with helper text, icons, error states

## Navigation Components (`components/navigation`)
- [x] `Breadcrumbs.tsx` with custom separators
- [x] `Pagination.tsx` with page size & jump controls
- [x] `Stepper.tsx` with progress indicators
- [x] `Tabs.tsx` with scrolling & badge support

## Feedback Components (`components/feedback`)
- [x] `Toast.tsx` with queueing and variants
- [x] `Alert.tsx` with modal/dialog presentation
- [x] `Progress.tsx` (linear & circular)
- [x] `Badge.tsx` with count & dot variants
- [x] Enhance `Spinner.tsx` with size/color props

## Media Components (`components/media`)
- [x] `Image.tsx` with lazy loading, placeholders, zoom
- [x] `Video.tsx` with player controls & fullscreen
- [x] `Audio.tsx` with waveform & playback controls
- [x] `ImageGallery.tsx` with swipe/thumbnail navigation

## Cross-Cutting Requirements
- [x] Provide TypeScript props & storybook-style examples
- [x] Ensure dark/light theme compatibility
- [~] Add animation & haptic feedback hooks where relevant
- [~] Include accessibility labels/focus management
- [x] Implement loading/error/empty states as applicable
- [x] Export components via `components/data/index.ts` et al.
- [x] Create root `components/index.ts` barrel export
- [x] Create shared utilities (table-selection, file-picker, theming)

## Example Module (`modules/examples/ui-components-example`)
- [x] Create module definition file
- [x] Build screen with interactive playground
- [~] Provide searchable catalog of components
- [ ] Add code snippets with copy-to-clipboard

## Documentation
- [x] Update `docs/ui-components.md` with API tables
- [x] Document theming and customization recipes
- [x] Capture usage patterns and anti-patterns
- [ ] Add screenshots or recordings for showcase (manual task)

## Validation
- [ ] Write unit & snapshot tests for critical components
- [ ] Test on iOS, Android, and Web targets
- [ ] Capture performance metrics for heavy lists/grids

