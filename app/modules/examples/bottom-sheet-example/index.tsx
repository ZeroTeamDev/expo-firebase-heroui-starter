/**
 * BottomSheet Example Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Rewritten to align with the new BottomSheet component structure.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "heroui-native";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetWithSteps,
  type BottomSheetStep,
} from "@/components/layout";
import { LiquidGlassButton } from "@/components/glass";
import {
  Heart,
  Star,
  Send as SendIcon,
  Bug,
  MessageSquare,
  Lightbulb,
  Send,
  Repeat,
  Activity,
  Coins,
  Image as ImageIcon,
  MoreHorizontal,
  Check,
} from "lucide-react-native";

// --- Mock Data & Constants ---
const MAIN_MENU_ITEMS = [
  {
    id: "bug",
    icon: Bug,
    title: "Report Bug",
    description: "Let us know about a specific issue you're experiencing.",
    targetStep: "reportBug",
  },
  {
    id: "feedback",
    icon: MessageSquare,
    title: "Share Feedback",
    description: "Let us know how to improve by providing some feedback.",
    targetStep: "chooseAreas",
  },
  {
    id: "other",
    icon: Lightbulb,
    title: "Something Else",
    description: "Request features, leave a nice comment, or anything else.",
    targetStep: null,
  },
];

const AREA_ITEMS = [
  { id: "send", icon: Send, label: "Send" },
  { id: "swaps", icon: Repeat, label: "Swaps" },
  { id: "activity", icon: Activity, label: "Activity" },
  { id: "tokens", icon: Coins, label: "Tokens" },
  { id: "collectibles", icon: ImageIcon, label: "Collectibles" },
  { id: "other", icon: MoreHorizontal, label: "Other" },
];

export default function BottomSheetExampleScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  const [simpleSheetVisible, setSimpleSheetVisible] = useState(false);
  const [multiStepSheetVisible, setMultiStepSheetVisible] = useState(false);
  const [currentStepId, setCurrentStepId] = useState("menu");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [bugSubject, setBugSubject] = useState("");

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const steps: BottomSheetStep[] = [
    {
      id: "menu",
      component: (
        <>
          <BottomSheetHeader
            title="How can we help?"
            onClose={() => setMultiStepSheetVisible(false)}
          />
          <View style={styles.menuList}>
            {MAIN_MENU_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  item.targetStep && setCurrentStepId(item.targetStep)
                }
                style={styles.menuItem}
              >
                <View style={styles.menuIconContainer}>
                  <item.icon size={24} color={isDark ? "#FFF" : "#1f2937"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.menuItemTitle,
                      { color: isDark ? "#FFF" : "#1f2937" },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.menuItemDescription,
                      { color: isDark ? "#a1a1aa" : "#6b7280" },
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </>
      ),
    },
    {
      id: "chooseAreas",
      component: (
        <>
          <BottomSheetHeader
            title="Choose Areas"
            onClose={() => setMultiStepSheetVisible(false)}
            onBack={() => setCurrentStepId("menu")}
            showBackButton
          />
          <View style={styles.areaList}>
            {AREA_ITEMS.map((item) => {
              const isSelected = selectedAreas.includes(item.id);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => toggleArea(item.id)}
                  style={[
                    styles.areaItem,
                    isSelected && styles.areaItemSelected,
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <item.icon
                      size={24}
                      color={
                        isSelected ? "#4f46e5" : isDark ? "#a1a1aa" : "#6b7280"
                      }
                    />
                    <Text
                      style={[
                        styles.areaLabel,
                        { color: isDark ? "#FFF" : "#1f2937", marginLeft: 16 },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && <Check size={16} color="#FFF" />}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            disabled={selectedAreas.length === 0}
            style={[
              styles.continueButton,
              selectedAreas.length === 0 && {
                backgroundColor: "rgba(255,255,255,0.2)",
                opacity: 0.7,
              },
            ]}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </>
      ),
    },
    {
      id: "reportBug",
      component: (
        <>
          <BottomSheetHeader
            title="Report a Bug"
            onClose={() => setMultiStepSheetVisible(false)}
            onBack={() => setCurrentStepId("menu")}
            showBackButton
          />
          <View>
            <Text
              style={[
                styles.inputLabel,
                { color: isDark ? "#FFF" : "#1f2937" },
              ]}
            >
              Subject
            </Text>
            <TextInput
              placeholder="Brief summary of the issue"
              value={bugSubject}
              onChangeText={setBugSubject}
              placeholderTextColor={isDark ? "#a1a1aa" : "#9ca3af"}
              style={[styles.input, { color: isDark ? "#FFF" : "#1f2937" }]}
            />
          </View>
          <View style={{ marginTop: 16 }}>
            <Text
              style={[
                styles.inputLabel,
                { color: isDark ? "#FFF" : "#1f2937" },
              ]}
            >
              Description
            </Text>
            <TextInput
              placeholder="Describe the issue in more detail"
              multiline
              rows={4}
              placeholderTextColor={isDark ? "#a1a1aa" : "#9ca3af"}
              style={[
                styles.input,
                {
                  height: 120,
                  textAlignVertical: "top",
                  color: isDark ? "#FFF" : "#1f2937",
                },
              ]}
            />
          </View>
          <Pressable
            disabled={bugSubject.length === 0}
            style={[
              styles.continueButton,
              bugSubject.length === 0 && {
                backgroundColor: "rgba(255,255,255,0.2)",
                opacity: 0.7,
              },
            ]}
          >
            <Text style={styles.continueButtonText}>Submit</Text>
          </Pressable>
        </>
      ),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="BottomSheet Examples" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Simple Bottom Sheet
          </Text>
          <Pressable
            onPress={() => setSimpleSheetVisible(true)}
            style={[
              styles.button,
              { backgroundColor: isDark ? "#6366f1" : "#4f46e5" },
            ]}
          >
            <Text style={styles.buttonText}>Open Simple Sheet</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Multi-Step Bottom Sheet
          </Text>
          <Pressable
            onPress={() => {
              setCurrentStepId("menu");
              setMultiStepSheetVisible(true);
            }}
            style={[
              styles.button,
              { backgroundColor: isDark ? "#6366f1" : "#4f46e5" },
            ]}
          >
            <Text style={styles.buttonText}>Open Multi-Step Sheet</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Liquid Glass Buttons
          </Text>
          <View style={styles.buttonExampleWrapper}>
            <LinearGradient
              colors={
                isDark
                  ? [
                      "rgba(99, 102, 241, 0.4)",
                      "rgba(139, 92, 246, 0.4)",
                      "rgba(236, 72, 153, 0.4)",
                    ]
                  : [
                      "rgba(99, 102, 241, 0.3)",
                      "rgba(139, 92, 246, 0.3)",
                      "rgba(236, 72, 153, 0.3)",
                    ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonExampleContainer}
            >
              <View style={{ marginRight: 12, marginBottom: 12 }}>
                <LiquidGlassButton
                  variant="default"
                  label="Default"
                  icon={Star}
                />
              </View>
              <View style={{ marginRight: 12, marginBottom: 12 }}>
                <LiquidGlassButton variant="icon" icon={Heart} />
              </View>
              <View style={{ marginRight: 12, marginBottom: 12 }}>
                <LiquidGlassButton
                  variant="filled"
                  label="Filled"
                  icon={SendIcon}
                />
              </View>
              <View style={{ marginRight: 12, marginBottom: 12 }}>
                <LiquidGlassButton
                  variant="default"
                  label="Disabled"
                  icon={Star}
                  disabled
                />
              </View>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>

      {/* Simple Bottom Sheet */}
      <BottomSheet
        isVisible={simpleSheetVisible}
        onClose={() => setSimpleSheetVisible(false)}
      >
        <BottomSheetHeader
          title="Simple Bottom Sheet"
          onClose={() => setSimpleSheetVisible(false)}
        />
        <Text
          style={[styles.simpleText, { color: isDark ? "#FFF" : "#1f2937" }]}
        >
          This is a simple bottom sheet example. You can add any content here.
        </Text>
        <Text
          style={[
            styles.simpleText,
            { color: isDark ? "#a1a1aa" : "#6b7280", marginTop: 12 },
          ]}
        >
          Swipe down or tap the backdrop to close.
        </Text>
        {/* Add more content here to test scrolling */}
        {[...Array(15)].map((_, i) => (
          <Text
            key={i}
            style={[
              styles.simpleText,
              { color: isDark ? "#FFF" : "#1f2937", marginTop: 16 },
            ]}
          >
            Scrollable content item #{i + 1}.
          </Text>
        ))}
      </BottomSheet>

      {/* Multi-Step Bottom Sheet */}
      <BottomSheetWithSteps
        isVisible={multiStepSheetVisible}
        onClose={() => setMultiStepSheetVisible(false)}
        steps={steps}
        currentStepId={currentStepId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  button: { padding: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  simpleText: { fontSize: 16, lineHeight: 24 },
  menuList: { gap: 12 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  menuIconContainer: {
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 12,
    borderRadius: 99,
    marginRight: 16,
  },
  menuItemTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  menuItemDescription: { fontSize: 14 },
  areaList: { gap: 8, marginBottom: 24 },
  areaItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.2)",
  },
  areaItemSelected: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderColor: "rgba(255,255,255,0.6)",
  },
  areaLabel: { fontSize: 16, fontWeight: "500" },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  checkboxSelected: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  continueButton: {
    width: "100%",
    padding: 16,
    borderRadius: 99,
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#4f46e5",
  },
  continueButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    fontSize: 16,
  },
  buttonExampleWrapper: {
    marginTop: 12,
    borderRadius: 24,
    overflow: "hidden",
  },
  buttonExampleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
