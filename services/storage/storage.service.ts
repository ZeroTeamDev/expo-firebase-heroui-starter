/**
 * Storage Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Service for Firebase Storage operations
 */

import {
  getStorage,
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
  type StorageReference,
  type StringFormat,
} from "firebase/storage";
import {
  getFirebaseApp,
  getAuthInstance,
} from "@/integrations/firebase.client";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Platform } from "react-native";

// Dynamic import for expo-file-system to avoid errors if not available
// Try to use legacy API first to avoid deprecation warnings
let FileSystemModule: any = null;
async function getFileSystem() {
  if (FileSystemModule) return FileSystemModule;
  try {
    // Try legacy API first (expo-file-system/legacy) to avoid deprecation warnings
    try {
      const legacyModule = await import("expo-file-system/legacy");
      // Legacy module may not have default export
      FileSystemModule = legacyModule;
      if (__DEV__) {
        console.log("[Storage] Using expo-file-system/legacy API");
      }
      return FileSystemModule;
    } catch {
      // Fallback to regular expo-file-system if legacy is not available
      const module = await import("expo-file-system");
      FileSystemModule = module.default || module;
      if (__DEV__) {
        console.log(
          "[Storage] Using expo-file-system API (legacy not available)"
        );
      }
      return FileSystemModule;
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("[Storage] expo-file-system not available:", error);
    }
    return null;
  }
}

let storageInstance: ReturnType<typeof getStorage> | null = null;

/**
 * Get Firebase Storage instance
 */
