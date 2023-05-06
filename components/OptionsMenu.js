import { useState, useContext } from "react";
import { StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import { logout } from "../utils/api-service";
import { AuthContext } from '../store/auth-context';
import { SettingsContext } from "../store/settings-context";
import { BlockedContactsContext } from "../store/blocked-contacts-context";
import { ChatContext } from "../store/chat-context";
import { ChatsContext } from "../store/chats-context";
import { ChatsDetailsContext } from "../store/chats-details-context";
import { ContactContext } from "../store/contact-context";
import { ContactsContext } from "../store/contacts-context";
import { useNavigation } from "@react-navigation/native";
import { Menu, MenuItem } from "react-native-material-menu";

import Colors from "../constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OptionsMenu() {
    const [visible, setVisible] = useState(false);

    const authCtx = useContext(AuthContext);
    const blockedContactsCtx = useContext(BlockedContactsContext);
    const chatCtx = useContext(ChatContext);
    const chatsCtx = useContext(ChatsContext);
    const chatsDetailsCtx = useContext(ChatsDetailsContext);
    const contactCtx = useContext(ContactContext);
    const contactsCtx = useContext(ContactsContext);
    const userCtx = useContext(SettingsContext);

    const navigation = useNavigation();

    function hideMenu() {
        setVisible(false);
    }

    function showMenu() {
        setVisible(true);
    }

    async function logoutHandler() {
        authCtx.setFetchingState(true);
        const logoutResults = await logout(authCtx.token);

        if (logoutResults.response.ok) {
            authCtx.logout();
            await AsyncStorage.clear();
            blockedContactsCtx.clear();
            chatCtx.clear();
            chatsCtx.clear();
            chatsDetailsCtx.clear();
            contactCtx.clear();
            contactsCtx.clear();
            userCtx.clear();
        } else {
            console.log('Logout failed.');
        }
        authCtx.setFetchingState(false);
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>WhatsThat</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Add')}
                >
                    <Image
                        style={styles.icon}
                        source={require('../assets/images/add_user_blue.png')}
                    />
                </TouchableOpacity>
                <Menu
                    visible={visible}
                    anchor={
                        <TouchableOpacity onPress={showMenu}>
                            <Image
                                style={styles.icon}
                                source={require('../assets/images/menu_blue.png')}
                            />
                        </TouchableOpacity>
                    }
                    onRequestClose={hideMenu}
                    style={styles.menuContainer}
                >
                    <MenuItem
                        onPress={() => {
                            hideMenu();
                            navigation.navigate('Settings')
                        }}
                        style={styles.menuItemContainer}
                        textStyle={styles.menuItemText}
                    >
                        Settings
                    </MenuItem>
                    <MenuItem
                        onPress={() => {
                            hideMenu();
                            logoutHandler();
                        }}
                        style={styles.menuItemContainer}
                        textStyle={styles.menuItemText}
                    >
                        Log out
                    </MenuItem>
                </Menu>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        flexDirection: 'row',
        padding: 18,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors['blue-dark']
    },
    titleContainer: {
        width: '65%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 20,
        color: Colors['blue-lightest']
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '35%',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    icon: {
        width: 20,
        height: 20
    },
    menuContainer: {
        width: '50%',
        marginTop: 36,
        marginLeft: 8,
        borderRadius: 16,
        borderTopRightRadius: 0,
        backgroundColor: Colors['blue'],
        overflow: 'hidden'
    },
    menuItemContainer: {
        backgroundColor: Colors['blue']
    },
    menuItemText: {
        fontSize: 16,
        color: Colors['ice']
    }
})