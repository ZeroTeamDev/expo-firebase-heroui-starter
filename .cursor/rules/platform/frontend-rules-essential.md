---
description: "Frontend development with React/Vue and TypeScript. Apply when working with JavaScript/TypeScript files, web projects, or frontend development."
alwaysApply: false
category: "platform"
priority: "high"
---

# Frontend Development - Essential Guidelines

## Core Architecture

### Component-Based Architecture
- **UI Layer**: React/Vue Components + State Management
- **Service Layer**: API Services + Data Transformations
- **State Layer**: Global State + Local State
- **Unidirectional Data Flow**: UI → Actions → State → UI

### Key Principles
- Single Responsibility Principle
- Component Composition
- Immutable State Updates
- Separation of Concerns

## Essential Tech Stack

### Primary Frameworks
- **React**: Component library with hooks
- **Vue**: Progressive framework with composition API
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server

### Essential Dependencies
```json
{
  "dependencies": {
    // React Ecosystem
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    
    // Vue Ecosystem
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    
    // State Management
    "zustand": "^4.3.0",
    "@tanstack/react-query": "^4.24.0",
    
    // Styling
    "tailwindcss": "^3.3.0",
    "clsx": "^1.2.0",
    
    // HTTP Client
    "axios": "^1.4.0",
    
    // Form Handling
    "react-hook-form": "^7.45.0",
    "@hookform/resolvers": "^2.9.0",
    "zod": "^3.21.0",
    
    // UI Components
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@vitejs/plugin-vue": "^4.2.0",
    "typescript": "^5.1.0",
    "vitest": "^0.32.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.0"
  }
}
```

## Standard Project Structure

### React Project
```
src/
├── components/
│   ├── ui/
│   ├── forms/
│   └── layout/
├── pages/
├── hooks/
├── services/
├── store/
├── types/
├── utils/
├── constants/
└── App.tsx
```

### Vue Project
```
src/
├── components/
│   ├── ui/
│   ├── forms/
│   └── layout/
├── views/
├── composables/
├── services/
├── stores/
├── types/
├── utils/
├── constants/
└── App.vue
```

## Development Patterns

### React Component Pattern
```tsx
interface FeatureProps {
  id: string;
  onUpdate: (id: string, data: FeatureData) => void;
}

export const FeatureComponent: React.FC<FeatureProps> = ({ id, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data, refetch } = useQuery({
    queryKey: ['feature', id],
    queryFn: () => featureService.getById(id),
  });
  
  const handleUpdate = async (data: FeatureData) => {
    setLoading(true);
    setError(null);
    
    try {
      await featureService.update(id, data);
      onUpdate(id, data);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="feature-container">
      <FeatureForm data={data} onSubmit={handleUpdate} />
    </div>
  );
};
```

### Vue Component Pattern
```vue
<template>
  <div class="feature-container">
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    <FeatureForm 
      v-else
      :data="data" 
      @submit="handleUpdate" 
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
}

interface Emits {
  (e: 'update', id: string, data: FeatureData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const loading = ref(false);
const error = ref<string | null>(null);

const { data, refetch } = useQuery({
  queryKey: ['feature', props.id],
  queryFn: () => featureService.getById(props.id),
});

const handleUpdate = async (data: FeatureData) => {
  loading.value = true;
  error.value = null;
  
  try {
    await featureService.update(props.id, data);
    emit('update', props.id, data);
    refetch();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Update failed';
  } finally {
    loading.value = false;
  }
};
</script>
```

### State Management (Zustand)
```ts
interface FeatureStore {
  features: Feature[];
  loading: boolean;
  error: string | null;
  fetchFeatures: () => Promise<void>;
  addFeature: (feature: Feature) => void;
  updateFeature: (id: string, updates: Partial<Feature>) => void;
  deleteFeature: (id: string) => void;
}

export const useFeatureStore = create<FeatureStore>((set, get) => ({
  features: [],
  loading: false,
  error: null,
  
  fetchFeatures: async () => {
    set({ loading: true, error: null });
    try {
      const features = await featureService.getAll();
      set({ features, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch',
        loading: false 
      });
    }
  },
  
  addFeature: (feature) => set((state) => ({
    features: [...state.features, feature]
  })),
  
  updateFeature: (id, updates) => set((state) => ({
    features: state.features.map(f => 
      f.id === id ? { ...f, ...updates } : f
    )
  })),
  
  deleteFeature: (id) => set((state) => ({
    features: state.features.filter(f => f.id !== id)
  }))
}));
```

