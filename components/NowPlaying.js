import React from "react";
import {Image, Pressable, StyleSheet, TouchableOpacity} from "react-native";
import {Text, View} from "./Themed";
import { scale } from 'react-native-size-matters'
import Colors from "../constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import {AntDesign, Entypo} from "@expo/vector-icons";
import {useRecoilState, useRecoilValue} from "recoil";
import {currentAudioInstance, currentStatus} from "../atoms/AudioFunctions";
import {useNavigation} from "@react-navigation/native";

const NowPlaying = () => {
    const theme = 'dark'

    const [currAudioInstance, setCurrAudioInstance] = useRecoilState(currentAudioInstance)
    const currStatus = useRecoilValue(currentStatus)
    const navigation = useNavigation()

    const onPress = () => {
        navigation.navigate('AudioPlayer', {pressedSound: null, fromDownloaded: false})
    }

    const onPlay = async () => {
        if(currAudioInstance !== null) {
            if(currStatus.isPlaying)
                currAudioInstance.pauseAsync()
            else
                currAudioInstance.playAsync()
        }
    }

    const onToggle = async () => {
        if(currAudioInstance !== null) {
            try {
                await onPlay(currAudioInstance, currStatus)
            }
            catch (e){
                console.log(e)
            }
        }
    }

    const onClose = async () => {
        try {
            await currAudioInstance.stopAsync()
            setCurrAudioInstance(null)
        }
        catch (e){
            console.log(e)
        }
    }

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Image source={require('../assets/images/rio-bg.jpeg')} style={{width: scale(55), height: '100%'}} resizeMode={'cover'} />
            <Text>Naslov</Text>
            <View style={styles.container}>
                <TouchableOpacity style={{marginRight: scale(10)}} onPress={onToggle}>
                    <Entypo name={currStatus?.isPlaying? "controller-paus":"controller-play"} size={30} color={Colors[theme].primary} />
                </TouchableOpacity>
                <AntDesign name="close" size={24} color="gray" onPress={onClose} />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        height: '8%',
        backgroundColor: '#3d3604',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: scale(20),
        borderTopLeftRadius: scale(14),
        borderTopRightRadius: scale(14),
        elevation: 10,
        shadowColor: 'white',
        borderColor: 'olive',
        borderTopWidth: 0.5,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#3d3604'
    }
});


export default NowPlaying
