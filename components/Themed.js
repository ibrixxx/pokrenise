/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {Text as DefaultText, useColorScheme, View as DefaultView} from 'react-native';
import {Title as PaperTitle} from "react-native-paper";

import Colors from '../constants/Colors';
import {scale, verticalScale} from "react-native-size-matters";
import {LinearGradient} from "expo-linear-gradient";

export function useThemeColor(props, colorName) {
    const theme = 'dark' //useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

export function Text(props) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ lightColor, darkColor }, 'text');

    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ lightColor, darkColor }, 'background');

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Title(props) {
    const { style, lightColor, darkColor, colors, ...otherProps } = props;
    const backgroundColor = useThemeColor({ lightColor, darkColor }, 'background');

    return (<LinearGradient
                colors={colors}
                style={{alignItems: 'center', paddingHorizontal: scale(10), borderRadius: scale(10), marginBottom: verticalScale(5)}}
                end={{x: 0.25, y: 0.85}}
                start={{x: 0.5, y: 1}}
            >
                <PaperTitle style={[{color: Colors['dark'].text, fontStyle: 'italic', fontWeight: 'bold'}, { backgroundColor }, style]} {...otherProps} />
            </LinearGradient>)
}
