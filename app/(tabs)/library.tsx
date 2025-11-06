import { ThemeView } from "@/components/theme-view";
import { useTheme } from "heroui-native";
import { Text } from "react-native";

export default function LibraryScreen() {
  const { colors } = useTheme();

  return (
    <ThemeView
      className="flex-1 items-center justify-center w-full p-4"
      useSafeArea={false}
    >
      <Text style={{ color: colors.foreground }} className="text-3xl font-bold">
        Library
      </Text>
      <Text style={{ color: colors.mutedForeground }} className="text-lg mt-4">
        Your music collection
      </Text>
    </ThemeView>
  );
}
