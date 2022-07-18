import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Text, View} from "./Themed";
import {LogBox, StyleSheet, TouchableOpacity} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import * as FileSystem from 'expo-file-system';
import {useNavigation} from "@react-navigation/native";
import {useRecoilState, useRecoilValue} from "recoil";
import {currentAudioInstance, currentAudioObject, currentPlaylist} from "../atoms/AudioFunctions";

const DownloadedCard = ({title, uri, onDeleteFinish, downloadedPlaylist, index, fetchDownloaded}) => {
    const theme = 'dark'
    const navigation = useNavigation()

    const currAudioInstance = useRecoilValue(currentAudioInstance)
    const [currPlaylist, setCurrPlaylist] = useRecoilState(currentPlaylist)
    const [currAudioObject, setCurrAudioObject] = useRecoilState(currentAudioObject)


    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    const onDelete = async () => {
        FileSystem.deleteAsync(uri, {idempotent: false})
            .then(res => {
                onDeleteFinish()
            })
            .catch(e => console.log(e))

    }

    const onPress = async () => {
        if(currPlaylist !== downloadedPlaylist)
            await setCurrPlaylist(downloadedPlaylist)
        if(currAudioInstance !== null && title === currPlaylist[currAudioObject]) {
            navigation.navigate('AudioPlayer', {pressedSound: null, fetchDownloaded, fromDownloaded: true})
        }
        else {
            await setCurrAudioObject(index)
            await navigation.navigate('AudioPlayer', {pressedSound: {title}, fetchDownloaded, fromDownloaded: true})
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.card, {borderColor: Colors[theme].primary}]}>
            <LinearGradient
                colors={['black', 'transparent']}
                style={styles.gradient}
                end={{x: 0.25, y: 0.85}}
            >
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'transparent'}}>
                    <MaterialCommunityIcons name="file-music" size={24} color={Colors[theme].primary} />
                    <Text style={{color: Colors[theme].tabIconDefault, fontWeight: 'bold', fontStyle: 'italic', width: '80%'}}>{title}</Text>
                </View>
                <MaterialCommunityIcons onPress={onDelete} style={{width: '100%', height: '100%', alignItems: 'center'}} name="delete-outline" size={24} color={Colors[theme].tabIconDefault} />
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default DownloadedCard

const styles = StyleSheet.create({
    card: {
        marginTop: verticalScale(20),
        borderRadius: scale(12),
        borderWidth: scale(2),
    },
    gradient: {
        flexDirection: 'row',
        padding: scale(14),
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: scale(10),
    }
});
