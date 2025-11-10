# Firebase Functions Deployment Guide

Created by Kien AI (leejungkiin@gmail.com)

## Quick Commands

### Deploy Functions

```bash
# Deploy all functions
npm run functions:deploy

# Deploy specific function
npm run functions:deploy:uploadFile

# Or use script directly
bash scripts/deploy-functions.sh uploadFile
```

### Check Functions Status

```bash
# Check deployment status
npm run functions:check

# Or use script directly
bash scripts/check-functions.sh
```

### Build Expo with Functions Check

```bash
# Build with functions check (default)
npm run build

# Build without functions check
npm run build -- --skip-functions-check

# Build for specific platform
npm run build:android
npm run build:ios
```

## Pre-build Check

The project is configured to automatically check Firebase Functions deployment status before building Expo app.

### How It Works

1. Before building Expo app, `prebuild` script runs
2. Script checks if `uploadFile` function is deployed
3. If not found, prompts user to deploy or continue anyway
4. Can be skipped with `--skip-functions-check` flag

### Skip Functions Check

If you want to build without checking functions:

```bash
# Using npm script
npm run build -- --skip-functions-check

# Using expo directly
npx expo prebuild --skip-functions-check
```

## Manual Deployment

### Step 1: Build Functions

```bash
cd functions
npm install  # First time only
npm run build
cd ..
```

### Step 2: Deploy

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:uploadFile
```

### Step 3: Verify

```bash
firebase functions:list
```

## Troubleshooting

### Functions Not Found

If pre-build check fails:

1. **Deploy functions first:**
   ```bash
   npm run functions:deploy
   ```

2. **Or skip check:**
   ```bash
   npm run build -- --skip-functions-check
   ```

### Build Fails with Functions Check

If you want to disable pre-build check permanently, remove these lines from `package.json`:

```json
"prebuild": "bash scripts/prebuild-check.sh",
"prebuild:android": "bash scripts/prebuild-check.sh",
"prebuild:ios": "bash scripts/prebuild-check.sh",
```

### Firebase CLI Not Found

Install Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

## CI/CD Integration

For CI/CD pipelines, you can:

1. **Deploy functions before build:**
   ```bash
   npm run functions:deploy
   npm run build
   ```

2. **Or skip check in CI:**
   ```bash
   npm run build -- --skip-functions-check
   ```

## Scripts Reference

### `scripts/deploy-functions.sh`

Deploys Firebase Functions with build step.

**Usage:**
```bash
bash scripts/deploy-functions.sh              # Deploy all
bash scripts/deploy-functions.sh uploadFile   # Deploy specific
bash scripts/deploy-functions.sh --check      # Check status
```

### `scripts/check-functions.sh`

Checks deployment status of Firebase Functions.

**Usage:**
```bash
bash scripts/check-functions.sh
```

### `scripts/prebuild-check.sh`

Pre-build check script that runs before Expo build.

**Usage:**
```bash
bash scripts/prebuild-check.sh                # Check functions
bash scripts/prebuild-check.sh --skip-functions-check  # Skip check
```

## Best Practices

1. **Always deploy functions before production build:**
   ```bash
   npm run functions:deploy
   npm run build
   ```

2. **Check functions status regularly:**
   ```bash
   npm run functions:check
   ```

3. **Use specific function deployment for faster iteration:**
   ```bash
   npm run functions:deploy:uploadFile
   ```

4. **In CI/CD, deploy functions in separate step:**
   ```yaml
   - name: Deploy Functions
     run: npm run functions:deploy
   
   - name: Build Expo
     run: npm run build -- --skip-functions-check
   ```

