import {FlatList, LogBox, SafeAreaView, StyleSheet} from 'react-native';
import Colors from "../constants/Colors";
import {Caption, Snackbar, Title} from "react-native-paper";
import {scale} from "react-native-size-matters";
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";
import PlaylistCard from "../components/PlaylistCard";


export default function PlaylistScreen({route}) {
    const theme = 'dark'
    const {title, playlist, refetch, color, fetchDownloaded} = route.params
    const [refreshing, setRefreshing] = useState(false)

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    const onRefresh = async () => {
        await setRefreshing(true)
        await refetch()
        await setRefreshing(false)
    }


    return (
        <SafeAreaView style={{flex: 1, paddingTop: scale(30), paddingHorizontal: scale(30), backgroundColor: Colors[theme].background}}>
            <LinearGradient
                colors={['transparent', color]}
                style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: scale(10), borderRadius: scale(10)}}
                end={{x: 0.25, y: 0.85}}
                start={{x: 0.5, y: 1}}
            >
                <Title style={{color: Colors[theme].text, fontStyle: 'italic', fontWeight: 'bold'}}>
                    {title}
                </Title>
                <Caption style={{color: Colors[theme].text, marginLeft: scale(5), fontStyle: 'italic'}}>
                    ({playlist.length})
                </Caption>
            </LinearGradient>
            <FlatList
                refreshing={refreshing}
                data={playlist}
                renderItem={({item, index}) =>
                    <PlaylistCard
                        sound={item}
                        color={color}
                        playlist={playlist}
                        index={index}
                        fetchDownloaded={fetchDownloaded}
                    />
                }
                keyExtractor={(item, index) => item+index}
                onRefresh={() => onRefresh()}
            />
        </SafeAreaView>
    )
}

