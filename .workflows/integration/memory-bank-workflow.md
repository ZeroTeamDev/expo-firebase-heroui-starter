---
description: "Memory Bank Workflow for conversation state management and workflow tracking. Apply when working with conversation state management, memory systems, or workflow state tracking."
alwaysApply: false
category: "integration"
priority: "medium"
triggers:
  - "keywords: memory, state, conversation, workflow tracking"
  - "context: long conversations, multi-session work"
  - "file_patterns: memory_bank/*.md, *.memory"
---

# Memory Bank Workflow

## Nguyên Tắc Cơ Bản

- **_BẮT BUỘC_** tạo file memory bank khi bắt đầu cuộc trò chuyện mới với nhiệm vụ cụ thể
- **_BẮT BUỘC_** cập nhật tiến độ sau mỗi bước thực hiện trong cuộc trò chuyện
- **_BẮT BUỘC_** đọc file memory bank trước khi tiếp tục công việc trong cuộc trò chuyện
- **_BẮT BUỘC_** tích hợp với các quy trình experience-system-workflow hiện tại
- **_KHUYẾN NGHỊ_** tạo memory bank có cấu trúc rõ ràng, dễ theo dõi
- **_KHUYẾN NGHỊ_** sử dụng memory bank để tổng hợp kinh nghiệm khi kết thúc workflow

## Cấu Trúc Thư Mục

```
memory_bank/
├── wf_user_management.md       # Workflow quản lý người dùng
├── wf_payment_integration.md   # Workflow tích hợp thanh toán
├── wf_bug_fixing_auth_flow.md  # Workflow sửa lỗi luồng xác thực
├── wf_ui_first_design.md       # Workflow thiết kế UI First
└── ...                         # Các workflow khác
```

## Quy Trình Khởi Tạo Memory Bank

### Khi bắt đầu cuộc trò chuyện mới

1. **Phân tích yêu cầu**:
   - Đọc file `.project-identity` để hiểu ngữ cảnh dự án
   - Phân tích yêu cầu từ người dùng
   - Xác định loại workflow và phạm vi công việc

2. **Tạo memory bank file**:
   - Tạo tên workflow ngắn gọn (dưới 10 từ, dạng snake_case)
   - Tạo file `memory_bank/wf_{tên_workflow}.md`
   - Cập nhật danh sách workflows trong memory bank

### Cấu trúc file memory bank

```markdown
# Workflow: [Tên Workflow]

## 📋 Thông tin cơ bản
- **Ngày bắt đầu**: [YYYY-MM-DD]
- **Ngày kết thúc**: [YYYY-MM-DD] (nếu hoàn thành)
- **Trạng thái**: [In Progress / Completed / Blocked]
- **Ưu tiên**: [High / Medium / Low]
- **Phạm vi**: [Mô tả ngắn gọn phạm vi công việc]

## 🎯 Mục tiêu
- [Mục tiêu chính 1]
- [Mục tiêu chính 2]
- [Mục tiêu phụ (nếu có)]

## 📝 Tiến độ thực hiện

### Phase 1: [Tên Phase]
- [x] Task 1 đã hoàn thành
- [x] Task 2 đã hoàn thành
- [ ] Task 3 đang thực hiện
- [ ] Task 4 chưa bắt đầu

### Phase 2: [Tên Phase]
- [ ] Task 1 chưa bắt đầu
- [ ] Task 2 chưa bắt đầu

## 🔧 Files đã tạo/sửa đổi
- `path/to/file1.ts` - Mô tả thay đổi
- `path/to/file2.md` - Mô tả thay đổi

## 🚧 Vấn đề và giải pháp
- **Vấn đề**: [Mô tả vấn đề]
  - **Giải pháp**: [Mô tả giải pháp]
  - **Kết quả**: [Kết quả áp dụng]

## 📚 Kiến thức thu được
- [Kiến thức 1]: [Mô tả chi tiết]
- [Kiến thức 2]: [Mô tả chi tiết]

## 🔄 Next Steps
- [ ] Task tiếp theo cần thực hiện
- [ ] Dependencies cần giải quyết
- [ ] Resources cần chuẩn bị

## 📊 Metrics
- **Thời gian dự kiến**: [X hours]
- **Thời gian thực tế**: [X hours]
- **Files tạo/sửa**: [X files]
- **Lines of code**: [X lines]
```

