import { useState } from "react"
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native"
import Colors from "../constants/colors";

export default function ChatNameInput({ defaultValue, onSave }) {
    const [chatName, setChatName] = useState();
    const [inputHeight, setInputHeight] = useState(24);
    const [isSaveButtonVisible, setIsSaveButtonVisible] = useState()

    function inputHandler(input) {
        input = input.replace('\n', '');
        setChatName(input);
        setIsSaveButtonVisible(input != defaultValue);
    }

    // If chat name without spaces at the beginning and end of the string is the same, don't save it.
    function saveHandler() {
        let input = chatName;

        input = input.trim();

        setChatName(input);
        onSave(input);
    }

    function heightHandler(height) {
        if (height <= 72) {
            setInputHeight(height - 1);
        }
    }

    return (
        <View style={styles.chatNameContainer}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.chatNameLabel}>Chat Name</Text>
                <Text style={styles.chatNameLabel}>{chatName ? chatName.length : defaultValue.length} / 100</Text>
            </View>
            <TextInput
                multiline
                style={[styles.chatName, { height: Math.max(24, inputHeight) }]}
                defaultValue={defaultValue}
                placeholder="Chat name..."
                placeholderTextColor={Colors['grey']}
                value={chatName}
                onChangeText={(input) => inputHandler(input)}
                maxLength={100}
                onContentSizeChange={(event) => heightHandler(event.nativeEvent.contentSize.height)}
            />
            {isSaveButtonVisible &&
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => { saveHandler(); setIsSaveButtonVisible(false); }}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    chatNameContainer: {
        width: '100%',
        flexDiredction: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 24
    },
    chatNameLabel: {
        fontSize: 14,
        color: Colors['blue-lightest'],
        marginBottom: 4
    },
    chatName: {
        width: '100%',
        paddingRight: 16,
        color: Colors['ice'],
        fontSize: 18,
        outlineStyle: 'none',
    },
    saveButton: {
        alignSelf: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 8,
        borderRadius: 18,
        backgroundColor: Colors['green']
    },
    saveButtonText: {
        fontSize: 16,
        color: Colors['ice']
    },
})