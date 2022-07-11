import {Image, Pressable, ScrollView, StyleSheet, useColorScheme} from 'react-native';
import {Text, View} from "../components/Themed";
import {AntDesign, Entypo, FontAwesome, MaterialIcons, SimpleLineIcons} from '@expo/vector-icons';
import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextTicker from 'react-native-text-ticker'
import Slider from '@react-native-community/slider';
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import {
    currentPlaybackOption,
    currentAudioObject,
    currentAudioInstance,
    currentStatus,
    currentPlaylist
} from "../atoms/AudioFunctions";
import {useRecoilState, useRecoilValue} from "recoil";
import {playbackOptions} from "../utils/playbackOptions";
import {loadPlaybackInstance, onPlay} from "../utils/AudioPlayer";
import {_getMMSSFromMillis} from "../utils/millisecondFormater";


export default function AudioPlayerScreen() {
    const theme = 'dark' //useColorScheme()
    const navigation = useNavigation()

    const [currPlaybackOption, setCurrPlaybackOption] = useRecoilState(currentPlaybackOption)
    const [currAudioObject, setCurrAudioObject] = useRecoilState(currentAudioObject)
    const [currAudioInstance, setCurrAudioInstance] = useRecoilState(currentAudioInstance)
    const [currStatus, setCurrStatus] = useRecoilState(currentStatus)
    const currPlaylist = useRecoilValue(currentPlaylist)

    const [liked, setLiked] = useState(false)
    const [speed, setSpeed] = useState(1.0)
    const [desc, setDesc] = useState(false)
    const [isSeeking, setIsSeeking] = useState(null)

    const togglePlaybackIcon = plbck => {
        setCurrPlaybackOption(playbackOptions[plbck])
    }

    const togglePlaybackSpeed = async () => {
        if(currAudioInstance !== null) {
            try {
                if (speed !== 1.75) {
                    await currAudioInstance.setRateAsync((speed + 0.25) % 2)
                    await setSpeed((speed + 0.25) % 2)
                }
                else {
                    await currAudioInstance.setRateAsync(speed + 0.25)
                    await setSpeed(speed + 0.25)
                }
            }
            catch (e) {
                console.log('star ti telefon kume - ', e)
            }
        }
    }

    const toggleDesc = val => {
        setDesc(val)
    }

    const onPlayButton = async () => {
        if(currAudioInstance !== null) {
            try {
                await onPlay(currAudioInstance, currStatus)
            }
            catch (e){
                console.log(e)
            }
        }
        else if(currStatus.didJustFinish) {
            try {
                await loadPlaybackInstance(currAudioInstance, setCurrAudioInstance, sound, true, setCurrStatus)
            }
            catch (e){
                console.log(e)
            }
        }
    }

    const showPlaybackIcon = () => {
        if(currPlaybackOption === playbackOptions[0])
            return <MaterialIcons onPress={() => togglePlaybackIcon(1)} name="sync-alt" size={24} color={Colors[theme].tabIconDefault} />
        else if(currPlaybackOption === playbackOptions[2])
            return <MaterialIcons onPress={() => togglePlaybackIcon(0)} name="sync-disabled" size={24} color={Colors[theme].tabIconDefault} />
        else
            return <SimpleLineIcons onPress={() => togglePlaybackIcon(2)} name="loop" size={24} color={Colors[theme].tabIconDefault} />
    }

    const onSliderStart = val => {
        if(currAudioInstance !== null && !isSeeking) {
            currAudioInstance.pauseAsync()
        }
        setIsSeeking(val)
    }

    const getTimestamp = () => {
        if(currAudioInstance !== null && currStatus !== null) {
            if(isSeeking !== null)
                return `${_getMMSSFromMillis(isSeeking * currStatus.durationMillis)} / ${_getMMSSFromMillis(currStatus.durationMillis)}`
            return `${_getMMSSFromMillis(currStatus.positionMillis)} / ${_getMMSSFromMillis(currStatus.durationMillis)}`
        }
        return ''
    }

    const onSliderEnd = async val => {
        if(currAudioInstance !== null) {
            const newPosition = val * currStatus?.durationMillis
            await currAudioInstance.playFromPositionAsync(newPosition)
            await setIsSeeking(null)
        }
    }

    const onReplay = async () => {
        if(currAudioInstance !== null) {
            currAudioInstance.playFromPositionAsync(0)
        }
    }

    const fifteen = async sign => {
        if(currAudioInstance !== null && currStatus !== null) {
            if(sign && currStatus.durationMillis === currStatus.positionMillis)
                return
            if(!sign && currStatus.positionMillis === 0)
                return
            const newPosition = sign? currStatus.positionMillis + 15000 : currStatus.positionMillis - 15000
            if(currStatus.isPlaying)
                currAudioInstance.playFromPositionAsync(newPosition)
            else
                currAudioInstance.setPositionAsync(newPosition)
        }
    }

    const onForward = async () => {
        const currentIndex = currPlaylist.findIndex( e => e._id === currAudioObject._id)
        await setCurrAudioObject(currPlaylist[(currentIndex + 1) % currPlaylist.length])
        try {
            await loadPlaybackInstance(currAudioInstance, setCurrAudioInstance, currPlaylist[(currentIndex + 1) % currPlaylist.length], true, setCurrStatus)
        }
        catch (e){
            console.log(e)
        }
    }

    const onBackward = async () => {
        const currentIndex = currPlaylist.findIndex( e => e._id === currAudioObject._id)
        const newIndex = currentIndex === 0? currPlaylist.length - 1 : currentIndex - 1
        await setCurrAudioObject(currPlaylist[newIndex])
        try {
            await loadPlaybackInstance(currAudioInstance, setCurrAudioInstance, currPlaylist[newIndex], true, setCurrStatus)
        }
        catch (e){
            console.log(e)
        }
    }

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
                    {currAudioObject.title}
                </TextTicker>
            </View>
            <Pressable onPress={() => toggleDesc(true)} disabled={desc} style={styles.audioImage}>
                <Image source={{uri: currAudioObject.imageUrl}} style={{width: '90%', height: '100%'}} />
                {
                    desc &&
                    <ScrollView style={styles.scrollViewDesc} contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.desc}>{currAudioObject.description}</Text>
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
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    disabled={currStatus?.isBuffering}
                    value={currStatus? (isSeeking?? currStatus.positionMillis / currStatus.durationMillis) : 0}
                    onValueChange={(value) => onSliderStart(value)}
                    onSlidingComplete={(value) =>  onSliderEnd(value)}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: verticalScale(-10)}}>
                    <Text style={{color: Colors[theme].tabIconDefault, fontSize: 11}}>{currStatus?.isBuffering && 'loading...'}</Text>
                    {
                        currStatus?.didJustFinish?
                        <MaterialIcons onPress={onReplay} name="replay-circle-filled" size={24} color={Colors[theme].tabIconDefault} />
                        :
                        <Text style={{color: Colors[theme].tabIconDefault, fontSize: 11}}>{getTimestamp()}</Text>
                    }
                </View>
            </View>
            <View style={styles.footer}>
                <MaterialCommunityIcons onPress={() => fifteen(false)} name="rewind-15" size={24} color={Colors[theme].tabIconDefault} />
                <MaterialCommunityIcons onPress={onBackward} name="skip-previous" size={33} color={Colors[theme].primary} />
                <Pressable onPress={onPlayButton} style={[styles.buttonPlay, {backgroundColor: Colors[theme].primary}]}>
                    <Entypo name={currStatus?.isPlaying? "controller-paus":"controller-play"} size={30} color="black" />
                </Pressable>
                <MaterialCommunityIcons onPress={onForward} name="skip-next" size={33} color={Colors[theme].primary} />
                <MaterialCommunityIcons onPress={() => fifteen(true)} name="fast-forward-15" size={24} color={Colors[theme].tabIconDefault} />
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
