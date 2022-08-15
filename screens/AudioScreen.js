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
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { Modalize } from 'react-native-modalize';



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
    const [activeIndex, setActiveIndex] = React.useState(0);

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
            <View style={{borderRadius: scale(14), overflow: 'hidden'}}>
                <TouchableOpacity onPress={() => handleOnPress(item, 0)} style={{height: '80%', width: '100%'}}>
                    <Ionicons style={{position: 'absolute', zIndex: 2, top: '44%', left: '44%'}} name="play-outline" size={44} color={Colors[theme].primary} />
                    <Image source={{uri: item.imageUrl}} resizeMode={'cover'} style={{width: width * 0.9, height: '100%', zIndex: 1}} />
                </TouchableOpacity>
                <View style={{width: '100%', height: '20%', backgroundColor: 'whitesmoke', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: Colors[theme].primary, fontWeight: 'bold', paddingLeft: scale(20)}}>{item.title}</Text>
                </View>
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

                <View style={{height: height * 0.3, marginTop: verticalScale(20)}}>
                    <Carousel
                        ref={carouselRef}
                        data={data.result}
                        renderItem={({item}) => renderCarousel(item)}
                        sliderWidth={width}
                        itemWidth={width * 0.8}
                        layout={'default'}
                        inactiveSlideOpacity={0.5}
                        containerCustomStyle={{height: '80%'}}
                        onSnapToItem={index => setActiveIndex(index)}
                    />
                    <Pagination
                        dotsLength={data.result.length}
                        activeDotIndex={activeIndex}
                        dotColor={'#FFF'}
                        inactiveDotColor={'gray'}
                        containerStyle={{marginVertical: verticalScale(-10)}}
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
            <Pressable style={{height: '8%', backgroundColor: '#222222', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '100%', paddingHorizontal: scale(20), borderTopLeftRadius: scale(14), borderTopRightRadius: scale(14)}}>
                <Image source={require('../assets/images/rio-bg.jpeg')} style={{width: scale(55), height: '100%'}} resizeMode={'cover'} />
                <Text>Naslov</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#222222'}}>
                    <TouchableOpacity style={{marginRight: scale(10)}} onPress={() => console.log('ua')}>
                        <Entypo name={currStatus?.isPlaying? "controller-paus":"controller-play"} size={30} color={Colors[theme].primary} />
                    </TouchableOpacity>
                    <AntDesign name="close" size={24} color="gray" />
                </View>
            </Pressable>
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
