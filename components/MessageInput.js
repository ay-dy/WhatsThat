import { useContext, useEffect, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { DraftsContext } from "../store/drafts-context";
import { ChatContext } from "../store/chat-context";

import Colors from "../constants/colors";
import MessageEditPreview from "./MessageEditPreview";

export default function MessageInput({
    onSendMessage,
    onUpdateMessage,
    messageToUpdate,
    onUpdatePreviewClose,
    setMessageToDraft
}) {
    const chatCtx = useContext(ChatContext);
    const draftsCtx = useContext(DraftsContext);

    const [input, setInput] = useState('')
    const [inputHeight, setInputHeight] = useState(21);

    function heightHandler(height) {
        // 126px = 6 lines of text, which is a limit.
        // Add 23 to the height to account for paddingVertical.
        return (input ? (height <= 126 ? setInputHeight(height + 23) : setInputHeight(149)) : setInputHeight(21))
    }

    function resetToDefaults() {
        setInput('');
        if (onUpdatePreviewClose) {
            onUpdatePreviewClose();
        }
    }

    function findDraft() {
        return draftsCtx.drafts ? draftsCtx.drafts.find(draft => draft.chat_id === chatCtx.chat.chat_id) : null;
    }

    function getMessageDraft() {
        let draft = findDraft();
        return draft ? draft.message : '';
    }

    function isDraftMessageToUpdate() {
        let draft = findDraft();
        return draft ? draft.isMessageToUpdate : '';
    }

    useEffect(() => {
        setInput(messageToUpdate);
    }, [messageToUpdate]);

    useEffect(() => {
        setInput(getMessageDraft());
    }, [draftsCtx.drafts]);

    useEffect(() => {
        setMessageToDraft(input);
    }, [input])

    async function submitHandler(input) {
        resetToDefaults();
        setMessageToDraft('');
        if (onSendMessage) {
            await onSendMessage(input);
        } else {
            await onUpdateMessage(input);
        }
    }

    return (
        <View style={styles.mainContainer}>
            <View style={{ width: '80%' }}>
                {((isDraftMessageToUpdate() && input === getMessageDraft()) || onUpdateMessage) &&
                    <MessageEditPreview
                        message={isDraftMessageToUpdate() ? getMessageDraft() : messageToUpdate}
                        closeHandler={resetToDefaults}
                    />
                }
                <View style={[
                    styles.messageInputContainer,
                    { height: Math.max(45, inputHeight) },
                    ((isDraftMessageToUpdate() && input === getMessageDraft()) || onUpdateMessage) ? { borderTopRightRadius: 0, borderTopLeftRadius: 0 } : null
                ]}>
                    <TextInput
                        style={[styles.messageInput, { height: Math.max(21, inputHeight) }]}
                        multiline={true}
                        value={input}
                        placeholder='Message'
                        placeholderTextColor={Colors['grey']}
                        onChangeText={(input) => {
                            setInput(input);
                        }}
                        onContentSizeChange={(event) => {
                            heightHandler(event.nativeEvent.contentSize.height);
                        }}
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={() => input != '' ? submitHandler(input) : null}
            >
                <Image
                    style={styles.sendButton}
                    source={require('../assets/images/send_message_icon.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 8,
        alignItems: 'flex-end',
        justifyContent: 'space-around'
    },
    messageInputContainer: {
        flexDirection: 'column',
        width: '100%',
        padding: 12,
        borderRadius: 16,
        backgroundColor: Colors['blue'],
    },
    messageInput: {
        fontSize: 16,
        paddingRight: 8,
        color: Colors['ice'],
        outlineStyle: 'none',
    },
    sendButton: {
        width: 48,
        height: 48,
        marginLeft: 16
    }
})