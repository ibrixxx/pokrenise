import React from 'react';
import {
    FlatList,
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
import {scale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import {useRecoilState} from "recoil";
import {currentAudioObject} from "../atoms/AudioFunctions";

export default function AudioScreen({ navigation }) {
    const [{ data, loading, error }, refetch] = useAxios(getAudio)
    const [music, setMusic] = useState([])
    const [motivation, setMotivation] = useState([])
    const [podcasts, setPodcasts] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [currAudioObject, setCurrAudioObject] = useRecoilState(currentAudioObject)


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
        }
    }, [data])

    const handleOnPress = sound => {
        setCurrAudioObject(sound)
        navigation.navigate('AudioPlayer', {soundItem: sound})
    }

    if (loading) return <View style={styles.container}><Text>Loading...</Text></View>
    if (error) return <View style={styles.container}><Text>Error!</Text></View>

    return (
        <SafeAreaView style={{flex: 1, paddingTop: scale(30), backgroundColor: Colors['dark'].background}}>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {setRefreshing(true); refetch().then(() => setRefreshing(false))}}
                    />
                }
            >
                <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                    <Title style={{color: 'white'}}>
                        Motivakcija
                    </Title>
                </View>
                <FlatList
                    horizontal={true}
                    data={data.result}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => <AudioCard handleOnPress={handleOnPress} m={item} />}
                    keyExtractor={item => item._id}
                    ListEmptyComponent={() => <Text>Nema podataka</Text>}
                />

                <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                    <Title style={{color: 'white'}}>
                        Muzika
                    </Title>
                </View>
                <FlatList
                    horizontal={true}
                    data={data.result}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => <AudioCard handleOnPress={handleOnPress} m={item} />}
                    keyExtractor={item => item._id}
                    ListEmptyComponent={() => <Text>Nema podataka</Text>}
                />

                <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: '5%'}}>
                    <Title style={{color: 'white'}}>
                        Podcasti
                    </Title>
                </View>
                <FlatList
                    horizontal={true}
                    data={data.result}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => <AudioCard handleOnPress={handleOnPress} m={item} />}
                    keyExtractor={item => item._id}
                    ListEmptyComponent={() => <Text>Nema podataka</Text>}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
