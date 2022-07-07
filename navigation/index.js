import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {useColorScheme} from 'react-native';
import Colors from '../constants/Colors';
import CommunityScreen from "../screens/CommunityScreen";
import AudioPlayerScreen from "../screens/AudioPlayerScreen";
import AudioScreen from "../screens/AudioScreen";
import ProfileScreen from "../screens/ProfileScreen";


export default function Navigation({ colorScheme }) {
    return (
        <NavigationContainer
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator();

function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false, contentStyle: {backgroundColor: 'black'}}} />
            <Stack.Screen name="NotFound" component={CommunityScreen} options={{ title: 'Oops!' }} />
            <Stack.Group screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }}>
                <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} />
            </Stack.Group>
        </Stack.Navigator>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="Audio"
            sceneContainerStyle={{marginBottom: 10}}
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tabIconSelected,
                tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors[colorScheme].tabColor
                }
            }}
        >
            <BottomTab.Screen
                name="Audio"
                component={AudioScreen}
                options={{
                    tabBarLabel: () => null,
                    tabBarItemStyle: {paddingBottom: 5},
                    tabBarIcon: ({ color }) => <TabBarIcon name="play" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Community"
                component={CommunityScreen}
                options={{
                    tabBarLabel: () => null,
                    tabBarItemStyle: {paddingBottom: 5},
                    tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} size={27}/>,
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: () => null,
                    tabBarItemStyle: {paddingBottom: 5},
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} size={27}/>,
                }}
            />
        </BottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon( props ) {
    return <FontAwesome size={25} style={{ marginBottom: 1 }} {...props} />;
}
