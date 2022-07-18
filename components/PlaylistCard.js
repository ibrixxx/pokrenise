import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import {Text, View} from "./Themed";
import {Image, LogBox, StyleSheet, TouchableOpacity} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useNavigation} from "@react-navigation/native";
import {useRecoilState, useRecoilValue} from "recoil";
import {currentAudioInstance, currentAudioObject, currentPlaylist} from "../atoms/AudioFunctions";

const PlaylistCard = ({sound, color, playlist, index, fetchDownloaded}) => {
    const theme = 'dark'
    const navigation = useNavigation()

    const currAudioInstance = useRecoilValue(currentAudioInstance)
    const [currPlaylist, setCurrPlaylist] = useRecoilState(currentPlaylist)
    const [currAudioObject, setCurrAudioObject] = useRecoilState(currentAudioObject)


    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);


    const onPress = async () => {
        if(currPlaylist !== playlist)
            await setCurrPlaylist(playlist)
        if(currAudioInstance !== null && sound.audioUrl === currPlaylist[currAudioObject]?.audioUrl) {
            navigation.navigate('AudioPlayer', {pressedSound: null, fetchDownloaded, fromDownloaded: false})
        }
        else {
            setCurrAudioObject(index)
            navigation.navigate('AudioPlayer', {pressedSound: sound, fetchDownloaded, fromDownloaded: false})
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.card, {borderColor: color}]}>
            <Image resizeMode={'cover'} source={{uri: sound.imageUrl}} style={styles.image}/>

            <LinearGradient
                colors={['black', 'transparent']}
                style={styles.gradient}
                end={{x: 0.25, y: 0.85}}
            >
                <Text style={{color: Colors[theme].tabIconDefault, fontWeight: 'bold', fontStyle: 'italic', width: '80%'}}>{sound.title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default PlaylistCard

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginTop: verticalScale(20),
        borderRadius: scale(12),
        borderWidth: scale(2),
    },
    gradient: {
        flexDirection: 'row',
        padding: scale(14),
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: scale(10),
    },
    image: { width: '20%', height: '100%', borderTopLeftRadius: scale(12), borderBottomLeftRadius: scale(12) },
});