function getStorageInstance() {
  if (storageInstance) {
    return storageInstance;
  }

  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase app is not initialized");
  }

  try {
    storageInstance = getStorage(app);
    if (__DEV__) {
      console.log("[Storage] Firebase Storage instance initialized");
    }
    return storageInstance;
  } catch (error) {
    console.error("[Storage] Failed to initialize Storage:", error);
    throw new Error(
      `Failed to initialize Firebase Storage: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get Firebase Functions instance
 */
function getFunctionsInstance() {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase app not initialized");
  }
  const functionsRegion =
    process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION || "us-central1";
  return getFunctions(app, functionsRegion);
}

export interface UploadFileOptions {
  metadata?: {
    contentType?: string;
    customMetadata?: Record<string, string>;
  };
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  storagePath: string;
  downloadURL: string;
  metadata: {
    size: number;
    contentType: string;
    fullPath: string;
  };
}

/**
 * Read file from URI and convert to base64
 * Works on both React Native and Web
 */
async function readFileToBase64(fileUri: string): Promise<string> {
  if (Platform.OS === "web") {
    // Web: use fetch to read file
    const response = await fetch(fileUri);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      );
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix if present
        const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } else {
    // React Native: use expo-file-system
    const FileSystem = await getFileSystem();
    if (!FileSystem) {
      throw new Error("expo-file-system is not available");
    }

    try {
      // Read file as base64 using expo-file-system
      // Handle both legacy and new API formats
      const readAsStringAsync = FileSystem.readAsStringAsync;
      if (!readAsStringAsync) {
        throw new Error("expo-file-system readAsStringAsync is not available");
      }

      // Determine encoding type
      const encodingType = FileSystem.EncodingType?.Base64 ?? "base64";

      const base64 = await readAsStringAsync(fileUri, {
        encoding: encodingType,
      });

      return base64;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (__DEV__) {
        console.error("[Storage] Failed to read file from URI:", error);
      }
      throw new Error(`Failed to read file from URI: ${errorMessage}`);
    }
  }
}

/**
 * atob polyfill for React Native (if not available)
 */
function atobPolyfill(base64: string): string {
  // Manual base64 decode
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";

  base64 = base64.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  for (let i = 0; i < base64.length; i += 4) {
    const enc1 = chars.indexOf(base64.charAt(i));
    const enc2 = chars.indexOf(base64.charAt(i + 1));
    const enc3 = chars.indexOf(base64.charAt(i + 2));
    const enc4 = chars.indexOf(base64.charAt(i + 3));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    output += String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }

  return output;
}

/**
 * Convert base64 string to ArrayBuffer (binary data)
 * React Native compatible
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Remove data URL prefix if present
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

  // Use atob or polyfill
  const atobFn = typeof atob !== "undefined" ? atob : atobPolyfill;
  const binaryString = atobFn(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

/**
 * Fallback: Upload base64 via multipart API
 * Used when resumable upload fails
 */
async function uploadBase64ViaMultipartAPI(
  storageRef: StorageReference,
  base64String: string,
  metadata: { contentType?: string; [key: string]: any },
  idToken: string,
  bucketId: string,
  encodedPath: string,
  binaryData: ArrayBuffer,
  onProgress?: (progress: number) => void
): Promise<any> {
  // Get Firebase app to try different bucket formats
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    throw new Error("Firebase app not initialized");
  }

  const storageBucketFull = firebaseApp.options.storageBucket || bucketId;
  const projectId = firebaseApp.options.projectId;

  // Try different bucket formats - prioritize FULL bucket name first
  // Based on download URL evidence: https://firebasestorage.googleapis.com/v0/b/superheroes-ee77d.firebasestorage.app/o/...
  const bucketFormats = [
    storageBucketFull, // Try full bucket name FIRST (matches download URL)
    bucketId, // Then bucket ID (fallback)
  ];

  if (
    projectId &&
    projectId !== bucketId &&
    !bucketFormats.includes(projectId)
  ) {
    bucketFormats.push(projectId);
  }

  if (__DEV__) {
    console.log(
      "[Storage] Trying multipart upload with bucket formats (prioritizing full domain):",
      {
        formats: bucketFormats,
        original: storageBucketFull,
        bucketId,
        projectId,
        note: "Full bucket name is tried first (matches download URL format)",
      }
    );
  }

  let lastError: Error | null = null;

  // Try each bucket format
  for (const bucketFormat of bucketFormats) {
    try {
      const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketFormat}/o?name=${encodedPath}&uploadType=multipart`;

      if (__DEV__) {
        console.log(
          `[Storage] Trying multipart upload with bucket format: ${bucketFormat}`
        );
      }

      // Create multipart/related form data
      const boundary =
        "----firebasestorage" + Math.random().toString(36).substring(2, 15);
      const metadataPart = JSON.stringify({
        contentType: metadata.contentType || "application/octet-stream",
      });

      // Build multipart/related body according to Firebase Storage API spec
      // Format: --boundary\r\nContent-Type: application/json\r\n\r\n{metadata}\r\n--boundary\r\nContent-Type: {fileType}\r\n\r\n{binary}\r\n--boundary--
      const multipartHeader = [
        `--${boundary}`,
        "Content-Type: application/json",
        "",
        metadataPart,
        "",
        `--${boundary}`,
        `Content-Type: ${metadata.contentType || "application/octet-stream"}`,
        "",
        "", // Binary data starts here
      ].join("\r\n");

      const multipartFooter = `\r\n--${boundary}--\r\n`;

      // Convert to bytes
      let headerBytes: Uint8Array;
      let footerBytes: Uint8Array;

      if (typeof TextEncoder !== "undefined") {
        headerBytes = new TextEncoder().encode(multipartHeader + "\r\n");
        footerBytes = new TextEncoder().encode(multipartFooter);
      } else {
        // Manual UTF-8 encoding
        const encodeUTF8 = (str: string): Uint8Array => {
          const utf8: number[] = [];
          for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode < 0x80) {
              utf8.push(charCode);
            } else if (charCode < 0x800) {
              utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
            } else {
              utf8.push(
                0xe0 | (charCode >> 12),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f)
              );
            }
          }
          return new Uint8Array(utf8);
        };
        headerBytes = encodeUTF8(multipartHeader + "\r\n");
        footerBytes = encodeUTF8(multipartFooter);
      }

      // Combine parts
      const totalLength =
        headerBytes.length + binaryData.byteLength + footerBytes.length;

      if (__DEV__) {
        console.log(`[Storage] Building multipart body:`, {
          headerBytes: headerBytes.length,
          binaryData: binaryData.byteLength,
          footerBytes: footerBytes.length,
          totalLength,
          boundary,
          note: "Binary data should be included in multipart body",
        });
      }

      const multipartData = new Uint8Array(totalLength);
      multipartData.set(headerBytes, 0);

      // Convert ArrayBuffer to Uint8Array
      const binaryBytes = new Uint8Array(binaryData);

      multipartData.set(binaryBytes, headerBytes.length);
      multipartData.set(footerBytes, headerBytes.length + binaryBytes.length);

      if (__DEV__) {
        console.log(`[Storage] Multipart body created:`, {
          multipartDataLength: multipartData.length,
          expectedLength: totalLength,
          firstBytes: Array.from(multipartData.slice(0, 100))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(" "),
          lastBytes: Array.from(multipartData.slice(-50))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(" "),
        });
      }

      // Upload multipart body
      // Use XMLHttpRequest for React Native (more reliable with binary data)
      // Use fetch for Web
      let response:
        | Response
        | {
            ok: boolean;
            status: number;
            statusText: string;
            text: () => Promise<string>;
          };

      if (Platform.OS === "web") {
        // Web: use fetch with ArrayBuffer
        const multipartArrayBuffer = multipartData.buffer.slice(
          multipartData.byteOffset,
          multipartData.byteOffset + multipartData.byteLength
        );

        if (__DEV__) {
          console.log(`[Storage] Uploading multipart body (web):`, {
            multipartArrayBufferSize: multipartArrayBuffer.byteLength,
            multipartDataLength: multipartData.length,
            contentType: `multipart/related; boundary=${boundary}`,
          });
        }

        response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": `multipart/related; boundary=${boundary}`,
            "Content-Length": String(multipartArrayBuffer.byteLength),
          },
          body: multipartArrayBuffer,
        });
      } else {
        // React Native: use XMLHttpRequest for reliable binary data upload
        if (__DEV__) {
          console.log(`[Storage] Uploading multipart body (React Native):`, {
            multipartDataLength: multipartData.length,
            contentType: `multipart/related; boundary=${boundary}`,
            note: "Using XMLHttpRequest for reliable binary data upload",
          });
        }

        try {
          response = await new Promise<{
            ok: boolean;
            status: number;
            statusText: string;
            text: () => Promise<string>;
          }>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", uploadUrl, true);
            xhr.setRequestHeader("Authorization", `Bearer ${idToken}`);
            xhr.setRequestHeader(
              "Content-Type",
              `multipart/related; boundary=${boundary}`
            );
            xhr.setRequestHeader(
              "Content-Length",
              String(multipartData.length)
            );
            xhr.responseType = "text";

            // Track upload progress
            if (onProgress) {
              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const progress = (event.loaded / event.total) * 100;
                  onProgress(progress);
                }
              };
            }

            xhr.onload = () => {
              resolve({
                ok: xhr.status >= 200 && xhr.status < 300,
                status: xhr.status,
                statusText: xhr.statusText,
                text: async () => xhr.responseText || xhr.response || "",
              });
            };

            xhr.onerror = () => {
              reject(
                new Error(
                  `Network request failed: ${xhr.status || "unknown"} ${
                    xhr.statusText || "unknown error"
                  }`
                )
              );
            };

            xhr.ontimeout = () => {
              reject(new Error("Upload timeout"));
            };

            xhr.timeout = 120000; // 120 seconds

            // Send multipart data
            // Try sending as ArrayBuffer first, fallback to Uint8Array
            try {
              // Convert Uint8Array to ArrayBuffer for better compatibility
              const arrayBuffer = multipartData.buffer.slice(
                multipartData.byteOffset,
                multipartData.byteOffset + multipartData.byteLength
              );
              xhr.send(arrayBuffer);
            } catch {
              // Fallback to sending Uint8Array directly
              xhr.send(multipartData);
            }
          });
        } catch (xhrError) {
          const errorMessage =
            xhrError instanceof Error ? xhrError.message : "Unknown error";
          if (__DEV__) {
            console.error("[Storage] Multipart upload XMLHttpRequest failed:", {
              error: errorMessage,
              bucketFormat,
            });
          }
          lastError =
            xhrError instanceof Error ? xhrError : new Error(String(xhrError));
          continue;
        }
      }

      // Process response
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        if (__DEV__) {
          console.warn(
            `[Storage] Multipart upload failed with bucket format "${bucketFormat}":`,
            {
              status: response.status,
              statusText: response.statusText,
              error: errorText.substring(0, 200),
            }
          );
        }

        // If 404, try next format
        if (response.status === 404) {
          lastError = new Error(
            `Bucket format "${bucketFormat}" not found (404)`
          );
          continue;
        }

        // For other errors, save and continue
        lastError = new Error(
          `Multipart upload failed with "${bucketFormat}": ${response.status} ${
            response.statusText
          }. ${errorText.substring(0, 200)}`
        );
        continue;
      }

      // Parse JSON response
      const responseText = await response.text();
      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        // If response is not JSON, create error
        lastError = new Error(
          `Failed to parse multipart upload response: ${responseText.substring(
            0,
            200
          )}`
        );
        continue;
      }

      // Verify upload was successful
      const uploadedSize = result.size ? parseInt(result.size) : 0;
      const expectedSize = binaryData.byteLength;

      if (uploadedSize < expectedSize * 0.1) {
        // Uploaded size is less than 10% of expected - likely only metadata
        const errorMsg = `Multipart upload only uploaded metadata (${uploadedSize} bytes) instead of file data (${expectedSize} bytes). This usually means the binary data was not included in the multipart body correctly.`;
        if (__DEV__) {
          console.error(
            "[Storage] Multipart upload failed - only metadata uploaded:",
            {
              uploadedSize,
              expectedSize,
              result,
              error: errorMsg,
            }
          );
        }
        lastError = new Error(errorMsg);
        continue;
      }

      if (onProgress) {
        onProgress(100);
      }

      if (__DEV__) {
        console.log(
          `[Storage] ✅ Multipart upload successful with bucket format: ${bucketFormat}`,
          {
            name: result.name,
            size: result.size,
            uploadedSize,
            expectedSize,
            contentType: result.contentType,
            downloadTokens: result.downloadTokens,
          }
        );
      }

      // Verify upload by getting download URL
      try {
        const downloadURL = await getDownloadURL(storageRef);
        if (__DEV__) {
          console.log(
            "[Storage] ✅ Multipart upload verified with download URL:",
            {
              downloadURL: downloadURL.substring(0, 100) + "...",
            }
          );
        }
      } catch (urlError) {
        if (__DEV__) {
          console.warn(
            "[Storage] Could not get download URL after multipart upload:",
            urlError
          );
        }
      }

      // Multipart upload returns metadata with downloadTokens
      const fileName =
        result.name || storageRef.fullPath.split("/").pop() || "file";
      const downloadTokens = result.downloadTokens;

      // Return result with proper metadata structure
      // Note: result.contentType might be "application/json" from metadata part
      // Use the metadata.contentType we passed in instead (actual file content type)
      return {
        ref: storageRef,
        metadata: {
          contentType: metadata.contentType || "application/octet-stream", // Use actual file content type
          size: uploadedSize, // Use actual uploaded size from response
          fullPath: storageRef.fullPath,
          name: fileName,
          downloadTokens: downloadTokens,
          ...result, // Include all other fields from response
        },
      };
    } catch (formatError) {
      lastError =
        formatError instanceof Error
          ? formatError
          : new Error(String(formatError));
      if (__DEV__) {
        console.warn(
          `[Storage] Error with multipart bucket format "${bucketFormat}":`,
          formatError
        );
      }
      continue;
    }
  }

  // All formats failed
  if (__DEV__) {
    console.error("[Storage] ❌ All upload methods and bucket formats failed");
    console.error("[Storage] Last error:", lastError);
    console.error("[Storage] Troubleshooting:");
    console.error("  1. Verify bucket exists in Firebase Console");
    console.error("  2. Check Firebase Storage is enabled");
    console.error("  3. Verify EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET in .env");
    console.error("  4. Check Storage security rules allow uploads");
    console.error("  5. Verify user is authenticated");
    console.error(
      "  6. Check Firebase Storage API is enabled in Google Cloud Console"
    );
  }

  throw (
    lastError ||
    new Error(
      "All upload methods failed. Check Firebase Storage configuration."
    )
  );
}

