import { useContext, useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { getUserProfilePhoto, search } from "../utils/api-service";
import { AuthContext } from "../store/auth-context";

import SearchBar from "../components/SearchBar";
import FoundContact from "../components/FoundContact";
import SpinnerOverlay from "../components/SpinnerOverlay";
import Colors from "../constants/colors";

export default function AddContactScreen() {
    const authCtx = useContext(AuthContext);
    const [foundUsers, setFoundUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isSearched, setIsSearched] = useState(false);

    async function searchHandler(query) {
        setIsFetching(true);
        setIsSearched(true);

        const searchResults = await search(query, 'all', authCtx.token);

        if (searchResults.response.ok) {
            let users = searchResults.responseData;

            let loggedInUserIndex = users.indexOf(users.find(user => user.user_id === authCtx.id));

            // Remove yourself from search results
            if (loggedInUserIndex != -1) {
                users.splice(loggedInUserIndex, 1);
            }

            const profilePics = await Promise.all(users.map(async contact => {
                const picResults = await getUserProfilePhoto(contact.user_id, authCtx.token);

                if (picResults.response.ok) {
                    return picResults.responseData;
                } else {
                    return require('../assets/images/contact_icon_blue.png');
                }
            }));

            for (let i = 0; i < users.length; i++) {
                users[i].profile_photo = profilePics[i];
            }

            // Change key names and keep their order for consistency across contexts.
            users = users.map(({
                user_id: user_id,
                given_name: first_name,
                family_name: last_name,
                ...rest
            }) => ({
                user_id,
                first_name,
                last_name,
                ...rest
            }));

            setFoundUsers(users);
            console.log(query, users);
        } else {
            console.log('Server error');
        }

        setIsFetching(false);
    }

    function renderContact(contact) {
        return (
            <FoundContact
                foundContactInfo={contact.item}
            />
        );
    }

    if (isFetching) {
        return <SpinnerOverlay isFetching={isFetching} />
    } else {
        return (
            <View style={styles.resultsContainer}>
                <SearchBar onSearch={searchHandler} returnToScreen={'Tabs'} />
                {isSearched && foundUsers.length ?
                    <FlatList
                        data={foundUsers}
                        keyExtractor={(user) => user.user_id}
                        renderItem={renderContact}
                    />
                    :
                    null
                }
                {isSearched && !foundUsers.length ?
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>No contacts found.</Text>
                    </View>
                    : null
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    resultsContainer: {
        flex: 1,
        backgroundColor: Colors['blue-darker']
    },
    messageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageText: {
        fontSize: 18,
        color: Colors['ice']
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})