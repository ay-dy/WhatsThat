import { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View, FlatList, Image, TouchableOpacity } from "react-native"
import { ChatsContext } from "../store/chats-context";
import { useNavigation } from "@react-navigation/native";

import ChatButton from "../components/ChatButton";
import Colors from "../constants/colors";

export default function ChatsScreen() {
    const chatsCtx = useContext(ChatsContext);
    const [chats, setChats] = useState();

    const navigation = useNavigation();

    useEffect(() => {
        setChats(chatsCtx.chats);
    }, [chatsCtx.chats]);

    function renderChat(chatInfo) {
        chatInfo = chatInfo.item;
        return (
            <ChatButton chatInfo={chatInfo} />
        )
    }

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate('NewConversation')}
                style={styles.buttonContainer}
            >
                <Image
                    style={styles.buttonIcon}
                    source={require('../assets/images/message.png')}
                />
                <Text style={styles.buttonText}>New Conversation</Text>
            </TouchableOpacity>
            <FlatList
                data={chats && chats}
                keyExtractor={(chat) => chat.chat_id}
                renderItem={renderChat}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 8,
        backgroundColor: Colors['blue-darker'],
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    },
    buttonIcon: {
        width: '12%',
        aspectRatio: 1,
        borderRadius: '50%',
        marginRight: '4%',
    },
    buttonText: {
        fontSize: 16,
        color: Colors['ice']
    }
});