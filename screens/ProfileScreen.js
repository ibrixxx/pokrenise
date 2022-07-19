import React from "react";
import {StyleSheet} from 'react-native';
import {Text, View} from "../components/Themed";
import {Button, TextInput} from "react-native-paper";
import Colors from "../constants/Colors";
import {scale, verticalScale} from "react-native-size-matters";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {auth} from "../firebase";
import { useUserUpdate} from "../context/AppContext";


export default function ProfileScreen() {
    const theme = 'dark'
    const setUser = useUserUpdate()

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const setUserData = res => {
        setUser({
            isLogged: true,
            token: res.user.stsTokenManager.accessToken,
            refreshToken: res.user.stsTokenManager.refreshToken,
            uid: res.user.uid,
            email: res.user.email,
            displayName: res.user.displayName,
            photoUrl: res.user.photoURL,
            phoneNumber: res.user.phoneNumber
        })
    }

    const onRegister = () => {
        createUserWithEmailAndPassword(auth, email.trim(), password)
            .then(res => {
                console.log(res)
                setUserData(res)
            })
            .catch(e => console.log(e))
    }

    const onLogin = () => {
        console.log(email.trim() + '11')
        signInWithEmailAndPassword(auth, email.trim(), password)
            .then(res => {
                console.log(res)
                setUserData(res)
            })
            .catch(e => console.log(e))
    }

    return (
        <View style={styles.container}>
            <TextInput
                mode={'outlined'}
                style={[styles.input, {backgroundColor: Colors[theme].background}]}
                label="email"
                value={email}
                activeOutlineColor={Colors[theme].primary}
                outlineColor={Colors[theme].tabIconDefault}
                onChangeText={text => setEmail(text)}
                theme={{ colors: { text: Colors[theme].text, placeholder: Colors[theme].tabIconDefault }}}
            />
            <TextInput
                mode={'outlined'}
                style={[styles.input, {marginBottom: verticalScale(10), backgroundColor: Colors[theme].background}]}
                label="password"
                value={password}
                activeOutlineColor={Colors[theme].primary}
                outlineColor={Colors[theme].tabIconDefault}
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                theme={{ colors: { text: Colors[theme].text, placeholder: Colors[theme].tabIconDefault }}}
            />
            <Button uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary} onPress={onLogin}>
                <Text style={[styles.title, {color: Colors[theme].text}]}>prijavi se</Text>
            </Button>
            <Button uppercase={false} style={[styles.button, {borderColor: Colors[theme].primary, borderWidth: scale(1.5)}]} mode="outlined" color={Colors[theme].primary} onPress={onRegister}>
                <Text style={[styles.title, {color: Colors[theme].primary}]}>registruj se</Text>
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: scale(30),
        alignContent: 'space-between',
    },
    title: {
        fontSize: scale(20),
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    button: {
        borderRadius: scale(12),
        marginVertical: verticalScale(10)
    },
    input: {
        borderRadius: scale(12),
        marginBottom: verticalScale(10)
    },
});
