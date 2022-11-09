import {Text, View} from "../components/Themed";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Button, Modal, TextInput, Title} from "react-native-paper";
import Colors from "../constants/Colors";
import React, {useRef} from "react";
import {scale, verticalScale} from "react-native-size-matters";
import {LinearGradient} from "expo-linear-gradient";
import {Entypo} from "@expo/vector-icons";
import AppIntroSlider from "react-native-app-intro-slider";
import {auth} from "../firebase";
import ColorPicker from "react-native-wheel-color-picker";
import EmojiSelector from "react-native-emoji-selector";
import { updateProfile } from "firebase/auth";


const AddUserDetails = ({navigation, route}) => {
    const theme = 'dark'

    const picker = useRef(null)

    const [nick, setNick] = React.useState("");
    const [emoji, setEmoji] = React.useState('🧠');
    const [visible, setVisible] = React.useState(false);
    const [visible2, setVisible2] = React.useState(false);
    const [selectedColors, setSelectedColors] = React.useState(['#ffa500', '#00ffff']);
    const [modalColor, setModalColor] = React.useState('#fff');
    const [selectedColor, setSelectedColor] = React.useState(null);

    const formatNick = t => {
        setNick(t)
    }

    const showModal = i => {
        if(i < selectedColors.length)
            setModalColor(selectedColors[i])
        setSelectedColor(i)
        setVisible(true)
    };

    const hideModal = () => {
        setVisible(false);
        setModalColor('#fff')
    }

    const showModal2 = () => {
        setVisible2(true)
    };
    const hideModal2 = () => {
        setVisible2(false);
    }

    const addOrChangeColor = () => {
        let pom = selectedColors
        if(selectedColor < selectedColors.length)
            pom[selectedColor] = modalColor
        else
            pom.push(modalColor)
        setSelectedColors(pom)
        hideModal()
    }

    const removeColor = () => {
        setSelectedColors(selectedColors.filter((c, i) => i !== selectedColor))
        hideModal()
    }

    const onConfirm = () => {
        updateProfile(auth.currentUser, {
            displayName: nick.toLowerCase(), photoURL: selectedColors.toString() + ',' + emoji
        }).then(() => {
            navigation.replace('ProfileHome')
        }).catch((error) => {
            console.log(error)
        });
    }

    const slides = [
        {
            id: 0,
            title: "napravite svoj @"
        },
        {
            id: 1,
            title: "napravite svoj avatar"
        },
        {
            id: 2,
            title: "gotovo?"
        },
    ]

    const renderItem = ({item}) => {
        if(item.id === -1 && !auth.currentUser.emailVerified) {
            console.log(auth.currentUser.emailVerified)
            return (
                <View style={styles.container}>
                    <Title style={[styles.title, {
                        color: Colors[theme].tabIconDefault,
                        width: '100%',
                        fontSize: scale(27),
                        flex: 1
                    }]}>{item.title}</Title>
                </View>
            )
        }
        else if(item.id === 0)
            return (
                <View style={styles.container}>
                    <Title style={[styles.title, {color: Colors[theme].tabIconDefault, width: '100%', fontSize: scale(27), flex: 1}]}>{item.title}</Title>
                    <View style={{width: '100%', justifyContent: 'center', flex: 4}}>
                    <TextInput
                        autoCapitalize={'none'}
                        mode={'outlined'}
                        style={[styles.input, {backgroundColor: Colors[theme].background}]}
                        label="@"
                        placeholder={'@nabildani_mozak'}
                        value={nick}
                        activeOutlineColor={Colors[theme].primary}
                        outlineColor={Colors[theme].tabIconDefault}
                        onChangeText={text => {
                            formatNick(text.replace(/\s/g, ''))
                        }}
                        theme={{ colors: { text: Colors[theme].text, placeholder: Colors[theme].tabIconDefault }}}
                    />
                    </View>
                </View>
            )

        else if(item.id === 1)
            return (
                <View style={styles.container}>
                    <Title style={[styles.title, {color: Colors[theme].tabIconDefault, width: '100%', fontSize: scale(27), flex: 1}]}>{item.title}</Title>
                    <View style={{width: '100%', alignItems: 'center', flex: 4}}>
                        <View style={styles.profileOutline}>
                            <LinearGradient
                                colors={selectedColors}
                                style={styles.profileBackground}
                            >
                                <Text style={{fontSize: scale(55)}}>{emoji}</Text>
                            </LinearGradient>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '70%', justifyContent: 'space-between'}}>
                            {
                                selectedColors.map((c, i) => {
                                        return (<TouchableOpacity key={i} onPress={() => showModal(i)} style={styles.colorOutline}>
                                                    <View style={[styles.colorBackground, {backgroundColor: c}]}/>
                                                </TouchableOpacity>)
                                })
                            }
                            {
                                selectedColors.length < 3 &&
                                <TouchableOpacity onPress={() => showModal(selectedColors.length)} style={styles.colorOutline}>
                                    <View style={styles.colorBackground}>
                                        <Entypo name="plus" size={33} color="gray"/>
                                    </View>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={showModal2} style={styles.colorOutline}>
                                <View style={styles.colorBackground}>
                                    <Text style={{fontWeight: 'bold', fontSize: scale(19)}}>{emoji}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        return (
            <View style={styles.container}>
                <Title style={[styles.title, {color: Colors[theme].tabIconDefault, width: '100%', fontSize: scale(33), flex: 1}]}>{item.title}</Title>
                <View style={{width: '100%', alignItems: 'center', flex: 4}}>
                    <View style={styles.profileOutline}>
                        <LinearGradient
                            colors={selectedColors}
                            style={styles.profileBackground}
                        >
                            <Text style={{fontSize: scale(55)}}>{emoji}</Text>
                        </LinearGradient>
                    </View>
                    <Title style={[styles.title, {color: Colors[theme].text, width: '100%', fontSize: scale(27)}]}>@{nick.toLowerCase()}</Title>
                </View>
            </View>
        )
    }

    const nextButton = () => (
        nick.length < 2 ? null :
        <Button uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary}>
            <Text style={[styles.title, {color: Colors[theme].text}]}>aj dalje</Text>
        </Button>
    )

    const doneButton = () => (
        <Button uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary}>
            <Text style={[styles.title, {color: Colors[theme].text}]}>potvrdi</Text>
        </Button>
    )

    const prevButton = () => (
        <Button uppercase={false} style={styles.button} mode="outlined" color={Colors[theme].primary}>
            <Text style={[styles.title, {color: Colors[theme].tabIconDefault}]}>vrati</Text>
        </Button>
    )


    return(
        <View style={{width: '100%', height: '100%'}}>

            <AppIntroSlider
                renderItem={renderItem}
                data={slides}
                scrollEnabled={false}
                onDone={onConfirm}
                showPrevButton={true}
                renderDoneButton={doneButton}
                renderNextButton={nextButton}
                renderPrevButton={prevButton}
                dotClickEnabled={false}
                dotStyle={{backgroundColor: Colors[theme].tabIconDefault}}
                activeDotStyle={{backgroundColor: Colors[theme].primary}}
            />

            <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={{paddingHorizontal: scale(20), borderRadius: scale(12), height: '59%', width: '100%', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors[theme].background}}>
                <Text style={[styles.title, {flex: 1}]}>{modalColor}</Text>
                <View style={{flex: 4, marginBottom: verticalScale(30), width: '90%'}}>
                    <ColorPicker
                        ref={picker}
                        color={modalColor}
                        onColorChange={color => setModalColor(color)}
                        onColorChangeComplete={color => setModalColor(color)}
                        thumbSize={40}
                        sliderSize={40}
                        noSnap={false}
                        row={false}
                        swatches={false}
                        sliderSize={scale(20)}
                    />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between',  width: '100%'}}>
                    {selectedColors.length === 3 && <Button onPress={removeColor} uppercase={false} style={styles.button} mode="outlined" color={Colors[theme].primary}><Text style={[styles.title, {color: 'firebrick'}]}>ukloni</Text></Button>}
                    <Button onPress={hideModal} uppercase={false} style={styles.button} mode="outlined" color={Colors[theme].primary}><Text style={[styles.title, {color: Colors[theme].text}]}>otkaži</Text></Button>
                    <Button onPress={addOrChangeColor} uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary}><Text style={[styles.title, {color: Colors[theme].text}]}>izaberi</Text></Button>
                </View>
            </Modal>

            <Modal
                visible={visible2}
                onDismiss={hideModal2}
                contentContainerStyle={{paddingHorizontal: scale(20), borderRadius: scale(12), height: '69%', width: '100%', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors[theme].background}}>
                <Text style={[styles.title, {flex: 1, fontStyle: 'normal'}]}>{emoji}</Text>
                <View style={{flex: 4, marginBottom: verticalScale(30), width: '90%'}}>
                    <EmojiSelector onEmojiSelected={emoji => setEmoji(emoji)} theme={Colors[theme].primary} showSearchBar={false}/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between',  width: '100%', marginTop: verticalScale(20)}}>
                    <Button onPress={hideModal2} uppercase={false} style={styles.button} mode="outlined" color={Colors[theme].primary}><Text style={[styles.title, {color: Colors[theme].text}]}>otkaži</Text></Button>
                    <Button onPress={hideModal2} uppercase={false} style={styles.button} mode="contained" color={Colors[theme].primary}><Text style={[styles.title, {color: Colors[theme].text}]}>izaberi</Text></Button>
                </View>
            </Modal>

        </View>
    )
}

export default AddUserDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: scale(30),
        paddingTop: scale(44),
        width: '100%'
    },
    input: {
        borderRadius: scale(12),
        marginBottom: verticalScale(10)
    },
    button: {
        borderRadius: scale(12),
        marginBottom: verticalScale(20)
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
