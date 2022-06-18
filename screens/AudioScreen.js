import {Pressable, StyleSheet} from 'react-native';
import { Text, View } from '../components/Themed';
import {FontAwesome} from "@expo/vector-icons";
import {Title} from "react-native-paper";
import {useEffect, useState} from "react";
import { Audio } from 'expo-av';
import useAxios from "axios-hooks";
import {getAudio} from "../constants/API";

export default function AudioScreen({ navigation }) {
    const [iconName, setIconName] = useState('play')
    const [soundPlayingUrl, setSoundPlayingUrl] = useState(null)
    const [sound, setSound] = useState(null)
    const [{ data, loading, error }, refetch] = useAxios(getAudio)
    const [music, setMusic] = useState([])
    const [motivation, setMotivation] = useState([])
    const [podcasts, setPodcasts] = useState([])

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
            setMusic(musicArr)
            setMotivation(motivationArr)
            setPodcasts(podcastsArr)
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
                setIconName('pause')
            } else {
                setIconName('play')
            }

            if (playbackStatus.isBuffering) {
                // setIconName('music')
            }
            if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                console.log('f')
                setSound(null)
                setSoundPlayingUrl(null)
                setIconName('play')
            }
        }
    }

    async function playSound(url) {
        if(!sound && url) {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync({uri: url});
            await setSound(sound);
            await setSoundPlayingUrl(url)
            await sound.setOnPlaybackStatusUpdate(audioStatusUpdate)
            console.log('Playing Sound');
            await sound.playAsync();
        }
        else if(url && (url !== soundPlayingUrl)) {
            await setSound(null)
            console.log('Loading Sound 2');
            const { sound } = await Audio.Sound.createAsync({uri: url});
            await setSound(sound);
            await setSoundPlayingUrl(url)
            await sound.setOnPlaybackStatusUpdate(audioStatusUpdate)
            console.log('Playing Sound 3');
            await sound.playAsync();
        }
        else {
            console.log('Playing Sound 2');
            await sound.playAsync();
        }
    }

    async function pauseSound() {
        console.log('Pause')
        await sound.pauseAsync()
    }

    const handleOnPress = url => {
        if(url === soundPlayingUrl && iconName === 'pause')
            return pauseSound()
        else if(url === soundPlayingUrl && iconName === 'play')
            return playSound(null)
        else
            return playSound(url)
    }

    const handleAudioIcon = url => {
        if(url === soundPlayingUrl)
            return iconName
        else
            return 'play'
    }

    if (loading) return <View style={styles.container}><Text>Loading...</Text></View>
    if (error) return <View style={styles.container}><Text>Error!</Text></View>

    return (
        <View style={styles.container}>
            {
                music.map(m =>
                    (
                        <View key={m._id} style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                                <Title style={{color: 'white'}}>
                                    Muzika
                                </Title>
                            </View>
                            <View style={styles.card}>
                                <Text>{m.title}</Text>
                                <Pressable onPress={() => handleOnPress(m.audioUrl)} style={{width: '10%', height: '100%', justifyContent: 'center'}}>
                                    <FontAwesome name={handleAudioIcon(m.audioUrl)} color={'white'} size={14} />
                                </Pressable>
                            </View>
                        </View>
                    )
                )
            }
            {
                motivation.map(m =>
                    (
                        <View key={m._id} style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                                <Title style={{color: 'white'}}>
                                    Motivakcija
                                </Title>
                            </View>
                            <View style={styles.card}>
                                <Text>{m.title}</Text>
                                <Pressable onPress={() => handleOnPress(m.audioUrl)} style={{width: '10%', height: '100%', justifyContent: 'center'}}>
                                    <FontAwesome name={handleAudioIcon(m.audioUrl)} color={'white'} size={14} />
                                </Pressable>
                            </View>
                        </View>
                    )
                )
            }
            {
                podcasts.map(m =>
                    (
                        <View key={m._id} style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                                <Title style={{color: 'white'}}>
                                    Podcasti
                                </Title>
                            </View>
                            <View style={styles.card}>
                                <Text>{m.title}</Text>
                                <Pressable onPress={() => handleOnPress(m.audioUrl)} style={{width: '10%', height: '100%', justifyContent: 'center'}}>
                                    <FontAwesome name={handleAudioIcon(m.audioUrl)} color={'white'} size={14} />
                                </Pressable>
                            </View>
                        </View>
                    )
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'darkorange',
        width: '90%',
        height: '30%',
        elevation: 24,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 20,
        marginBottom: '5%',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
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
