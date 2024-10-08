import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {useCallback, useEffect, useState} from "react";
const { width } = Dimensions.get("screen");
import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import CircularProgress from "react-native-circular-progress-indicator";
import {FontAwesome5, MaterialCommunityIcons} from "@expo/vector-icons";
import CardView from "../components/CardView";
import {Caption, DataTable, Title} from "react-native-paper";
// import {HealthKitDataType} from "@kilohealth/rn-fitness-tracker/src/enums/healthKitDataType";
import {GoogleFitDataType} from "@kilohealth/rn-fitness-tracker/src/enums/googleFitDataType";
// import {FitnessTracker, GoogleFit} from "@kilohealth/rn-fitness-tracker/src/api";
import {FitnessDataType} from "@kilohealth/rn-fitness-tracker/src/types/fitnessTypes";
import {useFocusEffect} from "@react-navigation/native";
import {GoogleFit} from "@kilohealth/rn-fitness-tracker/src/api";

// const permissions = {
//     healthReadPermissions: [HealthKitDataType.StepCount],
//     googleFitReadPermissions: [GoogleFitDataType.Steps],
// };

export default function CommunityScreen() {
    const theme = 'dark'

    const [currentStepsCount, setCurrentStepsCount] = useState(0)
    const distance = (currentStepsCount/1408).toFixed(1)
    const kcal = (currentStepsCount*0.03).toFixed(0)

    useFocusEffect(
        useCallback(() => {
            const getStepsToday = async () => {
                const authorized = await GoogleFit.authorize([GoogleFitDataType.Steps], [GoogleFitDataType.Steps]);
                console.log(authorized)
                if (!authorized) return;
                const stepsToday = await GoogleFit.getStatisticTodayTotal(
                    FitnessDataType.Steps,
                );
                console.log(stepsToday);
                setCurrentStepsCount(stepsToday);
            };
            GoogleFit.isTrackingAvailable([GoogleFitDataType.Steps], [GoogleFitDataType.Steps])
                .then(() => getStepsToday().catch(e => console.log('e ', e)))
                .catch(e => console.log('er ', e))
            }, []
        )
    )

    return (
        <View style={[styles.container, {backgroundColor: Colors[theme].background}]}>
            <CardView
                style={{padding: scale(12), flex: 4}}
                children={
                <>
                    <CircularProgress
                        value={currentStepsCount}
                        maxValue={10000}
                        radius={verticalScale(80)}
                        progressValueColor={'#ecf0f1'}
                        activeStrokeColor={Colors[theme].primary}
                        inActiveStrokeColor={'black'}
                        inActiveStrokeOpacity={0.5}
                        inActiveStrokeWidth={40}
                        activeStrokeWidth={20}
                        title={'steps'}
                        titleColor={'white'}
                    />
                    <View style={{flexDirection: 'row', marginTop: verticalScale(10), justifyContent: 'space-between', width: '75%'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginRight: scale(10)}}>
                                <MaterialCommunityIcons name="map-marker-distance" size={26} color="white" />
                                <Caption>km</Caption>
                            </View>
                            <Title>{distance}</Title>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginRight: scale(10)}}>
                                <FontAwesome5 name="fire-alt" size={24} color="white" />
                                <Caption>kcal</Caption>
                            </View>
                            <Title>{kcal}</Title>
                        </View>
                    </View>
                </>
            }
          />
            <CardView
                style={{padding: scale(12), flex: 5}}
                children={
                <ScrollView style={{flexGrow: 1, height: '100%', width: '100%'}}>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>#</DataTable.Title>
                            <DataTable.Title style={{flex: 4}}>name</DataTable.Title>
                            <DataTable.Title numeric>steps</DataTable.Title>
                        </DataTable.Header>

                        <DataTable.Row style={{backgroundColor: 'rgba(255, 215, 0, 0.15)'}}>
                            <DataTable.Cell>1.</DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>Frozen yogurt</DataTable.Cell>
                            <DataTable.Cell numeric>159</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row style={{backgroundColor: 'rgba(192, 192, 192, 0.15)'}}>
                            <DataTable.Cell>2.</DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>Ice cream sandwich</DataTable.Cell>
                            <DataTable.Cell numeric>237</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row style={{backgroundColor: 'rgba(205, 127, 50, 0.15)'}}>
                            <DataTable.Cell>3.</DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>Ice cream sandwich</DataTable.Cell>
                            <DataTable.Cell numeric>237</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row>
                            <DataTable.Cell>4.</DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>Ice cream sandwich</DataTable.Cell>
                            <DataTable.Cell numeric>237</DataTable.Cell>
                        </DataTable.Row>

                        <DataTable.Row style={{backgroundColor: Colors[theme].primary, opacity: 0.7}}>
                            <DataTable.Cell>23.</DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>cream sandwich</DataTable.Cell>
                            <DataTable.Cell numeric>237</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                </ScrollView>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(30)
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
