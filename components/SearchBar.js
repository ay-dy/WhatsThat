import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from "../constants/colors";
import Icon from "react-native-vector-icons/Ionicons";

export default function SearchBar({ onSearch, returnToScreen }) {
    const [query, setQuery] = useState('');

    const navigation = useNavigation();

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate(returnToScreen)}
            >
                <Icon size={24} color={Colors['blue-lightest']} name='arrow-back-outline' />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
                <View style={styles.searchBarContainer}>
                    <TextInput
                        style={styles.searchBarText}
                        placeholder='Search...'
                        value={query}
                        placeholderTextColor={Colors['blue-lightest']}
                        onChangeText={setQuery}
                    />
                </View>
                <View style={styles.searchButtonsContainer}>
                    {
                        query != '' &&
                        <View style={styles.searchButtonsContainer}>
                            <TouchableOpacity
                                style={{ marginRight: 8 }}
                                onPress={() => onSearch(query)}
                            >
                                <Icon size={22} color={Colors['blue-lightest']} name='search-outline' />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginLeft: 8 }}
                                onPress={() => setQuery('')}
                            >
                                <Icon size={24} color={Colors['blue-lightest']} name='close-outline' />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: 64,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors['blue-dark'],
    },
    buttonContainer: {
        width: '10%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    searchContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    searchBarContainer: {
        width: '80%',
        paddingHorizontal: 16
    },
    searchBarText: {
        flex: 1,
        fontSize: 16,
        color: Colors['ice'],
        outlineStyle: 'none'
    },
    searchButtonsContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    }
})