/**
 * Upload base64 string to Firebase Storage using REST API
 * This is needed because uploadString doesn't work well in React Native
 */
async function uploadBase64ViaRESTAPI(
  storageRef: StorageReference,
  base64String: string,
  metadata: { contentType?: string; [key: string]: any },
  onProgress?: (progress: number) => void
): Promise<any> {
  const authInstance = getAuthInstance();
  if (!authInstance?.currentUser) {
    throw new Error("User must be authenticated to upload files");
  }

  // Get Firebase config
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    throw new Error("Firebase app not initialized");
  }

  let storageBucket = firebaseApp.options.storageBucket;
  if (!storageBucket) {
    throw new Error("Storage bucket not configured");
  }

  // Check if bucket contains domain (has dots)
  // If not, it's already just the bucket ID
  const hasDomain = storageBucket.includes(".");

  if (__DEV__) {
    console.log("[Storage] Original storage bucket:", storageBucket);
    console.log("[Storage] Has domain:", hasDomain);
  }

  // Get access token
  const idToken = await authInstance.currentUser.getIdToken();

  // Convert base64 to binary data FIRST (we need the size for upload initiation)
  let binaryData: ArrayBuffer;
  try {
    binaryData = base64ToArrayBuffer(base64String);
  } catch (error) {
    throw new Error(
      `Failed to convert base64 to binary: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  // Build REST API URL for resumable upload (more reliable than multipart)
  // Firebase Storage REST API supports resumable uploads which are more reliable
  // Step 1: Get upload URL
  // Step 2: Upload data to that URL

  const encodedPath = encodeURIComponent(storageRef.fullPath);

  // Try different bucket name formats for Firebase Storage REST API
  // IMPORTANT: Based on download URL evidence, Firebase Storage uses FULL bucket name with domain
  // Download URL format: https://firebasestorage.googleapis.com/v0/b/superheroes-ee77d.firebasestorage.app/o/...
  // Format 1: Full bucket name with domain (e.g., "superheroes-ee77d.firebasestorage.app") - PRIORITY
  // Format 2: Bucket ID only (e.g., "superheroes-ee77d") - fallback
  // Format 3: Project ID (if different from bucket ID) - fallback

  const bucketId = hasDomain ? storageBucket.split(".")[0] : storageBucket;

  // Prioritize FULL bucket name FIRST (matches download URL format)
  const bucketFormats = [
    storageBucket, // Try full bucket name FIRST (e.g., "superheroes-ee77d.firebasestorage.app")
    bucketId, // Then try bucket ID only (fallback)
  ];

  // Also try with project ID if available and different
  const projectId = firebaseApp.options.projectId;
  if (
    projectId &&
    projectId !== bucketId &&
    !bucketFormats.includes(projectId)
  ) {
    bucketFormats.push(projectId);
  }

  if (__DEV__) {
    console.log(
      "[Storage] Trying bucket formats (prioritizing full domain based on download URL):",
      {
        formats: bucketFormats,
        original: storageBucket,
        bucketId,
        projectId,
        note: "Full bucket name is tried first (matches download URL format)",
      }
    );
  }

  let lastError: Error | null = null;

  // Try each bucket format until one works
  for (const bucketFormat of bucketFormats) {
    try {
      const initiateUploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketFormat}/o?name=${encodedPath}&uploadType=resumable`;

      if (__DEV__) {
        console.log(
          `[Storage] Trying resumable upload with bucket format: ${bucketFormat}`
        );
        console.log(`[Storage] Initiate URL: ${initiateUploadUrl}`);
      }

      // Step 1: Initialize resumable upload to get upload URL
      let initResponse: Response;
      try {
        if (__DEV__) {
          console.log(`[Storage] Initializing resumable upload:`, {
            bucketFormat,
            binaryDataSize: binaryData.byteLength,
            contentType: metadata.contentType,
          });
        }

        initResponse = await fetch(initiateUploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json; charset=UTF-8",
            "X-Goog-Upload-Protocol": "resumable",
            "X-Goog-Upload-Command": "start",
          },
          body: JSON.stringify({
            contentType: metadata.contentType || "application/octet-stream",
          }),
        });

        if (__DEV__) {
          console.log(`[Storage] Resumable init response:`, {
            status: initResponse.status,
            statusText: initResponse.statusText,
            ok: initResponse.ok,
            headers: Object.fromEntries(initResponse.headers.entries()),
          });
        }
      } catch (fetchError) {
        if (__DEV__) {
          console.error(`[Storage] Resumable init fetch failed:`, fetchError);
        }
        lastError =
          fetchError instanceof Error
            ? fetchError
            : new Error(String(fetchError));
        continue;
      }

      if (!initResponse.ok) {
        const errorText = await initResponse.text();

        if (__DEV__) {
          console.warn(`[Storage] Bucket format "${bucketFormat}" failed:`, {
            status: initResponse.status,
            statusText: initResponse.statusText,
            error: errorText.substring(0, 500), // Increase error text length
          });
        }

        // If 404, try next format
        if (initResponse.status === 404) {
          lastError = new Error(
            `Bucket format "${bucketFormat}" not found (404)`
          );
          continue; // Try next format
        }

        // For other errors, save and continue trying
        lastError = new Error(
          `Failed with bucket format "${bucketFormat}": ${
            initResponse.status
          } ${initResponse.statusText}. ${errorText.substring(0, 500)}`
        );
        continue;
      }

      // Success! Get the upload URL
      // Firebase Storage returns upload URL in either "Location" or "x-goog-upload-url" header
      const uploadUrl =
        initResponse.headers.get("Location") ||
        initResponse.headers.get("x-goog-upload-url");

      if (!uploadUrl) {
        if (__DEV__) {
          console.error(`[Storage] No upload URL found in headers:`, {
            headers: Object.fromEntries(initResponse.headers.entries()),
            availableHeaders: Array.from(initResponse.headers.keys()),
          });
        }
        lastError = new Error(
          `No upload URL returned for bucket format "${bucketFormat}" (checked Location and x-goog-upload-url headers)`
        );
        continue;
      }

      if (__DEV__) {
        console.log(`[Storage] ✅ Success with bucket format: ${bucketFormat}`);
        console.log(`[Storage] Got resumable upload URL: ${uploadUrl}`);
        console.log(`[Storage] Upload URL source:`, {
          fromLocation: !!initResponse.headers.get("Location"),
          fromXGoogUploadUrl: !!initResponse.headers.get("x-goog-upload-url"),
        });
      }

      // Step 2: Upload the binary data
      try {
        const binaryBytes = new Uint8Array(binaryData);

        if (__DEV__) {
          console.log("[Storage] Uploading binary data:", {
            size: binaryBytes.length,
            contentType: metadata.contentType || "application/octet-stream",
            uploadUrl: uploadUrl.substring(0, 100) + "...",
            platform: Platform.OS,
            note:
              Platform.OS === "web"
                ? "Using fetch with Blob"
                : "Using XMLHttpRequest with Uint8Array",
          });
        }

        let result: any;

        if (Platform.OS === "web") {
          // Web: use fetch with Blob
          const blob = new Blob([binaryBytes], {
            type: metadata.contentType || "application/octet-stream",
          });
          const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type":
                metadata.contentType || "application/octet-stream",
              "Content-Length": String(binaryData.byteLength),
            },
            body: blob,
          });

          if (!response.ok) {
            const errorText = await response
              .text()
              .catch(() => "Unknown error");
            if (__DEV__) {
              console.error("[Storage] Resumable upload failed:", {
                status: response.status,
                statusText: response.statusText,
                error: errorText.substring(0, 500),
              });
            }
            throw new Error(
              `Upload failed: ${response.status} ${response.statusText}. ${errorText}`
            );
          }

          const responseText = await response.text();
          if (responseText) {
            try {
              result = JSON.parse(responseText);
            } catch {
              // Empty or non-JSON response - will verify with getDownloadURL
            }
          }
        } else {
          // React Native: Try multiple approaches for binary data upload
          // XMLHttpRequest may not work reliably with Uint8Array in React Native
          if (__DEV__) {
            console.log("[Storage] Uploading binary data (React Native):", {
              size: binaryBytes.length,
              contentType: metadata.contentType || "application/octet-stream",
              uploadUrl: uploadUrl.substring(0, 100) + "...",
              note: "Trying fetch with ArrayBuffer",
            });
          }

          try {
            // Try fetch with ArrayBuffer first
            // Convert Uint8Array to ArrayBuffer for fetch
            const arrayBuffer = binaryBytes.buffer.slice(
              binaryBytes.byteOffset,
              binaryBytes.byteOffset + binaryBytes.byteLength
            );

            const response = await fetch(uploadUrl, {
              method: "PUT",
              headers: {
                "Content-Type":
                  metadata.contentType || "application/octet-stream",
                "Content-Length": String(arrayBuffer.byteLength),
              },
              body: arrayBuffer,
            });

            if (!response.ok) {
              const errorText = await response
                .text()
                .catch(() => "Unknown error");
              if (__DEV__) {
                console.error("[Storage] Fetch upload failed:", {
                  status: response.status,
                  statusText: response.statusText,
                  error: errorText.substring(0, 500),
                });
              }
              throw new Error(
                `Upload failed: ${response.status} ${response.statusText}. ${errorText}`
              );
            }

            const responseText = await response.text();
            if (responseText) {
              try {
                result = JSON.parse(responseText);
              } catch {
                // Empty or non-JSON response - will verify with getDownloadURL
                result = { success: true };
              }
            } else {
              result = { success: true };
            }

            if (onProgress) {
              onProgress(100);
            }
          } catch (fetchError) {
            // If fetch fails, try XMLHttpRequest as fallback
            if (__DEV__) {
              console.warn(
                "[Storage] Fetch upload failed, trying XMLHttpRequest:",
                fetchError instanceof Error
                  ? fetchError.message
                  : "Unknown error"
              );
            }

            try {
              result = await new Promise<any>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                // Set up progress tracking
                if (onProgress) {
                  xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                      const progress = (event.loaded / event.total) * 100;
                      onProgress(progress);
                    }
                  };
                }

                xhr.open("PUT", uploadUrl, true);
                xhr.setRequestHeader(
                  "Content-Type",
                  metadata.contentType || "application/octet-stream"
                );
                xhr.setRequestHeader(
                  "Content-Length",
                  String(binaryBytes.length)
                );
                xhr.responseType = "text";

                xhr.onload = () => {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    const responseText = xhr.responseText || xhr.response || "";
                    try {
                      if (responseText) {
                        const parsedResult = JSON.parse(responseText);
                        resolve(parsedResult);
                      } else {
                        resolve({ success: true });
                      }
                    } catch {
                      resolve({ success: true });
                    }
                  } else {
                    const errorText =
                      xhr.responseText || xhr.response || "Unknown error";
                    reject(
                      new Error(
                        `Upload failed: ${xhr.status} ${xhr.statusText}. ${errorText}`
                      )
                    );
                  }
                };

                xhr.onerror = () => {
                  reject(
                    new Error(
                      `Network request failed: ${xhr.status || "unknown"} ${
                        xhr.statusText || "unknown error"
                      }`
                    )
                  );
                };

                xhr.ontimeout = () => {
                  reject(new Error("Upload timeout"));
                };

                xhr.timeout = 120000; // 120 seconds

                // Try sending as ArrayBuffer view
                xhr.send(binaryBytes.buffer);
              });

              if (onProgress) {
                onProgress(100);
              }
            } catch (xhrError) {
              const errorMessage =
                xhrError instanceof Error ? xhrError.message : "Unknown error";
              if (__DEV__) {
                console.error(
                  "[Storage] Both fetch and XMLHttpRequest failed:",
                  {
                    fetchError:
                      fetchError instanceof Error
                        ? fetchError.message
                        : "Unknown",
                    xhrError: errorMessage,
                    uploadUrl: uploadUrl.substring(0, 100) + "...",
                  }
                );
              }
              throw new Error(
                `Upload failed with both fetch and XMLHttpRequest: ${errorMessage}`
              );
            }
          }
        }

        // Verify upload was successful - check if size matches
        if (result?.size && parseInt(result.size) !== binaryData.byteLength) {
          if (__DEV__) {
            console.warn("[Storage] Uploaded file size mismatch:", {
              expected: binaryData.byteLength,
              actual: result.size,
            });
          }
          // Continue anyway - might be compression or other processing
        }

        if (onProgress) {
          onProgress(100);
        }

        // Verify upload by getting download URL
        // This ensures the file was actually uploaded, not just metadata
        try {
          const downloadURL = await getDownloadURL(storageRef);
          if (__DEV__) {
            console.log(
              "[Storage] ✅ Resumable upload verified with download URL:",
              {
                downloadURL: downloadURL.substring(0, 100) + "...",
                expectedSize: binaryData.byteLength,
                resultSize: result?.size,
                note: "File uploaded successfully with binary data",
              }
            );
          }
        } catch (urlError) {
          // If we can't get download URL, upload might have failed
          if (__DEV__) {
            console.error(
              "[Storage] Failed to get download URL after upload:",
              urlError
            );
          }
          // Continue anyway - result might have the necessary info
        }

        // Return result with metadata
        // If result is empty/undefined, we still have storageRef and can get URL later
        const fileName =
          result?.name || storageRef.fullPath.split("/").pop() || "file";
        const downloadTokens = result?.downloadTokens;

        return {
          ref: storageRef,
          metadata: {
            contentType: metadata.contentType || "application/octet-stream",
            size: result?.size ? parseInt(result.size) : binaryData.byteLength,
            fullPath: storageRef.fullPath,
            name: fileName,
            downloadTokens: downloadTokens,
            ...(result || {}),
          },
        };
      } catch (uploadError) {
        // Upload binary data failed - log and try next format
        if (__DEV__) {
          console.error(
            `[Storage] Resumable upload binary data failed for "${bucketFormat}":`,
            uploadError
          );
        }
        lastError =
          uploadError instanceof Error
            ? uploadError
            : new Error(String(uploadError));
        continue; // Try next format
      }
    } catch (formatError) {
      // Format error (init failed, no upload URL, etc.)
      lastError =
        formatError instanceof Error
          ? formatError
          : new Error(String(formatError));
      if (__DEV__) {
        console.warn(
          `[Storage] Error with bucket format "${bucketFormat}":`,
          formatError
        );
      }
      continue; // Try next format
    }
  }

  // All formats failed, try multipart as last resort
  if (__DEV__) {
    console.warn(
      "[Storage] All resumable upload formats failed, trying multipart upload as fallback"
    );
    console.warn("[Storage] Last error:", lastError);
  }

  // Fallback to multipart upload with the original bucket ID
  return await uploadBase64ViaMultipartAPI(
    storageRef,
    base64String,
    metadata,
    idToken,
    bucketId,
    encodedPath,
    binaryData,
    onProgress
  );
}

