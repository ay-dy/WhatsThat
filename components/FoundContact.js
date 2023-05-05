import { useContext, useEffect, useState } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ContactsContext } from "../store/contacts-context";
import { addContact } from "../utils/api-service";
import { AuthContext } from "../store/auth-context";

import Colors from "../constants/colors";
import Spinner from 'react-native-loading-spinner-overlay';

export default function FoundContact({ foundContactInfo }) {
    const contactsCtx = useContext(ContactsContext);
    const authCtx = useContext(AuthContext)

    const [contactAlreadyInContacts, setContactAlreadyInContacts] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    function isContact() {
        return contactsCtx.contacts.find(contact => contact.user_id === foundContactInfo.user_id) ? true : false;
    }

    useEffect(() => {
        setContactAlreadyInContacts(isContact());
    }, [])

    async function addHandler() {
        setIsFetching(true);
        const addContactResults = await addContact(foundContactInfo.user_id, authCtx.token);

        if (addContactResults.response.ok) {
            setContactAlreadyInContacts(true);

            contactsCtx.contacts.unshift(foundContactInfo);

            console.log('Contact added successfully');
        } else {
            console.log('Server error');
        }

        setIsFetching(false)
    }

    return (
        <View style={styles.mainContainer}>
            {isFetching &&
                <Spinner
                    visible={isFetching}
                />
            }
            <View style={styles.infoContainer}>
                <Image
                    style={styles.profilePhoto}
                    source={foundContactInfo.profile_photo}
                />
                <Text style={styles.name}>{foundContactInfo.first_name + ' ' + foundContactInfo.last_name}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                {!contactAlreadyInContacts &&
                    <TouchableOpacity
                        onPress={addHandler}
                    >
                        <Image
                            style={styles.button}
                            source={require('../assets/images/add_user_blue.png')}
                        />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoContainer: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    name: {
        fontSize: 16,
        color: Colors['ice']
    },
    profilePhoto: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        marginRight: 16
    },
    buttonsContainer: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    button: {
        width: 22,
        height: 22,
        marginHorizontal: 12
    },
    spinnerContainer: {
        width: '100%',
        height: 96,
        alignItems: 'center',
        justifyContent: 'center'
    }
});