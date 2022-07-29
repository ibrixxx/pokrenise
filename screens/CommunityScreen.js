import {Dimensions, Image, ScrollView, StyleSheet} from 'react-native';
import {Text, View} from "../components/Themed";
import { Pedometer } from 'expo-sensors';
import {useCallback, useEffect, useState} from "react";
const { width } = Dimensions.get("screen");
import {scale, verticalScale} from "react-native-size-matters";
import {DataTable} from "react-native-paper";
import Colors from "../constants/Colors";

const itemsPerPage = 10

const fakeData = [
    {name: '@username', steps: 12404},
    {name: '@usedaame', steps: 1404},
    {name: '@sadas', steps: 43},
    {name: '@sad', steps: 12434},
    {name: '@gdsgg', steps: 2404},
    {name: '@reg', steps: 3404},
    {name: '@dsfsdf', steps: 3224},
    {name: '@r44', steps: 6546},
    {name: '@usedfsdfame', steps: 567845},
    {name: '@sdfds', steps: 3534},
    {name: '@grg', steps: 645754},
    {name: '@fdsf', steps: 7876},
    {name: '@3e3', steps: 6868},
]

export default function CommunityScreen() {
    const theme = 'dark'

    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking')
    const [pasteStepsCount, setPasteStepsCount] = useState(0)
    const [currentStepsCount, setCurrentStepsCount] = useState(0)
    const [page, setPage] = useState(0)
    const [contestants, setContestants] = useState(fakeData)

    useEffect(
        useCallback(() => {
            setContestants(fakeData.sort((a, b) => a.steps < b.steps))
        }, [contestants])
    )

    // useEffect(
    //     useCallback(() => {
    //         const unsubscribe = async () => {
    //             Pedometer.watchStepCount(res => setCurrentStepsCount(res.steps))
    //             Pedometer.isAvailableAsync().then(res => setIsPedometerAvailable(String(res))).catch(e => setIsPedometerAvailable('error'))
    //             const end = new Date()
    //             const start = new Date()
    //             start.setDate(end.getDate() - 1)
    //             Pedometer.getStepCountAsync(start, end).then(res => setPasteStepsCount(res.steps)).catch(e => setPasteStepsCount(e))
    //         }
    //         return unsubscribe
    //     }, [isPedometerAvailable])
    // )

    return (
        <ScrollView contentContainerStyle={[styles.container, {backgroundColor: Colors[theme].background}]}>
            <Image source={require('../assets/images/rio-bg.jpeg')} resizeMode={'cover'} style={styles.backgroundImage} />
            <DataTable style={{flex: 1}}>
                <DataTable.Header style={{backgroundColor: Colors[theme].primary}} >
                    <DataTable.Title style={{flex: 0.1}}>#</DataTable.Title>
                    <DataTable.Title style={{flex: 0.6}}>ime</DataTable.Title>
                    <DataTable.Title style={{flex: 0.3}} numeric>koraci</DataTable.Title>
                </DataTable.Header>
                {
                    contestants
                        .slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)
                        .map((item, i) =>
                            (<DataTable.Row key={i}>
                                <DataTable.Cell style={{flex: 0.1}}>{page * itemsPerPage + i + 1}.</DataTable.Cell>
                                <DataTable.Cell style={{flex: 0.6}}>{item.name}</DataTable.Cell>
                                <DataTable.Cell style={{flex: 0.3}} numeric>{item.steps}</DataTable.Cell>
                            </DataTable.Row>)
                        )
                }

                <DataTable.Pagination
                    page={page}
                    numberOfPages={3}
                    onPageChange={(page) => setPage(page)}
                    label={`page ${page + 1}`}
                    itemsPerPage={itemsPerPage}
                    showFastPagination
                />
            </DataTable>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    image1: {
        height: 400,
        width: '100%',
        position: 'absolute',
        zIndex: 99,
    },
    backgroundImage: {
       width: width,
       height: verticalScale(169),
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
