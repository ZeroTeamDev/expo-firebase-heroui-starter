---
description: "iOS development with SwiftUI and MVVM. Apply when working with Swift files, iOS projects, or mobile development."
alwaysApply: false
category: "platform"
priority: "high"
---

# iOS Development - Essential Guidelines

## Core Architecture

### MVVM + Clean Architecture
- **UI Layer**: SwiftUI + ViewModels (ObservableObject)
- **Domain Layer**: Use Cases + Models + Repository Protocols
- **Data Layer**: Repository Implementations + Data Sources
- **Unidirectional Data Flow**: View → ViewModel → UseCase → Repository

### Key Principles
- Single Responsibility Principle
- Dependency Inversion (Protocols)
- Testable Architecture
- Separation of Concerns

## Essential Tech Stack

### Core Framework
- **SwiftUI**: Primary UI framework
- **Combine**: Reactive programming
- **Core Data**: Local persistence (if needed)

### Essential Dependencies
```swift
// Package.swift
dependencies: [
    // Networking
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),
    
    // JSON Parsing
    .package(url: "https://github.com/Flight-School/AnyCodable.git", from: "0.6.0"),
    
    // Dependency Injection
    .package(url: "https://github.com/Swinject/Swinject.git", from: "2.8.0"),
    
    // Async Image Loading
    .package(url: "https://github.com/kean/Nuke.git", from: "12.0.0"),
    
    // Testing
    .package(url: "https://github.com/Quick/Quick.git", from: "7.0.0"),
    .package(url: "https://github.com/Quick/Nimble.git", from: "12.0.0")
]
```

## Standard Project Structure

```
MyApp/
├── App/
│   ├── MyAppApp.swift
│   └── ContentView.swift
├── Core/
│   ├── Domain/
│   │   ├── Models/
│   │   ├── UseCases/
│   │   └── Repositories/
│   ├── Data/
│   │   ├── Repositories/
│   │   ├── DataSources/
│   │   └── Network/
│   └── DI/
│       └── Container.swift
├── Features/
│   ├── FeatureName/
│   │   ├── View/
│   │   ├── ViewModel/
│   │   └── Components/
├── Shared/
│   ├── Extensions/
│   ├── Utils/
│   └── Constants/
└── Tests/
    ├── UnitTests/
    └── IntegrationTests/
```

## Development Patterns

### ViewModel Pattern
```swift
class FeatureViewModel: ObservableObject {
    @Published var state: FeatureState = .loading
    @Published var errorMessage: String?
    
    private let useCase: FeatureUseCase
    
    init(useCase: FeatureUseCase) {
        self.useCase = useCase
    }
    
    func loadData() {
        Task {
            do {
                let result = try await useCase.execute()
                await MainActor.run {
                    self.state = .loaded(result)
                }
            } catch {
                await MainActor.run {
                    self.state = .error
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
}
```

### Repository Pattern
```swift
protocol FeatureRepository {
    func fetchData() async throws -> [FeatureModel]
}

class FeatureRepositoryImpl: FeatureRepository {
    private let dataSource: FeatureDataSource
    
    init(dataSource: FeatureDataSource) {
        self.dataSource = dataSource
    }
    
    func fetchData() async throws -> [FeatureModel] {
        let data = try await dataSource.fetchData()
        return data.map { FeatureModel(from: $0) }
    }
}
```

### Dependency Injection
```swift
class Container {
    static let shared = Container()
    
    func registerDependencies() {
        // Repositories
        container.register(FeatureRepository.self) { _ in
            FeatureRepositoryImpl(dataSource: self.container.resolve(FeatureDataSource.self)!)
        }
        
        // Use Cases
        container.register(FeatureUseCase.self) { _ in
            FeatureUseCaseImpl(repository: self.container.resolve(FeatureRepository.self)!)
        }
    }
}
```

## SwiftUI Best Practices

### View Composition
```swift
struct FeatureView: View {
    @StateObject private var viewModel: FeatureViewModel
    
    var body: some View {
        VStack {
            HeaderView()
            ContentView(state: viewModel.state)
            FooterView()
        }
        .task {
            viewModel.loadData()
        }
    }
}
```

### State Management
- Use `@StateObject` for ViewModels
- Use `@ObservedObject` for passed ViewModels
- Use `@State` for local UI state
- Use `@Binding` for two-way data binding

### Navigation
```swift
NavigationStack {
    List(items) { item in
        NavigationLink(value: item) {
            ItemRowView(item: item)
        }
    }
    .navigationDestination(for: Item.self) { item in
        ItemDetailView(item: item)
    }
}
```

## Testing Standards

### Unit Tests
```swift
class FeatureViewModelTests: QuickSpec {
    override func spec() {
        describe("FeatureViewModel") {
            var viewModel: FeatureViewModel!
            var mockUseCase: MockFeatureUseCase!
            
            beforeEach {
                mockUseCase = MockFeatureUseCase()
                viewModel = FeatureViewModel(useCase: mockUseCase)
            }
            
            context("when loading data") {
                it("should update state to loaded") {
                    // Given
                    let expectedData = [FeatureModel.mock]
                    mockUseCase.result = .success(expectedData)
                    
                    // When
                    viewModel.loadData()
                    
                    // Then
                    expect(viewModel.state).toEventually(equal(.loaded(expectedData)))
                }
            }
        }
    }
}
```

### Integration Tests
- Test ViewModel + UseCase integration
- Test Repository + DataSource integration
- Test navigation flows
- Test error handling

## Performance Optimization

### Essential Optimizations
- Use `@StateObject` instead of `@ObservedObject` for ViewModels
- Implement `Equatable` for custom views
- Use `LazyVStack`/`LazyHStack` for large lists
- Optimize image loading with Nuke
- Use `Task` for async operations

### Memory Management
- Avoid retain cycles with `weak` references
- Use `@MainActor` for UI updates
- Properly cancel async tasks

## Quality Checklist

### Architecture Compliance
- [ ] MVVM pattern implemented correctly
- [ ] Clean Architecture layers separated
- [ ] Dependency injection configured
- [ ] Repository pattern used for data access

### Code Quality
- [ ] SOLID principles followed
- [ ] Functions are small and focused
- [ ] Proper error handling implemented
- [ ] Code is testable

### Testing Coverage
- [ ] Unit tests for ViewModels (>80% coverage)
- [ ] Unit tests for UseCases (>90% coverage)
- [ ] Unit tests for Repositories (>80% coverage)
- [ ] Integration tests for critical flows
- [ ] UI tests for main user journeys

### SwiftUI Best Practices
- [ ] Views are composable and reusable
- [ ] State management follows SwiftUI patterns
- [ ] Navigation implemented correctly
- [ ] Performance optimizations applied
- [ ] Accessibility features implemented

### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] README updated with setup instructions
- [ ] Architecture decisions documented

---

**Essential iOS development with SwiftUI, MVVM, and Clean Architecture for modern iOS applications.**
