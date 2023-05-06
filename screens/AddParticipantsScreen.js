import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { ContactsContext } from "../store/contacts-context";
import { ChatContext } from "../store/chat-context";
import { AuthContext } from "../store/auth-context";
import { useNavigation } from "@react-navigation/native";
import { ChatsDetailsContext } from "../store/chats-details-context";
import { addChatParticipant, getChatDetails } from "../utils/api-service";

import SpinnerOverlay from "../components/SpinnerOverlay";
import Colors from "../constants/colors";
import SearchBar from "../components/SearchBar";

export default function AddParticipantsScreen() {
    const authCtx = useContext(AuthContext);
    const chatCtx = useContext(ChatContext);
    const contactsCtx = useContext(ContactsContext);
    const chatsDetailsCtx = useContext(ChatsDetailsContext);

    const [participants, setParticipants] = useState([]);
    const [results, setResults] = useState();
    const [selectedResults, setSelectedResults] = useState([]);
    const [isFetching, setIsFetching] = useState();

    const navigation = useNavigation();

    useEffect(() => {
        setParticipants(chatCtx.chat.members);
    }, [chatCtx.chat]);

    function searchHandler(query) {
        query = query.toLowerCase();

        const results = contactsCtx.contacts.filter(contact => {
            let data = contact.first_name + contact.last_name + contact.email;
            data = data.toLowerCase();
            return data.includes(query);
        });

        setResults(results);
    }

    async function addParticipants() {
        setIsFetching(true);
        await Promise.all(selectedResults.map(async result => {
            const addChatParticipantResults = await addChatParticipant(chatCtx.chat.chat_id, result.user_id, authCtx.token);

            if (addChatParticipantResults.response.ok) {
                console.log('Participant added');
            } else {
                console.log('Failed to add participant.');
            }
        }));
        await updateChat();
        setIsFetching(false);
        navigation.navigate('ChatSettings');
    }

    async function updateChat() {
        let getChatDetailsResults = await getChatDetails(chatCtx.chat.chat_id, authCtx.token);

        if (getChatDetailsResults.response.ok) {
            let allChats = chatsDetailsCtx.chatsDetails;
            let thisChatUpdated = getChatDetailsResults.responseData;
            thisChatUpdated.chat_id = chatCtx.chat.chat_id;

            // Remove the outdated chat object and replace it with the new one.
            allChats.splice(allChats.findIndex(c => c.chat_id === chatCtx.chat.chat_id), 1);
            chatCtx.set(thisChatUpdated);
            chatsDetailsCtx.set([...allChats, thisChatUpdated]);
        }
    }

    function renderContact(contact) {
        contact = contact.item;

        const selected = selectedResults && selectedResults.includes(contact);
        const alreadyInChat = participants.find(participant => participant.user_id === contact.user_id);

        function toggleSelected() {
            if (selected) {
                setSelectedResults(selectedResults.filter(result => result.user_id != contact.user_id));
            } else {
                setSelectedResults([...selectedResults, contact]);
            }
        }

        return (
            <TouchableOpacity
                onPress={() => alreadyInChat ? null : toggleSelected()}
                style={styles.contactContainer}
            >
                <Image
                    style={styles.contactPhoto}
                    source={selected ? require('../assets/images/confirm.png') : contact.profile_photo}
                />
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.contactName}>{contact.first_name}</Text>
                    {alreadyInChat ?
                        <Text style={{ fontStyle: 'italic', color: Colors['grey'] }}>Already added to the group</Text>
                        : null}
                </View>
            </TouchableOpacity>
        );
    }

    function renderSelectedContact(contact) {
        contact = contact.item;
        return (
            <TouchableOpacity
                onPress={() => setSelectedResults(selectedResults.filter(result => result.user_id != contact.user_id))}
                style={styles.selectedContactContainer}
            >
                <View style={styles.selectedContactPhotoWrapper}>
                    <View style={styles.selectedContactPhotoContainer}>
                        <Image
                            style={styles.selectedContactPhoto}
                            source={contact.profile_photo}
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Image
                            style={styles.icon}
                            source={require('../assets/images/x_mark_2_red.png')}
                        />
                    </View>
                </View>

                <Text style={styles.selectedContactName} numberOfLines={1}>{contact.first_name}</Text>
            </TouchableOpacity>
        )
    }

    if (isFetching) {
        return <SpinnerOverlay isFetching={isFetching} />
    } else {
        return (
            <View style={styles.mainContainer}>
                <SearchBar onSearch={searchHandler} returnToScreen={'ChatSettings'} />
                {
                    selectedResults.length ?
                        <View style={styles.selectedContactsContainer}>
                            <FlatList
                                horizontal
                                data={selectedResults}
                                keyExtractor={participant => participant.user_id}
                                renderItem={renderSelectedContact}
                            />
                        </View>
                        : null
                }
                <View style={styles.contactsContainer}>
                    <FlatList
                        data={results}
                        keyExtractor={participant => participant.user_id}
                        renderItem={renderContact}
                    />
                    {
                        selectedResults.length ?
                            <View style={styles.confirmButtonContainer}>
                                <TouchableOpacity
                                    onPress={() => addParticipants()}
                                >
                                    <Image
                                        style={styles.confirmButton}
                                        source={require('../assets/images/confirm.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            : null
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: Colors['blue-darker']
    },
    text: {
        fontSize: 16,
        color: Colors['ice']
    },
    contactsContainer: {
        flex: 1,
        width: '100%',
        padding: 24,
        alignItems: 'flex-start',
        justifyContent: 'flex-end'
    },
    contactContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 12,
    },
    contactPhoto: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        marginRight: 16
    },
    contactName: {
        fontSize: 16,
        color: Colors['ice'],
    },
    selectedContactsContainer: {
        width: '100%',
        height: 100,
        padding: 24,
        paddingBottom: 0,
    },
    selectedContactContainer: {
        flex: 1,
        width: 80,
        maxWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedContactPhotoWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedContactPhotoContainer: {
        width: 52,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedContactPhoto: {
        width: 48,
        height: 48,
        borderRadius: '50%',
    },
    iconContainer: {
        width: 52,
        height: 52,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        position: 'absolute'
    },
    icon: {
        width: 16,
        height: 16
    },
    selectedContactName: {
        fontSize: 14,
        color: Colors['grey'],
    },
    confirmButtonContainer: {
        flex: 1,
        alignSelf: 'flex-end',
        position: 'absolute'
    },
    confirmButton: {
        width: 48,
        height: 48,
        borderRadius: '50%'
    }
});