# Liquid Glass Button - Hướng Dẫn Chi Tiết

Created by Kien AI (leejungkiin@gmail.com)

## 📖 Tổng Quan

`LiquidGlassButton` là component nút tái sử dụng với hiệu ứng liquid glass (thủy tinh lỏng) được thiết kế để tạo ra các nút bấm đẹp mắt, hiện đại với hiệu ứng trong suốt và mờ (blur) mượt mà.

## 🎨 Đặc Điểm

- **Liquid Glass Effect**: Hiệu ứng thủy tinh lỏng với blur và gradient
- **Theme Support**: Tự động hỗ trợ dark/light mode
- **Animations**: Press animations mượt mà với spring physics
- **Haptic Feedback**: Hỗ trợ haptic feedback khi nhấn
- **Multiple Variants**: Nhiều biến thể (icon, text, filled, default)
- **Multiple Sizes**: Nhiều kích thước (small, medium, large)
- **Accessibility**: Hỗ trợ đầy đủ accessibility features

## 🚀 Cài Đặt & Import

```typescript
import { LiquidGlassButton } from '@/components/glass';
// Hoặc
import { LiquidGlassButton } from '@/components/glass/LiquidGlassButton';
```

## 📝 Cách Sử Dụng Cơ Bản

### 1. Icon Button (Nút Chỉ Có Icon)

```typescript
import { LiquidGlassButton } from '@/components/glass';
import { X, Heart, Settings } from 'lucide-react-native';

// Close button
<LiquidGlassButton
  variant="icon"
  icon={X}
  onPress={() => console.log('Close pressed')}
/>

// Heart button với size lớn
<LiquidGlassButton
  variant="icon"
  icon={Heart}
  iconSize={24}
  size="large"
  onPress={() => console.log('Like pressed')}
/>
```

### 2. Text Button (Nút Chỉ Có Text)

```typescript
<LiquidGlassButton
  variant="text"
  label="Click Me"
  onPress={() => console.log('Button pressed')}
/>

// Với size lớn
<LiquidGlassButton
  variant="text"
  label="Submit"
  size="large"
  onPress={handleSubmit}
/>
```

### 3. Default Button (Nút Có Icon + Text)

```typescript
import { Send, Save } from 'lucide-react-native';

<LiquidGlassButton
  variant="default"
  label="Send"
  icon={Send}
  onPress={handleSend}
/>

<LiquidGlassButton
  label="Save"
  icon={Save}
  onPress={handleSave}
/>
```

### 4. Filled Button (Nút Đầy Màu)

```typescript
<LiquidGlassButton
  variant="filled"
  label="Submit"
  onPress={handleSubmit}
/>

// Với icon
<LiquidGlassButton
  variant="filled"
  label="Save"
  icon={Save}
  onPress={handleSave}
/>
```

## 🎛️ Props Chi Tiết

### LiquidGlassButtonProps

| Prop | Type | Default | Mô Tả |
|------|------|---------|-------|
| `label` | `string` | `undefined` | Text hiển thị trên nút |
| `icon` | `LucideIcon` | `undefined` | Icon component từ lucide-react-native |
| `iconSize` | `number` | `20` | Kích thước icon |
| `variant` | `'default' \| 'icon' \| 'text' \| 'filled'` | `'default'` | Biến thể của nút |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Kích thước nút |
| `loading` | `boolean` | `false` | Trạng thái loading |
| `disabled` | `boolean` | `false` | Trạng thái disabled |
| `blurIntensity` | `number` | `20` | Độ mờ của blur effect |
| `style` | `ViewStyle` | `undefined` | Custom style cho container |
| `textStyle` | `TextStyle` | `undefined` | Custom style cho text |
| `enableHaptics` | `boolean` | `true` | Bật/tắt haptic feedback |
| `enableAnimation` | `boolean` | `true` | Bật/tắt press animation |
| `gradientColors` | `string[]` | `undefined` | Custom gradient colors |
| `backgroundColor` | `string` | `undefined` | Custom background color |
| `borderColor` | `string` | `undefined` | Custom border color |
| `onPress` | `() => void` | `undefined` | Callback khi nhấn nút |
| `onPressIn` | `() => void` | `undefined` | Callback khi bắt đầu nhấn |
| `onPressOut` | `() => void` | `undefined` | Callback khi thả nút |

