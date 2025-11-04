---
description: "Android development with Jetpack Compose and MVVM. Apply when working with Kotlin files, Android projects, or mobile development."
alwaysApply: false
category: "platform"
priority: "high"
---

# Android Development - Essential Guidelines

## Core Architecture

### MVVM + Clean Architecture
- **UI Layer**: Jetpack Compose + ViewModels
- **Domain Layer**: Use Cases + Models + Repository Interfaces
- **Data Layer**: Repository Implementations + Data Sources
- **Unidirectional Data Flow**: UI → ViewModel → UseCase → Repository

### Key Principles
- Single Responsibility Principle
- Dependency Inversion (Interfaces)
- Testable Architecture
- Separation of Concerns

## Essential Tech Stack

### Core Framework
- **Jetpack Compose**: Modern UI toolkit
- **Kotlin Coroutines**: Asynchronous programming
- **Room**: Local database
- **Retrofit**: Network communication

### Essential Dependencies
```kotlin
// build.gradle.kts
dependencies {
    // UI Framework
    implementation "androidx.compose.ui:ui:$compose_version"
    implementation "androidx.compose.material3:material3:$material3_version"
    implementation "androidx.activity:activity-compose:$activity_compose_version"
    implementation "androidx.navigation:navigation-compose:$nav_compose_version"
    
    // Dependency Injection
    implementation "com.google.dagger:hilt-android:$hilt_version"
    kapt "com.google.dagger:hilt-compiler:$hilt_version"
    
    // Async Programming
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:$coroutines_version"
    
    // Networking
    implementation "com.squareup.retrofit2:retrofit:$retrofit_version"
    implementation "com.squareup.okhttp3:okhttp:$okhttp_version"
    implementation "org.jetbrains.kotlinx:kotlinx-serialization-json:$serialization_version"
    
    // Database
    implementation "androidx.room:room-runtime:$room_version"
    implementation "androidx.room:room-ktx:$room_version"
    kapt "androidx.room:room-compiler:$room_version"
    
    // Image Loading
    implementation "io.coil-kt:coil-compose:$coil_version"
    
    // Testing
    testImplementation "junit:junit:$junit_version"
    testImplementation "org.mockito.kotlin:mockito-kotlin:$mockito_version"
    testImplementation "org.jetbrains.kotlinx:kotlinx-coroutines-test:$coroutines_version"
    androidTestImplementation "androidx.compose.ui:ui-test-junit4:$compose_version"
}
```

## Standard Project Structure

```
app/src/main/java/com/yourapp/
├── data/
│   ├── local/
│   │   ├── database/
│   │   └── dao/
│   ├── remote/
│   │   ├── api/
│   │   └── dto/
│   └── repository/
├── domain/
│   ├── model/
│   ├── repository/
│   └── usecase/
├── presentation/
│   ├── screens/
│   ├── components/
│   ├── viewmodel/
│   └── navigation/
├── di/
│   ├── DatabaseModule.kt
│   ├── NetworkModule.kt
│   └── RepositoryModule.kt
└── MainActivity.kt
```

## Development Patterns

### ViewModel Pattern
```kotlin
@HiltViewModel
class FeatureViewModel @Inject constructor(
    private val useCase: FeatureUseCase
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(FeatureUiState())
    val uiState: StateFlow<FeatureUiState> = _uiState.asStateFlow()
    
    fun loadData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            
            try {
                val result = useCase.execute()
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    data = result,
                    error = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }
}
```

### Repository Pattern
```kotlin
interface FeatureRepository {
    suspend fun getData(): Result<List<FeatureModel>>
}

@Singleton
class FeatureRepositoryImpl @Inject constructor(
    private val localDataSource: FeatureLocalDataSource,
    private val remoteDataSource: FeatureRemoteDataSource
) : FeatureRepository {
    
    override suspend fun getData(): Result<List<FeatureModel>> {
        return try {
            val localData = localDataSource.getData()
            if (localData.isNotEmpty()) {
                Result.success(localData)
            } else {
                val remoteData = remoteDataSource.getData()
                localDataSource.saveData(remoteData)
                Result.success(remoteData)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

### Use Case Pattern
```kotlin
class FeatureUseCase @Inject constructor(
    private val repository: FeatureRepository
) {
    suspend operator fun invoke(): List<FeatureModel> {
        return repository.getData().getOrThrow()
    }
}
```

## Jetpack Compose Best Practices

### Composable Structure
```kotlin
@Composable
fun FeatureScreen(
    viewModel: FeatureViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    FeatureScreenContent(
        uiState = uiState,
        onLoadData = viewModel::loadData
    )
}

@Composable
private fun FeatureScreenContent(
    uiState: FeatureUiState,
    onLoadData: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        HeaderComponent()
        
        when {
            uiState.isLoading -> LoadingComponent()
            uiState.error != null -> ErrorComponent(
                error = uiState.error,
                onRetry = onLoadData
            )
            else -> DataComponent(data = uiState.data)
        }
    }
}
```

### State Management
- Use `StateFlow` for ViewModel state
- Use `collectAsState()` in Composables
- Use `remember` for local UI state
- Use `rememberSaveable` for configuration changes

### Navigation
```kotlin
@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        composable("home") {
            HomeScreen(
                onNavigateToDetail = { id ->
                    navController.navigate("detail/$id")
                }
            )
        }
        
        composable(
            "detail/{id}",
            arguments = listOf(navArgument("id") { type = NavType.StringType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getString("id") ?: ""
            DetailScreen(id = id)
        }
    }
}
```

## Testing Standards

### Unit Tests
```kotlin
@ExtendWith(MockKExtension::class)
class FeatureViewModelTest {
    
    @MockK
    private lateinit var useCase: FeatureUseCase
    
    private lateinit var viewModel: FeatureViewModel
    
    @BeforeEach
    fun setup() {
        viewModel = FeatureViewModel(useCase)
    }
    
    @Test
    fun `loadData should update state to loaded when successful`() = runTest {
        // Given
        val expectedData = listOf(FeatureModel.mock)
        coEvery { useCase() } returns expectedData
        
        // When
        viewModel.loadData()
        
        // Then
        val uiState = viewModel.uiState.value
        assertThat(uiState.isLoading).isFalse()
        assertThat(uiState.data).isEqualTo(expectedData)
        assertThat(uiState.error).isNull()
    }
}
```

### Integration Tests
- Test ViewModel + UseCase integration
- Test Repository + DataSource integration
- Test Room database operations
- Test Retrofit API calls

## Performance Optimization

### Essential Optimizations
- Use `LazyColumn`/`LazyRow` for large lists
- Implement `Parcelable` for data classes
- Use `remember` for expensive computations
- Optimize image loading with Coil
- Use `Dispatchers.IO` for network operations

### Memory Management
- Use `viewModelScope` for coroutines
- Properly dispose of resources
- Avoid memory leaks in Composables

## Quality Checklist

### Architecture Compliance
- [ ] MVVM pattern implemented correctly
- [ ] Clean Architecture layers separated
- [ ] Dependency injection with Hilt configured
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

### Jetpack Compose Best Practices
- [ ] Composables are reusable and testable
- [ ] State management follows Compose patterns
- [ ] Navigation implemented correctly
- [ ] Performance optimizations applied
- [ ] Accessibility features implemented

### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] README updated with setup instructions
- [ ] Architecture decisions documented

---

**Essential Android development with Jetpack Compose, MVVM, and Clean Architecture for modern Android applications.**
