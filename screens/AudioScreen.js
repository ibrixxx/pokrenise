import React from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet
} from 'react-native';
import { Text, View } from '../components/Themed';
import {Title} from "react-native-paper";
import {useEffect, useState} from "react";
import useAxios from "axios-hooks";
import {getAudio} from "../constants/API";
import AudioCard from "../components/AudioCard";
import {scale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import {useRecoilState} from "recoil";
import {currentAudioInstance, currentAudioObject, currentPlaylist, currentStatus} from "../atoms/AudioFunctions";
import {loadPlaybackInstance} from "../utils/AudioPlayer";

export default function AudioScreen({ navigation }) {
    const [{ data, loading, error }, refetch] = useAxios(getAudio)
    const [audio, setAudio] = useState({
        music: [],
        motivation: [],
        podcasts: []
    })
    const [refreshing, setRefreshing] = React.useState(false);

    const [currAudioObject, setCurrAudioObject] = useRecoilState(currentAudioObject)
    const [currAudioInstance, setCurrAudioInstance] = useRecoilState(currentAudioInstance)
    const [currStatus, setCurrStatus] = useRecoilState(currentStatus)
    const [currPlaylist, setCurrPlaylist] = useRecoilState(currentPlaylist)



    useEffect(() => {
        if(data) {
            // console.log(data)
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
        }
    }, [data])

    const handleOnPress = async sound => {
        if(currAudioInstance !== null && sound.audioUrl === currAudioObject.audioUrl) {
            navigation.navigate('AudioPlayer')
        }
        else {
            // if(sound.type === 'muzika')
            //     await setCurrPlaylist(audio.music)
            // else if(sound.type === 'podcast')
            //     await setCurrPlaylist(audio.podcasts)
            // else
            //     await setCurrPlaylist(audio.motivation)
            setCurrPlaylist(data.result)
            await setCurrAudioObject(sound)
            try {
                await loadPlaybackInstance(currAudioInstance, setCurrAudioInstance, sound, true, setCurrStatus)
            }
            catch (e) {
                console.log(e)
            }
            navigation.navigate('AudioPlayer')
        }
    }

    if (loading) return <View style={styles.container}><Text>Loading...</Text></View>
    if (error) return <View style={styles.container}><Text>Error!</Text></View>

    return (
        <SafeAreaView style={{flex: 1, paddingTop: scale(30), backgroundColor: Colors['dark'].background}}>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {setRefreshing(true); refetch().then(() => setRefreshing(false))}}
                    />
                }
            >
                <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                    <Title style={{color: 'white'}}>
                        Motivakcija
                    </Title>
                </View>
                <FlatList
                    horizontal={true}
                    data={data.result}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => <AudioCard handleOnPress={handleOnPress} m={item} />}
                    keyExtractor={item => item._id}
                    ListEmptyComponent={() => <Text>Nema podataka</Text>}
                />

                <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                    <Title style={{color: 'white'}}>
                        Muzika
                    </Title>
                </View>
                <FlatList
                    horizontal={true}
                    data={data.result}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => <AudioCard handleOnPress={handleOnPress} m={item} />}
                    keyExtractor={item => item._id}
                    ListEmptyComponent={() => <Text>Nema podataka</Text>}
                />

                <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                    <Title style={{color: 'white'}}>
                        Podcasti
                    </Title>
                </View>
                <FlatList
                    horizontal={true}
                    data={data.result}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => <AudioCard handleOnPress={handleOnPress} m={item} />}
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
});
