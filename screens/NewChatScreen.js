import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNewChat, getChatDetails, getChats } from "../utils/api-service";
import { AuthContext } from "../store/auth-context";
import { ChatsContext } from "../store/chats-context";
import { ChatsDetailsContext } from "../store/chats-details-context";
import { useNavigation } from "@react-navigation/native";

import SpinnerOverlay from "../components/SpinnerOverlay";
import Colors from "../constants/colors";
import ChatNameInput from "../components/ChatNameInput";

export default function NewChatScreen() {
    const authCtx = useContext(AuthContext);
    const chatsCtx = useContext(ChatsContext);
    const chatsDetailsCtx = useContext(ChatsDetailsContext);

    const [isFetching, setIsFetching] = useState(false);
    const [isChatNameEmpty, setIsChatNameEmpty] = useState(false);

    const navigation = useNavigation();

    async function newChat(chatName) {
        chatName = chatName.trim();

        if (chatName) {
            setIsChatNameEmpty(false);
            setIsFetching(true);

            const newChatResults = await createNewChat({ name: chatName }, authCtx.token);

            if (newChatResults.response.ok) {
                const chatsResults = await getChats(authCtx.token);
                const chats = chatsResults.responseData

                if (chatsResults.response.ok) {
                    chatsCtx.set(chats);
                    const chatId = chats.slice(-1).pop().chat_id;
                    const chatDetailsResults = await getChatDetails(chatId, authCtx.token);

                    if (chatDetailsResults.response.ok) {
                        const chatDetails = chatDetailsResults.responseData;
                        chatDetails.chat_id = chatId;
                        chatsDetailsCtx.set([...chatsDetailsCtx.chatsDetails, chatDetails]);
                    }
                }
            }

            setIsFetching(false);
            navigation.navigate('Chats');
        } else {
            setIsChatNameEmpty(true);
        }

    }

    if (isFetching) {
        return (
            <SpinnerOverlay isFetching={isFetching} />
        )
    } else {
        return (
            <View style={styles.mainContainer}>
                <ChatNameInput defaultValue={''} onSave={newChat} />
                {isChatNameEmpty === true ?
                    <Text style={styles.errorMessage}>Chat name cannot be blank</Text>
                    : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: Colors['blue-darker']
    },
    errorMessage: {
        fontSize: 14,
        color: Colors['red-lighter']
    }
});