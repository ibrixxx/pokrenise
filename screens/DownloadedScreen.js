import {FlatList, LogBox, SafeAreaView, StyleSheet} from 'react-native';
import {useRecoilState, useRecoilValue} from "recoil";
import {currentAudioInstance, downloadedAudios} from "../atoms/AudioFunctions";
import Colors from "../constants/Colors";
import {Caption, Snackbar, Title} from "react-native-paper";
import {scale, verticalScale} from "react-native-size-matters";
import DownloadedCard from "../components/DownloadedCard";
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";
import {View} from "../components/Themed";
import {fetchDownloaded} from "../utils/fileSystem";
import NowPlaying from "../components/NowPlaying";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";


export default function DownloadedScreen({route}) {
    const [downloaded, setDownloaded] = useRecoilState(downloadedAudios)
    const theme = 'dark'
    const [refreshing, setRefreshing] = useState(false)
    const [visible, setVisible] = useState(false)
    const currAudioInstance = useRecoilValue(currentAudioInstance)
    const navigation = useNavigation()

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    const onRefresh = async () => {
        await setRefreshing(true)
        await fetchDownloaded(setDownloaded)
        await setRefreshing(false)
    }

    const onDeleteFinish = () => {
        fetchDownloaded(setDownloaded).catch(e => console.log(e))
        setVisible(true)
    }

    return (
        <SafeAreaView style={{flex: 1, paddingTop: scale(30), backgroundColor: Colors[theme].background}}>
            <View style={{flex: 1, paddingHorizontal: scale(30), backgroundColor: Colors[theme].background, marginTop: verticalScale(20)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons onPress={() => navigation.goBack()} name="arrow-back-sharp" size={24} color="white" style={{marginRight: scale(10)}} />
                    <LinearGradient
                        colors={['transparent', Colors[theme].primary]}
                        style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: scale(10), borderRadius: scale(10)}}
                        end={{x: 0.25, y: 0.1}}
                        start={{x: 0.5, y: 1.1}}
                    >
                        <Title style={{color: Colors[theme].text, fontStyle: 'italic', fontWeight: 'bold'}}>
                            skinuto
                        </Title>
                        <Caption style={{color: Colors[theme].text, marginLeft: scale(5), fontStyle: 'italic'}}>
                            ({Object.keys(downloaded).length})
                        </Caption>
                    </LinearGradient>
                </View>
                <FlatList
                    refreshing={refreshing}
                    data={Object.keys(downloaded)}
                    renderItem={({item, index}) =>
                        <DownloadedCard
                            title={item}
                            uri={downloaded[item].uri}
                            onDeleteFinish={() => onDeleteFinish()}
                            downloadedPlaylist={Object.keys(downloaded)}
                            index={index}
                            fetchDownloaded={() => fetchDownloaded(setDownloaded)}
                        />}
                    keyExtractor={(item, index) => item+index}
                    onRefresh={() => onRefresh()}
                />
                <View style={{justifyContent: 'center'}}>
                    <Snackbar
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        style={{width: '100%'}}
                        action={{
                            label: 'OK',
                            onPress: () => {
                                setVisible(false)
                            },
                        }}>
                        fajl uspješno izbrisan
                    </Snackbar>
                </View>
            </View>
            {
                currAudioInstance !== null && <NowPlaying />
            }
        </SafeAreaView>
    )
}
