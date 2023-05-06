import { useContext } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../store/auth-context";
import { ChatContext } from "../store/chat-context";
import { ChatsDetailsContext } from "../store/chats-details-context";
import { useNavigation } from "@react-navigation/native";

import Colors from "../constants/colors";

export default function ChatButton({ chatInfo, draftMessageInfo }) {

    const authCtx = useContext(AuthContext);
    const chatCtx = useContext(ChatContext);
    const chatsDetailsCtx = useContext(ChatsDetailsContext);
    const navigation = useNavigation();

    function convertTimestamp(timestamp) {
        const messageDate = new Date(timestamp);
        const today = new Date();

        const hourDiff = Math.floor((today - messageDate) / 3.6e6);
        /*
            Day difference rounded up is used to account for scenarios such as 
            01/MM/YYYY 23:59 - 02/MM/YYYY 00:00 etc.
        */
        const dayDiff = Math.ceil((today - messageDate) / 8.64e7);
        const sameDay = messageDate.getDate() === today.getDate();

        // Display message time in hh:mm format.
        if ((hourDiff < 24) && (sameDay)) {
            return messageDate.toTimeString().substring(0, 5);
        }

        if (!sameDay && dayDiff === 1) {
            return 'Yesterday';
        }

        // Display message date in DD/MM/YYYY format
        if (dayDiff >= 2) {
            return messageDate.toLocaleDateString();
        }
    }

    function findChatDetails() {
        return chatsDetailsCtx.chatsDetails.find(chat => chat.chat_id === chatInfo.chat_id);
    }

    return (
        <TouchableOpacity
            style={styles.mainContainer}
            onPress={() => {
                chatCtx.set(findChatDetails());
                navigation.navigate('Chat');
            }}
        >
            <View style={styles.chatIcon}>
                <Text style={styles.chatInitial}>{chatInfo.name.substring(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.chatInfoContainer}>
                <View style={styles.chatInfo}>
                    <Text style={styles.chatName} numberOfLines={1}>{chatInfo.name}</Text>
                    <Text style={styles.chatLastMessage}>
                        {
                            draftMessageInfo ?
                                convertTimestamp(draftMessageInfo.timestamp)
                                : chatInfo.last_message ?
                                    convertTimestamp(chatInfo.last_message.timestamp)
                                    : null

                        }
                    </Text>
                </View>
                <View style={styles.chatInfo}>
                    <Text style={styles.chatLastMessage} numberOfLines={1}>
                        {
                            draftMessageInfo ?
                                'Draft: ' + draftMessageInfo.message
                                : chatInfo.last_message.message ?
                                    ((chatInfo.last_message.author.user_id === authCtx.id) ?
                                        'You: ' : chatInfo.last_message.author.first_name.concat(': '))
                                        .concat(chatInfo.last_message.message)
                                    : null
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    },
    chatIcon: {
        width: '12%',
        aspectRatio: 1,
        borderRadius: '50%',
        marginRight: '4%',
        backgroundColor: Colors['blue'],
        alignItems: 'center',
        justifyContent: 'center'
    },
    chatInfoContainer: {
        width: '84%',
    },
    chatInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: '1%'
    },
    chatInitial: {
        fontSize: 24,
        color: Colors['blue-lightest']
    },
    chatName: {
        fontSize: 16,
        color: Colors['ice']
    },
    chatLastMessage: {
        fontSize: 14,
        color: Colors['grey']
    }
});