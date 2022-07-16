import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Text, View} from "./Themed";
import {StyleSheet, TouchableOpacity} from "react-native";
import {LinearGradient} from "expo-linear-gradient";

const DownloadedCard = ({title}) => {
    const theme = 'dark'

    return (
        <TouchableOpacity style={[styles.card, {borderColor: Colors[theme].primary}]}>
            <LinearGradient
                colors={['black', 'transparent']}
                style={styles.gradient}
                end={{x: 0.25, y: 0.85}}
            >
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'transparent'}}>
                    <MaterialCommunityIcons name="file-music" size={24} color={Colors[theme].primary} />
                    <Text style={{color: Colors[theme].tabIconDefault, fontWeight: 'bold', fontStyle: 'italic', width: '80%'}}>{title}</Text>
                </View>
                <MaterialCommunityIcons onPress={() => console.log('aaa')} style={{width: '100%', height: '100%', alignItems: 'center'}} name="delete-outline" size={24} color={Colors[theme].tabIconDefault} />
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default DownloadedCard

const styles = StyleSheet.create({
    card: {
        marginTop: verticalScale(20),
        borderRadius: scale(12),
        borderWidth: scale(2),
    },
    gradient: {
        flexDirection: 'row',
        padding: scale(14),
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: scale(10),
    }
});
