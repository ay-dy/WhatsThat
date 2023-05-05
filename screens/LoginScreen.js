import { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { login, getUserProfilePhoto, getUserInfo, getContacts, getBlockedContacts, getChats, getChatDetails } from '../utils/api-service';
import { AuthContext } from '../store/auth-context';
import { SettingsContext } from '../store/settings-context';
import { ContactsContext } from '../store/contacts-context';
import { BlockedContactsContext } from '../store/blocked-contacts-context';
import { ChatsContext } from '../store/chats-context';
import { ChatsDetailsContext } from '../store/chats-details-context';

import Form from '../components/Form';
import DataField from '../components/DataField';
import Colors from '../constants/colors';
import ErrorMessage from '../components/ErrorMessage';
import SpinnerOverlay from '../components/SpinnerOverlay';
import validator from 'validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [credentialsValid, setCredentialsValid] = useState({
        email: true,
        password: true
    });

    const [allFetched, setAllFetched] = useState(true);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');

    const authCtx = useContext(AuthContext);
    const settingsCtx = useContext(SettingsContext);
    const contactsCtx = useContext(ContactsContext);
    const blockedContactsCtx = useContext(BlockedContactsContext);
    const chatsCtx = useContext(ChatsContext);
    const chatsDetailsCtx = useContext(ChatsDetailsContext);

    useEffect(() => {
        (async () => {
            await loadAuthData();
        })();
    }, []);

    async function loadAuthData() {
        setAllFetched(false);
        try {
            const id = parseInt(await AsyncStorage.getItem('id'));
            const token = await AsyncStorage.getItem('token');

            if (id && token) {
                await populateContexts(id, token);
            }
        } catch (error) {
            console.log(error);
        }
        setAllFetched(true);
    }

    function emailHandler(emailInput) {
        setCredentials({ ...credentials, email: emailInput });
        setCredentialsValid({ ...credentialsValid, email: !validator.isEmpty(emailInput) });
    }

    function passwordHandler(passwordInput) {
        setCredentials({ ...credentials, password: passwordInput });
        setCredentialsValid({ ...credentialsValid, password: !validator.isEmpty(passwordInput) });
    }

    function allValid() {
        return (
            !validator.isEmpty(credentials.email) &&
            !validator.isEmpty(credentials.password)
        );
    }

    async function prepareContactsProfilePics(contacts, authToken) {
        const contactsProfilePics = await Promise.all(contacts.map(async contact => {
            const getUserProfilePhotoResults = await getUserProfilePhoto(contact.user_id, authToken);

            if (getUserProfilePhotoResults.response.ok) {
                return getUserProfilePhotoResults.responseData;
            } else {
                return require('../assets/images/contact_icon_blue.png');
            }
        }));

        for (let i = 0; i < contacts.length; i++) {
            contacts[i].profile_photo = contactsProfilePics[i];
        }

        return contacts;
    }

    async function getAllChatsDetails(chats, authToken) {
        const allChats = await Promise.all(chats.map(async chat => {
            const getChatDetailsResults = await getChatDetails(chat.chat_id, authToken);

            if (getChatDetailsResults.response.ok) {
                let data = getChatDetailsResults.responseData;
                data.chat_id = chat.chat_id;
                console.log(data);
                return data;
            } else {
                return [];
            }
        }));
        console.log(allChats);

        return allChats;
    }

    async function populateContexts(userId, authToken) {
        setAllFetched(false)

        const getUserProfilePhotoResults = await getUserProfilePhoto(userId, authToken);

        let userProfilePhotoUri;

        if (getUserProfilePhotoResults.response.ok) {
            userProfilePhotoUri = getUserProfilePhotoResults.responseData;
        } else {
            // If profile pic is not found or there's a server error, assign a default image
            userProfilePhotoUri = require('../assets/images/contact_icon_blue.png');
        }

        const getUserInfoResults = await getUserInfo(userId, authToken);

        if (getUserInfoResults.response.ok) {
            const userInfo = getUserInfoResults.responseData;

            delete userInfo.user_id;

            userInfo.password = credentials.password;

            settingsCtx.set(userProfilePhotoUri, userInfo);
        } else {
            setLoginErrorMessage('Server error.');
            return;
        }

        const getContactsResults = await getContacts(authToken);

        if (getContactsResults.response.ok) {
            const contacts = getContactsResults.responseData;

            if (contacts.length) {
                contactsCtx.set(await prepareContactsProfilePics(contacts, authToken));
            }
        } else {
            setLoginErrorMessage('Server error.');
            return;
        }

        const getChatsResults = await getChats(authToken);

        if (typeof getChatsResults.responseData !== 'undefined') {
            if (getChatsResults.response.ok) {
                chatsCtx.set(getChatsResults.responseData);
                chatsDetailsCtx.set(await getAllChatsDetails(getChatsResults.responseData, authToken));
            } else {
                setLoginErrorMessage('Server error.');
                return;
            }
        }

        const getBlockedContactsResults = await getBlockedContacts(authToken);

        if (getBlockedContactsResults.response.ok) {
            const blockedContacts = getBlockedContactsResults.responseData;

            if (blockedContacts.length) {
                blockedContactsCtx.set(await prepareContactsProfilePics(blockedContacts, authToken));
            }

        } else {
            setLoginErrorMessage('Server error.');
            return;
        }

        authCtx.authenticate(userId, authToken);
        setAllFetched(true);
    }

    async function loginHandler() {
        if (allValid) {
            setAllFetched(false);

            const loginResults = await login(credentials);

            switch (loginResults.response.status) {
                case 400:
                    setLoginErrorMessage('Your credentials are invalid.');
                    break;
                case 500:
                    setLoginErrorMessage('Server error.');
                    break;
                default:
                    const userId = loginResults.responseData.id;
                    const authToken = loginResults.responseData.token;

                    await populateContexts(userId, authToken);

                    if (loginErrorMessage === '') {
                        await AsyncStorage.multiSet([['id', userId], ['token', authToken]]);
                        authCtx.authenticate(userId, authToken);
                    }
            }
            setAllFetched(true);
        }
    }

    if (!allFetched) {
        return <SpinnerOverlay isFetching={!allFetched} />
    } else {
        return (
            <View style={styles.container}>
                <Form
                    submitValue={'LOG IN'}
                    submitHandler={loginHandler}
                    switchValue={"New to WhatsThat?"}
                    switchHandler={() => navigation.navigate('Signup')}
                >
                    {loginErrorMessage ? <ErrorMessage>{loginErrorMessage}</ErrorMessage> : null}
                    <DataField
                        label={'Email address'}
                        text={credentials.email}
                        placeholder={'Email address'}
                        inputHandler={emailHandler}
                        isValid={credentialsValid.email}
                    />
                    {credentialsValid.email ? null : <Text style={styles.errorMessage}>Required</Text>}
                    <DataField
                        label={'Password'}
                        text={credentials.password}
                        placeholder={'Password'}
                        secureEntry={true}
                        inputHandler={passwordHandler}
                        isValid={credentialsValid.password}
                    />
                    {credentialsValid.password ? null : <Text style={styles.errorMessage}>Required</Text>}
                </Form>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors['blue-darker'],
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorMessage: {
        paddingLeft: 16,
        fontSize: 14,
        color: Colors['red']
    }
});