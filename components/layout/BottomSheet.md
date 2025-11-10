# BottomSheet Component

Created by Kien AI (leejungkiin@gmail.com)

Optimized, reusable bottom sheet component with liquid glass effect, gesture handling, and smooth animations for React Native/Expo.

## Features

- 🎨 **Liquid Glass Effect** - Beautiful glass morphism design with blur and gradients
- 👆 **Gesture Support** - Swipe to close with smooth animations
- ⌨️ **Keyboard Handling** - Automatic keyboard avoidance
- 📱 **Multi-Step Navigation** - Built-in support for multi-step flows
- 🎯 **Fully Customizable** - Extensive props for customization
- ⚡ **Optimized Performance** - Memoized components and efficient animations
- 🌓 **Theme Support** - Automatic dark/light mode support
- 📐 **Safe Area Aware** - Respects device safe areas

## Installation

The component is already included in the layout components. Import it from:

```typescript
import { BottomSheet, BottomSheetWithSteps } from '@/components/layout';
```

## Basic Usage

### Simple Bottom Sheet

```typescript
import { useState } from 'react';
import { BottomSheet } from '@/components/layout';

function MyComponent() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>Open Sheet</Button>
      
      <BottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        title="My Bottom Sheet"
      >
        <Text>Your content here</Text>
      </BottomSheet>
    </>
  );
}
```

### Multi-Step Bottom Sheet

```typescript
import { useState } from 'react';
import { BottomSheetWithSteps, type BottomSheetStep } from '@/components/layout';

function MyComponent() {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState('step1');

  const steps: BottomSheetStep[] = [
    {
      id: 'step1',
      title: 'Step 1',
      content: <Text>Step 1 Content</Text>,
    },
    {
      id: 'step2',
      title: 'Step 2',
      showBackButton: true,
      content: <Text>Step 2 Content</Text>,
    },
  ];

  return (
    <BottomSheetWithSteps
      visible={visible}
      onClose={() => setVisible(false)}
      steps={steps}
      currentStepId={currentStep}
      onStepChange={setCurrentStep}
    />
  );
}
```

## Props

### BottomSheetProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | **required** | Whether the bottom sheet is visible |
| `onClose` | `() => void` | **required** | Callback when sheet is closed |
| `children` | `ReactNode` | **required** | Content to render inside the sheet |
| `header` | `ReactNode` | `undefined` | Custom header component |
| `title` | `string` | `undefined` | Title for the sheet |
| `showBackButton` | `boolean` | `false` | Whether to show back button |
| `onBack` | `() => void` | `undefined` | Callback when back button is pressed |
| `showCloseButton` | `boolean` | `true` | Whether to show close button |
| `maxHeight` | `number` | `0.9` | Maximum height (0-1, percentage of screen) |
| `enableSwipeToClose` | `boolean` | `true` | Enable swipe to close gesture |
| `dismissOnBackdropPress` | `boolean` | `true` | Dismiss when backdrop is pressed |
| `enableKeyboardAvoidance` | `boolean` | `true` | Enable keyboard avoidance |
| `blurIntensity` | `number` | `20` | Blur intensity for backdrop |
| `backdropOpacity` | `number` | `0.3` | Backdrop opacity |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Custom styles for sheet container |
| `contentStyle` | `StyleProp<ViewStyle>` | `undefined` | Custom styles for content |
| `showHandle` | `boolean` | `true` | Show handle bar at top |
| `animationDuration` | `number` | `300` | Animation duration in milliseconds |
| `snapPoints` | `number[]` | `undefined` | Snap points (0-1, percentage of screen) |
| `initialSnapIndex` | `number` | `0` | Initial snap point index |
| `onPositionChange` | `(position: number) => void` | `undefined` | Callback when position changes |

### BottomSheetWithStepsProps

Extends `BottomSheetProps` with:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `BottomSheetStep[]` | **required** | Array of steps to display |
| `currentStepId` | `string` | **required** | Current step ID |
| `onStepChange` | `(stepId: string) => void` | **required** | Callback when step changes |

### BottomSheetStep

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique identifier for the step |
| `content` | `ReactNode` | **required** | Step content |
| `title` | `string` | `undefined` | Step title (used in header) |
| `showBackButton` | `boolean` | `undefined` | Whether to show back button |

## Examples

### Example 1: Feedback Form

