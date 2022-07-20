import {Text, View} from "../components/Themed";
import {StyleSheet} from "react-native";
import {Button, TextInput, Title} from "react-native-paper";
import Colors from "../constants/Colors";
import React from "react";
import {scale, verticalScale} from "react-native-size-matters";

const AddUserDetails = ({route, navigation}) => {
    const auth = route.params.auth
    const theme = 'dark'
    const [nick, setNick] = React.useState("");

    const onConfirm = () => {
        navigation.replace('ProfileHome')
        auth.signOut()
    }

    return(
        <View style={styles.container}>
            <Title style={[styles.title, {color: Colors[theme].text, width: '100%'}]}>napravite svoj @ npr. @nabildani_mozak</Title>
            <TextInput
                mode={'outlined'}
                style={[styles.input, {backgroundColor: Colors[theme].background}]}
                label="@"
                value={nick}
                activeOutlineColor={Colors[theme].primary}
                outlineColor={Colors[theme].tabIconDefault}
                onChangeText={text => setNick(text)}
                theme={{ colors: { text: Colors[theme].text, placeholder: Colors[theme].tabIconDefault }}}
            />
            <Button uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary} onPress={onConfirm}>
                <Text style={[styles.title, {color: Colors[theme].text}]}>potvrdi</Text>
            </Button>
        </View>
    )
}

export default AddUserDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: scale(30),
        alignContent: 'space-between',
    },
    input: {
        borderRadius: scale(12),
        marginBottom: verticalScale(10)
    },
    button: {
        borderRadius: scale(12),
        marginVertical: verticalScale(10)
    },
    title: {
        fontSize: scale(20),
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
});
