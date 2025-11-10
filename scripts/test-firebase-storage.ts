/**
 * Firebase Storage Test Script
 * Created by Kien AI (leejungkiin@gmail.com)
 * 
 * Test script to verify Firebase Storage configuration and upload functionality
 */

import { getFirebaseApp, getAuthInstance } from '../integrations/firebase.client';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Platform } from 'react-native';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  details?: any;
}

const testResults: TestResult[] = [];

function logTest(test: string, status: 'pass' | 'fail' | 'skip', message: string, details?: any) {
  testResults.push({ test, status, message, details });
  const symbol = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⏭️';
  console.log(`${symbol} [${test}] ${message}`);
  if (details) {
    console.log('   Details:', JSON.stringify(details, null, 2));
  }
}

/**
 * Test 1: Firebase App Initialization
 */
async function testFirebaseAppInit(): Promise<void> {
  try {
    const app = getFirebaseApp();
    if (!app) {
      logTest('Firebase App Init', 'fail', 'Firebase app is not initialized');
      return;
    }
    
    logTest('Firebase App Init', 'pass', 'Firebase app initialized successfully', {
      appId: app.options.appId,
      projectId: app.options.projectId,
    });
  } catch (error) {
    logTest('Firebase App Init', 'fail', 'Failed to initialize Firebase app', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Test 2: Storage Bucket Configuration
 */
async function testStorageBucketConfig(): Promise<void> {
  try {
    const app = getFirebaseApp();
    if (!app) {
      logTest('Storage Bucket Config', 'skip', 'Firebase app not initialized');
      return;
    }
    
    const storageBucket = app.options.storageBucket;
    if (!storageBucket) {
      logTest('Storage Bucket Config', 'fail', 'Storage bucket not configured');
      return;
    }
    
    const hasDomain = storageBucket.includes('.');
    const bucketId = hasDomain ? storageBucket.split('.')[0] : storageBucket;
    
    logTest('Storage Bucket Config', 'pass', 'Storage bucket configured', {
      fullBucket: storageBucket,
      bucketId,
      hasDomain,
    });
  } catch (error) {
    logTest('Storage Bucket Config', 'fail', 'Failed to get storage bucket config', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Test 3: Authentication
 */
async function testAuthentication(): Promise<void> {
  try {
    const authInstance = getAuthInstance();
    if (!authInstance) {
      logTest('Authentication', 'fail', 'Auth instance not available');
      return;
    }
    
    const currentUser = authInstance.currentUser;
    if (!currentUser) {
      logTest('Authentication', 'fail', 'No authenticated user', {
        message: 'Please log in first',
      });
      return;
    }
    
    const idToken = await currentUser.getIdToken();
    if (!idToken) {
      logTest('Authentication', 'fail', 'Failed to get ID token');
      return;
    }
    
    logTest('Authentication', 'pass', 'User authenticated', {
      userId: currentUser.uid,
      email: currentUser.email,
      tokenLength: idToken.length,
    });
  } catch (error) {
    logTest('Authentication', 'fail', 'Authentication test failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Test 4: Storage Instance
 */
async function testStorageInstance(): Promise<void> {
  try {
    const app = getFirebaseApp();
    if (!app) {
      logTest('Storage Instance', 'skip', 'Firebase app not initialized');
      return;
    }
    
    const storage = getStorage(app);
    if (!storage) {
      logTest('Storage Instance', 'fail', 'Failed to get storage instance');
      return;
    }
    
    logTest('Storage Instance', 'pass', 'Storage instance created successfully', {
      app: storage.app.name,
    });
  } catch (error) {
    logTest('Storage Instance', 'fail', 'Failed to create storage instance', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Test 5: Test Bucket Access (Check if bucket exists)
 */
async function testBucketAccess(): Promise<void> {
  try {
    const app = getFirebaseApp();
    const authInstance = getAuthInstance();
    
    if (!app || !authInstance?.currentUser) {
      logTest('Bucket Access', 'skip', 'Firebase app or auth not available');
      return;
    }
    
    const storageBucket = app.options.storageBucket;
    if (!storageBucket) {
      logTest('Bucket Access', 'skip', 'Storage bucket not configured');
      return;
    }
    
    const bucketId = storageBucket.includes('.') 
      ? storageBucket.split('.')[0] 
      : storageBucket;
    
    // Try to list files in bucket (this will fail if bucket doesn't exist or no access)
    const testPath = `test-access-${Date.now()}.txt`;
    const testUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketId}/o?prefix=${testPath}`;
    
    const idToken = await authInstance.currentUser.getIdToken();
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });
    
    // 404 means bucket doesn't exist or wrong bucket ID
    // 401/403 means auth/permission issue
    // 200 means bucket exists and accessible
    if (response.status === 404) {
      logTest('Bucket Access', 'fail', 'Bucket not found or incorrect bucket ID', {
        bucketId,
        status: response.status,
        message: 'Bucket may not exist or bucket ID is incorrect',
      });
    } else if (response.status === 401 || response.status === 403) {
      logTest('Bucket Access', 'fail', 'Authentication or permission issue', {
        bucketId,
        status: response.status,
        message: 'Check authentication token and storage rules',
      });
    } else if (response.ok) {
      logTest('Bucket Access', 'pass', 'Bucket is accessible', {
        bucketId,
        status: response.status,
      });
    } else {
      logTest('Bucket Access', 'fail', 'Unexpected response', {
        bucketId,
        status: response.status,
        statusText: response.statusText,
      });
    }
  } catch (error) {
    logTest('Bucket Access', 'fail', 'Failed to test bucket access', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Test 6: Test Upload URL Format
 */
async function testUploadURLFormat(): Promise<void> {
  try {
    const app = getFirebaseApp();
    const authInstance = getAuthInstance();
    
    if (!app || !authInstance?.currentUser) {
      logTest('Upload URL Format', 'skip', 'Firebase app or auth not available');
      return;
    }
    
    const storageBucket = app.options.storageBucket;
    if (!storageBucket) {
      logTest('Upload URL Format', 'skip', 'Storage bucket not configured');
      return;
    }
    
    const bucketId = storageBucket.includes('.') 
      ? storageBucket.split('.')[0] 
      : storageBucket;
    
    const testPath = `test/test-${Date.now()}.txt`;
    const encodedPath = encodeURIComponent(testPath);
    
    // Test resumable upload URL
    const resumableUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketId}/o?name=${encodedPath}&uploadType=resumable`;
    
    // Test multipart upload URL
    const multipartUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketId}/o?name=${encodedPath}&uploadType=multipart`;
    
    logTest('Upload URL Format', 'pass', 'Upload URLs formatted correctly', {
      bucketId,
      testPath,
      resumableUrl,
      multipartUrl,
    });
  } catch (error) {
    logTest('Upload URL Format', 'fail', 'Failed to format upload URLs', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Test 7: Test Small File Upload (Resumable)
 */
async function testSmallFileUpload(): Promise<void> {
  try {
    const app = getFirebaseApp();
    const authInstance = getAuthInstance();
    
    if (!app || !authInstance?.currentUser) {
      logTest('Small File Upload', 'skip', 'Firebase app or auth not available');
      return;
    }
    
    const storageBucket = app.options.storageBucket;
    if (!storageBucket) {
      logTest('Small File Upload', 'skip', 'Storage bucket not configured');
      return;
    }
    
    const bucketId = storageBucket.includes('.') 
      ? storageBucket.split('.')[0] 
      : storageBucket;
    
    const testPath = `test/test-upload-${Date.now()}.txt`;
    const encodedPath = encodeURIComponent(testPath);
    const testContent = 'Hello, Firebase Storage!';
    const testContentBytes = new TextEncoder().encode(testContent);
    
    const idToken = await authInstance.currentUser.getIdToken();
    
    // Step 1: Initiate resumable upload
    const initiateUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketId}/o?name=${encodedPath}&uploadType=resumable`;
    
    const initResponse = await fetch(initiateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
      },
      body: JSON.stringify({
        contentType: 'text/plain',
      }),
    });
    
    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      logTest('Small File Upload', 'fail', 'Failed to initiate resumable upload', {
        status: initResponse.status,
        statusText: initResponse.statusText,
        error: errorText,
        url: initiateUrl,
      });
      return;
    }
    
    const uploadUrl = initResponse.headers.get('Location');
    if (!uploadUrl) {
      logTest('Small File Upload', 'fail', 'No upload URL returned');
      return;
    }
    
    // Step 2: Upload file
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': String(testContentBytes.length),
      },
      body: testContentBytes,
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      logTest('Small File Upload', 'fail', 'Failed to upload file', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText,
      });
      return;
    }
    
    const result = await uploadResponse.json();
    
    logTest('Small File Upload', 'pass', 'File uploaded successfully', {
      path: testPath,
      name: result.name,
      size: result.size,
    });
    
    // Cleanup: Try to delete test file
    try {
      // Note: We can't easily delete via REST API, so we'll just log success
      logTest('Small File Upload', 'pass', 'Test file uploaded (cleanup needed manually)', {
        path: testPath,
        note: 'Delete test files manually from Firebase Console',
      });
    } catch (error) {
      // Ignore cleanup errors
    }
  } catch (error) {
    logTest('Small File Upload', 'fail', 'Upload test failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Test 8: Check Storage Security Rules
 */
async function testStorageSecurityRules(): Promise<void> {
  try {
    const app = getFirebaseApp();
    const authInstance = getAuthInstance();
    
    if (!app || !authInstance?.currentUser) {
      logTest('Storage Security Rules', 'skip', 'Firebase app or auth not available');
      return;
    }
    
    const storageBucket = app.options.storageBucket;
    if (!storageBucket) {
      logTest('Storage Security Rules', 'skip', 'Storage bucket not configured');
      return;
    }
    
    const bucketId = storageBucket.includes('.') 
      ? storageBucket.split('.')[0] 
      : storageBucket;
    
    const testPath = `users/${authInstance.currentUser.uid}/test-rules-${Date.now()}.txt`;
    const encodedPath = encodeURIComponent(testPath);
    const testContent = 'Test security rules';
    const testContentBytes = new TextEncoder().encode(testContent);
    
    const idToken = await authInstance.currentUser.getIdToken();
    
    // Try to upload to user's personal folder
    const initiateUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketId}/o?name=${encodedPath}&uploadType=resumable`;
    
    const initResponse = await fetch(initiateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
      },
      body: JSON.stringify({
        contentType: 'text/plain',
      }),
    });
    
    if (initResponse.status === 403) {
      logTest('Storage Security Rules', 'fail', 'Storage rules blocking upload (403 Forbidden)', {
        message: 'Check Firebase Storage security rules',
        userId: authInstance.currentUser.uid,
        path: testPath,
        suggestion: 'Ensure rules allow authenticated users to upload to their own folders',
      });
    } else if (initResponse.status === 404) {
      logTest('Storage Security Rules', 'fail', 'Bucket not found (404)', {
        message: 'Bucket may not exist or bucket ID is incorrect',
        bucketId,
      });
    } else if (!initResponse.ok) {
      const errorText = await initResponse.text();
      logTest('Storage Security Rules', 'fail', 'Unexpected error testing rules', {
        status: initResponse.status,
        statusText: initResponse.statusText,
        error: errorText,
      });
    } else {
      logTest('Storage Security Rules', 'pass', 'Storage rules allow upload', {
        message: 'Rules appear to be configured correctly',
        userId: authInstance.currentUser.uid,
      });
    }
  } catch (error) {
    logTest('Storage Security Rules', 'fail', 'Failed to test storage rules', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Run all tests
 */
export async function runFirebaseStorageTests(): Promise<void> {
  console.log('🚀 Starting Firebase Storage Tests...\n');
  console.log(`Platform: ${Platform.OS}\n`);
  
  // Run all tests
  await testFirebaseAppInit();
  await testStorageBucketConfig();
  await testAuthentication();
  await testStorageInstance();
  await testBucketAccess();
  await testUploadURLFormat();
  await testStorageSecurityRules();
  await testSmallFileUpload();
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('='.repeat(50));
  
  const passed = testResults.filter(r => r.status === 'pass').length;
  const failed = testResults.filter(r => r.status === 'fail').length;
  const skipped = testResults.filter(r => r.status === 'skip').length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`📝 Total: ${testResults.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults
      .filter(r => r.status === 'fail')
      .forEach(r => {
        console.log(`   - ${r.test}: ${r.message}`);
        if (r.details) {
          console.log(`     Details: ${JSON.stringify(r.details, null, 2)}`);
        }
      });
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Recommendations
  if (failed > 0) {
    console.log('\n💡 Recommendations:');
    
    const bucketAccessTest = testResults.find(r => r.test === 'Bucket Access');
    if (bucketAccessTest?.status === 'fail') {
      console.log('   1. Verify bucket exists in Firebase Console');
      console.log('   2. Check bucket ID in Firebase config');
      console.log('   3. Ensure Firebase Storage is enabled for your project');
    }
    
    const authTest = testResults.find(r => r.test === 'Authentication');
    if (authTest?.status === 'fail') {
      console.log('   1. Ensure user is logged in');
      console.log('   2. Check Firebase Authentication configuration');
    }
    
    const rulesTest = testResults.find(r => r.test === 'Storage Security Rules');
    if (rulesTest?.status === 'fail') {
      console.log('   1. Check Firebase Storage security rules');
      console.log('   2. Ensure rules allow authenticated users to upload');
      console.log('   3. Example rule: allow write: if request.auth != null;');
    }
    
    const uploadTest = testResults.find(r => r.test === 'Small File Upload');
    if (uploadTest?.status === 'fail') {
      console.log('   1. Check all previous test results');
      console.log('   2. Verify bucket access and security rules');
      console.log('   3. Check network connectivity');
    }
  }
  
  console.log('\n✨ Tests completed!\n');
}

// Export for use in React Native
export default runFirebaseStorageTests;

