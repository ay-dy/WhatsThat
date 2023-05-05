import { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { blockContact, deleteContact } from "../utils/api-service";
import { ContactsContext } from "../store/contacts-context";
import { ContactContext } from "../store/contact-context";
import { AuthContext } from "../store/auth-context";
import { BlockedContactsContext } from "../store/blocked-contacts-context";
import { useNavigation } from "@react-navigation/native";

import SpinnerOverlay from "../components/SpinnerOverlay";
import Colors from "../constants/colors";

export default function ContactScreen() {
    const authCtx = useContext(AuthContext);
    const contactsCtx = useContext(ContactsContext);
    const contactCtx = useContext(ContactContext);
    const blockedContactsCtx = useContext(BlockedContactsContext);

    const navigation = useNavigation();

    const [contact, setContact] = useState();
    const [isFetching, setIsFetching] = useState(false);

    function findContact() {
        return contactsCtx.contacts.find(contact => contact.user_id === contactCtx.id);
    }

    useEffect(() => {
        setContact(findContact());
    }, [contactCtx.id]);

    async function deleteHandler() {
        setIsFetching(true);

        const deleteContactResults = await deleteContact(contact.user_id, authCtx.token);

        resultsHandler(deleteContactResults);
        console.log('Contact deleted');

        setIsFetching(false);
    }

    async function blockHandler() {
        setIsFetching(true);

        const blockContactResults = await blockContact(contact.user_id, authCtx.token);

        resultsHandler(blockContactResults);
        blockedContactsCtx.blockedContacts.push(contact);
        console.log('Contact blocked');

        setIsFetching(false);
    }

    function resultsHandler(results) {
        if (results.response.ok) {
            contactsCtx.contacts.splice(contactsCtx.contacts.indexOf(findContact()), 1);
            navigation.navigate('Tabs');
        } else {
            console.log(results.responseData);
        }
    }

    if (contact && !isFetching) {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.detailsContainer}>
                    <Image
                        style={styles.photo}
                        source={{ uri: contact.profile_photo }}
                    />
                    <Text style={styles.name}>{contact.first_name + ' ' + contact.last_name}</Text>
                    <Text style={styles.email}>{contact.email}</Text>
                </View>
                <View style={styles.buttonOuterContainer}>
                    <Pressable style={styles.buttonInnerContainer}
                        onPress={deleteHandler}
                    >
                        <Image
                            style={styles.buttonIcon}
                            source={require('../assets/images/delete_red.png')}
                        />
                        <Text style={styles.buttonText}>Delete</Text>
                    </Pressable>
                </View>
                <View style={styles.buttonOuterContainer}>
                    <Pressable style={styles.buttonInnerContainer}
                        onPress={blockHandler}
                    >
                        <Image
                            style={styles.buttonIcon}
                            source={require('../assets/images/x_mark_red.png')}
                        />
                        <Text style={styles.buttonText}>Block</Text>
                    </Pressable>
                </View>
            </View>
        )
    } else {
        return <SpinnerOverlay isFetching={isFetching} />
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: Colors['blue-darker']
    },
    detailsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 64
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: '50%'
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors['ice'],
        paddingVertical: 16
    },
    email: {
        fontSize: 16,
        color: Colors['ice'],
    },
    buttonOuterContainer: {
        width: '100%',
        height: 64
    },
    buttonInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonIcon: {
        width: 24,
        height: 24,
        marginHorizontal: 24
    },
    buttonText: {
        fontSize: 18,
        color: Colors['red']
    }
});