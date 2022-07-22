import {Text, View} from "../components/Themed";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Button, Modal, TextInput, Title} from "react-native-paper";
import Colors from "../constants/Colors";
import React, {useRef} from "react";
import {scale, verticalScale} from "react-native-size-matters";
import Swiper from 'react-native-swiper'
import {LinearGradient} from "expo-linear-gradient";
import {Entypo} from "@expo/vector-icons";


const AddUserDetails = ({route, navigation}) => {
    const auth = route.params.auth
    const theme = 'dark'
    const [nick, setNick] = React.useState("");

    const swiperRef = useRef(null)

    const [visible, setVisible] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState('orange');
    const [activeIndex, setActiveIndex] = React.useState(0);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const onConfirm = () => {
        navigation.replace('ProfileHome')
        auth.signOut()
    }

    const onNext = i => {
        setActiveIndex(i)
        swiperRef.current?.scrollBy(i, true)
    }

    return(
        <Swiper
            style={styles.wrapper}
            showsButtons={false}
            scrollEnabled={false}
            loop={false}
            index={activeIndex}
            ref={swiperRef}
            activeDotColor={Colors[theme].primary}
        >
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
                <Button uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary} onPress={() => onNext(1)}>
                    <Text style={[styles.title, {color: Colors[theme].text}]}>aj dalje</Text>
                </Button>
            </View>

            <View style={styles.container}>
                <Title style={[styles.title, {color: Colors[theme].text, width: '100%'}]}>napravite svoj avatar</Title>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={styles.profileOutline}>
                        <LinearGradient
                            colors={['orange', 'aqua']}
                            style={styles.profileBackground}
                        >
                            <Text style={{fontSize: scale(55)}}>🧠</Text>
                        </LinearGradient>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', width: '70%', justifyContent: 'space-between'}}>
                        <TouchableOpacity onPress={showModal} style={styles.colorOutline}>
                            <View style={[styles.colorBackground, {backgroundColor: 'orange'}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showModal} style={styles.colorOutline}>
                            <View style={[styles.colorBackground, {backgroundColor: 'aqua'}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showModal} style={styles.colorOutline}>
                            <View style={styles.colorBackground}>
                                <Entypo name="plus" size={33} color="gray" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={{padding: 20, borderRadius: scale(12), height: '59%', width: '100%', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors[theme].background}}>
                    <Text style={styles.title}>{selectedColor}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                        <Button uppercase={false} style={styles.button} mode="outlined" color={Colors[theme].primary}><Text style={[styles.title, {color: 'firebrick'}]}>ukloni</Text></Button>
                        <Button uppercase={false} style={styles.button} mode="outlined" color={Colors[theme].primary}><Text style={[styles.title, {color: Colors[theme].text}]}>otkaži</Text></Button>
                        <Button uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary}><Text style={[styles.title, {color: Colors[theme].text}]}>izaberi</Text></Button>
                    </View>
                </Modal>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <Button uppercase={false} style={styles.button} mode="outlined" color={Colors[theme].primary} onPress={() => onNext(0)}><Text style={[styles.title, {color: Colors[theme].tabIconDefault}]}>vrati</Text></Button>
                    <Button uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary} onPress={() => onNext(2)}>
                        <Text style={[styles.title, {color: Colors[theme].text}]}>aj dalje</Text>
                    </Button>
                </View>
            </View>

            <View style={styles.container}>
                <Title style={[styles.title, {color: Colors[theme].text, width: '100%'}]}>napravite svoj avatar</Title>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={styles.profileOutline}>
                        <LinearGradient
                            colors={['orange', 'aqua']}
                            style={styles.profileBackground}
                        >
                            <Text style={{fontSize: scale(55)}}>🧠</Text>
                        </LinearGradient>
                    </View>
                    <Title style={[styles.title, {color: Colors[theme].text, width: '100%'}]}>@nabildani_mozak</Title>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <Button uppercase={false} style={styles.button} mode="outlined" color={Colors[theme].primary} onPress={() => onNext(1)}><Text style={[styles.title, {color: Colors[theme].tabIconDefault}]}>vrati</Text></Button>
                    <Button uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary} onPress={onConfirm}>
                        <Text style={[styles.title, {color: Colors[theme].text}]}>potvrdi</Text>
                    </Button>
                </View>
            </View>
        </Swiper>
    )
}

export default AddUserDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: scale(30),
        width: '100%'
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
    colorOutline: {
        borderRadius: scale(10),
        borderColor: 'gray',
        borderWidth: scale(1),
        width: scale(40),
        height: scale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorBackground: {
        borderRadius: scale(9),
        width: '90%',
        height: '90%',
        margin: scale(1),
        justifyContent: 'center',
        alignItems: 'center'
    }
});
