import React from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet, TouchableOpacity
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
    currentPlaylist, downloadedAudios,
} from "../atoms/AudioFunctions";
import {AntDesign} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import {fetchDownloaded} from "../utils/fileSystem";

export default function AudioScreen({ navigation }) {
    const theme = 'dark'
    const [{ data, loading, error }, refetch] = useAxios(getAudio)
    const [audio, setAudio] = useState({
        music: [],
        motivation: [],
        podcasts: []
    })
    const [refreshing, setRefreshing] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);

    const [currAudioObject, setCurrAudioObject] = useRecoilState(currentAudioObject)
    const currAudioInstance = useRecoilValue(currentAudioInstance)
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
        if(sound.type === 'muzika') {
            await setCurrPlaylist(audio.music)
        }
        else if(sound.type === 'podcast') {
            await setCurrPlaylist(audio.podcasts)
        }
        else {
            await setCurrPlaylist(audio.motivation)
        }
        if(currAudioInstance !== null && sound.audioUrl === currPlaylist[currAudioObject]?.audioUrl) {
            navigation.navigate('AudioPlayer', {pressedSound: null, fromDownloaded: false})
        }
        else {
            setCurrAudioObject(index)
            navigation.navigate('AudioPlayer', {pressedSound: sound, fromDownloaded: false})
        }
    }

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

    return (
        <SafeAreaView style={{flex: 1, paddingTop: scale(30), backgroundColor: Colors[theme].background}}>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {setRefreshing(true); refetch().then(() => setRefreshing(false))}}
                    />
                }
            >
                <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: scale(20)}}>
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
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
