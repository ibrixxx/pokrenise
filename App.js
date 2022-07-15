import { StatusBar } from 'expo-status-bar';
import Navigation from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context/src/SafeAreaContext";
import useCachedResources from "./hooks/useCachedResources";
import ContextProvider from "./context/AppContext";
import {RecoilRoot, useRecoilState} from "recoil";
import {useEffect} from "react";
import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from "expo-av";
import Colors from "./constants/Colors";


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = 'dark' //useColorScheme()

  useEffect(() => {
      (async () => {
          await Audio.setAudioModeAsync({
              staysActiveInBackground: true,
              interruptionModeIOS: InterruptionModeIOS.DuckOthers,
              playsInSilentModeIOS: true,
              interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          }).catch(e => console.log(e))
      })()
  }, [])

  if (!isLoadingComplete)
    return null;
  else
    return (
      <SafeAreaProvider>
        <StatusBar style={"light"} backgroundColor={Colors[colorScheme].background}/>
        <RecoilRoot>
            <ContextProvider>
                <Navigation colorScheme={colorScheme}/>
            </ContextProvider>
        </RecoilRoot>
      </SafeAreaProvider>
    );
}
