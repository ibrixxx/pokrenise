import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {Pressable, useColorScheme} from 'react-native';
import Colors from '../constants/Colors';
import ComunityScreen from "../screens/ComunityScreen";
import ChatScreen from "../screens/ChatScreen";
import FeedScreen from "../screens/FeedScreen";
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
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="NotFound" component={ComunityScreen} options={{ title: 'Oops!' }} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Profile" component={ProfileScreen} />
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
                tabBarActiveTintColor: Colors[colorScheme].tint
            }}>
            <BottomTab.Screen
                name="Audio"
                component={AudioScreen}
                options={({ navigation }) => ({
                    tabBarItemStyle: {paddingBottom: 5},
                    title: 'Audio',
                    tabBarIcon: ({ color }) => <TabBarIcon name="play" color={color} />,
                    headerRight: () => (
                        <Pressable
                            onPress={() => navigation.navigate('Profile')}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <FontAwesome
                                name="user"
                                size={25}
                                color={Colors[colorScheme].text}
                                style={{ marginRight: 15 }}
                            />
                        </Pressable>
                    ),
                })}
            />
            <BottomTab.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    title: 'Feed',
                    tabBarItemStyle: {paddingBottom: 5},
                    tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    title: 'Chat',
                    tabBarItemStyle: {paddingBottom: 5},
                    tabBarIcon: ({ color }) => <TabBarIcon name="commenting-o" color={color} />,
                }}
            />
            <BottomTab.Screen
                name="Comunity"
                component={ComunityScreen}
                options={{
                    title: 'Comunity',
                    tabBarItemStyle: {paddingBottom: 5},
                    tabBarIcon: ({ color }) => <TabBarIcon name="group" color={color} />,
                }}
            />
        </BottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon( props ) {
    return <FontAwesome size={20} style={{ marginBottom: 1 }} {...props} />;
}
