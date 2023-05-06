import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { getChats, removeChatParticipant, updateChatName, getChatDetails } from "../utils/api-service";
import { ChatContext } from "../store/chat-context";
import { AuthContext } from "../store/auth-context";
import { ChatsContext } from "../store/chats-context";
import { ChatsDetailsContext } from "../store/chats-details-context";
import { Menu, MenuItem } from "react-native-material-menu";
import { useNavigation } from "@react-navigation/native";

import SpinnerOverlay from "../components/SpinnerOverlay";
import ChatNameInput from "../components/ChatNameInput";
import Colors from "../constants/colors";

export default function ChatSettingsScreen() {
    const chatCtx = useContext(ChatContext);
    const authCtx = useContext(AuthContext);
    const chatsCtx = useContext(ChatsContext);
    const chatsDetailsCtx = useContext(ChatsDetailsContext);

    const [chat, setChat] = useState();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [participantId, setParticipantId] = useState();
    const [isFetching, setIsFetching] = useState();

    const navigation = useNavigation();

    useEffect(() => {
        setChat(chatCtx.chat);
    }, [chatCtx.chat])

    async function updateName(chatName) {
        if (chatName != chatCtx.chat.name) {
            setIsFetching(true);

            const results = await updateChatName(chat.chat_id, { name: chatName }, authCtx.token);

            if (results.response.ok) {
                chat.name = chatName;

                const results = await getChats(authCtx.token);
                if (results.response.ok) {
                    chatsCtx.set(results.responseData);
                }
            }
            setIsFetching(false);
        }
    }

    async function updateChat() {
        let getChatDetailsResults = await getChatDetails(chat.chat_id, authCtx.token);

        if (getChatDetailsResults.response.ok) {
            let allChats = chatsDetailsCtx.chatsDetails;
            let thisChatUpdated = getChatDetailsResults.responseData;
            thisChatUpdated.chat_id = chat.chat_id;

            // Remove the outdated chat object and replace it with the new one.
            allChats.splice(allChats.findIndex(c => c.chat_id === chat.chat_id), 1);
            chatCtx.set(thisChatUpdated);
            chatsDetailsCtx.set([...allChats, thisChatUpdated]);
        }
    }

    function renderParticipant(data) {
        data = data.item;
        return (
            <TouchableOpacity
                onPress={() => {
                    if ((data.user_id != authCtx.id) && (authCtx.id === chat.creator.user_id)) {
                        setParticipantId(data.user_id);
                        showMenu();
                    }
                }}
                style={styles.participantContainer}
            >
                <Image
                    style={styles.participantPhoto}
                    source={data.profile_photo}
                />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.participantName}>{data.user_id === authCtx.id ? 'You' : data.first_name}</Text>
                    {(data.user_id === chat.creator.user_id) &&
                        <View style={styles.adminBadge}>
                            <Text style={styles.adminBadgeText}>Group Admin</Text>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    function showMenu() {
        setIsMenuVisible(true);
    }

    function hideMenu() {
        setIsMenuVisible(false);
    }

    async function removeParticipant() {
        setIsFetching(true);
        setIsMenuVisible(false);
        const results = await removeChatParticipant(chat.chat_id, participantId, authCtx.token);

        if (results.response.ok) {
            await updateChat();
        }

        setIsFetching(false);
    }

    if (isFetching) {
        return <SpinnerOverlay isFetching={isFetching} />
    } else {
        return (
            <View style={styles.mainContainer}>
                <ChatNameInput defaultValue={chatCtx.chat.name} onSave={updateName} />
                <View style={styles.participantCountContainer}>
                    <Text style={styles.participantCount}>{chat && chat.members.length} members</Text>
                </View>
                {
                    (authCtx.id === (chat && chat.creator.user_id)) ?
                        <TouchableOpacity
                            style={styles.participantContainer}
                            onPress={() => navigation.navigate('AddParticipants')}
                        >
                            <Image
                                style={styles.participantPhoto}
                                source={require('../assets/images/add_user_green.png')}
                            />
                            <Text style={styles.participantName}>Add Participants</Text>
                        </TouchableOpacity> : null
                }
                <Menu
                    visible={isMenuVisible}
                    anchor=
                    {
                        <FlatList
                            inverted
                            data={chat && chat.members}
                            keyExtractor={participant => participant.user_id}
                            renderItem={renderParticipant}
                            style={{ maxHeight: '85%' }}
                        />
                    }
                    onRequestClose={() => hideMenu()}
                    style={styles.menuContainer}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <MenuItem
                            onPress={() => removeParticipant()}
                            pressColor='#2483fe'
                            style={styles.menuItemContainer}
                            textStyle={styles.menuItemText}
                        >
                            Remove
                        </MenuItem>
                    </View>
                </Menu>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 24,
        backgroundColor: Colors['blue-darker']
    },
    participantCountContainer: {
        width: '100%',
        justifyContent: 'flex-sart',
        marginBottom: 12
    },
    participantCount: {
        fontSize: 14,
        color: Colors['blue-lightest']
    },
    participantContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 12,
    },
    participantPhoto: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        marginRight: 16
    },
    participantName: {
        fontSize: 16,
        color: Colors['ice']
    },
    adminBadge: {
        alignSelf: 'flex-end',
        width: 90,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: Colors['midnight']
    },
    adminBadgeText: {
        fontSize: 12,
        color: Colors['green-lighter']
    },
    menuContainer: {
        minWidth: 90,
        marginTop: 24,
        marginLeft: 255,
        borderRadius: 24,
        backgroundColor: Colors['blue'],
        overflow: 'hidden'
    },
    menuItemContainer: {
        minWidth: 90,
        maxWidth: 90,
        minHeight: 36,
        maxHeight: 36,
        alignItems: 'center'
    },
    menuItemText: {
        fontSize: 14,
        color: Colors['ice']
    }
});