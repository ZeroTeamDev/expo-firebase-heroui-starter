# Firebase Functions Deploy Troubleshooting

## Lỗi: "Cannot read properties of undefined (reading 'stdin')"

Lỗi này thường xảy ra khi Firebase CLI cố gắng chạy npm build trong predeploy script.

### Giải pháp 1: Build trước rồi deploy (Recommended)

```bash
# 1. Build functions trước
cd functions
npm run build

# 2. Quay lại root và deploy (tạm thời tắt predeploy)
cd ..
firebase deploy --only functions --no-build
```

Hoặc tạm thời comment predeploy trong `firebase.json`:

```json
{
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "predeploy": []
    }
  ]
}
```

Sau đó build và deploy:

```bash
cd functions && npm run build && cd ..
firebase deploy --only functions
```

### Giải pháp 2: Sử dụng shell script

Tạo file `functions/build.sh`:

```bash
#!/bin/bash
cd "$(dirname "$0")"
npm run build
```

Sau đó cập nhật `firebase.json`:

```json
{
  "functions": [
    {
      "source": "functions",
      "predeploy": ["bash functions/build.sh"]
    }
  ]
}
```

### Giải pháp 3: Kiểm tra Node version

Đảm bảo Node version phù hợp:

```bash
node -v  # Should be v20.x.x
```

Nếu không đúng, sử dụng nvm:

```bash
nvm use 20
```

### Giải pháp 4: Clear cache và rebuild

```bash
cd functions
rm -rf node_modules dist
npm install
npm run build
cd ..
firebase deploy --only functions
```

## Verify Build

Trước khi deploy, luôn verify build thành công:

```bash
cd functions
npm run build
ls -la dist/  # Should see compiled .js files
```

## Deploy Without Predeploy

Nếu predeploy vẫn gặp vấn đề, bạn có thể:

1. Build manually trước
2. Deploy với flag `--no-build` (nếu có)
3. Hoặc tạm thời remove predeploy script