## 🎨 Variants

### 1. `default` - Nút Mặc Định

Nút có thể có icon và text, với liquid glass effect đầy đủ.

```typescript
<LiquidGlassButton
  variant="default"
  label="Button"
  icon={Send}
  onPress={handlePress}
/>
```

**Đặc điểm:**
- Có blur effect
- Có gradient overlay
- Có border với opacity
- Phù hợp cho các nút hành động chính

### 2. `icon` - Nút Chỉ Icon

Nút chỉ hiển thị icon, hình tròn hoặc vuông bo tròn.

```typescript
<LiquidGlassButton
  variant="icon"
  icon={X}
  onPress={handleClose}
/>
```

**Đặc điểm:**
- Hình tròn hoặc vuông bo tròn
- Kích thước tự động theo size prop
- Phù hợp cho close buttons, icon buttons

### 3. `text` - Nút Chỉ Text

Nút chỉ hiển thị text, không có blur effect đầy đủ (chỉ có border).

```typescript
<LiquidGlassButton
  variant="text"
  label="Button"
  onPress={handlePress}
/>
```

**Đặc điểm:**
- Không có blur effect
- Có border với opacity
- Phù hợp cho text-only buttons

### 4. `filled` - Nút Đầy Màu

Nút có background màu đầy đủ, không có glass effect.

```typescript
<LiquidGlassButton
  variant="filled"
  label="Submit"
  onPress={handleSubmit}
/>
```

**Đặc điểm:**
- Background màu accent từ theme
- Không có blur effect
- Phù hợp cho primary actions

## 📏 Sizes

### Small (32px height)

```typescript
<LiquidGlassButton
  size="small"
  variant="icon"
  icon={X}
  onPress={handleClose}
/>
```

**Đặc điểm:**
- Height: 32px
- Padding: 12px
- Border radius: 16px
- Icon size: 16px
- Font size: 14px

### Medium (36px height) - Default

```typescript
<LiquidGlassButton
  size="medium"
  variant="icon"
  icon={X}
  onPress={handleClose}
/>
```

**Đặc điểm:**
- Height: 36px
- Padding: 16px
- Border radius: 18px
- Icon size: 20px
- Font size: 15px

### Large (48px height)

```typescript
<LiquidGlassButton
  size="large"
  variant="icon"
  icon={X}
  onPress={handleClose}
/>
```

**Đặc điểm:**
- Height: 48px
- Padding: 24px
- Border radius: 24px
- Icon size: 24px
- Font size: 16px

## 🎨 Customization

### Custom Colors

```typescript
<LiquidGlassButton
  variant="icon"
  icon={Heart}
  backgroundColor="rgba(255, 0, 0, 0.3)"
  borderColor="rgba(255, 0, 0, 0.5)"
  onPress={handleLike}
/>
```

### Custom Gradient

```typescript
<LiquidGlassButton
  variant="default"
  label="Gradient Button"
  gradientColors={[
    'rgba(255, 100, 180, 0.4)',
    'rgba(255, 160, 0, 0.4)',
    'rgba(255, 220, 0, 0.4)',
  ]}
  onPress={handlePress}
/>
```

### Custom Blur Intensity

```typescript
<LiquidGlassButton
  variant="icon"
  icon={Settings}
  blurIntensity={40}
  onPress={handleSettings}
/>
```

### Custom Styles

```typescript
<LiquidGlassButton
  variant="default"
  label="Custom"
  style={{
    marginTop: 16,
    alignSelf: 'center',
  }}
  textStyle={{
    fontWeight: '700',
    letterSpacing: 1,
  }}
  onPress={handlePress}
/>
```

## 🔧 Advanced Usage

