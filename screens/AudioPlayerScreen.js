import {Image, Share, Pressable, ScrollView, StyleSheet} from 'react-native';
import {Text, View} from "../components/Themed";
import {AntDesign, Entypo, FontAwesome5, MaterialIcons, SimpleLineIcons} from '@expo/vector-icons';
import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextTicker from 'react-native-text-ticker'
import Slider from '@react-native-community/slider';
import {useNavigation} from "@react-navigation/native";
import {useEffect, useRef, useState} from "react";
import * as FileSystem from 'expo-file-system';
import {
    currentPlaybackOption,
    currentAudioObject,
    currentAudioInstance,
    currentStatus,
    currentPlaylist, downloadedAudios
} from "../atoms/AudioFunctions";
import {useRecoilState, useRecoilValue} from "recoil";
import {playbackOptions} from "../utils/playbackOptions";
import {_getMMSSFromMillis} from "../utils/millisecondFormater";
import {Audio} from "expo-av";
import LottieView from 'lottie-react-native';


export default function AudioPlayerScreen({route}) {
    const theme = 'dark' //useColorScheme()
    const navigation = useNavigation()
    const { pressedSound } = route.params
    const animation = useRef(null);

    const [currPlaybackOption, setCurrPlaybackOption] = useRecoilState(currentPlaybackOption)
    const [currAudioObject, setCurrAudioObject] = useRecoilState(currentAudioObject)
    const [currAudioInstance, setCurrAudioInstance] = useRecoilState(currentAudioInstance)
    const [currStatus, setCurrStatus] = useRecoilState(currentStatus)
    const currPlaylist = useRecoilValue(currentPlaylist)
    const downloaded = useRecoilValue(downloadedAudios)

    const [liked, setLiked] = useState(false)
    const [speed, setSpeed] = useState(1.0)
    const [desc, setDesc] = useState(false)
    const [isSeeking, setIsSeeking] = useState(null)
    const [downloading, setDownloading] = useState({animation: false, failed: false})


    useEffect(() => {
        (async () => {
            if(pressedSound?.audioUrl === currPlaylist[currAudioObject]?.audioUrl) {
                try {
                    await loadPlaybackInstance(true, currAudioObject)
                }
                catch (e) {
                    console.log(e)
                }
            }
        })()
    }, [currAudioObject, currPlaylist])

    const onPlaybackStatusUpdate = async (status) => {
        if(status.isLoaded) {
            setCurrStatus(status)
            // if(status.didJustFinish && !status.isLooping) {
                // try {
                //     if(currPlaybackOption === playbackOptions[0]) {
                //         await setCurrAudioObject((currAudioObject + 1) % currPlaylist.length)
                //         await playNextOnFinish((currAudioObject + 1) % currPlaylist.length)
                //     }
                // }
                // catch (e) {
                //     console.log(e)
                // }
            // }
        }
        else
            if(status.error) {
                console.log('FATAL ERROR ' + status.error)
            }
    }

    const loadPlaybackInstance = async (shouldPlay, index) => {
        if(currAudioInstance !== null) {
            await currAudioInstance.unloadAsync()
            await setCurrAudioInstance(null)
        }
        const initalStatus = {
            shouldPlay: shouldPlay,
            rate: 1.0,
            volume: 1.0,
            isMuted: false,
            isLooping: currPlaybackOption === playbackOptions[1],
            shouldCorrectPitch: true
        }
        const {sound, status} = await Audio.Sound.createAsync(
            {uri: currPlaylist[currAudioObject]?.audioUrl},
            initalStatus,
            onPlaybackStatusUpdate
        )
        await setCurrAudioInstance(sound)
    }

    const onPlay = async () => {
        if(currAudioInstance !== null) {
            if(currStatus.isPlaying)
                currAudioInstance.pauseAsync()
            else
                currAudioInstance.playAsync()
        }
    }

    const playNextOnFinish = async (index) => {
        try {
            await loadPlaybackInstance(true, index)
        }
        catch (e){
            console.log(e)
        }
    }

    const togglePlaybackIcon = async plbck => {
        setCurrPlaybackOption(playbackOptions[plbck])
        if(currAudioInstance !== null) {
            try {
                await currAudioInstance.setIsLoopingAsync(playbackOptions[plbck] === playbackOptions[1])
            }
            catch (e) {
                console.log(e)
            }
        }
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
    }

    const showPlaybackIcon = () => {
        if(currPlaybackOption === playbackOptions[0])
            return <MaterialIcons style={{width: scale(30)}} onPress={() => togglePlaybackIcon(1)} name="sync-alt" size={24} color={Colors[theme].tabIconDefault} />
        else if(currPlaybackOption === playbackOptions[2])
            return <MaterialIcons style={{width: scale(30)}} onPress={() => togglePlaybackIcon(0)} name="sync-disabled" size={24} color={Colors[theme].tabIconDefault} />
        else
            return <SimpleLineIcons style={{width: scale(30)}} onPress={() => togglePlaybackIcon(2)} name="loop" size={24} color={Colors[theme].tabIconDefault} />
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
        try {
            await playNextOnFinish()
        }
        catch (e) {
            console.log(e)
        }
    }

    const onBackward = async () => {
        const newIndex = currAudioObject === 0? currPlaylist.length - 1 : currAudioObject - 1
        await setCurrAudioObject(newIndex)
        try {
            await loadPlaybackInstance(true, newIndex)
        }
        catch (e){
            console.log(e)
        }
    }

    const onShare = async () => {
        const url = currPlaylist[currAudioObject].audioUrl;
        const title = currPlaylist[currAudioObject].title;
        const message = currPlaylist[currAudioObject].description;

        try {
            const result = await Share.share({
                message: `${title} ⬇🎧⬇ ${url}`,
            });
        } catch (error) {
            alert(error.message);
        }
    }

    const onDownload = async () => {
        await setDownloading({animation: true, failed: false})
        FileSystem.downloadAsync(
            currPlaylist[currAudioObject].audioUrl,
            FileSystem.documentDirectory + `${currPlaylist[currAudioObject].title}.mp3`
        )
            .then(({ uri }) => {
                console.log('Finished downloading to ', uri);
            })
            .catch(error => {
                console.error(error);
                setDownloading({animation: false, failed: true})
            });
    }

    const isDownloaded = () => {
        const downloadedArr = Object.keys(downloaded)
        return downloadedArr.includes(currPlaylist[currAudioObject].title+'.mp3')
    }

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <AntDesign name="down" onPress={() => navigation.goBack()} size={24} color={Colors[theme].tabIconDefault} />
                <View style={{flexDirection: 'row'}}>
                    {(downloading.animation && !downloading.failed)?
                        <LottieView
                            autoPlay={true}
                            ref={animation}
                            loop={false}
                            style={{
                                width: scale(50),
                                height: verticalScale(45),
                                margin: scale(-6)
                            }}
                            onAnimationFinish={() => {
                                setDownloading(prevState => ({animation: false, failed: prevState.failed}))
                            }}
                            source={require('../assets/gif/download.json')}
                        />
                        :
                        isDownloaded()?
                            <FontAwesome5 name="check-circle" size={24} color={Colors[theme].primary} style={{paddingHorizontal: scale(10)}}/>
                            :
                            <AntDesign onPress={onDownload} name="download" size={24} style={{paddingHorizontal: scale(10)}} color={Colors[theme].primary}/>
                    }

                    <AntDesign onPress={onShare} name="sharealt" size={24} style={{paddingHorizontal: scale(10)}} color={Colors[theme].primary} />
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
                    {currPlaylist[currAudioObject]?.title}
                </TextTicker>
            </View>
            <Pressable onPress={() => toggleDesc(true)} disabled={desc} style={styles.audioImage}>
                <Image source={{uri: currPlaylist[currAudioObject]?.imageUrl}} style={{width: '90%', height: '100%'}} />
                {
                    desc &&
                    <ScrollView style={styles.scrollViewDesc} contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.desc}>{currPlaylist[currAudioObject]?.description}</Text>
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
