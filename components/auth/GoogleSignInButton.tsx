/**
 * Google Sign-In Button Component
 * Created by Kien AI (leejungkiin@gmail.com)
 * 
 * Only renders if Google OAuth is properly configured
 */

import { signInWithGoogleIdToken } from "@/integrations/firebase.client";
import { useAuthStore } from "@/stores/authStore";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import { useTheme } from "heroui-native";
import { useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import useAlert from "@/hooks/use-alert";

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
}

export function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps) {
  const { colors } = useTheme();
  const { showAlert, haptic } = useAlert();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Always call hook unconditionally (React requirement)
  // This component should only be rendered when Google OAuth is configured
  // If client IDs are missing, the hook will throw - handle at parent level
  const [googleRequest, googleResponse, promptGoogle] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (googleResponse?.type === "success") {
        try {
          setIsLoading(true);
          const idToken = googleResponse.authentication?.idToken || (googleResponse.params as any)?.id_token;
          if (!idToken) {
            throw new Error("Google sign-in did not return an idToken");
          }
          const user = await signInWithGoogleIdToken(idToken);
          setUser(user);
          await showAlert("success", "Success!", "Signed in with Google.", "success");
          router.replace("/(tabs)");
          onSuccess?.();
        } catch (e: any) {
          await showAlert("error", "Google Sign-In Failed", e?.message || "Unexpected error.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    };
    handleGoogleResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleResponse]);

  // Don't render if request is not available
  if (!googleRequest) {
    return null;
  }

  return (
    <>
      {/* Or divider */}
      <View className="my-6 items-center">
        <Text style={{ color: colors.foreground, opacity: 0.6 }}>Or continue with</Text>
      </View>

      {/* Google Sign-In Button */}
      <Pressable
        onPress={async () => {
          await haptic.light();
          if (!googleRequest) return;
          try {
            await promptGoogle();
          } catch (error: any) {
            await showAlert("error", "Google Sign-In Error", error?.message || "Failed to start Google sign-in.", "error");
          }
        }}
        className="mt-2 w-full py-4 rounded-md items-center justify-center"
        style={{ backgroundColor: colors.default, borderWidth: 1, borderColor: colors.border }}
        disabled={isLoading || !googleRequest}
      >
        <Text style={{ color: colors.foreground }}>{isLoading ? "Please wait..." : "Continue with Google"}</Text>
      </Pressable>
    </>
  );
}

