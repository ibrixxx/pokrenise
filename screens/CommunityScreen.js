import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import { useEffect, useState } from "react";
const { width } = Dimensions.get("screen");
import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import CircularProgress from "react-native-circular-progress-indicator";
import {FontAwesome5, MaterialCommunityIcons} from "@expo/vector-icons";
import CardView from "../components/CardView";
import {Caption, DataTable, Title} from "react-native-paper";

export default function CommunityScreen() {
    const theme = 'dark'

    const [currentStepsCount, setCurrentStepsCount] = useState(0)

    useEffect(() => {

        }, []
    )

    return (
        <View style={[styles.container, {backgroundColor: Colors[theme].background}]}>
            <CardView
                style={{padding: scale(12), flex: 4}}
                children={
                <>
                    <CircularProgress
                        value={30}
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
                            <Title>9.5</Title>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginRight: scale(10)}}>
                                <FontAwesome5 name="fire-alt" size={24} color="white" />
                                <Caption>kcal</Caption>
                            </View>
                            <Title>2002</Title>
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
