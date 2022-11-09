import {Dimensions, Image, ScrollView, StyleSheet} from 'react-native';
import {Text, View} from "../components/Themed";
import { Pedometer } from 'expo-sensors';
import {useCallback, useEffect, useState} from "react";
const { width } = Dimensions.get("screen");
import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";


export default function CommunityScreen() {
    const theme = 'dark'

    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking')
    const [pasteStepsCount, setPasteStepsCount] = useState(0)
    const [currentStepsCount, setCurrentStepsCount] = useState(0)


    useEffect(
        useCallback(() => {
            (async () => {
                const permission = await Pedometer.getPermissionsAsync().catch(e => console.log(e))
                if(!permission.granted)
                    Pedometer.requestPermissionsAsync().catch(e => console.log(e))
                Pedometer.isAvailableAsync().then(res => {
                    setIsPedometerAvailable(String(res))
                }).catch(e => console.log('error', e))
                Pedometer.watchStepCount(res => {
                    setCurrentStepsCount(res.steps)
                    console.log('res ', res)
                })
            }) ()
            // return unsubscribe
        }, [isPedometerAvailable])
    )

    return (
        <View style={[styles.container, {backgroundColor: Colors[theme].background}]}>
            <Text style={{color: 'white'}}>{currentStepsCount}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image1: {
        height: 400,
        width: '100%',
        position: 'absolute',
        zIndex: 99,
    },
    backgroundImage: {
       width: width,
       height: verticalScale(169),
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
