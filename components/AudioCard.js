import React from "react";
import {Image, Pressable, StyleSheet, useColorScheme} from "react-native";
import {Text, View} from "./Themed";
import { scale, verticalScale } from 'react-native-size-matters'
import Colors from "../constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';

const AudioCard = ({
    handleOnPress,
    m,
    type
}) => {
    const theme = 'dark' //useColorScheme();

    const formatTitle = () => {
        if(m.title.length > 33)
            return m.title.substring(0, 33).concat('...')
        return m.title
    }

    const getGradientColors = () => {
        if(type === 1)
            return ['transparent', Colors[theme].primary, Colors[theme].primary]
        else if(type === 2)
            return ['transparent', 'dodgerblue', 'blue']
        return ['transparent', 'red', 'firebrick']
    }

    return (
        <Pressable onPress={() => handleOnPress()} style={[styles.card, {backgroundColor: Colors[theme].primary}]}>
            <Image resizeMode={'cover'} source={{uri: m.imageUrl}} style={styles.image}/>
            <LinearGradient
                colors={getGradientColors()}
                style={styles.button}>
                <Text style={styles.title}>{formatTitle()}</Text>
            </LinearGradient>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: scale(120),
        height: verticalScale(100),
        elevation: 24,
        borderColor: 'gray',
        borderWidth: scale(2),
        borderRadius: scale(12),
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        marginLeft: scale(20)
    },
    button: {flex: 1, width: scale(120), justifyContent: 'flex-end', height: '100%', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginTop: -verticalScale(20)},
    image: {flex: 3, width: scale(120), height: '100%', borderTopLeftRadius: 12, borderTopRightRadius: 12},
    title: { paddingLeft: scale(10), paddingRight: scale(5), marginBottom: verticalScale(3), fontSize: 10, fontWeight: 'bold' },
});


export default AudioCard
