import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNewChat, getChats } from "../utils/api-service";
import { AuthContext } from "../store/auth-context";
import { ChatsContext } from "../store/chats-context";
import { useNavigation } from "@react-navigation/native";

import SpinnerOverlay from "../components/SpinnerOverlay";
import Colors from "../constants/colors";
import ChatNameInput from "../components/ChatNameInput";

export default function NewChatScreen() {
    const authCtx = useContext(AuthContext);
    const chatsCtx = useContext(ChatsContext);

    const [isFetching, setIsFetching] = useState(false);
    const [isChatNameEmpty, setIsChatNameEmpty] = useState(false);

    const navigation = useNavigation();

    async function newChat(chatName) {
        chatName = chatName.trim();

        if (chatName) {
            setIsChatNameEmpty(false);
            setIsFetching(true);

            const results = await createNewChat({ name: chatName }, authCtx.token);

            if (results.response.ok) {
                const chats = await getChats(authCtx.token);

                if (chats.response.ok) {
                    chatsCtx.set(chats.responseData);
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