import { useContext, useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { unblockContact } from "../utils/api-service";
import { BlockedContactsContext } from "../store/blocked-contacts-context";
import { AuthContext } from "../store/auth-context";
import { ContactsContext } from "../store/contacts-context";
import { indexOf } from "lodash";

import Colors from "../constants/colors";
import BlockedContact from "../components/BlockedContact";
import SpinnerOverlay from "../components/SpinnerOverlay";

export default function BlockedContactsScreen() {
    const authCtx = useContext(AuthContext);
    const contactsCtx = useContext(ContactsContext);
    const blockedContactsCtx = useContext(BlockedContactsContext);

    const [blockedContacts, setBlockedContacts] = useState(blockedContactsCtx.blockedContacts);
    const [isFetching, setIsFetching] = useState(false);

    function findBlockedContact(blockedContactId) {
        return blockedContactsCtx.blockedContacts.find(bc => bc.user_id === blockedContactId);
    }

    useEffect(() => {
        setBlockedContacts(blockedContactsCtx.blockedContacts)
    }, [blockedContactsCtx.blockedContacts]);

    async function unblockHandler(blockedContact) {
        setIsFetching(true);

        const unblockContactResults = await unblockContact(blockedContact.user_id, authCtx.token);

        if (unblockContactResults.response.ok) {
            blockedContacts.splice(indexOf(findBlockedContact(blockedContact.user_id)), 1);
            blockedContactsCtx.set(blockedContacts);

            contactsCtx.contacts.unshift(blockedContact);
            console.log('Contact unblocked.');
        } else {
            console.log('Failed to unblock contact.');
        }

        setIsFetching(false);
    }

    function renderBlockedContact(blockedContact) {
        return (
            <BlockedContact
                blockedContactInfo={blockedContact}
                unblockHandler={() => unblockHandler(blockedContact)}
            />
        );
    }

    if (isFetching) {
        return (
            <SpinnerOverlay isFetching={isFetching} />
        )
    } else {
        return (
            <View style={styles.container}>
                <FlatList
                    data={blockedContacts}
                    keyExtractor={(blockedContact) => blockedContact.user_id}
                    renderItem={(blockedContact) => renderBlockedContact(blockedContact.item)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors['blue-darker']
    }
})