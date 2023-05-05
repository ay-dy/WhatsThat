import { useContext, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { ChatContext } from "../store/chat-context"
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../constants/colors";


export default function ChatHeader({ messageToDraft }) {
    const chatCtx = useContext(ChatContext);
    const navigation = useNavigation();

    function saveDraft() {
        if (messageToDraft) {
            console.log('Message to be saved.');
        } else {
            console.log('Input box empty.');
        }
    }

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity
                style={[styles.buttonContainer, { alignItems: 'flex-start' }]}
                onPress={() => { navigation.navigate('Chats'); saveDraft(); }}
            >
                <Icon size={24} color={Colors['blue-lightest']} name='arrow-back-outline' />
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>{chatCtx.chat.name}</Text>
            <TouchableOpacity
                style={[styles.buttonContainer, { alignItems: 'flex-end' }]}
                onPress={() => navigation.navigate('ChatSettings')}
            >
                <Image
                    source={require('../assets/images/menu_blue.png')}
                    style={styles.image}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: 64,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors['blue-dark'],
    },
    buttonContainer: {
        width: '15%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    title: {
        width: '70%',
        // textAlign: 'center',
        fontSize: 18,
        fontWeight: "500",
        color: Colors['blue-lightest']
    },
    image: {
        width: 20,
        height: 20
    }
})