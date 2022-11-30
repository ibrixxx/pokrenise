import {View} from "./Themed";
import {scale, verticalScale} from "react-native-size-matters";

const CardView = ({children, style}) => {
    return (
        <View style={[{width: '100%', alignItems: 'center', flex: 4, marginTop: verticalScale(30), borderRadius: scale(12), elevation: 2, shadowColor: 'white', padding: scale(22), backgroundColor: 'rgba(2,2,2,0.15)', overflow: 'hidden'}, style]}>
            {children}
        </View>
    )
}

export default CardView
