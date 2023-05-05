import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constants/colors";

export default function BlockedContact({ blockedContactInfo, unblockHandler }) {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.infoContainer}>
                <Image
                    style={styles.profilePhoto}
                    source={blockedContactInfo.profile_photo}
                />
                <Text style={styles.name}>{blockedContactInfo.first_name}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={unblockHandler}
                >
                    <Image
                        style={styles.button}
                        source={require('../assets/images/unblock_user_blue.png')}
                    />
                </TouchableOpacity>
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
    buttonContainer: {
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