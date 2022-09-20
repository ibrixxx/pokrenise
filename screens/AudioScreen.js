import React, {useRef} from 'react';
import {
    FlatList, Image, Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet, TouchableOpacity, useWindowDimensions
} from 'react-native';
import { Text, View, Title } from '../components/Themed';
import {useEffect, useState} from "react";
import useAxios from "axios-hooks";
import {getAudio} from "../constants/API";
import AudioCard from "../components/AudioCard";
import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import {useRecoilState, useRecoilValue} from "recoil";
import {
    currentAudioInstance,
    currentAudioObject,
    currentPlaylist, currentStatus, downloadedAudios,
} from "../atoms/AudioFunctions";
import {AntDesign, Entypo, Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import {fetchDownloaded} from "../utils/fileSystem";
import { Modalize } from 'react-native-modalize';
import NowPlaying from "../components/NowPlaying";
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    withTiming,
    Extrapolate, interpolateColor
} from "react-native-reanimated";


const PAGE_WIDTH = 60;
const PAGE_HEIGHT = 40;
const DATA = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];


export default function AudioScreen({ navigation }) {
    const theme = 'dark'
    const [{ data, loading, error }, refetch] = useAxios(getAudio)
    const { width, height } = useWindowDimensions();
    const carouselRef = useRef(null)
    const modalizeRef = useRef(null)

    const [audio, setAudio] = useState({
        music: [],
        motivation: [],
        podcasts: []
    })
    const [refreshing, setRefreshing] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const r = React.useRef(null);

    const [currAudioObject, setCurrAudioObject] = useRecoilState(currentAudioObject)
    const currAudioInstance = useRecoilValue(currentAudioInstance)
    const currStatus = useRecoilValue(currentStatus)
    const [currPlaylist, setCurrPlaylist] = useRecoilState(currentPlaylist)
    const [downloaded, setDownloaded] = useRecoilState(downloadedAudios)

    useEffect(() => {
        fetchDownloaded(setDownloaded).then(() => {
            if(!loading)
                setIsReady(true)
        }).catch(e => console.log(e))
    }, [setDownloaded])

    useEffect(() => {
        if(data) {
            let musicArr = []
            let motivationArr = []
            let podcastsArr = []
            data.result.forEach(m => {
                if (m.type === 'muzika')
                    musicArr.push(m)
                else if (m.type === 'motivakcija')
                    motivationArr.push(m)
                else
                    podcastsArr.push(m)
                }
            )
            setAudio({
                music: musicArr,
                motivation: motivationArr,
                podcasts: podcastsArr
            })
            setIsReady(true)
        }
    }, [data])

    const handleOnPress = async (sound, index) => {
        if(index === 0)
            setCurrPlaylist([sound])
        else {
            if (sound.type === 'muzika') {
                await setCurrPlaylist(audio.music)
            } else if (sound.type === 'podcast') {
                await setCurrPlaylist(audio.podcasts)
            } else {
                await setCurrPlaylist(audio.motivation)
            }
        }
        if(currAudioInstance !== null && sound.audioUrl === currPlaylist[currAudioObject]?.audioUrl) {
            navigation.navigate('AudioPlayer', {pressedSound: null, fromDownloaded: false})
        }
        else {
            setCurrAudioObject(index)
            navigation.navigate('AudioPlayer', {pressedSound: sound, fromDownloaded: false})
        }
        onOpen()
    }

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    if (loading && !isReady)
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <LottieView
                        autoPlay={true}
                        speed={2}
                        loop={true}
                        style={{
                            width: scale(100),
                            height: verticalScale(100),
                        }}
                        source={require('../assets/gif/muscle.json')}
                    />
                </View>

    if (error) return <View style={styles.container}><Text>Error!</Text></View>

    const renderCarousel = item => {
        return (
            <View style={{flex: 1, borderRadius: scale(14), overflow: 'hidden', justifyContent: 'center', alignItems: 'center', width: width * 0.5 }}>
                <TouchableOpacity onPress={() => handleOnPress(item, 0)} style={{height: '100%', width: width * 0.9}}>
                    <Image source={{uri: item.imageUrl}} resizeMode={'cover'} style={{width: width * 0.9, height: '80%', zIndex: 1}} />
                    <View style={{width: width * 0.9, height: '20%', backgroundColor: 'whitesmoke', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: Colors[theme].primary, fontWeight: 'bold', paddingLeft: scale(20)}}>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={{flex: 1, height: '100%', paddingTop: scale(30), backgroundColor: Colors[theme].background}}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {setRefreshing(true); refetch().then(() => setRefreshing(false))}}
                    />
                }
            >

                <View style={{height: height * 0.14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: scale(20)}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Downloads')} style={[styles.playlistButton, {borderColor: Colors[theme].primary}]}>
                        <LinearGradient
                            colors={[Colors[theme].primary, 'white']}
                            style={styles.playlistGradient}
                            end={{x: 0.25, y: 0.85}}
                        >
                            <AntDesign name="clouddownload" size={24} color={Colors[theme].primary} />
                            <Text style={[styles.playlistText, {color: Colors[theme].primary}]}>skinuto</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.playlistButton, {borderColor: Colors[theme].primary}]}>
                        <LinearGradient
                            colors={[Colors[theme].primary, 'white']}
                            style={styles.playlistGradient}
                            end={{x: 0.25, y: 0.85}}
                        >
                            <AntDesign name="heart" size={20} color={Colors[theme].primary} />
                            <Text style={[styles.playlistText, {color: Colors[theme].primary}]}>lajkovano</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 1, width: width, height: height * 0.081, justifyContent: 'center', alignItems: 'center'}}>
                    <Carousel
                        ref={r}
                        loop={true}
                        style={{
                            width: width,
                            height: PAGE_HEIGHT,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#0071fa',
                        }}
                        width={PAGE_WIDTH}
                        height={PAGE_HEIGHT}
                        data={DATA}
                        renderItem={({ item, animationValue }) => {
                            return (
                                <Item
                                    animationValue={animationValue}
                                    label={item}
                                    onPress={() =>
                                        r.current?.scrollTo({
                                            count: animationValue.value,
                                            animated: true,
                                        })
                                    }
                                />
                            );
                        }}
                        autoPlay={true}
                    />
                </View>

                <View style={{width: '100%', height: height * 0.69}}>
                    <View style={{marginBottom: verticalScale(14)}}>
                        <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%', marginTop: verticalScale(22)}}>
                            <Title onPress={() => navigation.navigate('Playlist', {title: 'motivakcija', playlist: audio.motivation, refetch, color: Colors[theme].primary, setDownloaded})} colors={['transparent', Colors[theme].primary]}>
                                motivakcija
                            </Title>
                        </View>
                        <FlatList
                            horizontal={true}
                            data={audio.motivation.slice(0, 6)}
                            contentContainerStyle={{paddingRight: scale(20)}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item, index}) => <AudioCard handleOnPress={() => handleOnPress(item, index)} m={item} type={1}/>}
                            keyExtractor={item => item._id}
                            ListEmptyComponent={() => <Text>Nema podataka</Text>}
                        />
                    </View>

                    <View style={{marginBottom: verticalScale(14)}}>
                        <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                            <Title onPress={() => navigation.navigate('Playlist', {playlist: audio.music, title: 'muzika', refetch, color: 'dodgerblue', setDownloaded})} colors={['transparent', 'dodgerblue']}>
                                muzika
                            </Title>
                        </View>
                        <FlatList
                            horizontal={true}
                            data={audio.music.slice(0, 6)}
                            contentContainerStyle={{paddingRight: scale(20)}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item, index}) => <AudioCard handleOnPress={() => handleOnPress(item, index)} m={item} type={2}/>}
                            keyExtractor={item => item._id}
                            ListEmptyComponent={() => <Text>Nema podataka</Text>}
                        />
                    </View>

                    <View style={{marginBottom: verticalScale(14)}}>
                        <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                            <Title onPress={() => navigation.navigate('Playlist', {playlist: audio.podcasts, title: 'podcasti', refetch: refetch, color: 'firebrick', setDownloaded})} colors={['transparent', 'firebrick']}>
                                podcasti
                            </Title>
                        </View>
                        <FlatList
                            horizontal={true}
                            data={audio.podcasts.slice(0, 6)}
                            contentContainerStyle={{paddingRight: scale(20)}}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item, index}) => <AudioCard handleOnPress={() => handleOnPress(item, index)} m={item} type={3}/>}
                            keyExtractor={item => item._id}
                            ListEmptyComponent={() => <Text>Nema podataka</Text>}
                        />
                    </View>
                </View>
                {/*<Modalize*/}
                {/*    modalStyle={{height: '20%', width: width}}*/}
                {/*    ref={modalizeRef}*/}
                {/*    panGestureEnabled={true}*/}
                {/*>*/}
                {/*    */}
                {/*</Modalize>*/}
            </ScrollView>
            {
                currAudioInstance !== null && <NowPlaying />
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    sectionTitle: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: '5%'
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
    playlistButton: {
        borderWidth: scale(1),
        borderRadius: scale(12),
        width: '48%',
        height: verticalScale(40),
    },
    playlistGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(10),
        width: '100%',
        height: '100%',
        borderRadius: scale(12),
    },
    playlistText: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginLeft: scale(5)
    }
});