### API Service Pattern
```ts
class FeatureService {
  private api = axios.create({
    baseURL: '/api/features',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  async getAll(): Promise<Feature[]> {
    const response = await this.api.get('/');
    return response.data;
  }
  
  async getById(id: string): Promise<Feature> {
    const response = await this.api.get(`/${id}`);
    return response.data;
  }
  
  async create(data: CreateFeatureData): Promise<Feature> {
    const response = await this.api.post('/', data);
    return response.data;
  }
  
  async update(id: string, data: UpdateFeatureData): Promise<Feature> {
    const response = await this.api.put(`/${id}`, data);
    return response.data;
  }
  
  async delete(id: string): Promise<void> {
    await this.api.delete(`/${id}`);
  }
}

export const featureService = new FeatureService();
```

## Styling Standards

### Tailwind CSS Configuration
```ts
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Component Styling
```tsx
// Utility function for conditional classes
export const cn = (...classes: (string | undefined | null | false)[]) => 
  clsx(classes.filter(Boolean));

// Usage in components
<div className={cn(
  'flex items-center justify-between',
  'p-4 bg-white rounded-lg shadow',
  isActive && 'ring-2 ring-primary-500',
  className
)}>
  {children}
</div>
```

## Testing Standards

### Component Tests (React Testing Library)
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeatureComponent } from './FeatureComponent';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('FeatureComponent', () => {
  it('should render feature data and handle updates', async () => {
    const mockData = { id: '1', name: 'Test Feature' };
    const mockOnUpdate = jest.fn();
    
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <FeatureComponent id="1" onUpdate={mockOnUpdate} />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Feature')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.any(Object));
    });
  });
});
```

### Component Tests (Vue Test Utils)
```ts
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import FeatureComponent from './FeatureComponent.vue';

describe('FeatureComponent', () => {
  it('should render feature data and handle updates', async () => {
    const mockData = { id: '1', name: 'Test Feature' };
    const mockOnUpdate = jest.fn();
    
    const wrapper = mount(FeatureComponent, {
      props: { id: '1', onUpdate: mockOnUpdate },
      global: {
        plugins: [createPinia()],
      },
    });
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.text()).toContain('Test Feature');
    
    await wrapper.find('[data-testid="update-button"]').trigger('click');
    
    expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.any(Object));
  });
});
```

## Performance Optimization

### Essential Optimizations
- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` for expensive calculations
- Implement code splitting with `React.lazy()`
- Use `IntersectionObserver` for lazy loading
- Optimize images with proper formats and sizes

### Bundle Optimization
```ts
// Dynamic imports for code splitting
const FeaturePage = lazy(() => import('./pages/FeaturePage'));

// Route-based code splitting
const routes = [
  {
    path: '/features',
    component: () => import('./pages/FeaturePage'),
  },
];
```

## Quality Checklist

### Architecture Compliance
- [ ] Component-based architecture implemented
- [ ] State management properly configured
- [ ] Service layer separated from UI
- [ ] TypeScript types defined for all data

### Code Quality
- [ ] SOLID principles followed
- [ ] Components are small and focused
- [ ] Proper error handling implemented
- [ ] Code is testable

### Testing Coverage
- [ ] Unit tests for components (>80% coverage)
- [ ] Unit tests for services (>90% coverage)
- [ ] Unit tests for stores/hooks (>80% coverage)
- [ ] Integration tests for critical flows
- [ ] E2E tests for main user journeys

### Performance
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading applied where appropriate
- [ ] Performance monitoring configured

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA attributes applied
- [ ] Keyboard navigation supported
- [ ] Screen reader compatibility tested
- [ ] Color contrast meets standards

### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] README updated with setup instructions
- [ ] Component documentation generated

---

**Essential frontend development with React/Vue, TypeScript, and modern tooling for scalable web applications.**
