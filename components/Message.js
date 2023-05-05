import { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { Menu, MenuItem } from "react-native-material-menu";

import Colors from '../constants/colors';

export default function Message({
    messageData,
    previousMessageData,
    onUpdateMessage,
    onDeleteMessage
}) {
    const authCtx = useContext(AuthContext);

    const [menuVisible, setMenuVisible] = useState(false);

    function getTime() {
        return new Date(messageData.timestamp).toTimeString().substring(0, 5);
    }

    function isNotYourMessage() {
        if (!(messageData.author.user_id === authCtx.id)) {
            return (
                {
                    alignSelf: 'flex-start',
                    backgroundColor: Colors['blue-light'],
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 16,
                }
            )
        } else {
            return null
        }
    }

    function isPreviousMessageDateDifferent() {
        const currentMessageDate = new Date(messageData.timestamp);
        const previousMessageDate = new Date(previousMessageData ? previousMessageData.timestamp : null);

        if (currentMessageDate.getDay() != previousMessageDate.getDay()) {
            return (
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{currentMessageDate.toLocaleDateString()}</Text>
                </View>
            )
        } else {
            return null;
        }
    }

    function isPreviousMessageBySameAuthor() {
        return previousMessageData ? messageData.author.user_id === previousMessageData.author.user_id : false;
    }

    function updateMessageHandler() {
        onUpdateMessage(messageData.message, messageData.message_id);
        hideMenu();
    }

    async function deleteMessageHandler() {
        await onDeleteMessage(messageData.message_id);
        hideMenu();
    }

    function showMenu() {
        setMenuVisible(true);
    }

    function hideMenu() {
        setMenuVisible(false);
    }

    return (
        <View style={styles.messageOuterContainer}>
            {isPreviousMessageDateDifferent()}
            {isNotYourMessage()
                ?
                <View style={[styles.messageInnerContainer, isNotYourMessage()]}>
                    {!isPreviousMessageBySameAuthor() ?
                        <Text style={[styles.authorText]}>{messageData.author.first_name}</Text>
                        : null
                    }
                    <Text style={styles.messageText}>{messageData.message}</Text>
                    <Text style={styles.timeText}>{getTime()}</Text>
                </View>
                :
                <Menu
                    visible={menuVisible}
                    anchor=
                    {
                        <View style={[styles.messageInnerContainer, isNotYourMessage()]}>
                            <TouchableOpacity
                                onLongPress={() => showMenu()}
                            >
                                <Text style={styles.messageText}>{messageData.message}</Text>
                                <Text style={styles.timeText}>{getTime()}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    onRequestClose={() => hideMenu()}
                    style={styles.menuContainer}
                >
                    <View
                        style={{ flexDirection: 'row' }}
                    >
                        <MenuItem
                            onPress={() => updateMessageHandler()}
                            pressColor='#2483fe'
                            style={styles.menuItemContainer}
                            textStyle={styles.menuItemText}
                        >
                            Edit
                        </MenuItem>
                        <MenuItem
                            onPress={() => deleteMessageHandler()}
                            pressColor='#2483fe'
                            style={styles.menuItemContainer}
                            textStyle={styles.menuItemText}
                        >
                            Delete
                        </MenuItem>
                    </View>
                </Menu>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    messageOuterContainer: {
        paddingHorizontal: 16,
        paddingVertical: 4
    },
    messageInnerContainer: {
        maxWidth: '80%',
        alignSelf: 'flex-end',
        backgroundColor: Colors['green'],
        borderRadius: 16,
        borderTopRightRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    authorText: {
        maxWidth: '100%',
        marginBottom: 2,
        fontSize: 14,
        color: Colors['gold'],
        fontWeight: 'bold',
    },
    messageText: {
        maxWidth: '100%',
        fontSize: 16,
        color: Colors['ice'],
        alignSelf: 'flex-start'
    },
    timeText: {
        fontSize: 12,
        color: Colors['grey'],
        alignSelf: 'flex-end',
        marginLeft: 4,
        marginTop: 4
    },
    dateContainer: {
        backgroundColor: Colors['steel-darker'],
        borderRadius: 8,
        padding: 4,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 16
    },
    dateText: {
        color: Colors['steel-lighter']
    },
    menuContainer: {
        minWidth: 160,
        marginTop: -48,
        marginLeft: 201,
        borderRadius: 40,
        backgroundColor: Colors['blue'],
        overflow: 'hidden'
    },
    menuItemContainer: {
        minWidth: 80,
        maxWidth: 80,
        padding: 0,
        margin: 0
    },
    menuItemText: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors['ice'],
        userSelect: 'none'
    }
});