import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native"
import Colors from "../constants/colors";
import Contact from "../components/Contact";

import { ContactsContext } from "../store/contacts-context";
import { useNavigation } from "@react-navigation/native";
import { ContactContext } from "../store/contact-context";

export default function ContactsScreen() {
    const contactsCtx = useContext(ContactsContext);
    const contactCtx = useContext(ContactContext);

    const navigation = useNavigation();

    const [contacts, setContacts] = useState(contactsCtx.contacts);

    useEffect(() => {
        setContacts(contactsCtx.contacts);
    }, [contactsCtx.contacts]);

    function contactHandler(contactId) {
        contactCtx.set(contactId);
        navigation.navigate('Contact')
    }

    function renderContact(contact) {
        return (
            <Contact
                profilePhoto={contact.item.profile_photo}
                firstName={contact.item.first_name}
                onPress={() => contactHandler(contact.item.user_id)}
            />
        )
    }

    if (contacts) {
        return (
            <View style={styles.contactContainer}>
                <FlatList
                    data={contacts}
                    keyExtractor={(contact) => contact.user_id}
                    renderItem={renderContact}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contactContainer: {
        flex: 1,
        paddingTop: 8,
        justifyContent: 'center',
        backgroundColor: Colors['blue-darker'],
    },
    mainText: {
        color: Colors['blue-lightest']
    }
});