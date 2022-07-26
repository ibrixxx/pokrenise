import React, {useEffect} from "react";
import {Image, StyleSheet} from 'react-native';
import {Text, View} from "../components/Themed";
import {Button, TextInput, Title} from "react-native-paper";
import Colors from "../constants/Colors";
import {scale, verticalScale} from "react-native-size-matters";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import {auth} from "../firebase";
import {useUser, useUserUpdate} from "../context/AppContext";
import {useNavigation} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";


export default function ProfileScreen() {
    const theme = 'dark'
    const user = useUser()
    const setUser = useUserUpdate()
    const navigation = useNavigation()

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserData(user)
            }
            else {
                setUserData()
            }

        })
        return unsubscribe
    }, [])

    const setUserData = user => {
        if(user)
            setUser({...user, isLogged: true})
        else
            setUser({isLogged: false})
    }

    const onRegister = () => {
        createUserWithEmailAndPassword(auth, email.trim(), password)
            .then(res => {
                navigation.replace('AddUserDetails', {email: email})
                sendEmailVerification(res.user).catch(e => console.log(e))
            })
            .catch(e => console.log(e))
    }

    const onLogin = () => {
        signInWithEmailAndPassword(auth, email.trim(), password)
            .catch(e => console.log(e))
    }

    const getGradient = () => {
        const arr = auth.currentUser.photoURL? auth.currentUser.photoURL.split(',') : ['white', 'black', 'orange']
        return arr.slice(0, arr.length-1)
    }

    return (
        <View style={styles.container}>
            {
                user.isLogged ?
                <View style={{width: '100%', alignItems: 'center', flex: 4, marginTop: verticalScale(30), borderRadius: scale(12), elevation: 12, shadowColor: 'white', padding: scale(22)}}>
                    <View style={styles.profileOutline}>
                        <LinearGradient
                            colors={getGradient()}
                            style={styles.profileBackground}
                        >
                            <Text style={{fontSize: scale(55)}}>{auth.currentUser.photoURL?.split(',').pop()}</Text>
                        </LinearGradient>
                    </View>
                    <Title style={[styles.title2, {color: Colors[theme].text, width: '100%', fontSize: scale(27)}]}>@{auth.currentUser.displayName}</Title>
                    <Button onPress={() => auth.signOut()} uppercase={false} style={styles.button} mode="outlined" color={Colors[theme].primary}>
                        <Text style={[styles.title, {color: 'firebrick'}]}>odjavi se</Text>
                    </Button>
                </View>
                    :
                <>
                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../assets/images/loginLogo.png')} style={{width: scale(156), height: scale(156)}} />
                    </View>
                    <TextInput
                        autoCapitalize={'none'}
                        mode={'outlined'}
                        style={[styles.input, {backgroundColor: Colors[theme].background}]}
                        label="email"
                        value={email}
                        activeOutlineColor={Colors[theme].primary}
                        outlineColor={Colors[theme].tabIconDefault}
                        onChangeText={text => setEmail(text)}
                        theme={{colors: {text: Colors[theme].text, placeholder: Colors[theme].tabIconDefault}}}
                    />
                    <TextInput
                        autoCapitalize={'none'}
                        mode={'outlined'}
                        style={[styles.input, {marginBottom: verticalScale(10), backgroundColor: Colors[theme].background}]}
                        label="password"
                        value={password}
                        activeOutlineColor={Colors[theme].primary}
                        outlineColor={Colors[theme].tabIconDefault}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={true}
                        theme={{colors: {text: Colors[theme].text, placeholder: Colors[theme].tabIconDefault}}}
                    />
                    <Button uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary} onPress={onLogin}>
                        <Text style={[styles.title, {color: Colors[theme].text}]}>prijavi se</Text>
                    </Button>
                    <Button uppercase={false} style={[styles.button, {borderColor: Colors[theme].primary, borderWidth: scale(1.5)}]} mode="outlined" color={Colors[theme].primary} onPress={onRegister}>
                        <Text style={[styles.title, {color: Colors[theme].primary}]}>registruj se</Text>
                    </Button>
                </>
            }
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
    title2: {
        fontSize: scale(20),
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    profileOutline: {
        borderRadius: scale(70),
        borderWidth: scale(2),
        borderColor: 'gray',
        width: scale(140),
        height: scale(140),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20)
    },
    profileBackground: {
        borderRadius: scale(70),
        width: '90%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: scale(5)
    },
});
