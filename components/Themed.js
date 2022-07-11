/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {Text as DefaultText, useColorScheme, View as DefaultView} from 'react-native';

import Colors from '../constants/Colors';

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
