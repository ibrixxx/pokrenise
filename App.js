import { StatusBar } from 'expo-status-bar';
import Navigation from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context/src/SafeAreaContext";
import useCachedResources from "./hooks/useCachedResources";
import {useColorScheme} from "react-native";
import ContextProvider from "./context/AppContext";
import {RecoilRoot} from "recoil";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme()


  if (!isLoadingComplete)
    return null;
  else
    return (
      <SafeAreaProvider>
        <StatusBar />
        <RecoilRoot>
            <ContextProvider>
                <Navigation colorScheme={colorScheme}/>
            </ContextProvider>
        </RecoilRoot>
      </SafeAreaProvider>
    );
}
