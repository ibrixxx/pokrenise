import { Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import styled, { css } from "styled-components/native";
const { width } = Dimensions.get("screen");


export const Card = styled.View`
  width: ${width}px;
  align-items: center;
  border-radius: 0px;
  overflow: hidden;
  margin: 0 15px;
`;

export const CardHeader = styled.View`
  align-items: center;
  width: 100%;
  top: 80px;
  position: absolute;
  z-index: 999;
`;

export const CardDesc = styled.Text`
  color: white;
  font-family: Roboto;
  margin-bottom: 5px;
  letter-spacing: 2px;
`;

export const PlaceName = styled.Text`
  color: white;
  font-size: 60px;
  font-weight: bold;
  margin-bottom: 30px;
`;

export const CardButtom = styled.TouchableOpacity.attrs({
    activeOpacity: 0.7,
})`
  height: 50px;
  width: 150px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.3);
`;

export const CardButtomText = styled.Text`
  color: white;
  font-family: Roboto;
  letter-spacing: 2px;
`;

export const Pic = styled(Animated.Image).attrs({
    resizeMode: "contain",
})`
  height: 120px;
  width: 200px;
  position: absolute;
  z-index: 99;
  
`;

export const Background = styled(Animated.Image).attrs({
    resizeMode: "contain",
})`
  width: 400px;
  height: 120px;
`;