### Loading State

```typescript
const [loading, setLoading] = useState(false);

<LiquidGlassButton
  variant="filled"
  label="Submit"
  loading={loading}
  onPress={async () => {
    setLoading(true);
    await handleSubmit();
    setLoading(false);
  }}
/>
```

### Disabled State

```typescript
<LiquidGlassButton
  variant="default"
  label="Submit"
  disabled={!isFormValid}
  onPress={handleSubmit}
/>
```

### Disable Haptics

```typescript
<LiquidGlassButton
  variant="icon"
  icon={X}
  enableHaptics={false}
  onPress={handleClose}
/>
```

### Disable Animation

```typescript
<LiquidGlassButton
  variant="icon"
  icon={X}
  enableAnimation={false}
  onPress={handleClose}
/>
```

### Custom Press Handlers

```typescript
<LiquidGlassButton
  variant="default"
  label="Button"
  onPressIn={() => {
    console.log('Press started');
  }}
  onPressOut={() => {
    console.log('Press ended');
  }}
  onPress={() => {
    console.log('Button pressed');
  }}
/>
```

## 🎯 Use Cases

### 1. Close Button trong Modal/Dialog

```typescript
<LiquidGlassButton
  variant="icon"
  icon={X}
  size="medium"
  onPress={onClose}
/>
```

### 2. Back Button trong Navigation

```typescript
<LiquidGlassButton
  variant="icon"
  icon={ChevronLeft}
  size="medium"
  onPress={onBack}
/>
```

### 3. Action Button trong Card

```typescript
<LiquidGlassButton
  variant="default"
  label="Edit"
  icon={Edit}
  size="small"
  onPress={handleEdit}
/>
```

### 4. Primary Action Button

```typescript
<LiquidGlassButton
  variant="filled"
  label="Submit"
  icon={Check}
  size="large"
  onPress={handleSubmit}
/>
```

### 5. Icon-only Action Buttons

```typescript
<View style={{ flexDirection: 'row', gap: 8 }}>
  <LiquidGlassButton
    variant="icon"
    icon={Heart}
    onPress={handleLike}
  />
  <LiquidGlassButton
    variant="icon"
    icon={Share}
    onPress={handleShare}
  />
  <LiquidGlassButton
    variant="icon"
    icon={Bookmark}
    onPress={handleBookmark}
  />
</View>
```

## 🏗️ Cách Tạo Liquid Glass Effect

### Bước 1: Cấu Trúc Cơ Bản

Liquid glass effect được tạo bằng cách kết hợp:

1. **BlurView**: Tạo hiệu ứng mờ (blur)
2. **LinearGradient**: Tạo gradient overlay
3. **Border với opacity**: Tạo viền trong suốt
4. **Background với opacity**: Tạo nền trong suốt

### Bước 2: Color Configuration

```typescript
const GLASS_COLORS = {
  light: {
    background: 'rgba(255, 255, 255, 0.3)',      // Nền trắng 30% opacity
    border: 'rgba(255, 255, 255, 0.4)',          // Viền trắng 40% opacity
    gradient: ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)'],
  },
  dark: {
    background: 'rgba(255, 255, 255, 0.1)',      // Nền trắng 10% opacity
    border: 'rgba(255, 255, 255, 0.2)',          // Viền trắng 20% opacity
    gradient: ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)'],
  },
};
```

### Bước 3: Implementation

```typescript
<View
  style={{
    backgroundColor: glassColors.background,
    borderColor: glassColors.border,
    borderWidth: 1,
    borderRadius: 18,
  }}
>
  {/* Blur effect */}
  <BlurView
    intensity={20}
    tint={isDark ? 'dark' : 'light'}
    style={StyleSheet.absoluteFill}
  />
  
  {/* Gradient overlay */}
  <LinearGradient
    colors={glassColors.gradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  />
  
  {/* Content */}
  <View style={{ zIndex: 1 }}>
    {/* Icon or Text */}
  </View>
</View>
```

### Bước 4: Animation

