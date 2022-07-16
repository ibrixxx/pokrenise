import {FlatList, LogBox, SafeAreaView, StyleSheet} from 'react-native';
import {useRecoilValue} from "recoil";
import {downloadedAudios} from "../atoms/AudioFunctions";
import Colors from "../constants/Colors";
import {Caption, Title} from "react-native-paper";
import {scale} from "react-native-size-matters";
import DownloadedCard from "../components/DownloadedCard";
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";


export default function DownloadedScreen({route}) {
    const downloaded = useRecoilValue(downloadedAudios)
    const theme = 'dark'
    const {fetchDownloaded} = route.params
    const [refreshing, setRefreshing] = useState(false)

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    const onRefresh = async () => {
        await setRefreshing(true)
        await fetchDownloaded()
        await setRefreshing(false)
    }

    return (
        <SafeAreaView style={{flex: 1, paddingTop: scale(30), paddingHorizontal: scale(30), backgroundColor: Colors[theme].background}}>
            <LinearGradient
                colors={['transparent', 'black']}
                style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: scale(10), borderRadius: scale(10)}}
                end={{x: 0.25, y: 0.85}}
                start={{x: 0.5, y: 1}}
            >
                <Title style={{color: Colors[theme].text, fontStyle: 'italic', fontWeight: 'bold'}}>
                    skinuto
                </Title>
                <Caption style={{color: Colors[theme].text, marginLeft: scale(5), fontStyle: 'italic'}}>
                    ({Object.keys(downloaded).length})
                </Caption>
            </LinearGradient>
            <FlatList
                refreshing={refreshing}
                data={Object.keys(downloaded)}
                renderItem={({item}) => <DownloadedCard title={item}/>}
                keyExtractor={(item, index) => item+index}
                onRefresh={() => onRefresh()}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
