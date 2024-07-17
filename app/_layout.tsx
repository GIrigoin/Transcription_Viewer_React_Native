import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function RootLayout() {
  const theme = useTheme();
  return (
    // <PaperProvider>
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Transcription Viewer",
          headerStyle: { backgroundColor: theme.colors.secondary },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
    // </PaperProvider>
  );
}
