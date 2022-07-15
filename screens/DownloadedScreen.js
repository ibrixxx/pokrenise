import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {View} from "../components/Themed";
import {useRecoilValue} from "recoil";
import {downloadedAudios} from "../atoms/AudioFunctions";
import Colors from "../constants/Colors";
import {Caption, Title} from "react-native-paper";
import {scale} from "react-native-size-matters";
import DownloadedCard from "../components/DownloadedCard";
import {LinearGradient} from "expo-linear-gradient";

export default function DownloadedScreen() {
    const downloaded = useRecoilValue(downloadedAudios)
    const theme = 'dark'

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
                data={Object.keys(downloaded)}
                renderItem={({item}) => <DownloadedCard title={item}/>}
                keyExtractor={(item, index) => item+index}
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
