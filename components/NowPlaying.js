import React from "react";
import {Image, Pressable, StyleSheet, TouchableOpacity} from "react-native";
import {View} from "./Themed";
import { scale } from 'react-native-size-matters'
import Colors from "../constants/Colors";
import {AntDesign, Entypo} from "@expo/vector-icons";
import {useRecoilState, useRecoilValue} from "recoil";
import {currentAudioInstance, currentAudioObject, currentPlaylist, currentStatus} from "../atoms/AudioFunctions";
import {useNavigation} from "@react-navigation/native";
import TextTicker from "react-native-text-ticker";

const NowPlaying = () => {
    const theme = 'dark'

    const [currAudioInstance, setCurrAudioInstance] = useRecoilState(currentAudioInstance)
    const currStatus = useRecoilValue(currentStatus)
    const currAudioObject = useRecoilValue(currentAudioObject)
    const currPlaylist = useRecoilValue(currentPlaylist)
    const navigation = useNavigation()

    const onPress = () => {
        if(currPlaylist[currAudioObject].imageUrl)
            navigation.navigate('AudioPlayer', {pressedSound: null, fromDownloaded: false})
        else
            navigation.navigate('AudioPlayer', {pressedSound: null, fromDownloaded: true})
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

    const getImageSource = () => {
        return currPlaylist[currAudioObject]?.imageUrl?  {uri: currPlaylist[currAudioObject]?.imageUrl} : require('../assets/images/motiv.png')
    }

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <Image source={getImageSource()} style={{width: scale(55), height: '100%'}} resizeMode={'cover'} />
            <View style={{width: scale(175), alignItems: 'center', backgroundColor: '#3d3604'}}>
                <TextTicker
                    style={{ fontSize: 14, color: 'white', fontWeight: 'bold'}}
                    useNativeDriver={true}
                    repeatSpacer={50}
                    marqueeDelay={2000}
                    scrollSpeed={24}
                >
                    {currPlaylist[currAudioObject]?.title?? currPlaylist[currAudioObject]}
                </TextTicker>
            </View>
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
