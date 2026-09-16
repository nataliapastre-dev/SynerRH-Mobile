import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#F6F9FE",
          },
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen name="colaboradores" />

        <Stack.Screen name="colaborador/[id]" />
      </Stack>
    </>
  );
}