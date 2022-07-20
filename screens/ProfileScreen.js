import React, {useEffect} from "react";
import {StyleSheet} from 'react-native';
import {Text, View} from "../components/Themed";
import {Button, TextInput} from "react-native-paper";
import Colors from "../constants/Colors";
import {scale, verticalScale} from "react-native-size-matters";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {auth} from "../firebase";
import { useUserUpdate} from "../context/AppContext";
import {useNavigation} from "@react-navigation/native";


export default function ProfileScreen() {
    const theme = 'dark'
    const setUser = useUserUpdate()
    const navigation = useNavigation()

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user)
                setUserData(user)
            } else {
                setUserData()
            }
        })
        return unsubscribe
    }, [])

    const setUserData = user => {
        if(user)
            setUser({
                isLogged: true,
                token: user.stsTokenManager.accessToken,
                refreshToken: user.stsTokenManager.refreshToken,
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoUrl: user.photoURL,
                phoneNumber: user.phoneNumber
            })
        else
            setUser({
                isLogged: false,
            })
    }

    const onRegister = () => {
        createUserWithEmailAndPassword(auth, email.trim(), password)
            .then(res => {
                navigation.replace('AddUserDetails', {auth: auth})
            })
            .catch(e => console.log(e))
    }

    const onLogin = () => {
        signInWithEmailAndPassword(auth, email.trim(), password)
            .then(res => {
                navigation.replace('AddUserDetails', {auth: auth})
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
