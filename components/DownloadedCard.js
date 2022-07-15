import {scale, verticalScale} from "react-native-size-matters";
import Colors from "../constants/Colors";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Text} from "./Themed";
import {StyleSheet, TouchableOpacity} from "react-native";
import {LinearGradient} from "expo-linear-gradient";

const DownloadedCard = ({title}) => {
    const theme = 'dark'

    return (
        <TouchableOpacity style={[styles.card, {borderColor: Colors[theme].primary}]}>
            <LinearGradient
                colors={['black', Colors[theme].primary]}
                style={styles.gradient}
                end={{x: 0.25, y: 0.85}}
            >
                <MaterialCommunityIcons name="file-music" size={24} color={Colors[theme].primary} />
                <Text style={{color: Colors[theme].tabIconDefault, fontWeight: 'bold', fontStyle: 'italic'}}>{title}</Text>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: scale(10),
    }
});