/**
 * Upload file to Firebase Storage
 */
export async function uploadFile(
  file:
    | File
    | Blob
    | { uri: string; name: string; type?: string; size?: number },
  storagePath: string,
  options?: UploadFileOptions
): Promise<UploadResult> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, storagePath);

  let fileName: string;
  let fileSize: number;
  let fileType: string;
  let base64Data: string | null = null;
  let blobData: Blob | File | null = null;

  // Handle different file types
  if (file instanceof File) {
    // Web: File object
    fileName = file.name;
    fileSize = file.size;
    fileType = file.type;
    blobData = file;
  } else if (file instanceof Blob) {
    // Web: Blob object
    fileName = "file";
    fileSize = file.size;
    fileType = file.type || "application/octet-stream";
    blobData = file;
  } else {
    // React Native: File object with URI
    fileName = file.name;
    fileSize = file.size || 0;
    fileType = file.type || "application/octet-stream";

    if (Platform.OS === "web") {
      // Web: convert URI to Blob
      try {
        if (__DEV__) {
          console.log("[Storage] Reading file from URI (web):", file.uri);
        }
        const response = await fetch(file.uri);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch file: ${response.status} ${response.statusText}`
          );
        }
        blobData = await response.blob();
        fileSize = file.size || (blobData instanceof Blob ? blobData.size : 0);
        fileType =
          file.type ||
          response.headers.get("content-type") ||
          "application/octet-stream";
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("[Storage] Failed to read file:", error);
        throw new Error(
          `Failed to read file: ${errorMessage}. Please ensure the file exists and is accessible.`
        );
      }
    } else {
      // React Native: Read file from URI and convert to base64
      try {
        if (__DEV__) {
          console.log("[Storage] Reading file from URI (React Native):", {
            uri: file.uri,
            name: fileName,
            type: fileType,
            size: fileSize,
          });
        }
        base64Data = await readFileToBase64(file.uri);
        if (__DEV__) {
          console.log("[Storage] File read successfully:", {
            base64Length: base64Data.length,
            fileName,
            fileType,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("[Storage] Failed to read file from URI:", error);
        throw new Error(
          `Failed to read file from URI: ${errorMessage}. Please ensure the file exists and is accessible.`
        );
      }
    }
  }

  const metadata = {
    contentType: fileType,
    ...options?.metadata,
  };

  if (__DEV__) {
    console.log("[Storage] Uploading file:", {
      fileName,
      fileSize,
      fileType,
      storagePath,
      platform: Platform.OS,
      method:
        Platform.OS === "web"
          ? "Firebase Web SDK"
          : "Firebase Web SDK (REST API)",
    });
  }

  try {
    // Web: Use Firebase Web SDK with Blob/File
    if (Platform.OS === "web" && blobData) {
      if (__DEV__) {
        const dataType = blobData instanceof File ? "File" : "Blob";
        console.log("[Storage] Using Firebase Web SDK uploadBytes:", {
          dataType,
          platform: Platform.OS,
          size: blobData.size,
        });
      }

      const uploadTask = uploadBytes(storageRef, blobData, metadata);

      // Handle progress if callback provided
      if (options?.onProgress) {
        // Note: uploadBytes doesn't support progress tracking directly
        // For progress tracking, we would need to use uploadBytesResumable
        // For now, we'll just call the callback with 100% after upload
        uploadTask.then(() => {
          options.onProgress?.(100);
        });
      }

      const snapshot = await uploadTask;

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      if (__DEV__) {
        console.log("[Storage] ✅ File uploaded successfully:", {
          storagePath,
          downloadURL: downloadURL.substring(0, 100) + "...",
          fileSize,
        });
      }

      return {
        storagePath,
        downloadURL,
        metadata: {
          size: fileSize,
          contentType: fileType,
          fullPath: snapshot.ref?.fullPath || storagePath,
        },
      };
    } else if (Platform.OS !== "web" && base64Data) {
      // React Native: Try uploadString first, then fallback to REST API
      // Note: uploadString may not work in all React Native environments
      if (__DEV__) {
        console.log(
          "[Storage] Using Firebase Storage SDK uploadString (React Native):",
          {
            fileName,
            fileSize,
            fileType,
            base64Length: base64Data.length,
          }
        );
      }

      try {
        // Try uploadString with base64 format
        const uploadTask = uploadString(
          storageRef,
          base64Data,
          "base64" as StringFormat,
          metadata
        );

        // Wait for upload to complete
        await uploadTask;

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);

        if (options?.onProgress) {
          options.onProgress(100);
        }

        if (__DEV__) {
          console.log(
            "[Storage] ✅ File uploaded successfully via uploadString:",
            {
              storagePath,
              downloadURL: downloadURL.substring(0, 100) + "...",
              fileSize,
            }
          );
        }

        return {
          storagePath,
          downloadURL,
          metadata: {
            size: fileSize,
            contentType: fileType,
            fullPath: storageRef.fullPath,
          },
        };
      } catch (sdkError) {
        const errorMessage =
          sdkError instanceof Error ? sdkError.message : "Unknown error";
        if (__DEV__) {
          console.warn(
            "[Storage] uploadString failed, falling back to REST API:",
            errorMessage
          );
        }

        // Fallback to Cloud Function if SDK fails
        try {
          if (__DEV__) {
            console.log(
              "[Storage] uploadString failed, trying Cloud Function:",
              errorMessage
            );
          }

          // Use Cloud Function to upload file
          const functions = getFunctionsInstance();
          const functionsRegion =
            process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION || "us-central1";

          if (__DEV__) {
            console.log("[Storage] Calling Cloud Function uploadFile:", {
              region: functionsRegion,
              storagePath: storageRef.fullPath,
              contentType: fileType,
              base64Length: base64Data.length,
            });
          }

          const uploadFileFunction = httpsCallable(functions, "uploadFile");

          // Call Cloud Function with base64 data
          const result = await uploadFileFunction({
            base64: base64Data,
            storagePath: storageRef.fullPath,
            contentType: fileType,
            metadata: metadata,
          });

          if (__DEV__) {
            console.log("[Storage] Cloud Function response:", {
              hasData: !!result.data,
              dataKeys: result.data ? Object.keys(result.data) : [],
            });
          }

          const response = result.data as {
            success?: boolean;
            downloadURL?: string;
            storagePath?: string;
            error?: string;
          };

          // Handle both success and error responses
          if (response.error) {
            throw new Error(`Cloud Function error: ${response.error}`);
          }

          if (!response.success) {
            throw new Error(
              response.error || "Cloud Function upload failed: No success flag"
            );
          }

          // Cloud Function uploaded successfully
          // Now get download URL using Firebase Storage SDK (handles auth automatically)
          const downloadURL = await getDownloadURL(storageRef);

          if (options?.onProgress) {
            options.onProgress(100);
          }

          if (__DEV__) {
            console.log(
              "[Storage] ✅ File uploaded successfully via Cloud Function:",
              {
                storagePath: response.storagePath || storagePath,
                downloadURL: downloadURL.substring(0, 100) + "...",
                fileSize,
              }
            );
          }

          return {
            storagePath: response.storagePath || storagePath,
            downloadURL,
            metadata: {
              size: fileSize,
              contentType: fileType,
              fullPath: storageRef.fullPath,
            },
          };
        } catch (functionError) {
          // Handle Firebase Functions HttpsError
          const isHttpsError =
            functionError && typeof (functionError as any).code === "string";
          const errorCode = isHttpsError
            ? (functionError as any).code
            : undefined;
          const errorMessage = isHttpsError
            ? (functionError as any).message
            : functionError instanceof Error
            ? functionError.message
            : "Unknown error";

          // Log detailed error information
          if (__DEV__) {
            console.error("[Storage] Cloud Function error details:", {
              message: errorMessage,
              code: errorCode,
              error: functionError,
              details: (functionError as any)?.details,
              stack:
                functionError instanceof Error
                  ? functionError.stack
                  : undefined,
              isHttpsError,
            });

            if (errorCode === "not-found") {
              const functionsRegionCheck =
                process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION ||
                "us-central1";
              console.error(
                "[Storage] Cloud Function not found. Possible causes:",
                {
                  functionName: "uploadFile",
                  region: functionsRegionCheck,
                  suggestion:
                    "Verify function is deployed: firebase functions:list",
                }
              );
            }

            console.warn(
              "[Storage] Cloud Function failed, trying REST API:",
              errorMessage
            );
          }

          // Final fallback to REST API
          try {
            await uploadBase64ViaRESTAPI(
              storageRef,
              base64Data,
              metadata,
              options?.onProgress
            );

            const downloadURL = await getDownloadURL(storageRef);

            if (__DEV__) {
              console.log(
                "[Storage] ✅ File uploaded successfully via REST API (final fallback):",
                {
                  storagePath,
                  downloadURL: downloadURL.substring(0, 100) + "...",
                  fileSize,
                }
              );
            }

            return {
              storagePath,
              downloadURL,
              metadata: {
                size: fileSize,
                contentType: fileType,
                fullPath: storageRef.fullPath,
              },
            };
          } catch (restError) {
            // All methods failed
            throw new Error(
              `Upload failed with all methods (uploadString, Cloud Function, REST API): ${errorMessage}. Cloud Function error: ${errorMessage}. REST API error: ${
                restError instanceof Error ? restError.message : "Unknown error"
              }`
            );
          }
        }
      }
    } else {
      throw new Error(
        "Invalid file format. Web requires Blob/File, React Native requires file object with URI."
      );
    }
  } catch (error) {
    console.error("[Storage] Upload failed:", error);
    console.error("[Storage] Error details:", {
      code: (error as any)?.code,
      message: error instanceof Error ? error.message : "Unknown error",
      serverResponse: (error as any)?.serverResponse,
      storagePath,
      fileName,
      fileSize,
      fileType,
    });

    // Provide more helpful error messages
    if (error instanceof Error) {
      // Check for specific Firebase Storage errors
      if (error.message.includes("storage/unknown")) {
        throw new Error(
          `Firebase Storage error: An unknown error occurred. ` +
            `Please check: 1) Firebase Storage is enabled in your Firebase Console, ` +
            `2) Storage security rules allow uploads, ` +
            `3) User is authenticated. ` +
            `Original error: ${error.message}`
        );
      }
      if (error.message.includes("storage/unauthorized")) {
        throw new Error(
          `Firebase Storage error: User is not authorized to upload files. ` +
            `Please check Storage security rules. ` +
            `Original error: ${error.message}`
        );
      }
      if (error.message.includes("storage/quota-exceeded")) {
        throw new Error(
          `Firebase Storage error: Storage quota exceeded. ` +
            `Please check your Firebase Storage quota. ` +
            `Original error: ${error.message}`
        );
      }
      if (error.message.includes("storage/unauthenticated")) {
        throw new Error(
          `Firebase Storage error: User is not authenticated. ` +
            `Please log in and try again. ` +
            `Original error: ${error.message}`
        );
      }
    }

    throw error;
  }
}

/**
 * Get download URL for file
 */
export async function getFileUrl(storagePath: string): Promise<string> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, storagePath);
  return await getDownloadURL(storageRef);
}

/**
 * Delete file from Firebase Storage
 */
export async function deleteFileFromStorage(storagePath: string): Promise<void> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}

/**
 * Validate file size
 */
export function validateFileSize(fileSize: number, maxSize: number): {
  valid: boolean;
  error?: string;
} {
  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`,
    };
  }
  return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
  mimeType: string,
  allowedTypes: string[]
): {
  valid: boolean;
  error?: string;
} {
  if (allowedTypes.length === 0) {
    // No restrictions
    return { valid: true };
  }

  if (!allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `File type ${mimeType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