```typescript
import { useState } from 'react';
import { BottomSheet } from '@/components/layout';
import { TextInput, Button } from 'react-native';

function FeedbackForm() {
  const [visible, setVisible] = useState(false);
  const [feedback, setFeedback] = useState('');

  return (
    <BottomSheet
      visible={visible}
      onClose={() => setVisible(false)}
      title="Send Feedback"
    >
      <TextInput
        value={feedback}
        onChangeText={setFeedback}
        placeholder="Your feedback..."
        multiline
        style={{ padding: 16, minHeight: 100 }}
      />
      <Button
        title="Submit"
        onPress={() => {
          // Handle submit
          setVisible(false);
        }}
      />
    </BottomSheet>
  );
}
```

### Example 2: Selection Sheet

```typescript
import { useState } from 'react';
import { BottomSheet } from '@/components/layout';

function SelectionSheet() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const options = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <BottomSheet
      visible={visible}
      onClose={() => setVisible(false)}
      title="Select Option"
    >
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => {
            setSelected(option);
            setVisible(false);
          }}
          style={{
            padding: 16,
            backgroundColor: selected === option ? '#e0e0e0' : 'transparent',
          }}
        >
          <Text>{option}</Text>
        </Pressable>
      ))}
    </BottomSheet>
  );
}
```

### Example 3: Multi-Step Flow

```typescript
import { useState } from 'react';
import { BottomSheetWithSteps, type BottomSheetStep } from '@/components/layout';

function MultiStepFlow() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState('intro');

  const steps: BottomSheetStep[] = [
    {
      id: 'intro',
      title: 'Welcome',
      content: (
        <View>
          <Text>Welcome to our app!</Text>
          <Button title="Next" onPress={() => setStep('details')} />
        </View>
      ),
    },
    {
      id: 'details',
      title: 'Details',
      showBackButton: true,
      content: (
        <View>
          <Text>Enter your details</Text>
          <Button title="Finish" onPress={() => setVisible(false)} />
        </View>
      ),
    },
  ];

  return (
    <BottomSheetWithSteps
      visible={visible}
      onClose={() => setVisible(false)}
      steps={steps}
      currentStepId={step}
      onStepChange={setStep}
    />
  );
}
```

## Customization

### Custom Header

```typescript
<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  header={
    <View style={{ padding: 16, backgroundColor: 'blue' }}>
      <Text style={{ color: 'white' }}>Custom Header</Text>
    </View>
  }
>
  <Text>Content</Text>
</BottomSheet>
```

### Custom Styling

```typescript
<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
  contentStyle={{ padding: 24 }}
  maxHeight={0.8}
  blurIntensity={30}
  backdropOpacity={0.5}
>
  <Text>Content</Text>
</BottomSheet>
```

### Snap Points

```typescript
<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  snapPoints={[0.5, 0.9]} // 50% and 90% of screen height
  initialSnapIndex={0}
  onPositionChange={(position) => {
    console.log('Sheet position:', position);
  }}
>
  <Text>Content</Text>
</BottomSheet>
```

## Performance Tips

1. **Memoize Content**: Use `React.memo` for complex content components
2. **Lazy Loading**: Load heavy content only when sheet is visible
3. **Virtual Lists**: Use `FlatList` or `VirtualizedList` for long lists
4. **Avoid Re-renders**: Use `useCallback` and `useMemo` for handlers and computed values

## Best Practices

1. **Keep Content Scannable**: Use proper spacing and typography
2. **Handle Keyboard**: Always test with keyboard visible
3. **Test Gestures**: Ensure swipe to close works smoothly
4. **Accessibility**: Add proper labels and hints
5. **Error Handling**: Handle errors gracefully in forms

## Troubleshooting

### Sheet doesn't close on swipe
- Ensure `enableSwipeToClose` is `true`
- Check if gesture handler is properly configured
- Verify `react-native-gesture-handler` is installed

### Keyboard covers content
- Enable `enableKeyboardAvoidance`
- Use `ScrollView` for content
- Adjust `maxHeight` if needed

### Animation is jerky
- Reduce `animationDuration`
- Check if other animations are running
- Verify `react-native-reanimated` is properly configured

## Dependencies

- `react-native-reanimated` - For smooth animations
- `react-native-gesture-handler` - For gesture handling
- `expo-blur` - For blur effects
- `expo-linear-gradient` - For gradients
- `heroui-native` - For theme support
- `react-native-safe-area-context` - For safe area handling

## License

Created by Kien AI (leejungkiin@gmail.com)

