/**
 * Firebase Cloud Functions
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Upload file to Firebase Storage from base64 string
 * This function is called from React Native client to upload files
 * 
 * Request body:
 * {
 *   base64: string, // Base64 encoded file data
 *   storagePath: string, // Storage path (e.g., "users/userId/personal/file.pdf")
 *   contentType: string, // MIME type (e.g., "application/pdf")
 *   metadata?: object // Optional metadata
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   downloadURL?: string,
 *   storagePath?: string,
 *   error?: string
 * }
 */
export const uploadFile = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to upload files"
    );
  }

  const { base64, storagePath, contentType, metadata } = data;

  // Validate required fields
  if (!base64 || !storagePath || !contentType) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: base64, storagePath, or contentType"
    );
  }

  try {
    // Get storage bucket
    const bucket = admin.storage().bucket();
    
    // Create file reference
    const file = bucket.file(storagePath);

    // Convert base64 to buffer
    const buffer = Buffer.from(base64, "base64");

    // Upload file to storage
    await file.save(buffer, {
      metadata: {
        contentType,
        metadata: metadata || {},
        // Add custom metadata
        customMetadata: {
          uploadedBy: context.auth.uid,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Upload successful - return storagePath
    // Client will use getDownloadURL() from Firebase Storage SDK to get download URL
    // This avoids IAM permission issues with signed URLs
    // The SDK automatically handles authentication and generates the correct URL
    
    return {
      success: true,
      storagePath,
      // Don't return downloadURL here - client will get it using getDownloadURL()
      // This avoids IAM permission issues
    };
  } catch (error: any) {
    console.error("[uploadFile] Error uploading file:", error);
    throw new functions.https.HttpsError(
      "internal",
      `Failed to upload file: ${error.message}`
    );
  }
});

