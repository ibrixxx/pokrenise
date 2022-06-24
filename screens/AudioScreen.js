import React from 'react';
import {
    Image,
    ImageBackground,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    SectionList,
    StyleSheet
} from 'react-native';
import { Text, View } from '../components/Themed';
import {FontAwesome} from "@expo/vector-icons";
import {Title} from "react-native-paper";
import {useEffect, useState} from "react";
import { Audio } from 'expo-av';
import useAxios from "axios-hooks";
import {getAudio} from "../constants/API";
import AudioCard from "../components/AudioCard";

export default function AudioScreen({ navigation }) {
    const [soundPlayingUrl, setSoundPlayingUrl] = useState([])
    const [sound, setSound] = useState(null)
    const [{ data, loading, error }, refetch] = useAxios(getAudio)
    const [music, setMusic] = useState([])
    const [motivation, setMotivation] = useState([])
    const [podcasts, setPodcasts] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [pom, setPom] = React.useState([]);


    useEffect(() => {
        if(data) {
            console.log(data)
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
            setMusic(musicArr)
            setMotivation(motivationArr)
            setPodcasts(podcastsArr)
            setPom([{title: 'Audio', data: data.result}])
        }
    }, [data])

    useEffect(()=>{
        return sound ? () => {
                sound.unloadAsync(); }
            : undefined;
    },[sound])

    const audioStatusUpdate = playbackStatus => {
        if (!playbackStatus.isLoaded) {
            if (playbackStatus.error) {
                console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
            }
        } else {
            if (playbackStatus.isPlaying) {
                console.log('play')
            }
            else {
                console.log('pause')
            }

            // if (playbackStatus.isBuffering) {
            //     console.log('bufff')
            // }
            if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                console.log('f')
                setSound(null)
                setSoundPlayingUrl(null)
            }
        }
    }

    async function playSound(url) {
        if(!sound && url) {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync({uri: url});
            await setSound(sound);
            await setSoundPlayingUrl([url])
            await sound.setOnPlaybackStatusUpdate(audioStatusUpdate)
            console.log('Playing Sound');
            await sound.playAsync();
        }
        else if((soundPlayingUrl.length === 2 && soundPlayingUrl[0] === '' && soundPlayingUrl[1] !== url) || (soundPlayingUrl.length === 1 && soundPlayingUrl[0] !== url) ) {
            await setSound(null)
            console.log('Loading Sound 2');
            const { sound } = await Audio.Sound.createAsync({uri: url});
            await setSound(sound);
            await setSoundPlayingUrl([url])
            await sound.setOnPlaybackStatusUpdate(audioStatusUpdate)
            console.log('Playing Sound 3');
            await sound.playAsync();
        }
        else {
            console.log('Playing Sound 2');
            await setSoundPlayingUrl([url])
            await sound.playAsync();
        }
    }

    async function pauseSound() {
        console.log('Pause')
        await setSoundPlayingUrl(['', soundPlayingUrl[0]])
        await sound.pauseAsync()
    }

    const handleOnPress = url => {
        if(url === soundPlayingUrl[0])
            return pauseSound()
        else if(soundPlayingUrl[0] === '')
            return playSound(url)
        else
            return playSound(url)
    }

    const handleAudioIcon = url => {
        if(url === soundPlayingUrl[0])
            return 'pause'
        else
            return 'play'
    }

    if (loading) return <View style={styles.container}><Text>Loading...</Text></View>
    if (error) return <View style={styles.container}><Text>Error!</Text></View>

    return (
            // <ScrollView
            //     contentContainerStyle={styles.container}
            //     refreshControl={
            //         <RefreshControl
            //             refreshing={refreshing}
            //             onRefresh={() => {setRefreshing(true); refetch().then(() => setRefreshing(false))}}
            //         />
            //     }
            // >
        <View style={styles.container}>
                    <SectionList
                        contentContainerStyle={{flexGrow: 1, height: '100%'}}
                        sections={pom}
                        keyExtractor={(item, index) => item._id + index}
                        renderItem={({item}) => <AudioCard handleAudioIcon={handleAudioIcon} handleOnPress={handleOnPress} m={item} />}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={styles.sectionTitle}>
                                <Title style={{color: 'white'}}>
                                    {title}
                                </Title>
                            </View>
                        )}
                        scrollEnabled={true}
                    />
        </View>
            // </ScrollView>
            //     {
            //         music.map(m =>
            //             (
            //                 <View key={m._id} style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            //                     <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
            //                         <Title style={{color: 'white'}}>
            //                             Muzika
            //                         </Title>
            //                     </View>
            //                     <AudioCard handleAudioIcon={handleAudioIcon} handleOnPress={handleOnPress} m={m} />
            //                 </View>
            //             )
            //         )
            //     }
            //     {
            //         motivation.map(m =>
            //             (
            //                 <View key={m._id} style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            //                     <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
            //                         <Title style={{color: 'white'}}>
            //                             Motivakcija
            //                         </Title>
            //                     </View>
            //                     <AudioCard handleAudioIcon={handleAudioIcon} handleOnPress={handleOnPress} m={m} />
            //                 </View>
            //             )
            //         )
            //     }
            //     {
            //         podcasts.map(m =>
            //             (
            //                 <View key={m._id} style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            //                     <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
            //                         <Title style={{color: 'white'}}>
            //                             Podcasti
            //                         </Title>
            //                     </View>
            //                     <AudioCard handleAudioIcon={handleAudioIcon} handleOnPress={handleOnPress} m={m} />
            //                 </View>
            //             )
            //         )
            //     }
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
