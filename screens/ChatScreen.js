import { useContext, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { getChatDetails, sendMessage, deleteMessage, updateMessage, getChats } from "../utils/api-service";
import { ChatContext } from "../store/chat-context";
import { ChatsDetailsContext } from "../store/chats-details-context";
import { AuthContext } from "../store/auth-context";
import { ContactsContext } from "../store/contacts-context";
import { SettingsContext } from "../store/settings-context";
import { ChatsContext } from "../store/chats-context";

import Colors from "../constants/colors";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader";

export default function ChatScreen() {
    const authCtx = useContext(AuthContext);
    const userCtx = useContext(SettingsContext);
    const chatCtx = useContext(ChatContext);
    const chatsCtx = useContext(ChatsContext);
    const chatsDetailsCtx = useContext(ChatsDetailsContext);
    const contactsCtx = useContext(ContactsContext);

    const [chat, setChat] = useState();
    const [isFetching, setIsFetching] = useState();
    const [inputMode, setInputMode] = useState('send');
    const [messageToDraft, setMessageToDraft] = useState();
    const [messageToUpdate, setMessageToUpdate] = useState();
    const [messageToUpdateId, setMessageToUpdateId] = useState();

    let flatlistRef = useRef();

    useEffect(() => {
        let chat = chatCtx.chat;
        chat.members = prepareParticipants(chat.members);
        setChat(chat);
    }, [chatCtx.chat, chatsDetailsCtx.chatsDetails]);

    function getPreviousMessageData(currentMessage) {
        const messages = chat.messages;
        const currentMessageIndex = messages.indexOf(currentMessage);

        if (currentMessageIndex === messages.length) {
            return null;
        }

        const previousMessage = messages.find(message => messages.indexOf(message) === currentMessageIndex + 1);

        return previousMessage ? previousMessage : null;
    }

    function renderMessage(message) {
        return (
            <Message
                messageData={message.item}
                previousMessageData={getPreviousMessageData(message.item)}
                onUpdateMessage={prepareMessageInput}
                onDeleteMessage={deleteMsg}
            />
        )
    }

    function getMessageInput() {
        if (inputMode === 'update') {
            return (
                <MessageInput
                    onUpdateMessage={updateMsg}
                    onUpdateCancel={() => setInputMode('send')}
                    messageToUpdate={messageToUpdate}
                    onChangeText={setMessageToDraft}
                />
            );
        } else {
            return (
                <MessageInput
                    onSendMessage={sendMsg}
                    onChangeText={setMessageToDraft}
                />
            );
        }
    }

    function prepareMessageInput(message, messageId) {
        setMessageToUpdate(message);
        setMessageToUpdateId(messageId);
        setInputMode('update');
    }

    function prepareParticipants(data) {
        const photos = data.map(participant => {
            if (participant.user_id === authCtx.id) {
                return userCtx.profile_photo;
            }

            let contact = contactsCtx.contacts.find(contact => contact.user_id === participant.user_id);

            return contact ? contact.profile_photo : require('../assets/images/contact_icon_blue.png');
        });

        for (let i in data) {
            data[i].profile_photo = photos[i];
        }

        return data;
    }

    async function updateChat() {
        setIsFetching(true);
        let getChatDetailsResults = await getChatDetails(chat.chat_id, authCtx.token);

        if (getChatDetailsResults.response.ok) {
            let allChats = chatsDetailsCtx.chatsDetails;
            let thisChatUpdated = getChatDetailsResults.responseData;
            thisChatUpdated.chat_id = chat.chat_id;

            // Remove the outdated chat object and replace it with the new one.
            allChats.splice(allChats.findIndex(c => c.chat_id === chat.chat_id), 1);
            chatCtx.set(thisChatUpdated);
            chatsDetailsCtx.set([...allChats, thisChatUpdated]);

            // Update chats context to display the latest message in preview.
            const chats = await getChats(authCtx.token);
            if (chats.response.ok) {
                chatsCtx.set(chats.responseData);
            }
        }
        setIsFetching(false);
    }

    function prepareMessage(message) {
        message = message.trimStart();
        message = message.trimEnd();
        return message;
    }

    async function sendMsg(message) {
        message = prepareMessage(message);
        const sendMessageResults = await sendMessage(chat.chat_id, authCtx.token, { message: message });

        if (sendMessageResults.response.ok) {
            updateChat();
        }
    }

    async function deleteMsg(messageId) {
        const deleteMessageResults = await deleteMessage(chat.chat_id, messageId, authCtx.token);

        if (deleteMessageResults.response.ok) {
            updateChat();
        }
    }

    async function updateMsg(message) {
        message = prepareMessage(message);

        const updateMessageResults = await updateMessage(
            chat.chat_id,
            messageToUpdateId,
            authCtx.token,
            { message: message }
        );

        if (updateMessageResults.response.ok) {
            setMessageToUpdate('');
            setMessageToUpdateId('');
            setInputMode('send');
            updateChat();
        }
        setInputMode('send');
    }

    function displayScreen() {
        return (
            <View style={styles.messagesContainer}>
                <ChatHeader messageToDraft={messageToDraft} />
                <FlatList
                    inverted
                    ref={ref => flatlistRef.current = ref}
                    data={chat && [...chat.messages]}
                    keyExtractor={(message) => message.message_id}
                    renderItem={renderMessage}
                    onContentSizeChange={() => flatlistRef.current.scrollToOffset({ animated: false, offset: 0 })}
                />
                {getMessageInput()}
            </View>
        );
    }

    if (isFetching) {
        return displayScreen();
    } else {
        return displayScreen();
    }
}

const styles = StyleSheet.create({
    messagesContainer: {
        flex: 1,
        backgroundColor: Colors['blue-darker'],
    }
});