const Item = (props) => {
    const { animationValue, label, onPress } = props;

    const translateY = useSharedValue(0);

    const containerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            animationValue.value,
            [-1, 0, 1],
            [0.5, 1, 0.5],
            Extrapolate.CLAMP
        );

        return {
            opacity,
        };
    }, [animationValue]);

    const labelStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            animationValue.value,
            [-1, 0, 1],
            [1, 1.25, 1],
            Extrapolate.CLAMP
        );

        const color = interpolateColor(
            animationValue.value,
            [-1, 0, 1],
            ['#b6bbc0', '#0071fa', '#b6bbc0']
        );

        return {
            transform: [{ scale }, { translateY: translateY.value }],
            color,
        };
    }, [animationValue, translateY]);

    const onPressIn = React.useCallback(() => {
        translateY.value = withTiming(-8, { duration: 250 });
    }, [translateY]);

    const onPressOut = React.useCallback(() => {
        translateY.value = withTiming(0, { duration: 250 });
    }, [translateY]);

    return (
        <Pressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <Animated.View
                style={[
                    {
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    containerStyle,
                ]}
            >
                <Animated.Text
                    style={[{ fontSize: 18, color: '#26292E' }, labelStyle]}
                >
                    {label}
                </Animated.Text>
            </Animated.View>
        </Pressable>
    );
};
