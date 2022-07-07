import {Image, Pressable, ScrollView, StyleSheet, useColorScheme} from 'react-native';
import {Text, View} from "../components/Themed";
import {AntDesign, Entypo, FontAwesome, MaterialIcons, SimpleLineIcons} from '@expo/vector-icons';
import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextTicker from 'react-native-text-ticker'
import Slider from '@react-native-community/slider';
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {currentPlaybackOption, currentAudioObject, currentAudioInstance, currentStatus} from "../atoms/AudioFunctions";
import {useRecoilState, useRecoilValue} from "recoil";
import {playbackOptions} from "../utils/playbackOptions";
import {onPlay} from "../utils/AudioPlayer";


export default function AudioPlayerScreen({route}) {
    const theme = useColorScheme()
    const navigation = useNavigation()
    const { soundItem } = route.params

    const [currPlaybackOption, setCurrPlaybackOption] = useRecoilState(currentPlaybackOption)
    const currAudioObject = useRecoilValue(currentAudioObject)
    const [currAudioInstance, setCurrAudioInstance] = useRecoilState(currentAudioInstance)
    const [currStatus, setCurrStatus] = useRecoilState(currentStatus)

    const [liked, setLiked] = useState(false)
    const [speed, setSpeed] = useState(1.0)
    const [desc, setDesc] = useState(false)

    const togglePlaybackIcon = plbck => {
        setCurrPlaybackOption(playbackOptions[plbck])
    }

    const togglePlaybackSpeed = () => {
        if(speed !== 1.75)
            setSpeed((speed + 0.25) % 2)
        else
            setSpeed(speed + 0.25)
    }

    const toggleDesc = val => {
        setDesc(val)
    }

    const onPlayButton = () => {
        onPlay(currAudioInstance, setCurrAudioInstance, currAudioObject, soundItem, currStatus, setCurrStatus)
    }


    const showPlaybackIcon = () => {
        if(currPlaybackOption === playbackOptions[0])
            return <MaterialIcons onPress={() => togglePlaybackIcon(1)} name="sync-alt" size={24} color={Colors[theme].tabIconDefault} />
        else if(currPlaybackOption === playbackOptions[2])
            return <MaterialIcons onPress={() => togglePlaybackIcon(0)} name="sync-disabled" size={24} color={Colors[theme].tabIconDefault} />
        else
            return <SimpleLineIcons onPress={() => togglePlaybackIcon(2)} name="loop" size={24} color={Colors[theme].tabIconDefault} />

    }

    // useEffect(()=>{
    //     return sound ? () => {
    //             sound.unloadAsync(); }
    //         : undefined;
    // },[sound])

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <AntDesign name="down" onPress={() => navigation.goBack()} size={24} color={Colors[theme].tabIconDefault} />
                <View style={{flexDirection: 'row'}}>
                    <AntDesign name="download" size={24} style={{paddingRight: scale(10)}} color={Colors[theme].primary} />
                    <AntDesign name="sharealt" size={24} style={{paddingLeft: scale(10)}} color={Colors[theme].primary} />
                </View>
            </View>
            <View style={{flex: 0.5, width: '90%', alignItems: 'center'}}>
                <TextTicker
                    style={{ fontSize: 27, color: 'white', fontWeight: 'bold'}}
                    useNativeDriver={true}
                    loop
                    repeatSpacer={50}
                    marqueeDelay={1000}
                    scrollSpeed={14}
                >
                    {soundItem.title}
                </TextTicker>
            </View>
            <Pressable onPress={() => toggleDesc(true)} disabled={desc} style={styles.audioImage}>
                <Image source={{uri: soundItem.imageUrl}} style={{width: '90%', height: '100%'}} />
                {
                    desc &&
                    <ScrollView style={styles.scrollViewDesc} contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.desc}>{soundItem.description}</Text>
                    </ScrollView>
                }
                {
                    desc && <AntDesign onPress={() => toggleDesc(false)} name="closesquareo" size={19} color="white" style={{position: 'absolute', right: scale(20), bottom: verticalScale(5), opacity: 0.75}} />
                }
            </Pressable>
            <View style={styles.footer}>
                <Pressable onPress={togglePlaybackSpeed} style={{paddingTop: verticalScale(4), alignItems: 'center', width: scale(30)}}>
                    <MaterialCommunityIcons name="play-speed" size={24} color={Colors[theme].tabIconDefault} />
                    <Text style={{color: Colors[theme].tabIconDefault, fontSize: 11}}>{speed.toString()}x</Text>
                </Pressable>
                <AntDesign onPress={() => setLiked(!liked)} name={liked? "heart":"hearto"} size={24} color={liked? Colors[theme].primary:Colors[theme].tabIconDefault} />
                {
                    showPlaybackIcon()
                }
            </View>
            <View style={{flex: 0.5, width: '90%'}}>
                <Slider
                    style={{width: '100%', height: verticalScale(40)}}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                />
            </View>
            <View style={styles.footer}>
                <MaterialCommunityIcons name="rewind-15" size={24} color={Colors[theme].tabIconDefault} />
                <MaterialCommunityIcons name="skip-previous" size={33} color={Colors[theme].primary} />
                <Pressable onPress={onPlayButton} style={[styles.buttonPlay, {backgroundColor: Colors[theme].primary}]}>
                    <Entypo name={currStatus?.isPlaying? "controller-paus":"controller-play"} size={30} color="black" />
                </Pressable>
                <MaterialCommunityIcons name="skip-next" size={33} color={Colors[theme].primary} />
                <MaterialCommunityIcons name="fast-forward-15" size={24} color={Colors[theme].tabIconDefault} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    audioImage: {
        width: '100%',
        height: '42%',
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonPlay: {
        width: scale(55),
        height: scale(55),
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
    },
    header: {
        flexDirection: "row",
        alignContent: 'space-between',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: scale(40),
        flex: 1
    },
    footer: {
        flexDirection: "row",
        alignContent: 'space-between',
        flex: 1,
        margin: scale(10),
        justifyContent: 'space-between',
        width: '80%',
        alignItems: 'center',
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
    scrollViewDesc: {
        position: 'absolute',
        backgroundColor: 'black',
        width: '90%',
        height: '100%',
        opacity: 0.75
    },
    scrollViewContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        padding: scale(30),
        opacity: 1
    },
    desc: {
        fontStyle: 'italic', fontSize: 14, opacity: 1
    }
});