```typescript
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

// On press
scale.value = withSpring(0.95, SPRING_CONFIG);

// On release
scale.value = withSpring(1, SPRING_CONFIG);
```

## 🎨 Design Principles

### 1. Opacity Levels

- **Light Mode Background**: 30% opacity
- **Dark Mode Background**: 10% opacity
- **Border**: Slightly higher opacity than background (40% light, 20% dark)
- **Gradient**: Từ opacity cao đến thấp để tạo depth

### 2. Blur Intensity

- **Default**: 20 - Phù hợp cho hầu hết các trường hợp
- **Strong**: 40+ - Cho hiệu ứng mạnh hơn
- **Subtle**: 10-15 - Cho hiệu ứng nhẹ nhàng

### 3. Border Radius

- **Small**: 16px (height 32px)
- **Medium**: 18px (height 36px)
- **Large**: 24px (height 48px)
- **Icon buttons**: `height / 2` để tạo hình tròn

### 4. Shadows

```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 2,
```

## 📚 Examples

### Example 1: Bottom Sheet Header

```typescript
import { LiquidGlassButton } from '@/components/glass';
import { X, ChevronLeft } from 'lucide-react-native';

<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <LiquidGlassButton
    variant="icon"
    icon={ChevronLeft}
    onPress={onBack}
  />
  <LiquidGlassButton
    variant="icon"
    icon={X}
    onPress={onClose}
  />
</View>
```

### Example 2: Action Bar

```typescript
<View style={{ flexDirection: 'row', gap: 12 }}>
  <LiquidGlassButton
    variant="default"
    label="Save"
    icon={Save}
    onPress={handleSave}
  />
  <LiquidGlassButton
    variant="filled"
    label="Publish"
    icon={Send}
    onPress={handlePublish}
  />
</View>
```

### Example 3: Card Actions

```typescript
<View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
  <LiquidGlassButton
    variant="icon"
    icon={Heart}
    size="small"
    onPress={handleLike}
  />
  <LiquidGlassButton
    variant="icon"
    icon={Share}
    size="small"
    onPress={handleShare}
  />
  <LiquidGlassButton
    variant="icon"
    icon={Bookmark}
    size="small"
    onPress={handleBookmark}
  />
</View>
```

## 🐛 Troubleshooting

### Button không hiển thị blur effect

**Nguyên nhân**: `BlurView` có thể không hoạt động trên một số platform.

**Giải pháp**: 
- Kiểm tra `expo-blur` đã được cài đặt
- Đảm bảo `variant` không phải `'filled'` hoặc `'text'`
- Thử tăng `blurIntensity`

### Animation không mượt

**Nguyên nhân**: `enableAnimation` bị tắt hoặc `react-native-reanimated` chưa được cấu hình.

**Giải pháp**:
- Kiểm tra `enableAnimation={true}`
- Đảm bảo `react-native-reanimated` đã được cấu hình đúng
- Kiểm tra babel config

### Colors không đúng với theme

**Nguyên nhân**: Theme colors chưa được cập nhật hoặc custom colors được set.

**Giải pháp**:
- Kiểm tra `useTheme()` hook
- Xóa custom `backgroundColor` và `borderColor` nếu muốn dùng theme colors
- Kiểm tra dark/light mode đang được sử dụng

## 📝 Best Practices

1. **Sử dụng đúng variant**: Chọn variant phù hợp với use case
2. **Consistent sizing**: Sử dụng cùng size cho các nút liên quan
3. **Haptic feedback**: Giữ haptic feedback bật cho better UX
4. **Loading states**: Luôn hiển thị loading state cho async actions
5. **Accessibility**: Thêm `accessibilityLabel` khi cần

## 🔗 Related Components

- `GlassCard`: Card component với glass effect
- `GlassModal`: Modal component với glass effect
- `BottomSheet`: Bottom sheet với liquid glass buttons

## 📄 License

Created by Kien AI (leejungkiin@gmail.com)

---

**Happy Coding! 🎉**

