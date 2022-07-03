import { StatusBar } from 'expo-status-bar';
import Navigation from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context/src/SafeAreaContext";
import useCachedResources from "./hooks/useCachedResources";
import {useColorScheme} from "react-native";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme()


  if (!isLoadingComplete)
    return null;
  else
    return (
      <SafeAreaProvider>
        <StatusBar />
        <Navigation colorScheme={colorScheme}/>
      </SafeAreaProvider>
    );
}
