import React from "react";
import {Image, Pressable, StyleSheet} from "react-native";
import {Text, View} from "./Themed";
import {FontAwesome} from "@expo/vector-icons";

const AudioCard = ({
    handleOnPress,
    handleAudioIcon,
    m,
}) => {
    return (
        <View style={styles.card}>
            <Image source={{uri: m.imageUrl}} style={styles.image}/>
            <Text>{m.title}</Text>
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
        width: '69%',
        height: '30%',
        elevation: 24,
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 20,
        marginBottom: '5%',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
    },
    pressable: {width: '10%', height: '100%', justifyContent: 'center'},
    image: {width: '20%', height: '100%', borderTopLeftRadius: 20, borderBottomLeftRadius: 20}
});

export default AudioCard
