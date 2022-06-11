import {Pressable, StyleSheet} from 'react-native';
import { Text, View } from '../components/Themed';
import {FontAwesome} from "@expo/vector-icons";
import {Title} from "react-native-paper";
import {useState} from "react";
import { Audio } from 'expo-av';

export default function AudioScreen({ navigation }) {
    const [iconName, setIconName] = useState('play')
    const [currentSound, setSound] = useState(null)

    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync({uri: 'https://ia800304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3'});
        await setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
        await setIconName('pause')
    }

    async function pauseSound() {
        console.log('Pause')
        await currentSound.pauseAsync()
        await currentSound.unloadAsync();
        await setIconName('play')
    }

    return (
        <View style={styles.container}>
            <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                <Title style={{color: 'white'}}>
                    Workout motivation
                </Title>
            </View>
            <View style={styles.card}>
                <Text>Masa masa</Text>
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
