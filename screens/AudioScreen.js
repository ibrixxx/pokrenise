import {Pressable, StyleSheet} from 'react-native';
import { Text, View } from '../components/Themed';
import {FontAwesome} from "@expo/vector-icons";
import {Title} from "react-native-paper";
import {useState} from "react";
import { Audio } from 'expo-av';
import useAxios from "axios-hooks";
import {getAudio} from "../constants/API";

export default function AudioScreen({ navigation }) {
    const [iconName, setIconName] = useState('play')
    const [sound, setSound] = useState(null)
    const [{ data, loading, error }, refetch] = useAxios(getAudio)

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
                setIconName('play')
            }
        }
    }

    async function playSound() {
        if(!sound) {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync({uri: data.result[0].audioUrl});
            await setSound(sound);
            await sound.setOnPlaybackStatusUpdate(audioStatusUpdate)
            console.log('Playing Sound');
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

    if (loading) return <View style={styles.container}><Text>Loading...</Text></View>
    if (error) return <View style={styles.container}><Text>Error!</Text></View>

    return (
        <View style={styles.container}>
            <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                <Title style={{color: 'white'}}>
                    Workout motivation
                </Title>
            </View>
            <View style={styles.card}>
                <Text>{data.result[0].title}</Text>
                <Pressable onPress={() => iconName === 'play'? playSound() : pauseSound()} style={{width: '10%', height: '100%', justifyContent: 'center'}}>
                    <FontAwesome name={iconName} color={'white'} size={14} />
                </Pressable>
            </View>
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
        padding: 22,
        backgroundColor: 'darkorange',
        width: '90%',
        height: '14%',
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