## Quy Trình Cập Nhật Memory Bank

### Sau mỗi bước thực hiện

1. **Cập nhật tiến độ**:
   - Đánh dấu task đã hoàn thành
   - Ghi nhận task đang thực hiện
   - Cập nhật trạng thái tổng thể

2. **Ghi nhận thay đổi**:
   - Liệt kê files đã tạo/sửa đổi
   - Mô tả ngắn gọn thay đổi
   - Ghi nhận impact của thay đổi

3. **Xử lý vấn đề**:
   - Ghi nhận vấn đề gặp phải
   - Mô tả giải pháp đã áp dụng
   - Đánh giá hiệu quả của giải pháp

### Khi tiếp tục công việc

1. **Đọc memory bank**:
   - Xem lại tiến độ hiện tại
   - Hiểu context của công việc
   - Xác định next steps

2. **Cập nhật trạng thái**:
   - Cập nhật thời gian làm việc
   - Ghi nhận thay đổi mới
   - Đánh giá tiến độ tổng thể

## Tích Hợp Với Experience System

### Thu thập kinh nghiệm

1. **Pattern Recognition**:
   - Ghi nhận patterns thành công
   - Xác định anti-patterns cần tránh
   - Tạo templates cho tương lai

2. **Knowledge Extraction**:
   - Rút ra lessons learned
   - Tạo best practices
   - Cập nhật documentation

### Chia sẻ kinh nghiệm

1. **Cross-Project Learning**:
   - Áp dụng kinh nghiệm từ project khác
   - Chia sẻ solutions thành công
   - Tránh lặp lại mistakes

2. **Team Knowledge**:
   - Cập nhật team knowledge base
   - Chia sẻ với team members
   - Tạo training materials

## Memory Bank Management

### File Organization

- **Naming Convention**: `wf_{workflow_name}.md`
- **Directory Structure**: Organized by project and date
- **Version Control**: Track changes in git
- **Backup Strategy**: Regular backup of memory bank

### Content Quality

- **Clarity**: Write clear, concise descriptions
- **Completeness**: Include all relevant information
- **Accuracy**: Keep information up to date
- **Reusability**: Structure for future reference

### Maintenance

- **Regular Review**: Weekly review of active workflows
- **Archive Completed**: Move completed workflows to archive
- **Cleanup**: Remove outdated or irrelevant information
- **Optimization**: Improve structure and content over time

## Advanced Features

### Workflow Templates

```markdown
# Template: UI First Development Workflow

## Standard Phases
1. **UI Analysis**: Analyze requirements for UI coverage
2. **UI Design**: Create UI mockups and specifications
3. **UI Implementation**: Build UI components
4. **UI Integration**: Connect UI with backend
5. **UI Testing**: Test UI functionality and UX

## Standard Metrics
- UI Coverage: [X%]
- User Flow Completion: [X%]
- Design Consistency: [X%]
- Performance Score: [X/100]
```

### Cross-Reference System

- **Related Workflows**: Link to related workflows
- **Dependencies**: Track workflow dependencies
- **Resources**: Link to relevant resources
- **Templates**: Reference reusable templates

### Analytics and Reporting

- **Time Tracking**: Track time spent on each workflow
- **Success Rate**: Measure workflow success rates
- **Pattern Analysis**: Identify successful patterns
- **Improvement Areas**: Identify areas for improvement

---

**Success Criteria**: Comprehensive workflow tracking, knowledge capture, experience sharing, and continuous improvement through memory bank system.
