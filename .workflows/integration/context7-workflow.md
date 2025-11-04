---
description: "Context7 Auto-Check Workflow for automatic context validation and knowledge base integration. Apply when working with Context7 integration, knowledge base lookup, or external context validation."
alwaysApply: false
category: "integration"
priority: "high"
triggers:
  - "keywords: context7, knowledge base, context validation"
  - "context: project setup, library integration"
  - "file_patterns: package.json, requirements.txt, pom.xml"
---

# Context7 Auto-Check Workflow

## Mục đích

Tự động kiểm tra và áp dụng context liên quan đến dự án từ Context7 MCP server để cung cấp thông tin và đề xuất phù hợp với tech stack hiện tại.

## Điều kiện kích hoạt

### Môi trường hỗ trợ

- **Hoạt động trên tất cả các IDE hỗ trợ MCP**
- Ưu tiên sử dụng Context7 MCP khi có sẵn
- Fallback về ngữ cảnh đã lưu trong bộ nhớ cache hoặc các mẫu cơ bản khi MCP không khả dụng
- Ghi log khi không thể kết nối Context7 MCP

### Kích hoạt tự động

- **BẮT BUỘC**: Khi bắt đầu bất kỳ task nào
- Khi bắt đầu phiên làm việc mới
- Khi phát hiện thay đổi trong tech stack
- Khi người dùng yêu cầu đề xuất hoặc giải pháp
- Khi gặp vấn đề cần tham khảo best practices
- Trong quá trình planning để kiểm tra compatibility và best practices

## Nguyên Tắc Cơ Bản

- **_BẮT BUỘC_** tự động kiểm tra context dự án trước khi thực hiện bất kỳ task nào
- **_BẮT BUỘC_** sử dụng Context7 MCP để lấy thông tin cập nhật về libraries/frameworks
- **_BẮT BUỘC_** cập nhật knowledge base khi phát hiện thay đổi trong tech stack
- **_BẮT BUỘC_** tích hợp vào tất cả workflows hiện có
- **_KHUYẾN NGHỊ_** cache context information để tránh gọi API quá nhiều
- **_NGHIÊM CẤM_** bỏ qua bước kiểm tra context khi người dùng không yêu cầu cụ thể

## Quy trình thực hiện

### Bước 1: Phân tích dự án (Enhanced)

1. **Project Analysis**
   ```
   - Detect project type (web, mobile, desktop, backend)
   - Identify programming languages and frameworks
   - Analyze package.json, requirements.txt, pom.xml
   - Check for build tools and development dependencies
   - Identify custom libraries và internal modules
   ```

2. **Context7 Integration**
   ```
   - Resolve library IDs cho detected libraries qua Context7 MCP
   - Fetch latest documentation và best practices
   - Cache results trong session memory với IDE source tag
   - Set up auto-refresh triggers
   - Fallback to cached/basic context nếu không có Context7 access
   ```

### Phase 2: Context Validation

1. **Compatibility Check**
   ```
   - Verify version compatibility matrix
   - Check for known conflicts
   - Validate dependency tree
   - Identify potential upgrade paths
   ```

2. **Best Practices Sync**
   ```
   - Compare current patterns với latest docs
   - Identify deprecated usage
   - Suggest modern alternatives
   - Update coding standards
   ```

### Phase 3: Context Application

1. **Workflow Enhancement**
   ```
   - Apply context-aware suggestions
   - Use library-specific patterns
   - Follow framework conventions
   - Implement security best practices
   ```

2. **Documentation Update**
   ```
   - Update Codebase.md với new context
   - Refresh API_Docs.md nếu cần
   - Update instruction files
   - Log context changes trong Decisions.md
   ```

## Context Check Triggers

### Automatic Triggers

- Khi bắt đầu new conversation/session
- Khi detect thay đổi trong package files
- Khi user mention new library/framework
- Khi gặp error liên quan đến outdated patterns
- Mỗi 4 giờ trong long-running sessions

### Manual Triggers

- User request context refresh
- Before major refactoring
- When adding new dependencies
- During code review process

## Context Storage Structure

```
memory_bank/
├── context_session.md          # Current session context
├── context_history/             # Historical context data
│   ├── 2024-01-15-context.md   # Daily context snapshots
│   └── ...
├── library_cache/               # Cached Context7 data
│   ├── react-18.2.0.md         # Library-specific context
│   ├── node-20.0.0.md          # Runtime context
│   └── ...
└── project_context/             # Project-specific context
    ├── tech_stack.md           # Current tech stack
    ├── dependencies.md         # Dependency analysis
    └── best_practices.md       # Applied best practices
```

## Implementation Examples

### React Project Context Check

```typescript
// Context7 integration example
async function checkReactContext() {
  try {
    // Resolve React library ID
    const reactId = await resolveLibraryId('react');
    
    // Fetch latest React documentation
    const reactDocs = await getLibraryDocs(reactId, {
      topic: 'hooks',
      tokens: 5000
    });
    
    // Check for best practices
    const bestPractices = extractBestPractices(reactDocs);
    
    // Apply to current project
    applyContextToProject(bestPractices);
    
  } catch (error) {
    // Fallback to cached context
    useCachedContext('react');
  }
}
```

### Node.js Backend Context Check

```typescript
async function checkNodeContext() {
  const nodeContext = await getContext7Data('node.js', {
    focus: 'security',
    version: '20.x'
  });
  
  // Apply security best practices
  applySecurityStandards(nodeContext.security);
  
  // Update dependency recommendations
  updateDependencyRecommendations(nodeContext.dependencies);
}
```

## Error Handling and Fallback

### Context7 Unavailable

1. **Use Cached Context**: Load last known context from local storage
2. **Basic Patterns**: Apply generic best practices
3. **Manual Override**: Allow user to specify context manually
4. **Log Issue**: Record context check failure for debugging

### Invalid Context Data

1. **Validate Response**: Check Context7 response format
2. **Sanitize Data**: Clean and validate context data
3. **Fallback Patterns**: Use default patterns if data invalid
4. **Report Issues**: Log invalid responses for improvement

## Performance Optimization

### Caching Strategy

- **Session Cache**: Store context for current session
- **Project Cache**: Cache project-specific context
- **Library Cache**: Cache library documentation
- **TTL Management**: Set appropriate cache expiration

### Request Optimization

- **Batch Requests**: Combine multiple context checks
- **Selective Updates**: Only check changed dependencies
- **Background Refresh**: Update context in background
- **Smart Triggers**: Avoid unnecessary context checks

## Integration Points

### With Development Workflows

- **Code Quality**: Apply context-aware quality standards
- **Testing**: Use context for test configuration
- **Deployment**: Apply context-specific deployment patterns
- **Monitoring**: Use context for monitoring setup

### With UI First Workflow

- **Component Libraries**: Apply context for UI framework best practices
- **Design Systems**: Use context for design system recommendations
- **Accessibility**: Apply context-specific accessibility standards
- **Performance**: Use context for UI performance optimization

---

**Success Criteria**: Automatic context validation, up-to-date best practices, seamless integration with all workflows, and reliable fallback mechanisms.
