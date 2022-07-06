import {Image, Pressable, StyleSheet, useColorScheme} from 'react-native';
import {Text, View} from "../components/Themed";
import {AntDesign, FontAwesome, MaterialIcons, SimpleLineIcons} from '@expo/vector-icons';
import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextTicker from 'react-native-text-ticker'
import Slider from '@react-native-community/slider';
import {useNavigation} from "@react-navigation/native";

export default function AudioPlayerScreen({route}) {
    const theme = useColorScheme()
    const {img, iconName} = route.params
    const navigation = useNavigation()

    const hendlePlaybackIcon = () => {
        // <SimpleLineIcons name="loop" size={24} color={Colors[theme].tabIconDefault} />
        // <MaterialIcons name="sync-alt" size={24} color={Colors[theme].tabIconDefault} />
        return <MaterialIcons name="sync-disabled" size={24} color={Colors[theme].tabIconDefault} />
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AntDesign name="down" onPress={() => navigation.goBack()} size={24} color={Colors[theme].tabIconDefault} />
                <View style={{flexDirection: 'row'}}>
                    <AntDesign name="download" size={24} style={{paddingRight: scale(10)}} color={Colors[theme].primary} />
                    <AntDesign name="sharealt" size={24} style={{paddingLeft: scale(10)}} color={Colors[theme].primary} />
                </View>
            </View>
            <View style={{flex: 0.5, width: '90%', alignItems: 'center'}}>
                <TextTicker
                    style={{ fontSize: 27, color: 'white', fontWeight: 'bold'}}
                    useNativeDriver={true}
                    loop
                    repeatSpacer={50}
                    marqueeDelay={1000}
                    scrollSpeed={14}
                >
                    Super long piece sdsafds gdfg dg f gdfhfh
                </TextTicker>
            </View>
            <Pressable style={styles.audioImage}>
                <Image source={{uri: img}} style={{width: '90%', height: '100%'}} />
            </Pressable>
            <View style={styles.footer}>
                <View style={{paddingTop: verticalScale(4), alignItems: 'center'}}>
                    <MaterialCommunityIcons name="play-speed" size={24} color={Colors[theme].tabIconDefault} />
                    <Text style={{color: Colors[theme].tabIconDefault, fontSize: 11}}>1.0x</Text>
                </View>
                <AntDesign name="hearto" size={24} color={Colors[theme].tabIconDefault} />
                <MaterialIcons name="sync-disabled" size={24} color={Colors[theme].tabIconDefault} />
            </View>
            <View style={{flex: 0.5, width: '90%'}}>
                <Slider
                    style={{width: '100%', height: verticalScale(40)}}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                />
            </View>
            <View style={styles.footer}>
                <MaterialCommunityIcons name="rewind-15" size={24} color={Colors[theme].tabIconDefault} />
                <MaterialCommunityIcons name="skip-previous" size={33} color={Colors[theme].primary} />
                <Pressable style={[styles.buttonPlay, {backgroundColor: Colors[theme].primary}]}>
                    <FontAwesome name={iconName} color={'black'} size={24} />
                </Pressable>
                <MaterialCommunityIcons name="skip-next" size={33} color={Colors[theme].primary} />
                <MaterialCommunityIcons name="fast-forward-15" size={24} color={Colors[theme].tabIconDefault} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    audioImage: {
        width: '100%',
        height: '42%',
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonPlay: {
        width: scale(55),
        height: scale(55),
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
    },
    header: {
        flexDirection: "row",
        alignContent: 'space-between',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: scale(40),
        flex: 1
    },
    footer: {
        flexDirection: "row",
        alignContent: 'space-between',
        flex: 1,
        margin: scale(10),
        justifyContent: 'space-between',
        width: '80%',
        alignItems: 'center',
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
