import React from "react";
import {Image, Pressable, StyleSheet} from "react-native";
import {Text, View} from "./Themed";
import {FontAwesome} from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

const AudioCard = ({
    handleOnPress,
    handleAudioIcon,
    m,
}) => {
    return (
        <View style={styles.card}>
            <Image resizeMode={'stretch'} source={{uri: m.imageUrl}} style={styles.image}/>
            <Text style={styles.title}>{m.title}</Text>
            <Pressable onPress={() => handleOnPress(m.audioUrl)} style={styles.pressable}>
                <FontAwesome name={handleAudioIcon(m.audioUrl)} color={'white'} size={14} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'darkorange',
        width: scale(250),
        height: verticalScale(100),
        elevation: 24,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 12,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        marginLeft: scale(20)
    },
    pressable: {width: '10%', height: '100%', justifyContent: 'center'},
    image: {width: scale(100), height: '100%', borderTopLeftRadius: 12, borderBottomLeftRadius: 12},
    title: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: scale(10)},
});


export default AudioCard
