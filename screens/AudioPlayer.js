import {Image, Pressable, StyleSheet, useColorScheme} from 'react-native';
import {Text, View} from "../components/Themed";
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AudioPlayer({route, navigation}) {
    const theme = useColorScheme()
    const {img, iconName} = route.params
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AntDesign name="down" size={24} color='gray' />
                <AntDesign name="download" size={24} color={Colors[theme].primary} />
            </View>
            <Pressable style={{width: '100%', height: '42%', flex: 3, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={{uri: img}} style={{width: '90%', height: '100%'}} />
            </Pressable>
            <View style={styles.footer}>
                <MaterialCommunityIcons name="rewind-15" size={24} color="gray" />
                <MaterialCommunityIcons name="skip-previous" size={33} color={Colors[theme].primary} />
                <Pressable style={[styles.buttonPlay, {backgroundColor: Colors[theme].primary}]}>
                    <FontAwesome name={iconName} color={'black'} size={24} />
                </Pressable>
                <MaterialCommunityIcons name="skip-next" size={33} color={Colors[theme].primary} />
                <MaterialCommunityIcons name="fast-forward-15" size={24} color="gray" />
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
        margin: scale(30),
        flex: 1
    },
    footer: {
        flexDirection: "row",
        alignContent: 'space-between',
        flex: 1,
        margin: scale(10),
        justifyContent: 'center',
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
